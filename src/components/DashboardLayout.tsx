import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, Briefcase, FolderKanban,
  FileText, MessageSquare, UserCircle, Menu, X, LogOut, ChevronDown,
  Bell, Settings, ClipboardList, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", path: "/employees", icon: Users },
    { label: "Clients", path: "/clients", icon: Building2 },
    { label: "Services", path: "/services", icon: Briefcase },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Service Requests", path: "/service-requests", icon: FileText },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "Users", path: "/users", icon: Settings },
    { label: "Profile", path: "/profile", icon: UserCircle },
  ],
  employee: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Projects", path: "/projects", icon: FolderKanban },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "Profile", path: "/profile", icon: UserCircle },
  ],
  client: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Projects", path: "/projects", icon: FolderKanban },
    { label: "Request Service", path: "/request-service", icon: ClipboardList },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "Profile", path: "/profile", icon: UserCircle },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = navByRole[user.role];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border glass sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-foreground hidden sm:block text-lg tracking-tight">
              Vinodhini Software Solutions
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full gradient-danger ring-2 ring-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent transition-colors">
                <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-foreground leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <UserCircle className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-card/80 backdrop-blur-xl border-r border-border
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "gradient-primary text-white shadow-soft"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 animate-fade-in overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
