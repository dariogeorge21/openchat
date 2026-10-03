import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[14px] border border-[#F1E8EB] bg-white px-4 py-2 text-sm text-[#171717] placeholder:text-[#737373]/60 transition-all duration-200 outline-none focus:border-[#66CCF2] focus:ring-2 focus:ring-[#66CCF2]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
