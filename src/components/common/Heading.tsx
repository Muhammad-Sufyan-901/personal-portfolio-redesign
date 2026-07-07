import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// NOTE (established gotcha): the default variant's responsive sizes survive
// twMerge over fluid tokens like `text-item` — for token-sized headings inside
// sections use `Box as="h3"` + token classes instead.
const headingVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "text-2xl font-semibold tracking-tight md:text-3xl",
      display: "font-display font-normal text-display",
      title: "font-display font-normal text-chapter",
      subtitle: "text-xl font-medium tracking-tight md:text-2xl",
      section: "font-display font-light text-statement",
    },
  },
  defaultVariants: { variant: "default" },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: HeadingElement;
} & VariantProps<typeof headingVariants> &
  ComponentPropsWithoutRef<"h1">;

export function Heading({ level = 1, as, variant, className, ...props }: HeadingProps) {
  const Component = as ?? (`h${level}` as HeadingElement);
  return (
    <Component
      className={cn(headingVariants({ variant }), className)}
      {...props}
    />
  );
}
