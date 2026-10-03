"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66CCF2] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#171717] text-white hover:bg-[#2d2d2d] shadow-sm hover:shadow-md",
        brand:
          "bg-[#66CCF2] text-[#171717] font-semibold hover:bg-[#52c1e8] shadow-[0_2px_12px_rgba(102,204,242,0.35)] hover:shadow-[0_4px_16px_rgba(102,204,242,0.5)]",
        orange:
          "bg-[#E64E25] text-white font-medium hover:bg-[#d4411a] shadow-[0_2px_12px_rgba(230,78,37,0.3)] hover:shadow-[0_4px_16px_rgba(230,78,37,0.45)]",
        google:
          "bg-white text-[#171717] border border-[#F1E8EB] hover:border-[#66CCF2]/60 hover:bg-[#FBF9FA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]",
        outline:
          "border border-[#F1E8EB] bg-transparent text-[#171717] hover:bg-[#FBF9FA] hover:border-[#d9ccd1]",
        ghost:
          "text-[#171717] hover:bg-[#FBF9FA] hover:text-[#171717]",
        subtle:
          "bg-[#66CCF2]/10 text-[#09739a] hover:bg-[#66CCF2]/20 font-medium",
        subtleOrange:
          "bg-[#E64E25]/10 text-[#c23b16] hover:bg-[#E64E25]/20 font-medium",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-[10px]",
        sm: "h-8 px-3 text-xs rounded-[10px]",
        lg: "h-12 px-6 text-sm font-semibold rounded-[10px]",
        xl: "h-14 px-8 text-base font-semibold rounded-[10px]",
        icon: "h-10 w-10 rounded-[10px]",
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
