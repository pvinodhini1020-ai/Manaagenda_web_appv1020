import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import { userService, User } from "@/services/userService";
import { toast } from "sonner";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        setUsers(response.data || []);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast.error(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    {search ? "No users found matching your search." : "No users available."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{u.role}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={(u.status || 'active') as "active" | "pending" | "completed" | "inactive" | "approved" | "rejected" | "in_progress"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
