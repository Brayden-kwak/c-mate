import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogoutIcon } from "./LogoutIcon";

describe("LogoutIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<LogoutIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has aria-hidden='true' to hide from screen readers", () => {
    const { container } = render(<LogoutIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the default className 'w-5 h-5 shrink-0' when no className is provided", () => {
    const { container } = render(<LogoutIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-5", "h-5", "shrink-0");
  });

  it("applies a custom className when provided", () => {
    const { container } = render(<LogoutIcon className="w-4 h-4 text-red-500" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-4", "h-4", "text-red-500");
  });

  it("does not apply default class when a custom className overrides it", () => {
    const { container } = render(<LogoutIcon className="w-4 h-4" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toHaveClass("w-5");
    expect(svg).not.toHaveClass("h-5");
  });

  it("renders SVG paths representing the logout icon", () => {
    const { container } = render(<LogoutIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("has the expected viewBox attribute", () => {
    const { container } = render(<LogoutIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("accepts an empty string className without error", () => {
    const { container } = render(<LogoutIcon className="" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});