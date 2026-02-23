import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const allProjects = [
  { id: 1, name: "E-Commerce Platform", client: "TechCorp India", status: "active" as const, employees: ["Ravi Sharma", "Ananya Verma"], progress: 65 },
  { id: 2, name: "CRM Integration", client: "CloudNet Solutions", status: "pending" as const, employees: ["Kiran Patel"], progress: 20 },
  { id: 3, name: "Mobile App Redesign", client: "InnovateTech", status: "active" as const, employees: ["Arjun Das", "Ravi Sharma"], progress: 45 },
  { id: 4, name: "Analytics Dashboard", client: "TechCorp India", status: "completed" as const, employees: ["Kiran Patel", "Meera Joshi"], progress: 100 },
];

export default function Projects() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isAdmin ? "Projects" : "My Projects"}</h1>
          <p className="text-muted-foreground">{isAdmin ? "Manage all projects" : "View your assigned projects"}</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft">
                <Plus className="h-4 w-4 mr-2" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Project Name</Label><Input placeholder="Enter project name" className="rounded-xl" /></div>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp India</SelectItem>
                      <SelectItem value="cloudnet">CloudNet Solutions</SelectItem>
                      <SelectItem value="innovate">InnovateTech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white" onClick={() => setDialogOpen(false)}>Create Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {allProjects.map((project) => (
          <div key={project.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-foreground text-lg">{project.name}</h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Client: {project.client}</p>
            <p className="text-sm text-muted-foreground mb-4">Team: {project.employees.join(", ")}</p>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div className="gradient-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">{project.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
