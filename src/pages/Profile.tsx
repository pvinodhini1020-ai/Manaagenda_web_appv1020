import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, Building, MapPin } from "lucide-react";
import { userService, User as UserType } from "@/services/userService";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    department: "",
    salary: ""
  });
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(profileData);

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        address: user.address || "",
        department: user.department || "",
        salary: user.salary ? user.salary.toString() : ""
      };
      setProfileData(data);
      setInitialData(data);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('No user found in auth context');
      toast.error("User not authenticated");
      return;
    }

    console.log('Current user:', user); // Debug log
    console.log('User ID:', user.id, (user as any).user_id); // Debug log
    
    setLoading(true);
    try {
      const updateData: any = {};
      
      // Only include fields that have changed and are allowed for the user's role
      Object.keys(profileData).forEach(key => {
        if (profileData[key as keyof typeof profileData] !== initialData[key as keyof typeof initialData]) {
          // Skip restricted fields based on user role
          if (user.role === 'employee' && (key === 'department' || key === 'salary')) {
            return; // Skip these fields for employees
          }
          if (user.role === 'client' && key === 'company') {
            return; // Skip company field for clients
          }
          
          if (key === 'salary') {
            updateData[key] = profileData[key] ? parseInt(profileData[key]) : undefined;
          } else {
            updateData[key] = profileData[key as keyof typeof profileData] || undefined;
          }
        }
      });

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const userId = user.id || (user as any).user_id;
      console.log('Updating user with ID:', userId); // Debug log
      console.log('Update data:', updateData); // Debug log

      await userService.updateUser(userId, updateData);
      toast.success("Profile updated successfully!");
      
      // Update initial data to reflect saved changes
      setInitialData(profileData);
      
      // If email was changed, user might need to re-login
      if (updateData.email) {
        toast.info("Email updated. You may need to login again.");
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(initialData);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and personal information</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-card space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="rounded-xl"
              />
            </div>

            {user.role === 'client' && (
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="rounded-xl"
                  disabled={true}
                  placeholder="Company cannot be modified"
                />
                <p className="text-xs text-muted-foreground">Company field cannot be modified by clients</p>
              </div>
            )}

            {user.role === 'employee' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="rounded-xl"
                    disabled={true}
                    placeholder="Department cannot be modified"
                  />
                  <p className="text-xs text-muted-foreground">Department field cannot be modified by employees</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={profileData.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                    className="rounded-xl"
                    disabled={true}
                    placeholder="Salary cannot be modified"
                  />
                  <p className="text-xs text-muted-foreground">Salary field cannot be modified by employees</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your full address"
              rows={3}
              className="rounded-xl"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity text-white shadow-soft"
              disabled={loading || !hasChanges}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            
            {hasChanges && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setProfileData(initialData)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
