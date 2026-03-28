import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-maroon-700 text-white",
        secondary: "border-transparent bg-gold-100 text-gold-800",
        sage: "border-transparent bg-sage-100 text-sage-800",
        outline: "text-darkText border-cream-300",
        normal: "border-transparent bg-sage-100 text-sage-700",
        mild: "border-transparent bg-gold-100 text-gold-700",
        moderate: "border-transparent bg-orange-100 text-orange-700",
        severe: "border-transparent bg-maroon-100 text-maroon-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
