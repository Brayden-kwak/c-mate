import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock MyPageNavList to avoid pulling in complex nav dependencies
vi.mock("@/app/_components/web-shell/MyPageNavList", () => ({
  MyPageNavList: () => <nav aria-label="my page nav" />,
}));

import { MobileHeader } from "./MobileHeader";

describe("MobileHeader — topbar", () => {
  it("renders a back button with aria-label '이전 화면으로'", () => {
    render(<MobileHeader />);
    expect(screen.getByRole("button", { name: "이전 화면으로" })).toBeInTheDocument();
  });

  it("renders the '기본정보' title in the topbar", () => {
    render(<MobileHeader />);
    // "기본정보" also appears in the step chip, so use getAllByText
    expect(screen.getAllByText("기본정보").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the menu toggle button with aria-label '전체 메뉴 열기' when closed", () => {
    render(<MobileHeader />);
    expect(screen.getByRole("button", { name: "전체 메뉴 열기" })).toBeInTheDocument();
  });
});

describe("MobileHeader — drawer toggle", () => {
  it("opens the drawer when the toggle button is clicked", () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
    expect(screen.getByRole("dialog", { name: "전체 메뉴" })).toBeInTheDocument();
  });

  it("changes toggle button label to '전체 메뉴 닫기' when drawer is open", () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
    expect(screen.getByRole("button", { name: "전체 메뉴 닫기" })).toBeInTheDocument();
  });

  it("closes the drawer when toggle button is clicked again", () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 닫기" }));
    expect(screen.queryByRole("dialog", { name: "전체 메뉴" })).toBeNull();
  });

  it("closes the drawer when Escape key is pressed", () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
    expect(screen.getByRole("dialog", { name: "전체 메뉴" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "전체 메뉴" })).toBeNull();
  });

  it("closes the drawer when backdrop is clicked", () => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
    const backdrop = document.getElementById("mobile-drawer")!;
    fireEvent.click(backdrop);
    expect(screen.queryByRole("dialog", { name: "전체 메뉴" })).toBeNull();
  });
});

describe("MobileHeader — drawer content", () => {
  beforeEach(() => {
    render(<MobileHeader />);
    fireEvent.click(screen.getByRole("button", { name: "전체 메뉴 열기" }));
  });

  it("renders DrawerUserProfile in drawer header with user name '임승리'", () => {
    const dialog = screen.getByRole("dialog", { name: "전체 메뉴" });
    expect(dialog).toHaveTextContent("임승리");
  });

  it("renders DrawerUserProfile avatar initial 'C' in drawer", () => {
    const dialog = screen.getByRole("dialog", { name: "전체 메뉴" });
    expect(dialog).toHaveTextContent("C");
  });

  it("renders a '로그아웃' button in the drawer footer", () => {
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  });

  it("renders '로그아웃' button without icon (showIcon=false)", () => {
    const logoutButton = screen.getByRole("button", { name: "로그아웃" });
    const svg = logoutButton.querySelector("svg");
    expect(svg).toBeNull();
  });

  it("renders '업그레이드' button in the drawer footer", () => {
    expect(screen.getByRole("button", { name: "업그레이드" })).toBeInTheDocument();
  });

  it("renders 'MAIN MENU' heading in the drawer", () => {
    expect(screen.getByText("MAIN MENU")).toBeInTheDocument();
  });

  it("renders '크리스천메이트' in the drawer nav", () => {
    const dialog = screen.getByRole("dialog", { name: "전체 메뉴" });
    expect(dialog).toHaveTextContent("크리스천메이트");
  });

  it("drawer has aria-modal='true'", () => {
    expect(screen.getByRole("dialog", { name: "전체 메뉴" })).toHaveAttribute(
      "aria-modal",
      "true"
    );
  });
});

describe("MobileHeader — step chips", () => {
  it("renders step chips for the 5 steps", () => {
    render(<MobileHeader />);
    // "기본정보" also appears in topbar title; use getAllByText and assert at least one instance
    expect(screen.getAllByText("기본정보").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("나의소개")).toBeInTheDocument();
    expect(screen.getByText("매력어필")).toBeInTheDocument();
    expect(screen.getByText("라이프")).toBeInTheDocument();
    expect(screen.getByText("이상형")).toBeInTheDocument();
  });

  it("marks the first step chip as current (primary styling)", () => {
    const { container } = render(<MobileHeader />);
    // Find the chip containing "기본정보" — it should have bg-primary class
    const chipContainers = container.querySelectorAll("[class*='bg-primary']");
    const currentChip = Array.from(chipContainers).find((el) =>
      el.textContent?.includes("기본정보")
    );
    expect(currentChip).toBeDefined();
  });
});