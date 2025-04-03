import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "relative inline-block aspect-square transform-gpu",
  {
    variants: {
      variant: {
        default: "[&>div]:bg-foreground",
        primary: "[&>div]:bg-primary",
        secondary: "[&>div]:bg-secondary",
        destructive: "[&>div]:bg-destructive",
        muted: "[&>div]:bg-muted-foreground",
      },
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof spinnerVariants>, "size"> {
  className?: string;
  size?: VariantProps<typeof spinnerVariants>["size"] | number;
}

const Spinner = ({ className, variant, size = "default" }: SpinnerProps) => (
  <div
    role="status"
    aria-label="Loading"
    className={cn(
      typeof size === "string"
        ? spinnerVariants({ variant, size })
        : spinnerVariants({ variant }),
      className
    )}
    style={typeof size === "number" ? { width: size, height: size } : undefined}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="absolute left-[46.5%] top-[4.4%] h-[24%] w-[7%]
          origin-[center_190%] rounded-full opacity-100 will-change-transform
          animate-[spinner_1.2s_linear_infinite]"
        style={{
          transform: `rotate(${i * 30}deg)`,
          animationDelay: `${(i * 0.083).toFixed(3)}s`,
        }}
        aria-hidden="true"
      />
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);

export { Spinner, spinnerVariants };