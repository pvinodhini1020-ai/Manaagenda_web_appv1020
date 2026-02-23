import { FolderKanban, ClipboardList, MessageSquare } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const projects = [
  { id: 1, name: "E-Commerce Platform", status: "active" as const, employees: ["Ravi Sharma", "Ananya Verma"], progress: 65 },
  { id: 2, name: "Analytics Dashboard", status: "completed" as const, employees: ["Kiran Patel"], progress: 100 },
];

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your projects and requests.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard title="My Projects" value={2} icon={FolderKanban} gradient="gradient-primary" />
        <StatCard title="Service Requests" value={1} icon={ClipboardList} gradient="gradient-info" />
        <StatCard title="Messages" value={4} icon={MessageSquare} gradient="gradient-purple" />
      </div>

      <div>
        <h2 className="font-bold text-foreground text-lg mb-4">Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-foreground">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Team: {project.employees.join(", ")}
              </p>
              <div className="w-full bg-muted rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="gradient-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{project.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
