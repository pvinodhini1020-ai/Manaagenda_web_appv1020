import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ClientDashboard from "./ClientDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "employee": return <EmployeeDashboard />;
    case "client": return <ClientDashboard />;
  }
}
