import { PageHeader } from "@/components/PageHeader";
import { devices as initialDevices, branches, getBranch } from "@/data/mockData";
import { DeviceStatusBadge } from "@/components/StatusBadges";
import { Cpu, Wifi, WifiOff, Activity, Plus, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { useState, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { DataTablePagination } from "@/components/DataTablePagination";

interface Device {
  id: string;
  model: string;
  status: "Online" | "Offline" | "Syncing" | "Maintenance";
  branchId: string;
  lastSync: string;
  totalScans: number;
  uptime: number;
  firmware: string;
  technician: string;
}

export default function Devices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [devices, setDevices] = useState<Device[]>(initialDevices as Device[]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({});

  const handleAddClick = () => {
    setEditingDevice(null);
    setFormData({
      status: "Online",
      branchId: branches[0]?.id || "",
      totalScans: 0,
      uptime: 100,
      lastSync: new Date().toISOString(),
      firmware: "v2.0.4",
    });
    setFormOpen(true);
  };

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      handleAddClick();
      // Clear param without refreshing
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("add");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleEditClick = (device: Device) => {
    setEditingDevice(device);
    setFormData(device);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.id || !formData.model) {
      toast.error("Please fill in required fields");
      return;
    }

    if (editingDevice) {
      setDevices(prev => prev.map(d => d.id === editingDevice.id ? { ...d, ...formData } as Device : d));
      toast.success(`Device ${formData.id} updated successfully`);
    } else {
      if (devices.find(d => d.id === formData.id)) {
        toast.error("Device ID already exists");
        return;
      }
      setDevices(prev => [{ ...formData, id: formData.id, model: formData.model } as Device, ...prev]);
      toast.success(`Device ${formData.id} added successfully`);
    }
    setFormOpen(false);
  };

  const filtered = useMemo(() => devices.filter((d) =>
    (d.id.toLowerCase().includes(search.toLowerCase()) || d.model.toLowerCase().includes(search.toLowerCase())) &&
    (branchFilter === "all" || d.branchId === branchFilter) &&
    (statusFilter === "all" || d.status === statusFilter)
  ), [devices, search, branchFilter, statusFilter]);

  const {
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize
  } = usePagination(filtered, 10);

  const online = devices.filter(d => d.status === "Online").length;
  const totalScans = devices.reduce((a, b) => a + (b.totalScans || 0), 0);

  return (
    <>
      <PageHeader title="Devices" description={`${devices.length} body composition monitors across all branches`}>
        <Button onClick={handleAddClick} className="bg-gradient-primary text-primary-foreground shadow-elevated">
          <Plus className="h-4 w-4 mr-2" /> Add Device
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Devices" value={devices.length} icon={Cpu} variant="primary" />
        <StatCard label="Online" value={online} icon={Wifi} variant="success" />
        <StatCard label="Offline / Maintenance" value={devices.length - online} icon={WifiOff} variant="warning" />
        <StatCard label="Lifetime Scans" value={totalScans.toLocaleString()} icon={Activity} variant="accent" />
      </div>

      <div className="card-elevated p-4 mb-4 flex flex-col md:flex-row gap-3">
        <Input placeholder="Search by device ID or model..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-muted/30 border-transparent focus:bg-card" />
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="md:w-56"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All branches</SelectItem>
            {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name.replace("Mayurah ", "")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
            <SelectItem value="Syncing">Syncing</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>
                <th className="text-left font-semibold py-3 px-5">Device</th>
                <th className="text-left font-semibold py-3 px-5">Branch</th>
                <th className="text-left font-semibold py-3 px-5">Status</th>
                <th className="text-left font-semibold py-3 px-5">Last Sync</th>
                <th className="text-left font-semibold py-3 px-5">Total Scans</th>
                <th className="text-left font-semibold py-3 px-5">Technician</th>
                <th className="text-left font-semibold py-3 px-5">Uptime</th>
                <th className="text-center font-semibold py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary-soft flex items-center justify-center"><Cpu className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="font-semibold">{d.id}</p>
                        <p className="text-xs text-muted-foreground">{d.model} · {d.firmware}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">{getBranch(d.branchId).name.replace("Mayurah ", "")}</td>
                  <td className="py-3 px-5"><DeviceStatusBadge status={d.status} /></td>
                  <td className="py-3 px-5 text-xs text-muted-foreground">{formatDistanceToNow(new Date(d.lastSync || Date.now()), { addSuffix: true })}</td>
                  <td className="py-3 px-5 font-semibold">{(d.totalScans || 0).toLocaleString()}</td>
                  <td className="py-3 px-5 text-xs">{d.technician}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${d.uptime > 95 ? "bg-success" : d.uptime > 90 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${d.uptime || 0}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{d.uptime || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(d)} className="hover:bg-primary-soft hover:text-primary rounded-full">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalItems > pageSize && (
          <DataTablePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
            totalItems={totalItems} 
            pageSize={pageSize} 
          />
        )}
      </div>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-l border-border">
          <SheetHeader className="pb-6 border-b border-border mb-6">
            <div className="bg-primary-soft h-12 w-12 rounded-2xl flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <SheetTitle className="text-2xl font-bold">{editingDevice ? "Edit Device" : "Configure New Device"}</SheetTitle>
            <SheetDescription>Set up hardware parameters and assign a medical branch location.</SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="deviceId" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Device ID</Label>
              <Input id="deviceId" placeholder="e.g. DEV-0009" value={formData.id || ""} onChange={e => setFormData({ ...formData, id: e.target.value })} disabled={!!editingDevice} className="bg-muted/30 border-transparent focus:bg-card" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Hardware Model</Label>
              <Input id="model" placeholder="e.g. BCM-X7 Elite" value={formData.model || ""} onChange={e => setFormData({ ...formData, model: e.target.value })} className="bg-muted/30 border-transparent focus:bg-card" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="branch" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Assigned Branch</Label>
              <Select value={formData.branchId} onValueChange={v => setFormData({ ...formData, branchId: v })}>
                <SelectTrigger className="bg-muted/30 border-transparent focus:bg-card"><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>
                  {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name.replace("Mayurah ", "")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Operational Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as Device["status"] })}>
                <SelectTrigger className="bg-muted/30 border-transparent focus:bg-card"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Syncing">Syncing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tech" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Assigned Technician</Label>
              <Input id="tech" placeholder="e.g. Ramesh Kumar" value={formData.technician || ""} onChange={e => setFormData({ ...formData, technician: e.target.value })} className="bg-muted/30 border-transparent focus:bg-card" />
            </div>
          </div>

          <SheetFooter className="mt-8 border-t border-border pt-6 gap-2">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground flex-[2]">{editingDevice ? "Save Changes" : "Register Device"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
