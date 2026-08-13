"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Props = Omit<ComponentProps<typeof Link>, "prefetch">;

export default function IntentPrefetchLink({
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...props
}: Props) {
  const [prefetch, setPrefetch] = useState(false);
  const warm = () => setPrefetch(true);

  return (
    <Link
      {...props}
      prefetch={prefetch ? null : false}
      onFocus={(event) => {
        warm();
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        warm();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        warm();
        onTouchStart?.(event);
      }}
    />
  );
}
