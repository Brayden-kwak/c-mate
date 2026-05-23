import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModalCloseButton } from "./ModalCloseButton";

describe("ModalCloseButton", () => {
  it("renders a button element", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("uses default aria-label '닫기' when no aria-label is provided", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("accepts a custom aria-label", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} aria-label="교회 검색 모달 닫기" />);
    expect(screen.getByRole("button", { name: "교회 검색 모달 닫기" })).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick before click", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders the close symbol ✕ as content", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveTextContent("✕");
  });

  it("has type='button' to avoid form submission", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("calls onClick multiple times when clicked multiple times", () => {
    const onClick = vi.fn();
    render(<ModalCloseButton onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});