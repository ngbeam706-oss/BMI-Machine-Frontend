import logoImage from "@/assets/Mayura-MyAiDoctor-Logo.pdf-removebg-preview.png";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, BarChart3, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <img src={logoImage} alt="Mayurah AI" className="h-16 w-auto brightness-0 invert" />
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">Centralized body composition monitoring across every Mayurah branch.</h1>
          <p className="text-lg opacity-90 max-w-md">Real-time scans, patient analytics, and clinical insights from a single, secure dashboard.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: BarChart3, label: "Live Analytics" },
              { icon: Users, label: "Multi-Branch" },
              { icon: Shield, label: "HIPAA Ready" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <f.icon className="h-5 w-5 mb-2" />
                <p className="text-sm font-semibold">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs opacity-70 relative">© 2026 Mayurah Hospitals. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to access the monitoring dashboard</p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate("/"); }}>
            <div className="space-y-2">
              <Label htmlFor="email">Hospital Email</Label>
              <Input id="email" type="email" placeholder="doctor@mayurah.in" defaultValue="anitha.rao@mayurah.in" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Sign in as</Label>
              <select id="role" className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm">
                <option>Super Admin</option>
                <option>Branch Admin</option>
                <option>Doctor</option>
                <option>Technician</option>
                <option>Receptionist</option>
              </select>
            </div>
            <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 font-semibold">Sign in to Dashboard</Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Protected by hospital-grade encryption · All access is audited
          </p>
        </div>
      </div>
    </div>
  );
}
