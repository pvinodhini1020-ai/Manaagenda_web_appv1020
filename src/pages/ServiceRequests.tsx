import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Check, X } from "lucide-react";

const requests = [
  { id: 1, client: "TechCorp India", service: "Web Development", description: "Need an e-commerce platform", date: "Feb 18, 2026", status: "pending" as const },
  { id: 2, client: "CloudNet Solutions", service: "API Integration", description: "Integrate payment gateway", date: "Feb 17, 2026", status: "pending" as const },
  { id: 3, client: "InnovateTech", service: "Mobile App Development", description: "iOS and Android app for delivery", date: "Feb 15, 2026", status: "approved" as const },
  { id: 4, client: "DataFlow Systems", service: "Cloud Solutions", description: "Migrate to AWS", date: "Feb 10, 2026", status: "rejected" as const },
];

export default function ServiceRequests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
        <p className="text-muted-foreground">Review and manage client service requests</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Service</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Description</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{req.client}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{req.service}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{req.description}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{req.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <Button size="icon" className="gradient-success border-0 rounded-xl hover:opacity-90 h-8 w-8"><Check className="h-4 w-4 text-white" /></Button>
                        <Button size="icon" className="gradient-danger border-0 rounded-xl hover:opacity-90 h-8 w-8"><X className="h-4 w-4 text-white" /></Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
