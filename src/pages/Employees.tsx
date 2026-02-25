import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { apiClient } from "@/services/authService";
import Loader from "@/components/Loader";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  salary?: number;
  role: string;
  status: "active" | "inactive";
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  salary: string;
  password: string;
  status: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  salary?: string;
  password?: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setFetchLoading(true);
      const response = await apiClient.get('/employees');
      setEmployees(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees", {
        description: error.response?.data?.error || "Please try again later.",
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
    password: "",
    status: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = "Please enter a valid salary amount";
    }

    if (!formData.password.trim() && !editingEmployee) {
      newErrors.password = "Password is required";
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name: formData.fullName,
        email: formData.email,
        salary: Number(formData.salary),
        status: formData.status ? "active" : "inactive",
      };

      // Only include phone if it's not empty
      if (formData.phone.trim()) {
        payload.phone = formData.phone;
      }

      // Only include department if it's not empty
      if (formData.department.trim()) {
        payload.department = formData.department;
      }

      // Only include password if it's provided (not empty)
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      // For new employees, set role to employee
      if (!editingEmployee) {
        payload.role = "employee";
        // For new employees, phone and department are required
        payload.phone = formData.phone;
        payload.department = formData.department;
      }

      if (editingEmployee) {
        await apiClient.put(`/employees/${editingEmployee.id}`, payload);
        toast.success("Employee updated successfully!", {
          description: `${formData.fullName} has been updated.`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      } else {
        await apiClient.post(`/employees`, payload);
        toast.success("Employee added successfully!", {
          description: `${formData.fullName} has been added to the team.`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }

      await fetchEmployees();
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        salary: "",
        password: "",
        status: true,
      });
      setErrors({});
      setEditingEmployee(null);
      setDialogOpen(false);

    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast.error(`Failed to ${editingEmployee ? 'update' : 'add'} employee`, {
        description: error.response?.data?.message || "Please try again later.",
        icon: <X className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      salary: employee.salary?.toString() || "",
      password: "",
      status: employee.status === "active",
    });
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
      password: "",
      status: true,
    });
    setErrors({});
    setEditingEmployee(null);
    setDialogOpen(false);
  };

  const handleDelete = async (employeeId: string, employeeName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/employees/${employeeId}`);
      if (response.status === 200) {
        toast.success("Employee deleted successfully!");
        // Refresh the employees list
        fetchEmployees();
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="text-muted-foreground mt-2">Manage your team members efficiently</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingEmployee(null);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                department: "",
                salary: "",
                password: "",
                status: true,
              });
              setErrors({});
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.fullName ? "border-destructive focus:border-destructive" : "border-border"
                        }`}
                      disabled={loading}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
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
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
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


                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-foreground">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. Engineering, Design, Marketing"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.department ? "border-destructive focus:border-destructive" : "border-border"
                        }`}
                      disabled={loading}
                    />
                    {errors.department && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium text-foreground">
                      Salary <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="75000"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      className={`rounded-xl border-2 transition-all duration-200 focus:border-primary/50 ${errors.salary ? "border-destructive focus:border-destructive" : "border-border"
                        }`}
                      disabled={loading}
                    />
                    {errors.salary && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.salary}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password {!editingEmployee && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={editingEmployee ? "Leave empty to keep current password" : "•••••••••"}
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
                    {editingEmployee && (
                      <p className="text-xs text-muted-foreground">
                        Leave empty to keep current password
                      </p>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="space-y-1">
                      <Label htmlFor="status" className="text-sm font-medium text-foreground">
                        Employee Status
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.status ? "Active - Employee can access the system" : "Inactive - Employee access disabled"}
                      </p>
                    </div>
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleInputChange("status", checked)}
                      disabled={loading}
                    />
                  </div>
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
                        {editingEmployee ? 'Updating...' : 'Adding Employee...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {editingEmployee ? 'Update Employee' : 'Save Employee'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-10 rounded-xl border-2 border-border focus:border-primary/50 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Employees Table */}
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <Loader size="md" text="Loading employees..." />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {search ? "No employees found matching your search" : "No employees found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{emp.role}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(emp)}
                            className="hover:bg-accent rounded-xl transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
                            onClick={() => handleDelete(emp.id, emp.name)}
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
