import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypeService, ServiceType } from "@/services/serviceTypeService";
import { FormErrors } from "@/utils/validation";
import Loader from "@/components/Loader";

export default function Services() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceType | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    description: "",
    status: ""
  });
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive"
  });

  const resetForm = () => {
    setNewService({
      name: "",
      description: "",
      status: "active"
    });
    setEditingService(null);
  };

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
      if (editingService) {
        // Update existing service
        const updatedService = await serviceTypeService.updateServiceType(editingService.id, {
          name: newService.name.trim(),
          description: newService.description.trim() || undefined,
          status: newService.status
        });
        setServices(prev => prev.map(service =>
          service.id === editingService.id ? updatedService : service
        ));
        toast.success("Service updated successfully!");
      } else {
        // Create new service
        const createdService = await serviceTypeService.createServiceType({
          name: newService.name.trim(),
          description: newService.description.trim() || undefined,
          status: newService.status
        });
        setServices(prev => [...prev, createdService]);
        toast.success("Service created successfully!");
      }

      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating/updating service:", error);
      toast.error(error.message || "Failed to create/update service");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditService = (service: ServiceType) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description || "",
      status: service.status
    });
    setDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await serviceTypeService.deleteServiceType(serviceToDelete.id);
      setServices(prev => prev.filter(service => service.id !== serviceToDelete.id));
      toast.success("Service deleted successfully!");
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "Failed to delete service");
    }
  };

  const openDeleteDialog = (service: ServiceType) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const validateServiceName = (value) => {
    if (!value.trim()) {
      return "Service Name is required";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft">
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>{editingService ? 'Edit Service' : 'Create Service'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>
                  Service Name <span className="text-red-500">*</span>
                </Label>

                <Input
                  placeholder="Enter service name"
                  className={`rounded-xl border-2 ${errors.name ? "border-red-500 focus:border-red-500" : "border-border"
                    }`}
                  value={newService.name}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Update value
                    setNewService((prev) => ({ ...prev, name: value }));

                    // 🔥 Call separate validation method
                    const errorMessage = validateServiceName(value);

                    setErrors((prev) => ({
                      ...prev,
                      name: errorMessage,
                    }));
                  }}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
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
                  <span>
                    <Loader size="sm" />
                    {editingService ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="md" text="Loading services..." />
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
                <span className={`text-sm px-2 py-1 rounded-full ${service.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {service.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => handleEditService(service)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={() => openDeleteDialog(service)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete service "{serviceToDelete?.name}"?
              This action cannot be undone and will permanently remove the service from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="gradient-danger border-0 rounded-xl hover:opacity-90 transition-opacity text-white"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
