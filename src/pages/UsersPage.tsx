import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";

const users = [
  { id: 1, name: "Vinodhini Kumar", email: "admin@vss.com", role: "Admin", status: "active" as const },
  { id: 2, name: "Ravi Sharma", email: "ravi@vss.com", role: "Employee", status: "active" as const },
  { id: 3, name: "Priya Nair", email: "priya@techcorp.in", role: "Client", status: "active" as const },
  { id: 4, name: "Ananya Verma", email: "ananya@vss.com", role: "Employee", status: "active" as const },
  { id: 5, name: "Meera Joshi", email: "meera@vss.com", role: "Employee", status: "inactive" as const },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">All registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{u.role}</td>
                  <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
