import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-white rounded-2xl shadow-medium hover:shadow-glow hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-medium hover:shadow-lg hover:scale-105 active:scale-95",
        outline:
          "glass-card border border-white/20 text-text-primary rounded-2xl hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95",
        secondary:
          "bg-white/10 text-text-secondary rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:scale-105 active:scale-95",
        ghost: "text-text-primary rounded-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105 active:scale-95",
        link: "text-accent-purple underline-offset-4 hover:underline hover:text-accent-purple-secondary",
        accent:
          "bg-gradient-to-r from-accent-green to-accent-green-secondary text-white rounded-xl shadow-medium hover:shadow-lg hover:scale-105 active:scale-95",
        premium:
          "bg-gradient-to-r from-accent-blue to-accent-blue-secondary text-white rounded-xl shadow-medium hover:shadow-lg hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-2xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-11 rounded-xl",
        xs: "h-8 rounded-lg px-3 text-xs has-[>svg]:px-2",
        xl: "h-14 rounded-3xl px-10 has-[>svg]:px-8 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
