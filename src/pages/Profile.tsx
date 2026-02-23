import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-card space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <span className="text-xl font-bold text-white">
              {user.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={user.name} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user.email} type="email" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+91 98765 43210" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input placeholder="Chennai, India" className="rounded-xl" />
          </div>
        </div>

        <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft">Save Changes</Button>
      </div>
    </div>
  );
}
