import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle, X, Building2, MapPin, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

interface Client {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  role: string;
  status: "active" | "inactive";
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  password: string;
  status: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  password?: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setFetchLoading(true);
      const response = await apiClient.get('/clients');
      setClients(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients", {
        description: error.response?.data?.error || "Please try again later.",
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    password: "",
    status: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchClients();
  }, []);

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    // Password validation - only required for new clients
    if (!editingClient) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      // For editing clients, only validate if password is provided and not placeholder
      if (formData.password.trim() && formData.password !== "••••••••" && formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let errorMessage: string | undefined;

    // Validation rules
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (field === "name") {
        if (!trimmedValue) {
          errorMessage = "Contact person name is required";
        } else if (trimmedValue.length < 3) {
          errorMessage = "Name must be at least 3 characters";
        }
      }
      // 🔹 Phone validation
      if (field === "phone") {
        const phoneRegex = /^[0-9+\-\s()]{10}$/;

        if (!trimmedValue) {
          errorMessage = "Phone number is required";
        } else if (!phoneRegex.test(trimmedValue)) {
          errorMessage = "Enter a valid phone number";
        }
      }

      // Email validation
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmedValue) {
          errorMessage = "Email is required";
        } else if (!emailRegex.test(value)) {
          errorMessage = "Enter a valid email address";
        }
      }
      // 🔹 Company validation
      if (field === "company") {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
          errorMessage = "Company name is required";
        } else if (trimmedValue.length < 2) {
          errorMessage = "Company name must be at least 2 characters";
        }
      }

      // 🔹 Address validation
      if (field === "address") {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
          errorMessage = "Address is required";
        } else if (trimmedValue.length < 10) {
          errorMessage = "Address must be at least 10 characters";
        }
      }

      if (field === "password") {
        const trimmedValue = value.trim();

        // If NOT editing → password required
        if (!editingClient) {
          if (!trimmedValue) {
            errorMessage = "Password is required";
          } else if (trimmedValue.length < 6) {
            errorMessage = "Password must be at least 6 characters";
          }
        }

        // If editing → only validate when user types something new (not placeholder)
        if (editingClient && trimmedValue !== "••••••••" && trimmedValue.length > 0) {
          if (trimmedValue.length < 6) {
            errorMessage = "Password must be at least 6 characters";
          }
        }
      }
    }


    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        role: "client",
        status: formData.status ? "active" : "inactive",
      };

      // Only include password if it's provided and not the placeholder
      if (formData.password.trim() && formData.password !== "••••••••") {
        payload.password = formData.password;
      }

      if (editingClient) {
        await apiClient.put(`/clients/${editingClient.user_id}`, payload);
        toast.success("Client updated successfully!", {
          description: `${formData.name} from ${formData.company} has been updated.`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } else {
        // For new clients, password is required
        if (!formData.password.trim()) {
          setErrors(prev => ({ ...prev, password: "Password is required for new clients" }));
          setLoading(false);
          return;
        }
        await apiClient.post('/clients', payload);
        toast.success("Client added successfully!", {
          description: `${formData.name} from ${formData.company} has been added.`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        password: "",
        status: true,
      });
      setErrors({});
      setEditingClient(null);
      setDialogOpen(false);

      // Refresh clients list
      await fetchClients();

    } catch (error: any) {
      console.error("Error saving client:", error);
      toast.error(`Failed to ${editingClient ? 'update' : 'add'} client`, {
        description: error.response?.data?.message || "Please try again later.",
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      password: "",
      status: true,
    });
    setErrors({});
    setEditingClient(null);
    setDialogOpen(false);
  };

  const handleViewClientList = () => {
    navigate('/clients');
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      company: client.company || "",
      address: client.address || "",
      password: "••••••••", // Placeholder to indicate existing password
      status: client.status === "active",
    });
    // Clear password errors when editing
    setErrors(prev => ({ ...prev, password: undefined }));
    setDialogOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete ${client.name} from ${client.company || 'their company'}?`)) {
      return;
    }

    try {
      await apiClient.delete(`/clients/${client.user_id}`);
      toast.success("Client deleted successfully!", {
        description: `${client.name} has been removed.`,
        icon: <CheckCircle className="h-4 w-4" />,
      });
      await fetchClients();
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client", {
        description: error.response?.data?.message || "Please try again later.",
        icon: <X className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Add New Client
            </h1>
            <p className="text-muted-foreground mt-2">Register a new client company</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleViewClientList}
              className="rounded-xl hover:bg-accent transition-all duration-200"
            >
              View All Clients
            </Button>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                handleCancel();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Client</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Contact Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter contact person name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.name ? "border-destructive focus:border-destructive" : "border-border"
                          }`}
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.email ? "border-destructive focus:border-destructive" : "border-border"
                          }`}
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.phone ? "border-destructive focus:border-destructive" : "border-border"
                          }`}
                        disabled={loading}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company"
                        placeholder="Company Name Ltd."
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.company ? "border-destructive focus:border-destructive" : "border-border"
                          }`}
                        disabled={loading}
                      />
                      {errors.company && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address including street, city, state, and postal code"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 min-h-[100px] ${errors.address ? "border-destructive focus:border-destructive" : "border-border"
                        }`}
                      disabled={loading}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password {!editingClient && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={editingClient ? "Leave empty to keep current password" : "Enter password (min 6 characters)"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.password ? "border-destructive focus:border-destructive" : "border-border"
                        }`}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                    {editingClient && (
                      <p className="text-xs text-muted-foreground">
                        Leave empty to keep current password
                      </p>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="space-y-1">
                      <Label htmlFor="status" className="text-sm font-medium text-foreground">
                        Client Status
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.status ? "Active - Client can access the system" : "Inactive - Client access disabled"}
                      </p>
                    </div>
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleInputChange("status", checked)}
                      disabled={loading}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="rounded-xl hover:bg-accent transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-all duration-200 text-white flex-1 sm:flex-initial"
                    >
                      {loading ? (
                        <>
                          <Loader size="sm" />
                          {editingClient ? 'Updating Client...' : 'Adding Client...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {editingClient ? 'Update Client' : 'Add Client'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Recent Clients Preview */}
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold text-foreground">Recent Clients</h2>
            <p className="text-sm text-muted-foreground">Latest client registrations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Contact</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Company</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Phone</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <Loader size="md" text="Loading clients..." />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No clients found. Click "Add Client" to register your first client.
                    </td>
                  </tr>
                ) : (
                  filtered.slice(0, 5).map((client) => (
                    <tr key={client.user_id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{client.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{client.company || '-'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{client.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(client)}
                            className="hover:bg-accent rounded-xl transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(client)}
                            className="text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
