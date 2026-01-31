import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        hero: "bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary shadow-elevated border border-primary/30 dark:text-primary-foreground text-black",
        gamemode: "bg-gradient-card border border-border text-foreground hover:border-primary hover:glow-primary",
        shop: "bg-gradient-accent text-accent-foreground hover:opacity-90 glow-accent shadow-elevated",
      },
      size: {
        default: "h-12 px-6 py-3 text-base md:h-10 md:px-4 md:py-2 md:text-sm min-h-[44px]",
        sm: "h-11 px-4 py-2 text-base md:h-9 md:px-3 md:text-sm min-h-[44px]",
        lg: "h-14 px-10 py-4 text-lg md:h-12 md:px-8 md:text-base min-h-[48px]",
        xl: "h-16 px-12 py-4 text-xl md:h-14 md:px-10 md:text-lg min-h-[52px]",
        icon: "h-12 w-12 md:h-10 md:w-10 min-h-[44px] min-w-[44px]",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
