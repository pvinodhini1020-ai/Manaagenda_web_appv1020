interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  gradient?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, gradient = "gradient-primary" }: StatCardProps) {
  return (
    <div className="group bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && <p className="text-xs text-success font-semibold mt-2">{trend}</p>}
        </div>
        <div className={`h-12 w-12 rounded-xl ${gradient} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
