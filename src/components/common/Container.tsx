import type { ComponentPropsWithRef, ComponentType, ElementType } from "react";
import { cn } from "@/lib/utils";

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

type ContainerProps<T extends ElementType> = {
  as?: T;
  maxWidth?: keyof typeof MAX_WIDTHS;
  centerContent?: boolean;
} & ComponentPropsWithRef<T>;

/** Centered max-width wrapper — always applies mx-auto px-4 sm:px-6 lg:px-8. */
export function Container<T extends ElementType = "div">({
  as,
  maxWidth = "7xl",
  centerContent = false,
  className,
  ...props
}: ContainerProps<T>) {
  // See Box.tsx — R3F's JSX augmentation breaks a bare `ElementType` spread.
  const Component = (as ?? "div") as ComponentType<Record<string, unknown>>;
  return (
    <Component
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        MAX_WIDTHS[maxWidth as keyof typeof MAX_WIDTHS],
        centerContent && "flex flex-col items-center",
        className,
      )}
      {...(props as Record<string, unknown>)}
    />
  );
}
