import { PageHeader } from "@/components/PageHeader";
import { branches, devices } from "@/data/mockData";
import { Building2, MapPin, Phone, Cpu, Activity, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { usePagination } from "@/hooks/usePagination";
import { DataTablePagination } from "@/components/DataTablePagination";

export default function Branches() {
  const [search, setSearch] = useState("");
  
  const filtered = useMemo(() => {
    return branches.filter((b) => 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const {
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize
  } = usePagination(filtered, 9);

  return (
    <>
      <PageHeader title="Branches" description={`${totalItems} hospital branches across India`}>
        <Input placeholder="Search branches..." className="w-56 bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Add Branch</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {paginatedItems.map((b) => {
          const onlineDevices = devices.filter((d) => d.branchId === b.id && d.status === "Online").length;
          return (
            <Link to={`/branches/${b.id}`} key={b.id} className="group">
              <div className="card-elevated overflow-hidden hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="h-24 bg-gradient-hero relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_50%)]" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-foreground">
                    Performance: {b.performance}%
                  </div>
                  <div className="absolute -bottom-6 left-5 h-12 w-12 rounded-xl bg-card shadow-card flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="p-5 pt-9">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{b.name.replace("Mayurah ", "")}</h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5"><MapPin className="h-3 w-3" />{b.city}, {b.state}</p>

                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Devices</p>
                      <p className="text-lg font-bold text-foreground flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-info" />{b.deviceCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Today</p>
                      <p className="text-lg font-bold text-foreground flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-success" />{b.todayScans}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Patients</p>
                      <p className="text-lg font-bold text-foreground">{(b.totalPatients / 1000).toFixed(1)}k</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{b.contact}</div>
                    <div>Online devices: <span className="font-semibold text-success">{onlineDevices}/{b.deviceCount}</span></div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <DataTablePagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
        totalItems={totalItems} 
        pageSize={pageSize} 
      />
    </>
  );
}
