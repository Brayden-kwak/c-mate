import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FreeConsultModal } from "./FreeConsultModal";
import { FREE_CONSULT_PHONE_DISPLAY, FREE_CONSULT_TEL } from "./consultation";

// Mock matchMedia since jsdom doesn't implement it
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe("FreeConsultModal — open/closed state", () => {
  beforeEach(() => mockMatchMedia(false));

  it("renders nothing when open=false", () => {
    const { container } = render(
      <FreeConsultModal open={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal content when open=true", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("FreeConsultModal — header", () => {
  beforeEach(() => mockMatchMedia(false));

  it("renders '무료 상담' as the modal title", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByText("무료 상담")).toBeInTheDocument();
  });

  it("renders a close button using ModalCloseButton with default aria-label '닫기'", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<FreeConsultModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<FreeConsultModal open={true} onClose={onClose} />);
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("FreeConsultModal — phone display", () => {
  beforeEach(() => mockMatchMedia(false));

  it("displays the FREE_CONSULT_PHONE_DISPLAY value", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByText(FREE_CONSULT_PHONE_DISPLAY)).toBeInTheDocument();
  });
});

describe("FreeConsultModal — confirm button", () => {
  beforeEach(() => mockMatchMedia(false));

  it("renders a '확인' button", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("calls onClose when '확인' is clicked", () => {
    const onClose = vi.fn();
    render(<FreeConsultModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("FreeConsultModal — desktop mode (callMode=false)", () => {
  beforeEach(() => mockMatchMedia(false));

  it("does not render a tel: link in desktop mode", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    const telLink = document.querySelector(`a[href="${FREE_CONSULT_TEL}"]`);
    expect(telLink).toBeNull();
  });
});

describe("FreeConsultModal — mobile mode (callMode=true)", () => {
  beforeEach(() => mockMatchMedia(true));

  it("renders a '통화하기' link in mobile mode", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    const callLink = screen.getByRole("link", { name: "통화하기" });
    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute("href", FREE_CONSULT_TEL);
  });
});

describe("FreeConsultModal — aria attributes", () => {
  beforeEach(() => mockMatchMedia(false));

  it("has role='dialog'", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-modal='true'", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby='free-consult-title'", () => {
    render(<FreeConsultModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "free-consult-title");
  });
});