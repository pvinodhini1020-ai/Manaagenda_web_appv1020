import { useState, useEffect } from "react";
import { Users, Building2, FolderKanban, FileText, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { projectService, Project } from "@/services/projectService";
import { toast } from "sonner";

export default function AdminDashboard() {
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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>All systems operational</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats.total_users || 0} 
          icon={Users} 
          trend={`${stats.employee_users || 0} employees`} 
          gradient="gradient-primary" 
        />
        <StatCard 
          title="Total Clients" 
          value={stats.client_users || 0} 
          icon={Building2} 
          trend={`${stats.admin_users || 0} admins`} 
          gradient="gradient-info" 
        />
        <StatCard 
          title="Active Projects" 
          value={stats.active_projects || 0} 
          icon={FolderKanban} 
          gradient="gradient-success" 
        />
        <StatCard 
          title="Pending Projects" 
          value={stats.pending_projects || 0} 
          icon={FileText} 
          gradient="gradient-warning" 
        />
      </div>

      {/* Recent Projects */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground text-lg">Recent Projects</h2>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Project Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {project.client?.company || project.client?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
