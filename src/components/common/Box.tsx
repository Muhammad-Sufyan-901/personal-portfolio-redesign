import type { ComponentPropsWithRef, ElementType } from "react";

type BoxProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithRef<T>;

/** Polymorphic layout primitive — replaces every bare structural tag
 *  (div/section/article/header/footer/nav/ul/li) in feature code.
 *  No styling of its own. */
export function Box<T extends ElementType = "div">({ as, ...props }: BoxProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return <Component {...props} />;
}
