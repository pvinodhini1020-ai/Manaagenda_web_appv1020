import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypeService, ServiceType } from "@/services/serviceTypeService";

export default function Services() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const serviceTypes = await serviceTypeService.getServiceTypes();
        setServices(serviceTypes || []);
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast.error(error.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getGradientForService = (index: number): string => {
    const gradients = [
      "gradient-primary",
      "gradient-info", 
      "gradient-purple",
      "gradient-success",
      "gradient-warning"
    ];
    return gradients[index % gradients.length];
  };

  const handleCreateService = async () => {
    if (!newService.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    setCreateLoading(true);
    try {
      const createdService = await serviceTypeService.createServiceType({
        name: newService.name.trim(),
        description: newService.description.trim() || undefined,
        status: newService.status
      });
      
      setServices(prev => [...prev, createdService]);
      setNewService({ name: "", description: "", status: "active" });
      setDialogOpen(false);
      toast.success("Service created successfully!");
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast.error(error.message || "Failed to create service");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await serviceTypeService.deleteServiceType(serviceId);
      setServices(prev => prev.filter(service => service.id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft">
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Create Service</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input 
                  placeholder="Enter service name" 
                  className="rounded-xl"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the service" 
                  className="rounded-xl"
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newService.status} onValueChange={(value: "active" | "inactive") => setNewService(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white" 
                onClick={handleCreateService}
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading services...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available. Add your first service to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
              <div className={`h-2 w-16 rounded-full ${getGradientForService(index)} mb-4`} />
              <h3 className="font-bold text-foreground mb-1 text-lg">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  service.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl"><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
