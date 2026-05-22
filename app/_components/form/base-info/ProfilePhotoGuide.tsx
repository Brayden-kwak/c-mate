import Image from "next/image";
import { InfoBoxIcon } from "@/app/_components/ui/InfoBoxIcon";

const PHOTO_GUIDE_TIPS = [
  "얼굴이 잘 보이는 선명한 사진이 좋아요.",
  "마스크, 선글라스 등으로 가린 사진은 대표 사진으로 사용할 수 없어요.",
  "AI 프로필 사진은 등록이 불가해요.",
  "여러명이 함께 나오거나, 흐릿하거나 어두운 사진은 피해주세요.",
] as const;

const GOOD_EXAMPLE_IMAGES = [
  { src: "/images/base-info/profile_good_ex1.png", alt: "좋은 사진 예시 1" },
  { src: "/images/base-info/profile_good_ex2.png", alt: "좋은 사진 예시 2" },
  { src: "/images/base-info/profile_good_ex3.png", alt: "좋은 사진 예시 3" },
] as const;

const BAD_EXAMPLE_IMAGES = [
  { src: "/images/base-info/profile_bad_ex1.png", alt: "나쁜 사진 예시 1" },
  { src: "/images/base-info/profile_bad_ex2.png", alt: "나쁜 사진 예시 2" },
  { src: "/images/base-info/profile_bad_ex3.png", alt: "나쁜 사진 예시 3" },
] as const;

const THUMB_CLASS =
  "relative shrink-0 overflow-hidden rounded-md bg-subtle w-[var(--spacing-photo-guide-thumb-width-compact)] h-[var(--spacing-photo-guide-thumb-height-compact)] photo-guide-wide:w-[var(--spacing-photo-guide-thumb-width)] photo-guide-wide:h-[var(--spacing-photo-guide-thumb-height)]";

type ExampleThumbProps = {
  src: string;
  alt: string;
};

const ExampleThumb = ({ src, alt }: ExampleThumbProps) => (
  <div className={THUMB_CLASS}>
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 89.375rem) 8rem, (min-width: 48rem) 10rem, 45vw"
      className="object-cover"
    />
  </div>
);

type Props = {
  className?: string;
};

export const ProfilePhotoGuide = ({ className = "" }: Props) => {
  return (
    <aside
      className={`flex w-full min-w-0 max-w-[var(--spacing-photo-guide-mobile-width)] flex-col rounded-lg border border-border-subtle bg-info-light photo-guide-wide:max-w-none ${className}`}
      aria-label="사진 등록 TIP"
    >
      <div className="flex shrink-0 flex-col gap-2.5 p-3.5 photo-guide-wide:gap-2 photo-guide-wide:p-3">
        <div className="flex items-center gap-1.5">
          <InfoBoxIcon />
          <h3 className="text-sm font-bold text-info">사진 등록 TIP</h3>
        </div>
        <ul className="list-disc space-y-0.5 pl-4 text-xs leading-snug text-text-secondary marker:text-text-tertiary">
          {PHOTO_GUIDE_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <hr className="border-0 border-t border-border-subtle" />
      </div>

      <div className="flex w-full min-w-0 gap-3 px-3.5 pb-3.5 photo-guide-wide:px-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="shrink-0 text-sm font-bold text-text">좋은 사진</p>
          <div className="flex flex-col gap-1">
            {GOOD_EXAMPLE_IMAGES.map((image) => (
              <ExampleThumb key={image.src} src={image.src} alt={image.alt} />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="shrink-0 text-sm font-bold text-text">나쁜 사진</p>
          <div className="flex flex-col gap-1">
            {BAD_EXAMPLE_IMAGES.map((image) => (
              <ExampleThumb key={image.src} src={image.src} alt={image.alt} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
