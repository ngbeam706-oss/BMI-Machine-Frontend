import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataTablePagination } from "@/components/DataTablePagination";

const staff = [
  { name: "Dr. Anitha Rao", role: "Super Admin", branch: "Bengaluru Central", email: "anitha.rao@mayurah.in", initials: "AR" },
  { name: "Dr. Vikram Shetty", role: "Branch Admin", branch: "HSR Layout", email: "vikram.s@mayurah.in", initials: "VS" },
  { name: "Dr. Priya Menon", role: "Doctor", branch: "Whitefield", email: "priya.m@mayurah.in", initials: "PM" },
  { name: "Ramesh K.", role: "Technician", branch: "Bengaluru Central", email: "ramesh.k@mayurah.in", initials: "RK" },
  { name: "Sunita P.", role: "Technician", branch: "Mumbai Andheri", email: "sunita.p@mayurah.in", initials: "SP" },
  { name: "Faisal A.", role: "Receptionist", branch: "Chennai T.Nagar", email: "faisal.a@mayurah.in", initials: "FA" },
  { name: "Dr. Lakshmi S.", role: "Branch Admin", branch: "Chennai T.Nagar", email: "lakshmi.s@mayurah.in", initials: "LS" },
  { name: "Dr. Kabir Singh", role: "Doctor", branch: "Delhi Saket", email: "kabir.s@mayurah.in", initials: "KS" },
];

const roleColor: Record<string, string> = {
  "Super Admin": "bg-primary-soft text-primary",
  "Branch Admin": "bg-info-soft text-info",
  "Doctor": "bg-accent-soft text-accent",
  "Technician": "bg-warning-soft text-warning",
  "Receptionist": "bg-success-soft text-success",
};

export default function Users() {
  const {
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize
  } = usePagination(staff, 6);

  return (
    <>
      <PageHeader title="Users & Staff" description={`${totalItems} active members across all branches`}>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {paginatedItems.map((s) => (
          <div key={s.email} className="card-elevated p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold">{s.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{s.name}</p>
              <p className="text-xs text-muted-foreground truncate">{s.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${roleColor[s.role]}`}><Shield className="h-3 w-3 inline mr-0.5" />{s.role}</span>
                <span className="text-[10px] text-muted-foreground">{s.branch}</span>
              </div>
            </div>
          </div>
        ))}
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
