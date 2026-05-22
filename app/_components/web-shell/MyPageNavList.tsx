"use client";

import { useState } from "react";
import {
  INITIAL_MY_PAGE_EXPANDED,
  MY_PAGE_NAV,
  isMyPageNavGroup,
} from "@/app/_components/web-shell/myPageNav";

type Variant = "drawer" | "sidebar";

function NavChevron({ open, variant }: { open: boolean; variant: Variant }) {
  if (variant === "sidebar") {
    return <span className="text-xs" aria-hidden="true">{open ? "⌃" : "⌄"}</span>;
  }

  return (
    <svg
      className={[
        "w-4 h-4 shrink-0 text-text-tertiary transition-transform duration-fast ease-standard",
        open ? "rotate-180" : "",
      ].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function MyPageNavList({ variant }: { variant: Variant }) {
  const [expandedSections, setExpandedSections] = useState(INITIAL_MY_PAGE_EXPANDED);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={variant === "drawer" ? "flex flex-col gap-2.5" : "flex flex-col gap-0.5"}>
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
                    "flex w-full items-center justify-between min-h-[31px] px-2 py-1.5 rounded-[6px] font-semibold text-left",
                    open ? "text-primary bg-primary-bg" : "text-text-brand-muted",
                  ].join(" ")}
                >
                  <span>{entry.label}</span>
                  <NavChevron open={open} variant={variant} />
                </button>
                {open && (
                  <div className="mt-0.5 mb-2 ml-3 flex flex-col gap-0.5">
                    {entry.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className={[
                          "block px-[7px] py-[5px] text-xs font-medium no-underline",
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
                  "flex w-full items-center justify-between gap-2 text-left text-[13px] font-bold",
                  open ? "text-primary" : "text-text",
                ].join(" ")}
              >
                <span>{entry.label}</span>
                <NavChevron open={open} variant={variant} />
              </button>
              {open && (
                <div className="mt-2 ml-3 flex flex-col gap-2">
                  {entry.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={[
                        "text-[13px] font-bold no-underline",
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
              className="flex min-h-[31px] items-center px-2 py-1.5 rounded-[6px] text-[13px] font-semibold text-text-brand-muted no-underline hover:text-primary transition-colors duration-fast ease-standard"
            >
              {entry.label}
            </a>
          );
        }

        return (
          <a
            key={entry.label}
            href={entry.href}
            className="text-[13px] font-bold text-text no-underline hover:text-primary transition-colors duration-fast ease-standard"
          >
            {entry.label}
          </a>
        );
      })}
    </div>
  );
}
