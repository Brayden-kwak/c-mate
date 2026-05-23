"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import type { FieldState, Size } from "./types";

export type DropdownOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  size?: Size;
  state?: FieldState;
  disabled?: boolean;
  layout?: "full" | "auto";
  fieldWidth?: "salary";
  name?: string;
  id?: string;
  wrapperClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

const triggerSizeClass: Record<Size, string> = {
  sm: "h-8 pl-2.5 pr-9 text-sm",
  md: "h-10 pl-3 pr-10 text-sm",
  lg: "h-12 pl-4 pr-11 text-base",
};

const stateClass: Record<FieldState, string> = {
  default:
    "border-border bg-surface text-text hover:border-border-strong focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1",
  error:
    "border-danger bg-surface text-text focus-visible:border-danger focus-visible:outline-2 focus-visible:outline-danger focus-visible:outline-offset-1",
  disabled: "border-border bg-disabled text-text-tertiary cursor-not-allowed",
};

const layoutClass: Record<NonNullable<Props["layout"]>, string | undefined> = {
  full: "w-full",
  auto: undefined,
};

const fieldWidthClass: Record<NonNullable<Props["fieldWidth"]>, string> = {
  salary: "w-[var(--spacing-field-salary)]",
};

const LIST_ITEM_HEIGHT_REM = 2.5;
const LIST_VERTICAL_PADDING_REM = 0.5;
const LIST_GAP_REM = 0.25;
const LIST_MAX_HEIGHT_REM = 18;
const FLIP_BUFFER_REM = 0.5;

const computeFlipThresholdRem = (optionCount: number) =>
  Math.min(
    optionCount * LIST_ITEM_HEIGHT_REM + LIST_VERTICAL_PADDING_REM,
    LIST_MAX_HEIGHT_REM,
  ) +
  LIST_GAP_REM +
  FLIP_BUFFER_REM;

type MenuRect = {
  top: number;
  left: number;
  width: number;
  direction: "down" | "up";
  triggerBottom: number;
  triggerTop: number;
};

export function DropdownSelect({
  value,
  onChange,
  options,
  placeholder = "선택",
  size = "md",
  state = "default",
  disabled = false,
  layout = "full",
  fieldWidth,
  name,
  id,
  wrapperClassName,
  ...aria
}: Props) {
  const resolvedState: FieldState = disabled ? "disabled" : state;
  const reactId = useId();
  const triggerId = id ?? `dropdown-${reactId}`;
  const listboxId = `${triggerId}-listbox`;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const measurePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const threshold = computeFlipThresholdRem(options.length) * remPx;
    const gap = LIST_GAP_REM * remPx;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const direction: MenuRect["direction"] =
      spaceBelow < threshold && spaceAbove > spaceBelow ? "up" : "down";
    setMenuRect({
      top: direction === "down" ? rect.bottom + gap : rect.top - gap,
      left: rect.left,
      width: rect.width,
      direction,
      triggerBottom: rect.bottom,
      triggerTop: rect.top,
    });
  }, [options.length]);

  useEffect(() => {
    if (!open) return;
    measurePosition();
    const handle = () => measurePosition();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open, measurePosition]);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
    };
  }, [open]);

  useEffect(() => {
    if (open && menuRect) listRef.current?.focus();
  }, [open, menuRect]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openMenu = () => {
    if (disabled) return;
    setMenuRect(null);
    setOpen(true);
    const currentIdx = options.findIndex((o) => o.value === value);
    setActiveIndex(currentIdx >= 0 ? currentIdx : 0);
  };

  const closeMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const select = (opt: DropdownOption) => {
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      closeMenu();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) select(opt);
    }
  };

  const selected = options.find((o) => o.value === value);
  const widthClass = fieldWidth ? fieldWidthClass[fieldWidth] : layoutClass[layout];
  const activeOptionId = activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  const menuStyle: CSSProperties | undefined = menuRect
    ? {
        position: "fixed",
        left: menuRect.left,
        width: menuRect.width,
        ...(menuRect.direction === "down"
          ? { top: menuRect.top }
          : { bottom: `calc(100vh - ${menuRect.top}px)` }),
      }
    : undefined;

  const canPortal = typeof window !== "undefined";

  return (
    <div
      ref={wrapperRef}
      className={["relative", widthClass, wrapperClassName].filter(Boolean).join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-invalid={resolvedState === "error" || undefined}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={[
          "flex w-full items-center justify-between border rounded-md transition-colors duration-fast ease-standard text-left",
          triggerSizeClass[size],
          stateClass[resolvedState],
        ].join(" ")}
        {...aria}
      >
        <span
          className={[
            "truncate",
            selected ? "text-text" : "text-text-tertiary",
          ].join(" ")}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={[
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-fast ease-standard",
            resolvedState === "disabled" ? "text-text-tertiary" : "text-text-secondary",
            open ? "rotate-180" : "rotate-0",
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
      </button>

      {name && <input type="hidden" name={name} value={value} />}

      {open && menuRect && canPortal &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={triggerId}
            onKeyDown={onListKeyDown}
            style={menuStyle}
            className="z-(--z-popover) overflow-auto rounded-md border border-border bg-surface shadow-md max-h-72 py-1 outline-none"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  id={`${listboxId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                  className={[
                    "h-10 flex items-center px-3 text-sm cursor-pointer select-none transition-colors duration-fast ease-standard",
                    isActive ? "bg-primary-50 text-primary" : "text-text hover:bg-subtle",
                    isSelected ? "font-semibold" : "font-medium",
                  ].join(" ")}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}
