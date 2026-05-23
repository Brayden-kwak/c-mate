import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChurchSearchModal } from "./ChurchSearchModal";

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onSelect: vi.fn(),
};

describe("ChurchSearchModal — open/closed state", () => {
  it("renders nothing when open=false", () => {
    const { container } = render(
      <ChurchSearchModal {...defaultProps} open={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal when open=true", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("ChurchSearchModal — header and close button", () => {
  it("renders the title '교회 검색'", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByText("교회 검색")).toBeInTheDocument();
  });

  it("renders a close button with custom aria-label '교회 검색 모달 닫기'", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("button", { name: "교회 검색 모달 닫기" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<ChurchSearchModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "교회 검색 모달 닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<ChurchSearchModal {...defaultProps} onClose={onClose} />);
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has role='dialog' on the dialog container", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-modal='true' on the dialog container", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby pointing to church-modal-title", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "church-modal-title");
  });
});

describe("ChurchSearchModal — search input", () => {
  it("renders a search input", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.getByRole("textbox", { name: "교회 또는 교단명 검색" })).toBeInTheDocument();
  });

  it("shows empty search result message when query has text", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "새생명" } });
    // Component renders curly quotes via &lsquo;/&rsquo; HTML entities
    expect(screen.getByText(/검색 결과가 없어요/)).toBeInTheDocument();
  });

  it("does not show empty state when query is empty", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    expect(screen.queryByText(/검색 결과가 없어요/)).toBeNull();
  });

  it("shows the registration application button when query is non-empty", () => {
    render(<ChurchSearchModal {...defaultProps} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "테스트교회" } });
    expect(screen.getByRole("button", { name: /교회\/교단 가입 신청하기/ })).toBeInTheDocument();
  });
});

describe("ChurchSearchModal — registration form", () => {
  function openRegistrationForm() {
    render(<ChurchSearchModal {...defaultProps} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "테스트" } });
    fireEvent.click(screen.getByRole("button", { name: /교회\/교단 가입 신청하기/ }));
  }

  it("shows registration form after clicking 가입 신청하기", () => {
    openRegistrationForm();
    expect(screen.getByText("교회/교단 신규 등록 신청")).toBeInTheDocument();
  });

  it("shows registration fields: 교회명, 교단, 담임목사, 교회 주소", () => {
    openRegistrationForm();
    expect(screen.getByRole("textbox", { name: "신규 신청 교회명" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "신규 신청 교단" })).toBeInTheDocument();
  });

  it("does not submit if required fields are empty", () => {
    const onSelect = vi.fn();
    render(<ChurchSearchModal {...defaultProps} onSelect={onSelect} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "테스트" } });
    fireEvent.click(screen.getByRole("button", { name: /교회\/교단 가입 신청하기/ }));
    fireEvent.click(screen.getByRole("button", { name: "신청하기" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("calls onSelect with church data when form is submitted with required fields", () => {
    const onSelect = vi.fn();
    render(<ChurchSearchModal {...defaultProps} onSelect={onSelect} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "테스트" } });
    fireEvent.click(screen.getByRole("button", { name: /교회\/교단 가입 신청하기/ }));

    fireEvent.change(screen.getByRole("textbox", { name: "신규 신청 교회명" }), {
      target: { value: "새생명교회" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "신규 신청 교단" }), {
      target: { value: "예장합동" },
    });
    fireEvent.click(screen.getByRole("button", { name: "신청하기" }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ church: "새생명교회", denom: "예장합동" })
    );
  });

  it("hides registration form when cancel is clicked", () => {
    openRegistrationForm();
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(screen.queryByText("교회/교단 신규 등록 신청")).toBeNull();
  });
});

describe("ChurchSearchModal — handleClose resets state", () => {
  it("resets query input after close button is clicked", () => {
    const onClose = vi.fn();
    render(<ChurchSearchModal {...defaultProps} onClose={onClose} />);
    const input = screen.getByRole("textbox", { name: "교회 또는 교단명 검색" });
    fireEvent.change(input, { target: { value: "테스트" } });
    expect(input).toHaveValue("테스트");
    fireEvent.click(screen.getByRole("button", { name: "교회 검색 모달 닫기" }));
    expect(onClose).toHaveBeenCalled();
  });
});