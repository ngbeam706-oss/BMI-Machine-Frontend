import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-2 border-t border-border/50">
      <div className="text-sm text-muted-foreground whitespace-nowrap order-2 sm:order-1">
        Showing <span className="font-semibold text-foreground">{startIdx}</span> to{" "}
        <span className="font-semibold text-foreground">{endIdx}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> entries
      </div>
      
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/60 hover:bg-primary-soft hover:text-primary transition-colors"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className={`h-8 min-w-[32px] rounded-lg text-xs font-semibold ${
                page === "..." 
                  ? "pointer-events-none opacity-50" 
                  : page === currentPage 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-primary-soft hover:text-primary"
              }`}
              onClick={() => typeof page === "number" && onPageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-border/60 hover:bg-primary-soft hover:text-primary transition-colors"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
