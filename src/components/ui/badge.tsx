import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
  secondary: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
  destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
  outline: "text-gray-700 border-gray-300",
  success: "border-transparent bg-green-100 text-green-700",
  warning: "border-transparent bg-yellow-100 text-yellow-700",
  info: "border-transparent bg-blue-100 text-blue-700",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
