import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// NOTE (established gotcha): for token type styles (text-body, text-meta, …)
// prefer `Box` + explicit token classes — this component's variant baseline
// can collide with custom --text-* utilities in twMerge.
const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "text-base leading-relaxed",
      lead: "text-xl leading-relaxed text-muted",
      large: "text-lg font-medium",
      small: "text-sm leading-snug",
      muted: "text-sm text-muted",
    },
  },
  defaultVariants: { variant: "default" },
});

type TextElement = "p" | "span" | "div";

type TextProps = {
  as?: TextElement;
} & VariantProps<typeof textVariants> &
  ComponentPropsWithoutRef<"p">;

export function Text({ as = "p", variant, className, ...props }: TextProps) {
  const Component = as;
  return (
    <Component
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}
