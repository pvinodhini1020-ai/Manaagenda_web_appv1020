import { Users, Building2, FolderKanban, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const recentActivity = [
  { id: 1, action: "New client registered", user: "TechCorp India", time: "2 hours ago", status: "active" as const },
  { id: 2, action: "Service request submitted", user: "Priya Nair", time: "4 hours ago", status: "pending" as const },
  { id: 3, action: "Project completed", user: "Ravi Sharma", time: "1 day ago", status: "completed" as const },
  { id: 4, action: "Employee onboarded", user: "Ananya Verma", time: "2 days ago", status: "active" as const },
  { id: 5, action: "Service request approved", user: "CloudNet Solutions", time: "3 days ago", status: "approved" as const },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>+12% this month</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employees" value={24} icon={Users} trend="+3 this month" gradient="gradient-primary" />
        <StatCard title="Total Clients" value={18} icon={Building2} trend="+2 this month" gradient="gradient-info" />
        <StatCard title="Active Projects" value={12} icon={FolderKanban} gradient="gradient-success" />
        <StatCard title="Pending Requests" value={5} icon={FileText} gradient="gradient-warning" />
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground text-lg">Recent Activity</h2>
          <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Action</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{item.action}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.user}</td>
                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
