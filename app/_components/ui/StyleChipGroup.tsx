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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-secondary">{group.label}</span>
              <span className="text-[10px] font-bold text-text-secondary bg-subtle px-2 py-0.5 rounded-pill tracking-[0.04em]">
                {groupSelected.length}개
              </span>
            </div>
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

      <div
        className={[
          "flex items-center gap-2 px-3.5 py-2.5 rounded-md text-[13px] font-semibold",
          atMax
            ? "bg-warning-light text-warning"
            : "bg-primary-50 text-primary",
        ].join(" ")}
      >
        <span>
          선택 합계 {totalCount} / {maxTotal}
        </span>
        <span className="ml-auto font-normal opacity-85">최대 {maxTotal}개까지</span>
      </div>
    </div>
  );
}
