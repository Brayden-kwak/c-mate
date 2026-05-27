"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type LinkButtonProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "style"
> & {
  href: LinkProps["href"];
  loading?: boolean;
  spinnerClass?: string;
  className: string;
  children: ReactNode;
};

export const LinkButton = ({
  href,
  loading,
  spinnerClass,
  className,
  onClick: externalOnClick,
  children,
  ...rest
}: LinkButtonProps) => {
  const isDisabled = loading || rest["aria-disabled"];
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    externalOnClick?.(e);
  };
  return (
    <Link
      {...rest}
      href={href}
      className={className}
      aria-disabled={isDisabled}
      onClick={handleClick}
    >
      {loading && spinnerClass && <span className={spinnerClass} />}
      {children}
    </Link>
  );
};
