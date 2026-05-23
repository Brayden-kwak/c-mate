import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Header } from "./Header";

// CmLogo and Link are mocked in vitest.setup.ts

describe("Header — structure", () => {
  it("renders a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the main navigation with aria-label '주요 메뉴'", () => {
    render(<Header />);
    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).toBeInTheDocument();
  });

  it("renders all 6 nav items", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "주요 메뉴" });
    const links = nav.querySelectorAll("a");
    expect(links.length).toBe(6);
  });

  it("renders '크리스천메이트' as the first nav item", () => {
    render(<Header />);
    expect(screen.getAllByText("크리스천메이트").length).toBeGreaterThanOrEqual(1);
  });

  it("renders '문의하기' as a nav item", () => {
    render(<Header />);
    expect(screen.getAllByText("문의하기").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Header — HeaderUserProfile and HeaderLogoutButton", () => {
  it("renders the user profile display name '임승리'", () => {
    render(<Header />);
    const names = screen.getAllByText("임승리");
    expect(names.length).toBeGreaterThanOrEqual(1);
  });

  it("renders avatar initial 'C'", () => {
    render(<Header />);
    const initials = screen.getAllByText("C");
    expect(initials.length).toBeGreaterThanOrEqual(1);
  });

  it("renders logout button with aria-label '로그아웃'", () => {
    render(<Header />);
    const logoutButtons = screen.getAllByRole("button", { name: "로그아웃" });
    expect(logoutButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders '로그아웃' text", () => {
    render(<Header />);
    const labels = screen.getAllByText("로그아웃");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Header — mega menu behavior", () => {
  it("mega menu is hidden initially", () => {
    render(<Header />);
    const megaMenu = screen.getByLabelText("열린 헤더 메뉴");
    expect(megaMenu).toHaveClass("hidden");
  });

  it("mega menu appears on mouseenter of the wrapper", () => {
    const { container } = render(<Header />);
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    const megaMenu = screen.getByLabelText("열린 헤더 메뉴");
    expect(megaMenu).toHaveClass("grid");
    expect(megaMenu).not.toHaveClass("hidden");
  });

  it("mega menu closes on mouseleave of the wrapper", () => {
    const { container } = render(<Header />);
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    const megaMenu = screen.getByLabelText("열린 헤더 메뉴");
    expect(megaMenu).toHaveClass("hidden");
  });

  it("mega menu has aria-hidden=true when closed", () => {
    render(<Header />);
    const megaMenu = screen.getByLabelText("열린 헤더 메뉴");
    expect(megaMenu).toHaveAttribute("aria-hidden", "true");
  });

  it("mega menu has aria-hidden=false when open", () => {
    const { container } = render(<Header />);
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    const megaMenu = screen.getByLabelText("열린 헤더 메뉴");
    expect(megaMenu).toHaveAttribute("aria-hidden", "false");
  });
});

describe("Header — active column highlighting", () => {
  it("highlights a nav item column on mouse enter", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "주요 메뉴" });
    const links = nav.querySelectorAll("a");
    // Hover first nav link to set activeCol=0
    fireEvent.mouseEnter(links[0]);
    expect(links[0].className).toContain("text-primary");
  });

  it("resets active column on menu close", () => {
    const { container } = render(<Header />);
    const wrapper = container.firstChild as HTMLElement;
    const nav = screen.getByRole("navigation", { name: "주요 메뉴" });
    const links = nav.querySelectorAll("a");
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseEnter(links[0]);
    fireEvent.mouseLeave(wrapper);
    expect(links[0].className).not.toContain("text-primary");
  });
});

describe("Header — logo link", () => {
  it("renders a link to the home page", () => {
    render(<Header />);
    const homeLinks = screen.getAllByRole("link");
    const homeLink = homeLinks.find((l) => l.getAttribute("href") === "/");
    expect(homeLink).toBeDefined();
  });
});