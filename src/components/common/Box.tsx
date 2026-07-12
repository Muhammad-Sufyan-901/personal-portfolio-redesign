import type { ComponentPropsWithRef, ComponentType, ElementType } from "react";

type BoxProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithRef<T>;

/** Polymorphic layout primitive — replaces every bare structural tag
 *  (div/section/article/header/footer/nav/ul/li) in feature code.
 *  No styling of its own. */
export function Box<T extends ElementType = "div">({ as, ...props }: BoxProps<T>) {
  // Internal type erasure (external signature stays strictly typed):
  // R3F v9 augments React's JSX intrinsics with ~200 three.js entries,
  // which collapses a bare `ElementType` spread to `never`.
  const Component = (as ?? "div") as ComponentType<Record<string, unknown>>;
  return <Component {...(props as Record<string, unknown>)} />;
}
