import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  HeaderUserProfile,
  DrawerUserProfile,
  HeaderLogoutButton,
} from "./HeaderAccount";

describe("HeaderUserProfile", () => {
  it("renders the display name", () => {
    render(<HeaderUserProfile />);
    expect(screen.getByText("임승리")).toBeInTheDocument();
  });

  it("renders the avatar initial 'C'", () => {
    render(<HeaderUserProfile />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("renders the avatar as a span", () => {
    const { container } = render(<HeaderUserProfile />);
    const avatar = container.querySelector("span");
    expect(avatar).toBeInTheDocument();
  });
});

describe("DrawerUserProfile", () => {
  it("renders the display name", () => {
    render(<DrawerUserProfile />);
    expect(screen.getByText("임승리")).toBeInTheDocument();
  });

  it("renders the avatar initial 'C'", () => {
    render(<DrawerUserProfile />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("renders inside a div (inline-flex layout for mobile drawer)", () => {
    const { container } = render(<DrawerUserProfile />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName.toLowerCase()).toBe("div");
  });
});

describe("HeaderLogoutButton", () => {
  it("renders a button with aria-label '로그아웃'", () => {
    render(<HeaderLogoutButton />);
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("renders '로그아웃' text label", () => {
    render(<HeaderLogoutButton />);
    expect(screen.getByText("로그아웃")).toBeInTheDocument();
  });

  it("shows icon SVG by default (showIcon=true)", () => {
    const { container } = render(<HeaderLogoutButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("hides icon SVG when showIcon=false", () => {
    const { container } = render(<HeaderLogoutButton showIcon={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("still renders '로그아웃' text when showIcon=false", () => {
    render(<HeaderLogoutButton showIcon={false} />);
    expect(screen.getByText("로그아웃")).toBeInTheDocument();
  });

  it("applies additional className when provided", () => {
    render(<HeaderLogoutButton className="w-full" />);
    const button = screen.getByRole("button", { name: "로그아웃" });
    expect(button).toHaveClass("w-full");
  });

  it("has type='button' to prevent accidental form submission", () => {
    render(<HeaderLogoutButton />);
    const button = screen.getByRole("button", { name: "로그아웃" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("does not throw when className is undefined", () => {
    expect(() => render(<HeaderLogoutButton />)).not.toThrow();
  });

  it("renders without className prop (uses default)", () => {
    render(<HeaderLogoutButton />);
    const button = screen.getByRole("button", { name: "로그아웃" });
    expect(button).toBeInTheDocument();
  });

  it("combines multiple class segments with showIcon=false and custom className", () => {
    render(<HeaderLogoutButton showIcon={false} className="my-class" />);
    const button = screen.getByRole("button", { name: "로그아웃" });
    expect(button).toHaveClass("my-class");
  });
});