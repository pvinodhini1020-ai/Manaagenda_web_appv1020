import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Loader({ size = "md", className, text }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse",
          sizeClasses[size]
        )} />
        {/* Middle ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin",
          sizeClasses[size]
        )} />
        {/* Inner dot */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          sizeClasses[size]
        )}>
          <div className={cn(
            "rounded-full bg-primary animate-ping",
            size === "sm" ? "h-1 w-1" : size === "md" ? "h-2 w-2" : "h-3 w-3"
          )} />
        </div>
        {/* Center gradient circle */}
        <div className={cn(
          "rounded-full gradient-primary opacity-80 animate-pulse",
          sizeClasses[size]
        )} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}
