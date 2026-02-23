import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ClipboardList } from "lucide-react";

export default function RequestService() {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Request Submitted", description: "Your service request has been sent for review." });
    setService("");
    setDescription("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Request a Service</h1>
        <p className="text-muted-foreground">Submit a new service request</p>
      </div>

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
            <Label>Service Type</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="mobile">Mobile App Development</SelectItem>
                <SelectItem value="design">UI/UX Design</SelectItem>
                <SelectItem value="cloud">Cloud Solutions</SelectItem>
                <SelectItem value="api">API Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="rounded-xl"
            />
          </div>
          <Button type="submit" className="w-full gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft h-12 font-semibold">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
