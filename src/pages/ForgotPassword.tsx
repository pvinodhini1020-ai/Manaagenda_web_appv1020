import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-x-1/2" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mb-4 shadow-glow">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">We'll send you a reset link</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-elevated">
          {sent ? (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-2xl gradient-success flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground text-lg">Check your email</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We've sent a reset link to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 font-semibold rounded-xl gradient-primary border-0 hover:opacity-90 transition-opacity text-white shadow-soft">
                Send reset link
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline gap-1 font-medium">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
