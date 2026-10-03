import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#171717] text-white",
        outline: "border border-[#F1E8EB] text-[#737373] bg-white",
        blue: "bg-[#66CCF2]/15 text-[#0284c7] border border-[#66CCF2]/30",
        orange: "bg-[#E64E25]/12 text-[#c23b16] border border-[#E64E25]/25",
        muted: "bg-[#FBF9FA] text-[#737373] border border-[#F1E8EB]",
        active: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
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
