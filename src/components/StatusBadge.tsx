import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "completed" | "inactive" | "approved" | "rejected";

const styles: Record<Status, string> = {
  active: "gradient-success text-white",
  completed: "gradient-primary text-white",
  pending: "gradient-warning text-white",
  inactive: "bg-muted text-muted-foreground",
  approved: "gradient-success text-white",
  rejected: "gradient-danger text-white",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm", styles[status])}>
      {status}
    </span>
  );
}
