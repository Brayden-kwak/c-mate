"use client";

import { useState } from "react";

export type StyleGroup = {
  label: string;
  options: string[];
};

type Props = {
  groups: StyleGroup[];
  maxTotal?: number;
  value?: Record<string, string[]>;
  onChange?: (value: Record<string, string[]>) => void;
};

export function StyleChipGroup({ groups, maxTotal = 5, value = {}, onChange }: Props) {
  const [local, setLocal] = useState<Record<string, string[]>>(value);

  const selected = value ?? local;
  const update = onChange ?? setLocal;

  const totalCount = Object.values(selected).flat().length;
  const atMax = totalCount >= maxTotal;

  function toggle(groupLabel: string, opt: string) {
    const groupSelected = selected[groupLabel] ?? [];
    const isSelected = groupSelected.includes(opt);

    if (!isSelected && atMax) return;

    const next = {
      ...selected,
      [groupLabel]: isSelected
        ? groupSelected.filter((v) => v !== opt)
        : [...groupSelected, opt],
    };
    update(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const groupSelected = selected[group.label] ?? [];
        return (
          <div key={group.label} className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-secondary">{group.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((opt) => {
                const isSelected = groupSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(group.label, opt)}
                    disabled={!isSelected && atMax}
                    className={[
                      "inline-flex items-center justify-center px-3.5 h-[38px] rounded-md border text-sm select-none transition-all duration-fast ease-standard",
                      isSelected
                        ? "bg-primary border-primary text-white font-semibold"
                        : "bg-surface border-border text-text font-medium hover:bg-subtle hover:border-border-strong",
                      !isSelected && atMax ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
