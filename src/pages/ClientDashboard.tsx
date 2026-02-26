import { useState, useEffect } from "react";
import { FolderKanban, ClipboardList, MessageSquare, Loader2, Bell } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { projectService, Project } from "@/services/projectService";
import { serviceRequestService, ServiceRequest } from "@/services/serviceRequestService";
import { messageService, Message } from "@/services/messageService";
import { useServiceRequestNotifications } from "@/hooks/useServiceRequestNotifications";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize service request notifications
  const { refreshNotifications, clearNotifications, unreadNotifications, hasNewNotifications } = useServiceRequestNotifications();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [dashboardStats, requestsRes, messagesRes] = await Promise.all([
          userService.getDashboardStats(),
          serviceRequestService.getClientServiceRequests(user.id),
          messageService.getMessages()
        ]);
        
        setStats(dashboardStats);
        // Filter projects to show only in_progress, pending, and active status
        const filteredProjects = (dashboardStats.projects || []).filter(
          (project: Project) => ['in_progress', 'pending', 'active'].includes(project.status)
        );
        setProjects(filteredProjects);
        setRequests(requestsRes || []);
        setMessages(messagesRes.data || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your projects and requests.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refreshNotifications();
            clearNotifications();
          }}
          className="flex items-center gap-2 relative"
        >
          <Bell className="h-4 w-4" />
          Refresh
          {hasNewNotifications && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          )}
          {unreadNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard 
          title="My Projects" 
          value={stats.total_projects || 0} 
          icon={FolderKanban} 
          gradient="gradient-primary" 
        />
        <StatCard 
          title="Service Requests" 
          value={requests.length} 
          icon={ClipboardList} 
          gradient="gradient-info" 
        />
        <StatCard 
          title="Messages" 
          value={messages.length} 
          icon={MessageSquare} 
          gradient="gradient-purple" 
        />
      </div>

      <div>
        <h2 className="font-bold text-foreground text-lg mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No projects assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                {project.employees && project.employees.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Team: {project.employees.map(emp => emp.name).join(", ")}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-2">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-3 overflow-hidden">
                  <div
                    className="gradient-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">{project.progress || 0}% complete</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-foreground text-lg mb-4">My Service Requests</h2>
        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No service requests submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground">{request.title}</h3>
                  <StatusBadge status={request.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Submitted: {new Date(request.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {request.description}
                </p>
                {request.project && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Related Project</p>
                    <p className="text-sm text-muted-foreground">{request.project.name}</p>
                    <StatusBadge status={request.project.status as any} />
                  </div>
                )}
                {request.status === 'approved' && request.project && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Your request has been approved! Project "{request.project.name}" has been created and work will begin soon.
                    </p>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      ❌ Your request has been rejected. Please contact support for more information.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
