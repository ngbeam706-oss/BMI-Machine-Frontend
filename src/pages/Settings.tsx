import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Manage hospital, devices, and notification preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-4">Hospital Profile</h3>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Hospital Name</Label><Input defaultValue="Mayurah Hospitals" /></div>
            <div className="space-y-1.5"><Label>Headquarters</Label><Input defaultValue="Bengaluru, Karnataka" /></div>
            <div className="space-y-1.5"><Label>Support Email</Label><Input defaultValue="support@mayurah.in" /></div>
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">Save changes</Button>
          </div>
        </div>
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Critical clinical alerts", desc: "Email when a patient has critical body composition values", on: true },
              { label: "Device offline alerts", desc: "Notify when any device goes offline > 1 hour", on: true },
              { label: "Daily digest", desc: "Receive a daily summary of branch performance", on: false },
              { label: "Weekly analytics report", desc: "Cross-branch analytics every Monday", on: true },
            ].map((s) => (
              <div key={s.label} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                <div><p className="font-semibold text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                <Switch defaultChecked={s.on} />
              </div>
            ))}
          </div>
        </div>
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-4">Range Standards</h3>
          <p className="text-sm text-muted-foreground mb-4">Default clinical ranges used for status badges across reports.</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">BMI</p><p className="font-bold">18.5 – 24.9</p></div>
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Visceral Fat</p><p className="font-bold">1 – 9 level</p></div>
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Water Ratio</p><p className="font-bold">50 – 65 %</p></div>
            <div className="p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground">Skeletal Muscle Ratio</p><p className="font-bold">33 – 39 %</p></div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-4">Security</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Two-factor authentication</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span>Audit log retention (90 days)</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span>Single Sign-On (SSO)</span><Switch /></div>
          </div>
        </div>
      </div>
    </>
  );
}
