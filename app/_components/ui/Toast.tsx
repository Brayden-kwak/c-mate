"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant = "default" | "success" | "danger";

type ToastState = {
  message: string;
  variant: ToastVariant;
  phase: "enter" | "visible" | "exit";
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClass: Record<ToastVariant, string> = {
  default: "bg-text text-white",
  success: "bg-success-light text-toast-success",
  danger: "bg-danger text-white",
};

const VISIBLE_MS = 2000;
const ENTER_MS = 240;
const EXIT_MS = 240;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      clearTimers();
      setToast({ message, variant, phase: "enter" });
      schedule(() => setToast((t) => (t ? { ...t, phase: "visible" } : null)), ENTER_MS);
      schedule(() => setToast((t) => (t ? { ...t, phase: "exit" } : null)), ENTER_MS + VISIBLE_MS);
      schedule(() => setToast(null), ENTER_MS + VISIBLE_MS + EXIT_MS);
    },
    [clearTimers, schedule]
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-(--z-toast) flex justify-center px-4 pt-4"
          role="status"
          aria-live="polite"
        >
          <div
            className={[
              "inline-flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-[13px] font-semibold shadow-lg",
              variantClass[toast.variant],
              toast.phase === "enter" && "animate-toast-enter",
              toast.phase === "visible" && "animate-toast-visible",
              toast.phase === "exit" && "animate-toast-exit",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {toast.variant === "success" && (
              <span className="text-base leading-none text-toast-success" aria-hidden="true">
                ✓
              </span>
            )}
            {toast.variant === "danger" && (
              <span className="text-base leading-none" aria-hidden="true">
                !
              </span>
            )}
            <span className={toast.variant === "success" ? "text-toast-success" : undefined}>
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
