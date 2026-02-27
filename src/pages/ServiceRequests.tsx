import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { Check, X, Users, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { serviceRequestService, ServiceRequest } from "@/services/serviceRequestService";
import { userService, User } from "@/services/userService";
import Loader from "@/components/Loader";

// Local interface for employees with user_id field
interface Employee {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'employee' | 'client';
  department?: string;
  company?: string;
  address?: string;
  salary?: number;
  status?: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function ServiceRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, employeesRes] = await Promise.all([
          serviceRequestService.getServiceRequests(),
          userService.getUsers({ role: 'employee' })
        ]);
        setRequests(requestsRes.data || []);
        // Map User objects to Employee objects (id -> user_id)
        const mappedEmployees = (employeesRes.data || []).map(user => ({
          ...user,
          user_id: user.user_id
        }));
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load service requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (requestId: string) => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    setApprovingRequestId(requestId);
    try {
      await serviceRequestService.approveServiceRequest(requestId, { employee_ids: selectedEmployees });
      toast.success("Service request approved and project created successfully");
      
      // Refresh the requests list
      const requestsRes = await serviceRequestService.getServiceRequests();
      setRequests(requestsRes.data || []);
      setSelectedEmployees([]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve request";
      toast.error(errorMessage);
    } finally {
      setApprovingRequestId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await serviceRequestService.rejectServiceRequest(requestId);
      toast.success("Service request rejected successfully");
      
      // Refresh the requests list
      const requestsRes = await serviceRequestService.getServiceRequests();
      setRequests(requestsRes.data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject request";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="md" text="Loading service requests..." />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
        <p className="text-muted-foreground">Review and manage client service requests</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground text-lg">Recent Service Requests</h2>
          <button 
            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'View all'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
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
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {req.client?.company || req.client?.name || 'Unknown Client'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{req.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{req.description}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(req.created_at)}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "pending" && user?.role === "admin" && (
                      <div className="flex justify-end gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="icon" 
                              className="gradient-success border-0 rounded-xl hover:opacity-90 h-8 w-8"
                              onClick={() => setSelectedEmployees([])}
                            >
                              <Check className="h-4 w-4 text-white" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Assign Employees
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Select employees to assign to this project:
                              </p>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {employees.map((employee) => (
                                  <div key={employee.user_id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={employee.user_id}
                                      checked={selectedEmployees.includes(employee.user_id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedEmployees([...selectedEmployees, employee.user_id]);
                                        } else {
                                          setSelectedEmployees(selectedEmployees.filter(id => id !== employee.user_id));
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={employee.user_id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {employee.name} - {employee.department}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedEmployees([])}>
                                  Clear
                                </Button>
                                <Button 
                                  onClick={() => handleApprove(req.id)}
                                  disabled={approvingRequestId === req.id || selectedEmployees.length === 0}
                                >
                                  {approvingRequestId === req.id ? (
                                    <Loader size="sm" />
                                  ) : null}
                                  Approve & Create Project
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="icon" 
                          className="gradient-danger border-0 rounded-xl hover:opacity-90 h-8 w-8"
                          onClick={() => handleReject(req.id)}
                        >
                          <X className="h-4 w-4 text-white" />
                        </Button>
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
