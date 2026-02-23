import { useState, useEffect } from "react";
import { FolderKanban, Clock, CheckCircle, Zap, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { projectService, Project } from "@/services/projectService";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const dashboardStats = await userService.getDashboardStats();
        setStats(dashboardStats);
        // Filter projects to show only in_progress, pending, and active status
        const filteredProjects = (dashboardStats.projects || []).filter(
          (project: Project) => ['in_progress', 'pending', 'active'].includes(project.status)
        );
        setProjects(filteredProjects);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
          <p className="text-muted-foreground mt-1">Your assigned projects and tasks.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
          <Zap className="h-4 w-4" />
          <span>{stats.in_progress_projects || 0} in progress</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard 
          title="Assigned Projects" 
          value={stats.assigned_projects || 0} 
          icon={FolderKanban} 
          gradient="gradient-primary" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.in_progress_projects || 0} 
          icon={Clock} 
          gradient="gradient-warning" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed_projects || 0} 
          icon={CheckCircle} 
          gradient="gradient-success" 
        />
      </div>

      <div>
        <h2 className="font-bold text-foreground text-lg mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No projects assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-foreground">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Client: {project.client?.company || project.client?.name}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        project.status === 'completed' ? 'bg-success' : 'gradient-primary'
                      }`}
                      style={{ width: `${project.progress || 0}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">
                      {project.progress || 0}% complete
                      {project.status === 'completed' && (
                        <span className="ml-2 text-success font-semibold">✓ Completed</span>
                      )}
                    </p>
                  </div>
                  {project.status === 'completed' && (
                    <div className="text-xs text-success font-medium">
                      Project is completed. Progress is locked at 100%.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
