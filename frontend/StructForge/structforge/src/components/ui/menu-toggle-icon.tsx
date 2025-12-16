import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuToggleIconProps {
  open: boolean;
  className?: string;
  duration?: number;
}

export function MenuToggleIcon({ open, className }: MenuToggleIconProps) {
  return open ? (
    <X className={cn("transition-all", className)} />
  ) : (
    <Menu className={cn("transition-all", className)} />
  );
}