import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const initialServices = [
  { id: 1, name: "Web Development", description: "Custom web applications using modern frameworks", price: "₹50,000+", gradient: "gradient-primary" },
  { id: 2, name: "Mobile App Development", description: "Cross-platform mobile applications", price: "₹80,000+", gradient: "gradient-info" },
  { id: 3, name: "UI/UX Design", description: "User interface and experience design services", price: "₹30,000+", gradient: "gradient-purple" },
  { id: 4, name: "Cloud Solutions", description: "Cloud infrastructure setup and management", price: "₹40,000+", gradient: "gradient-success" },
  { id: 5, name: "API Integration", description: "Third-party API integration services", price: "₹25,000+", gradient: "gradient-warning" },
];

export default function Services() {
  const [services] = useState(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);

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
              <div className="space-y-2"><Label>Service Name</Label><Input placeholder="Enter service name" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the service" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Starting Price</Label><Input placeholder="e.g. ₹50,000+" className="rounded-xl" /></div>
              <Button className="w-full gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white" onClick={() => setDialogOpen(false)}>Create Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <div className={`h-2 w-16 rounded-full ${service.gradient} mb-4`} />
            <h3 className="font-bold text-foreground mb-1 text-lg">{service.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
            <p className="text-lg font-bold text-primary mb-4">{service.price}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl"><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
