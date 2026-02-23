import { FolderKanban, Clock, CheckCircle, Zap } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projects = [
  { id: 1, name: "E-Commerce Platform", client: "TechCorp India", status: "active" as const, deadline: "Mar 15, 2026" },
  { id: 2, name: "CRM Integration", client: "CloudNet Solutions", status: "pending" as const, deadline: "Apr 01, 2026" },
  { id: 3, name: "Mobile App Redesign", client: "InnovateTech", status: "active" as const, deadline: "Mar 30, 2026" },
];

export default function EmployeeDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your assigned projects and tasks.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
          <Zap className="h-4 w-4" />
          <span>3 active tasks</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard title="Assigned Projects" value={3} icon={FolderKanban} gradient="gradient-primary" />
        <StatCard title="In Progress" value={2} icon={Clock} gradient="gradient-warning" />
        <StatCard title="Completed" value={7} icon={CheckCircle} gradient="gradient-success" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-foreground">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Client: {project.client}</p>
            <p className="text-sm text-muted-foreground mb-4">Deadline: {project.deadline}</p>
            <Select defaultValue={project.status}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
