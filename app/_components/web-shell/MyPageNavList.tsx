"use client";

import { useState } from "react";
import {
  INITIAL_MY_PAGE_EXPANDED,
  MY_PAGE_NAV,
  isMyPageNavGroup,
} from "@/app/_components/web-shell/myPageNav";

type Variant = "drawer" | "sidebar";

function NavChevron({ open, variant }: { open: boolean; variant: Variant }) {
  const toneClass =
    variant === "sidebar" ? "text-current" : "text-text-tertiary";

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center self-center",
        variant === "sidebar" ? "w-5 h-5" : "w-4 h-4",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg
        className={[
          "w-4 h-4",
          toneClass,
          "transition-transform duration-fast ease-standard",
          open ? "rotate-180" : "",
        ].join(" ")}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}

export function MyPageNavList({ variant }: { variant: Variant }) {
  const [expandedSections, setExpandedSections] = useState(INITIAL_MY_PAGE_EXPANDED);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={variant === "drawer" ? "flex flex-col" : "flex flex-col gap-0.5"}>
      {MY_PAGE_NAV.map((entry) => {
        if (isMyPageNavGroup(entry)) {
          const open = expandedSections[entry.id];

          if (variant === "sidebar") {
            return (
              <div key={entry.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggleSection(entry.id)}
                  className={[
                    "flex w-full items-center justify-between gap-2 min-h-9 px-2 py-1.5 rounded-[6px] text-sm font-semibold text-left",
                    open ? "text-primary bg-primary-bg" : "text-text-brand-muted",
                  ].join(" ")}
                >
                  <span className="min-w-0">{entry.label}</span>
                  <NavChevron open={open} variant={variant} />
                </button>
                {open && (
                  <div className="mt-0.5 mb-2 ml-3 flex flex-col gap-0.5">
                    {entry.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className={[
                          "block px-[7px] py-[5px] text-[13px] font-medium no-underline",
                          item.active ? "text-primary font-bold" : "text-text-brand-muted",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={entry.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggleSection(entry.id)}
                className={[
                  "flex w-full items-center justify-between gap-2 text-left text-[15px] font-bold min-h-12 border-b border-border-subtle",
                  open ? "text-primary" : "text-text",
                ].join(" ")}
              >
                <span>{entry.label}</span>
                <NavChevron open={open} variant={variant} />
              </button>
              {open && (
                <div className="ml-3 flex flex-col border-b border-border-subtle pb-1">
                  {entry.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={[
                        "flex items-center min-h-11 text-sm font-bold no-underline",
                        item.active
                          ? "text-primary"
                          : "text-text hover:text-primary transition-colors duration-fast ease-standard",
                      ].join(" ")}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (variant === "sidebar") {
          return (
            <a
              key={entry.label}
              href={entry.href}
              className="flex min-h-9 items-center px-2 py-1.5 rounded-[6px] text-sm font-semibold text-text-brand-muted no-underline hover:text-primary transition-colors duration-fast ease-standard"
            >
              {entry.label}
            </a>
          );
        }

        return (
          <a
            key={entry.label}
            href={entry.href}
            className="flex items-center min-h-12 text-[15px] font-bold text-text no-underline hover:text-primary transition-colors duration-fast ease-standard border-b border-border-subtle"
          >
            {entry.label}
          </a>
        );
      })}
    </div>
  );
}
