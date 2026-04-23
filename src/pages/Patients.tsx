import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadges";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, Download, LayoutGrid, List, ArrowUpDown, Filter, Eye, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { DataTablePagination } from "@/components/DataTablePagination";
import { usePatients } from "@/hooks/usePatients";

type View = "table" | "grid";
type Sort = "latest" | "health" | "bmi" | "name" | "branch";

export default function Patients() {
  const [view, setView] = useState<View>("table");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("latest");
  
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading: isDynamicLoading } = usePatients({
    start_date: startDate,
    end_date: endDate,
    patient_uhid: search.length > 3 ? search : undefined, // Only search backend if search > 3 chars
    limit: pageSize,
    offset: (currentPage - 1) * pageSize
  });

  const dynamicPatients = response?.data || [];
  const totalItems = response?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const branches = useMemo(() => {
    if (!dynamicPatients) return [];
    const unique = new Map();
    dynamicPatients.forEach(d => {
      if (!unique.has(d.branch.id)) unique.set(d.branch.id, d.branch);
    });
    return Array.from(unique.values());
  }, [dynamicPatients]);

  const devices = useMemo(() => {
    if (!dynamicPatients) return [];
    const unique = new Map();
    dynamicPatients.forEach(d => {
      if (!unique.has(d.device.id)) unique.set(d.device.id, d.device);
    });
    return Array.from(unique.values());
  }, [dynamicPatients]);

  const availableDevices = useMemo(() => {
    if (branchFilter === "all") return devices;
    return devices.filter(d => {
      const patientWithDevice = dynamicPatients?.find(p => p.device.id === d.id);
      return patientWithDevice?.branch.id === branchFilter;
    });
  }, [branchFilter, devices, dynamicPatients]);

  const handleBranchChange = (value: string) => {
    setBranchFilter(value);
    setDeviceFilter("all");
  };

  // Remaining local filters (gender, status, age, sort)
  const filtered = useMemo(() => {
    let list = [...dynamicPatients];
    
    // Apply local search if backend search wasn't triggered
    if (search && search.length <= 3) {
      const q = search.toLowerCase();
      list = list.filter(({ p, branch }) => 
        p.name.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q) || 
        p.phone.includes(q) || 
        branch.name.toLowerCase().includes(q)
      );
    }

    list = list.filter(({ p, scan, branch }) => {
      const matchesBranch = branchFilter === "all" || branch.id === branchFilter;
      const matchesDevice = deviceFilter === "all" || scan.deviceId === deviceFilter;
      const matchesGender = genderFilter === "all" || p.gender === genderFilter;
      const matchesStatus = statusFilter === "all" || scan.status === statusFilter;
      const matchesAge = ageFilter === "all" ||
        (ageFilter === "0-30" && p.age <= 30) ||
        (ageFilter === "31-50" && p.age > 30 && p.age <= 50) ||
        (ageFilter === "51+" && p.age > 50);
      return matchesBranch && matchesDevice && matchesGender && matchesStatus && matchesAge;
    });

    list.sort((a, b) => {
      switch (sort) {
        case "latest": return +new Date(b.scan.timestamp) - +new Date(a.scan.timestamp);
        case "health": return b.scan.measurement.healthScore - a.scan.measurement.healthScore;
        case "bmi": return b.scan.measurement.bmi - a.scan.measurement.bmi;
        case "name": return a.p.name.localeCompare(b.p.name);
        case "branch": return a.branch.name.localeCompare(b.branch.name);
      }
    });
    return list;
  }, [dynamicPatients, search, branchFilter, deviceFilter, genderFilter, statusFilter, ageFilter, sort]);

  return (
    <>
      <PageHeader title="Patient Monitoring" description={`${totalItems} patients · centralized body composition tracking`}>
        <div className="flex items-center gap-4 mr-4 bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase">From</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer p-0"
            />
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase">To</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer p-0"
            />
          </div>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
        <div className="flex items-center bg-card border border-border rounded-lg p-0.5 ml-2">
          <button onClick={() => setView("table")} className={cn("px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors", view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => setView("grid")} className={cn("px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </PageHeader>

      {/* Sticky filters */}
      <div className="card-elevated p-4 mb-4 sticky top-16 z-20 bg-card/95 backdrop-blur">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID, phone or branch..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/30 border-transparent focus:bg-card" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="h-4 w-4 text-muted-foreground self-center" />
            <Select value={branchFilter} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name.replace("Mayurah ", "")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Device" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All devices</SelectItem>
                {availableDevices.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.id} ({d.model.split(" ")[0]})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-32 h-9"><SelectValue placeholder="Age" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ages</SelectItem>
                <SelectItem value="0-30">0–30</SelectItem>
                <SelectItem value="31-50">31–50</SelectItem>
                <SelectItem value="51+">51+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Attention">Attention</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="w-44 h-9 ml-auto"><ArrowUpDown className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest scan</SelectItem>
                <SelectItem value="health">Health score</SelectItem>
                <SelectItem value="bmi">BMI</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isDynamicLoading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : view === "table" ? (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
                <tr>
                  <th className="text-left font-semibold py-3 px-5">Patient</th>
                  <th className="text-left font-semibold py-3 px-5">UHID</th>
                  <th className="text-left font-semibold py-3 px-5">Weight</th>
                  <th className="text-left font-semibold py-3 px-5">Height</th>
                  <th className="text-left font-semibold py-3 px-5">Heart Rate</th>
                  <th className="text-left font-semibold py-3 px-5">Gender/Age</th>
                  <th className="text-left font-semibold py-3 px-5">Date</th>
                  <th className="text-left font-semibold py-3 px-5">Status</th>
                  <th className="text-right font-semibold py-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ p, scan }) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <Link to={`/patients/${p.id}`} className="flex items-center gap-3 group">
                        <div className="h-9 w-9 rounded-full bg-gradient-accent text-accent-foreground flex items-center justify-center text-xs font-bold">{p.name.split(" ").map((n) => n[0]).join("")}</div>
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.phone}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-5"><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{p.uhid}</span></td>
                    <td className="py-3 px-5 font-semibold">{scan.measurement.weight} <span className="text-[10px] text-muted-foreground">kg</span></td>
                    <td className="py-3 px-5">{p.height} <span className="text-[10px] text-muted-foreground">cm</span></td>
                    <td className="py-3 px-5 font-semibold">{scan.measurement.heartRate} <span className="text-[10px] text-muted-foreground">bpm</span></td>
                    <td className="py-3 px-5 text-xs text-muted-foreground">{p.gender} · {p.age}y</td>
                    <td className="py-3 px-5 text-xs text-muted-foreground">{format(new Date(scan.timestamp), "d MMM, HH:mm")}</td>
                    <td className="py-3 px-5"><StatusBadge status={scan.status} /></td>
                    <td className="py-3 px-5 text-right">
                      <Link to={`/patients/${p.id}`}>
                        <Button size="sm" variant="outline" className="h-8 hover:bg-primary hover:text-primary-foreground hover:border-primary">
                          <Eye className="h-3.5 w-3.5 mr-1.5" />View
                        </Button>
                      </Link>
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(({ p, scan }) => (
              <Link key={p.id} to={`/patients/${p.id}`} className="card-elevated p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-accent text-accent-foreground flex items-center justify-center font-bold">{p.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.uhid} · {p.gender} · {p.age}y</p>
                  </div>
                  <StatusBadge status={scan.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase">Weight</p>
                    <p className="font-bold">{scan.measurement.weight}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase">Height</p>
                    <p className="font-bold">{p.height}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase">HR</p>
                    <p className="font-bold">{scan.measurement.heartRate}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground min-w-0">
                    <p className="truncate">{p.phone}</p>
                    <p>{format(new Date(scan.timestamp), "d MMM, HH:mm")}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 hover:bg-primary hover:text-primary-foreground hover:border-primary shrink-0">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />View
                  </Button>
                </div>
              </Link>
            ))}
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
        </>
      )}
    </>
  );
}
