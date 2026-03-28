import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-maroon-700 text-cream-100 shadow-md hover:bg-maroon-800 hover:shadow-lg",
        outline:
          "border-2 border-maroon-700 bg-transparent text-maroon-700 hover:bg-maroon-50",
        secondary:
          "bg-gold-500 text-white shadow-md hover:bg-gold-600 hover:shadow-lg",
        ghost: "text-maroon-700 hover:bg-maroon-50",
        sage: "bg-sage-500 text-white shadow-md hover:bg-sage-600",
        destructive: "bg-red-600 text-white shadow-md hover:bg-red-700",
        link: "text-maroon-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-6 text-lg min-w-[120px]",
        sm: "h-11 px-4 text-base",
        lg: "h-16 px-8 text-xl",
        xl: "h-18 px-10 text-2xl",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
