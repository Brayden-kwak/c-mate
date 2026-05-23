import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConfirmModal } from "./ConfirmModal";

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  children: <p>Modal content</p>,
};

describe("ConfirmModal — open/closed state", () => {
  it("renders nothing when open=false", () => {
    const { container } = render(
      <ConfirmModal {...defaultProps} open={false}>
        <p>Hidden</p>
      </ConfirmModal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal content when open=true", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });
});

describe("ConfirmModal — title prop", () => {
  it("renders the title when provided", () => {
    render(<ConfirmModal {...defaultProps} title="사진 삭제" />);
    expect(screen.getByText("사진 삭제")).toBeInTheDocument();
  });

  it("renders title as an h3 heading", () => {
    render(<ConfirmModal {...defaultProps} title="사진 삭제" />);
    const heading = screen.getByRole("heading", { name: "사진 삭제" });
    expect(heading.tagName.toLowerCase()).toBe("h3");
  });

  it("does not render a visible title element when title is undefined", () => {
    render(<ConfirmModal {...defaultProps} title={undefined} />);
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("sets aria-label on dialog when title is absent and ariaLabel is provided", () => {
    render(
      <ConfirmModal
        {...defaultProps}
        title={undefined}
        ariaLabel="대표 사진 필수 안내"
      />
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "대표 사진 필수 안내");
  });

  it("does not set aria-label on dialog when title is present", () => {
    render(
      <ConfirmModal
        {...defaultProps}
        title="사진 삭제"
        ariaLabel="should not appear"
      />
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-label");
  });

  it("does not set aria-label on dialog when both title and ariaLabel are absent", () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-label");
  });
});

describe("ConfirmModal — close button", () => {
  it("renders a close button", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the backdrop", () => {
    const onClose = vi.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} />);
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ConfirmModal — cancelLabel prop", () => {
  it("renders cancel button with default label '취소'", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("renders cancel button with custom label", () => {
    render(<ConfirmModal {...defaultProps} cancelLabel="돌아가기" />);
    expect(screen.getByRole("button", { name: "돌아가기" })).toBeInTheDocument();
  });

  it("does not render cancel button when cancelLabel=false", () => {
    render(<ConfirmModal {...defaultProps} cancelLabel={false} />);
    expect(screen.queryByRole("button", { name: "취소" })).toBeNull();
  });

  it("cancel button calls onClose when clicked", () => {
    const onClose = vi.fn();
    render(<ConfirmModal {...defaultProps} onClose={onClose} cancelLabel="취소" />);
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ConfirmModal — confirmLabel and onConfirm", () => {
  it("renders confirm button with default label '확인'", () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("renders confirm button with custom label", () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} confirmLabel="삭제" />);
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} confirmLabel="삭제" />);
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("does not render confirm button when onConfirm is not provided", () => {
    render(<ConfirmModal {...defaultProps} confirmLabel="확인" />);
    // When onConfirm is absent, the confirm button should not render
    const allButtons = screen.getAllByRole("button");
    // Only close button and cancel button should be present
    const buttonNames = allButtons.map((b) => b.getAttribute("aria-label") || b.textContent);
    expect(buttonNames).not.toContain("확인");
  });
});

describe("ConfirmModal — variant and width props", () => {
  it("renders with primary variant by default", () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} confirmLabel="확인" />);
    // Confirm button should be present (variant affects styling, not label)
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("renders with danger variant without error", () => {
    const onConfirm = vi.fn();
    expect(() =>
      render(
        <ConfirmModal {...defaultProps} onConfirm={onConfirm} variant="danger" confirmLabel="삭제" />
      )
    ).not.toThrow();
  });

  it("renders small width modal (max-w-[440px])", () => {
    render(<ConfirmModal {...defaultProps} width="sm" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-[440px]");
  });

  it("renders medium width modal (max-w-[480px])", () => {
    render(<ConfirmModal {...defaultProps} width="md" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-[480px]");
  });

  it("renders large width modal (max-w-[560px])", () => {
    render(<ConfirmModal {...defaultProps} width="lg" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-[560px]");
  });
});

describe("ConfirmModal — aria and role attributes", () => {
  it("has role='dialog' on the dialog container", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-modal='true' on the dialog container", () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });
});

describe("ConfirmModal — isRepDeleteBlocked scenario (cancelLabel=false + confirmLabel=확인 + variant=primary + width=sm)", () => {
  it("renders with no cancel button when cancelLabel=false", () => {
    render(
      <ConfirmModal
        {...defaultProps}
        title={undefined}
        ariaLabel="대표 사진 필수 안내"
        confirmLabel="확인"
        cancelLabel={false}
        onConfirm={vi.fn()}
        variant="primary"
        width="sm"
      />
    );
    expect(screen.queryByRole("button", { name: "취소" })).toBeNull();
  });

  it("calls onConfirm (setDeleteModal(null)) when confirm clicked in blocked state", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        {...defaultProps}
        title={undefined}
        ariaLabel="대표 사진 필수 안내"
        confirmLabel="확인"
        cancelLabel={false}
        onConfirm={onConfirm}
        variant="primary"
        width="sm"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});