import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2, Shield, Users, Briefcase } from "lucide-react";
import { validateLoginForm, FormErrors, LoginFormData } from "@/utils/validation";
import Loader from "@/components/Loader";

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { login, user, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Apply role-based theme class to body
  useEffect(() => {
    if (user?.role) {
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${user.role}`);
    }
    return () => {
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
    };
  }, [user]);

  // Redirect based on role after successful login
  useEffect(() => {
    if (user && showSuccess) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'employee' ? '/employee/dashboard' :
          '/client/dashboard';

      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    }
  }, [user, showSuccess, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors = validateLoginForm(formData);
    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      await login(formData.email, formData.password);
      setShowSuccess(true);
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'employee': return <Users className="h-4 w-4" />;
      case 'client': return <Briefcase className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'employee': return 'text-green-600 bg-green-50 border-green-200';
      case 'client': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic gradient background based on potential role */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mb-4 shadow-glow animate-float">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vinodhini Software Solutions</h1>
          <p className="text-muted-foreground">Secure access to your workspace</p>
        </div>

        {/* Login card */}
        <div className="glass rounded-3xl p-8 shadow-elevated animate-slide-up">
          {/* Success message */}
          {showSuccess && user && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-slide-up">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Login successful!</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-600">Welcome back, {user.name}</span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="text-xs font-medium capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !showSuccess && (
            <div className={`mb-6 p-4 rounded-xl border animate-slide-up ${error.toLowerCase().includes('inactive')
                ? 'bg-orange-50 border-orange-200'
                : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-center space-x-3">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 ${error.toLowerCase().includes('inactive') ? 'text-orange-600' : 'text-red-600'
                  }`} />
                <div>
                  <p className={`text-sm font-medium ${error.toLowerCase().includes('inactive') ? 'text-orange-800' : 'text-red-800'
                    }`}>
                    {error}
                  </p>
                  {error.toLowerCase().includes('inactive') && (
                    <p className="text-xs text-orange-600 mt-1">
                      Please reach out to your system administrator to reactivate your account.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`h-12 rounded-xl transition-all duration-200 ${formErrors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'focus:border-primary focus:ring-primary/20'
                  }`}
                disabled={isSubmitting || isLoading}
                autoComplete="email"
              />
              {formErrors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{formErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-12 rounded-xl pr-12 transition-all duration-200 ${formErrors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'focus:border-primary focus:ring-primary/20'
                    }`}
                  disabled={isSubmitting || isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{formErrors.password}</span>
                </p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 font-semibold rounded-xl gradient-primary border-0 hover:opacity-90 transition-all duration-200 text-white shadow-soft disabled:opacity-50"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader size="sm" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2026 Vinodhini Software Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
