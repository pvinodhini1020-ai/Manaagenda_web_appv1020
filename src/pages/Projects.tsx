import { useState, useEffect } from "react";
import { Plus, Users, Calendar, Building, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import StatusBadge from "@/components/StatusBadge";
import Loader from "@/components/Loader";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { projectService, Project } from "@/services/projectService";
import { userService, User } from "@/services/userService";
import { apiClient } from "@/services/authService";
import { toast } from "sonner";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  const [progressValues, setProgressValues] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_id: "",
    status: "pending" as "active" | "pending" | "completed"
  });

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        let projectsData;
        if (user?.role === 'client') {
          projectsData = await projectService.getClientProjects(user.id);
        } else {
          const response = await projectService.getProjects();
          projectsData = response.data;
        }
        setProjects(projectsData || []);

        if (isAdmin) {
          try {
            const [employeesRes, clientsRes] = await Promise.all([
              userService.getUsers({ role: 'employee' }),
              userService.getUsers({ role: 'client' })
            ]);
            console.log('Employees response:', employeesRes);
            console.log('Clients response:', clientsRes);
            setEmployees(employeesRes.data || []);
            setClients(clientsRes.data || []);
          } catch (error) {
            console.error('Error fetching employees/clients:', error);
            setEmployees([]);
            setClients([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, isAdmin]);

  // Debug: Log clients state changes
  useEffect(() => {
    console.log('Clients state updated:', clients);
    console.log('Form client_id:', formData.client_id);
  }, [clients, formData.client_id]);

  // Debug: Log employees and selectedEmployees state changes
  useEffect(() => {
    console.log('Employees state updated:', employees);
    console.log('Selected employees:', selectedEmployees);
  }, [employees, selectedEmployees]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
     
    // Enhanced validation for admin users
    if (isAdmin && selectedEmployees.length === 0) {
      toast.error("Please select at least one employee for the project");
      return;
    }
    
    if (!formData.name.trim() || !formData.client_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreateLoading(true);
    try {
      const project = await projectService.createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        client_id: formData.client_id,
        status: formData.status,
        employee_ids: isAdmin ? selectedEmployees : undefined
      });
      
      toast.success("Project created successfully!");
      setDialogOpen(false);
      resetForm();

      // Refresh projects list
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      client_id: "",
      status: "pending" as "active" | "pending" | "completed"
    });
    setSelectedEmployees([]);
  };

  const handleProgressUpdate = async (projectId: string, newProgress: number) => {
    const currentProject = projects.find(p => p.id === projectId);
    const currentProgress = currentProject?.progress || 0;
    
    // Prevent reducing progress
    if (newProgress < currentProgress) {
      toast.error("Progress cannot be reduced. Only increase or maintain current progress.");
      return;
    }
    
    setUpdatingProgress(projectId);
    try {
      await projectService.updateProgress(projectId, newProgress);
      toast.success("Project progress updated successfully!");
      
      // Update the project in the local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, progress: newProgress }
          : project
      ));
      
      // Update the progress values state
      setProgressValues(prev => ({ ...prev, [projectId]: newProgress }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update project progress");
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      await projectService.updateProject(projectId, { status: newStatus as any });
      
      // If status is changed to completed, automatically set progress to 100%
      if (newStatus === 'completed') {
        await projectService.updateProgress(projectId, 100);
        setProgressValues(prev => ({ ...prev, [projectId]: 100 }));
        toast.success("Project marked as completed! Progress set to 100%");
      } else {
        toast.success("Project status updated successfully!");
      }
      
      // Update the project in the local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              status: newStatus as any,
              progress: newStatus === 'completed' ? 100 : project.progress
            }
          : project
      ));
    } catch (error: any) {
      toast.error(error.message || "Failed to update project status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="md" text="Loading projects..." />
      </div>
    );
  }

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
            <DialogContent className="rounded-2xl max-w-2xl">
              <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="project-name">Project Name *</Label>
                    <Input
                      id="project-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter project name"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client">Client *</Label>
                    <Select value={formData.client_id} onValueChange={(value) => {
                      console.log('Client selected:', value); // Debug log
                      setFormData(prev => ({ ...prev, client_id: value }));
                    }}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Test option to verify dropdown is working */}
                        <SelectItem value="test">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Test Client</p>
                              <p className="text-xs text-muted-foreground">test@example.com</p>
                            </div>
                          </div>
                        </SelectItem>
                        
                        {clients && clients.length > 0 ? (
                          clients.map((client) => {
                            console.log('Client object:', client); // Debug log
                            const clientId = client.user_id;
                            console.log('Using client ID:', clientId); // Debug log
                            return (
                              <SelectItem key={clientId} value={clientId}>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  <div>
                                    <p className="font-medium">{client.company || client.name}</p>
                                    <p className="text-xs text-muted-foreground">{client.email}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectItem value="" disabled>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="h-4 w-4" />
                              <p>No clients available</p>
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the project scope and objectives..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assign Employees
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded-xl p-3">
                      {employees.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No employees available</p>
                      ) : (
                        employees.map((employee) => (
                          <div key={employee.user_id} className="flex items-center space-x-2">
                            <Checkbox
                              id={employee.user_id}
                              checked={selectedEmployees.includes(employee.user_id)}
                              onCheckedChange={(checked) => {
                                const empId = employee.user_id;
                                console.log('Employee toggle:', { empId, checked, currentSelected: selectedEmployees });
                                if (checked) {
                                  setSelectedEmployees([...selectedEmployees, empId]);
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
                                }
                              }}
                            />
                            <label
                              htmlFor={employee.user_id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {employee.name} - {employee.department}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft"
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <>
                        <Loader size="sm" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.length === 0 ? (
          <div className="md:col-span-2 bg-card rounded-2xl border border-border p-8 text-center">
            <div className="max-w-sm mx-auto">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground">
                {isAdmin ? "Create your first project to get started." : "Projects will appear here once assigned to you."}
              </p>
            </div>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-foreground text-lg">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{project.client?.company || project.client?.name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(project.created_at)}</span>
                </div>
                
                {project.employees && project.employees.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{project.employees.map(emp => emp.name).join(", ")}</span>
                  </div>
                )}
              </div>

              {project.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-3">
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
                  {!isAdmin && user?.role === 'employee' && project.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const currentValue = progressValues[project.id] ?? project.progress ?? 0;
                        setProgressValues(prev => ({ 
                          ...prev, 
                          [project.id]: Math.min(100, currentValue + 10) 
                        }));
                      }}
                      disabled={updatingProgress === project.id}
                      className="text-xs"
                    >
                      {updatingProgress === project.id ? (
                        <Loader size="sm" />
                      ) : (
                        "Quick +10%"
                      )}
                    </Button>
                  )}
                </div>
                
                {!isAdmin && user?.role === 'employee' && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">
                        {project.status === 'completed' ? 'Project Status' : 'Update Progress'}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {progressValues[project.id] ?? project.progress ?? 0}%
                      </span>
                    </div>
                    
                    {project.status !== 'completed' ? (
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[progressValues[project.id] ?? project.progress ?? 0]}
                          onValueChange={(value) => {
                            const currentProgress = project.progress || 0;
                            const newValue = value[0];
                            // Only allow increasing progress
                            if (newValue >= currentProgress) {
                              setProgressValues(prev => ({ ...prev, [project.id]: newValue }));
                            }
                          }}
                          max={100}
                          step={5}
                          className="flex-1"
                          disabled={updatingProgress === project.id}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleProgressUpdate(project.id, progressValues[project.id] ?? project.progress ?? 0)}
                          disabled={updatingProgress === project.id}
                          className="px-2 py-1 h-7"
                        >
                          {updatingProgress === project.id ? (
                            <Loader size="sm" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-success font-medium">
                        Project is completed. Progress is locked at 100%.
                      </div>
                    )}
                    
                    {/* Status selector for employees only - only show if not completed */}
                    {project.status !== 'completed' && (
                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-medium">Status:</Label>
                        <Select 
                          value={project.status} 
                          onValueChange={(value) => handleStatusChange(project.id, value)}
                          disabled={updatingProgress === project.id}
                        >
                          <SelectTrigger className="flex-1 h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
