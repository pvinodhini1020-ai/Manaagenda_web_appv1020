import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardList, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { serviceRequestService } from "@/services/serviceRequestService";
import { serviceTypeService, ServiceType } from "@/services/serviceTypeService";

export default function RequestService() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      if (!user) {
        console.error("User not authenticated");
        toast.error("Please log in to request services");
        return;
      }

      try {
        const types = await serviceTypeService.getActiveServiceTypes();
        setServiceTypes(types || []);
      } catch (error: any) {
        console.error("Error fetching service types:", error);
        toast.error(error.message || "Failed to load service types");
      } finally {
        setLoadingServiceTypes(false);
      }
    };

    if (user) {
      fetchServiceTypes();
    } else {
      setLoadingServiceTypes(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit a service request");
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const selectedServiceType = serviceTypes.find(s => s.id === serviceType);
      const serviceTitle = serviceType && selectedServiceType
        ? `${selectedServiceType.name}: ${title}`
        : title;

      await serviceRequestService.createServiceRequest({
        title: serviceTitle,
        description: description.trim()
      });
      
      toast.success("Service request submitted successfully! It will be reviewed by the admin.");
      
      // Reset form
      setTitle("");
      setDescription("");
      setServiceType("");
    } catch (error: any) {
      console.error("Error submitting service request:", error);
      toast.error(error.message || "Failed to submit service request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Request a Service</h1>
        <p className="text-muted-foreground">Submit a new service request and our team will review it</p>
      </div>

      {!user ? (
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card text-center">
          <p className="text-muted-foreground">Please log in to submit a service request.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl gradient-info flex items-center justify-center shadow-soft">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">New Service Request</h3>
              <p className="text-sm text-muted-foreground">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType} disabled={loadingServiceTypes}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={loadingServiceTypes ? "Loading service types..." : "Select a service type"} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {serviceTypes.length === 0 && !loadingServiceTypes && (
                <p className="text-sm text-muted-foreground">No active service types available. Please contact admin.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                placeholder="Brief title for your request..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your requirements in detail. Include any specific features, timeline, or technical requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="rounded-xl"
                required
              />
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Submission Details:</strong><br />
                • Submitted by: {user?.name || 'Unknown'} ({user?.email || 'No email'})<br />
                • Company: {user?.company || 'N/A'}<br />
                • Status will be updated once reviewed by admin
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft h-12 font-semibold"
              disabled={loading || loadingServiceTypes}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Service Request"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
