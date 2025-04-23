
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className="flex justify-center items-center">
      <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", className)} />
    </div>
  );
}
