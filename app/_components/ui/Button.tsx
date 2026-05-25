import Link from "next/link";
import type { LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import type { ButtonVariant, Size } from "./types";

type CommonProps = {
  variant?: ButtonVariant;
  size?: Size;
  layout?: "auto" | "full" | "fill" | "responsive";
  loading?: boolean;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> & {
    href?: undefined;
  };

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "style"> & {
    href: LinkProps["href"];
  };

type Props = ButtonProps | LinkButtonProps;

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover disabled:bg-disabled disabled:text-text-tertiary",
  secondary:
    "bg-surface text-text border border-border-strong hover:bg-subtle hover:border-border-strong disabled:bg-disabled disabled:text-text-tertiary",
  tertiary:
    "bg-subtle text-text-secondary hover:bg-disabled hover:text-text disabled:bg-disabled disabled:text-text-tertiary",
  danger:
    "bg-danger text-white hover:bg-danger-hover disabled:bg-disabled disabled:text-text-tertiary",
  icon: "bg-surface border border-border w-9 h-9 p-0 rounded-[6px] hover:bg-subtle hover:border-border-strong",
};

const sizeClass: Record<Size, string> = {
  sm: "text-[13px] h-8 px-3 rounded-md",
  md: "text-sm h-10 px-4 rounded-md",
  lg: "text-[15px] h-11 px-5 rounded-md",
};

const layoutClass: Record<NonNullable<Props["layout"]>, string | undefined> = {
  auto: undefined,
  full: "w-full",
  fill: "flex-1",
  responsive: "w-full sm:flex-1",
};

export function Button({
  variant = "primary",
  size = "md",
  layout = "auto",
  loading,
  className,
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-colors duration-base ease-standard focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed";
  const isLight = variant === "primary" || variant === "danger";
  const classNames = [
    base,
    variantClass[variant],
    sizeClass[size],
    layoutClass[layout],
    loading ? "gap-2 opacity-85" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest;
    return (
      <Link
        {...linkRest}
        href={href}
        className={classNames}
        aria-disabled={loading || linkRest["aria-disabled"]}
      >
        {loading && (
          <span className={isLight ? "btn-spinner" : "btn-spinner-dark"} />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={classNames}
    >
      {loading && (
        <span className={isLight ? "btn-spinner" : "btn-spinner-dark"} />
      )}
      {children}
    </button>
  );
}
