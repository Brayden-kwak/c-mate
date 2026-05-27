import Image from "next/image";

const PHOTO_GUIDE_TIPS = [
  "얼굴이 잘 보이는 선명한 사진이 좋아요.",
  "마스크, 선글라스 등으로 가린 사진은 대표 사진으로 사용할 수 없어요.",
  "AI 프로필 사진은 등록이 불가해요.",
  "여러명이 함께 나오거나, 흐릿하거나 어두운 사진은 피해주세요.",
] as const;

const GOOD_EXAMPLE_IMAGES = [
  { src: "/images/profile-info/profile_good_ex1.png", alt: "좋은 사진 예시 1" },
  { src: "/images/profile-info/profile_good_ex2.png", alt: "좋은 사진 예시 2" },
  { src: "/images/profile-info/profile_good_ex3.png", alt: "좋은 사진 예시 3" },
] as const;

const BAD_EXAMPLE_IMAGES = [
  { src: "/images/profile-info/profile_bad_ex1.png", alt: "나쁜 사진 예시 1" },
  { src: "/images/profile-info/profile_bad_ex2.png", alt: "나쁜 사진 예시 2" },
  { src: "/images/profile-info/profile_bad_ex3.png", alt: "나쁜 사진 예시 3" },
] as const;

const THUMB_CLASS =
  "relative w-full max-w-[var(--spacing-photo-guide-thumb-width-compact)] aspect-[517/307] overflow-hidden rounded-md bg-subtle photo-guide-wide:w-[var(--spacing-photo-guide-thumb-width)] photo-guide-wide:max-w-none photo-guide-wide:h-[var(--spacing-photo-guide-thumb-height)] photo-guide-wide:aspect-auto";

type ExampleThumbProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

const ExampleThumb = ({ src, alt, priority = false }: ExampleThumbProps) => (
  <div className={THUMB_CLASS}>
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 89.375rem) 8rem, 40vw"
      className="object-cover"
      priority={priority}
    />
  </div>
);

type Props = {
  className?: string;
};

export const ProfilePhotoGuide = ({ className = "" }: Props) => {
  return (
    <aside
      className={`flex w-full min-w-0 max-w-photo-guide-mobile-width flex-col rounded-lg border border-border-subtle bg-info-light photo-guide-wide:max-w-none ${className}`}
      aria-label="사진 등록 TIP"
    >
      <div className="flex shrink-0 flex-col gap-2.5 p-3.5 photo-guide-wide:gap-2 photo-guide-wide:p-3">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex size-4 shrink-0 items-center justify-center font-bold leading-none text-info"
            aria-hidden="true"
          >
            ⓘ
          </span>
          <h3 className="text-sm font-bold text-info">사진 등록 TIP</h3>
        </div>
        <ul className="list-disc space-y-0.5 pl-4 text-xs leading-snug text-text-secondary marker:text-text-tertiary">
          {PHOTO_GUIDE_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <hr className="border-0 border-t border-border-subtle" />
      </div>

      <div className="flex w-full min-w-0 gap-2 px-3.5 pb-3.5 photo-guide-wide:gap-3 photo-guide-wide:px-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 photo-guide-wide:items-stretch">
          <p className="w-full shrink-0 text-sm font-bold text-text">
            좋은 사진
          </p>
          <div className="flex w-full min-w-0 flex-col gap-1">
            {GOOD_EXAMPLE_IMAGES.map((image, index) => (
              <ExampleThumb
                key={image.src}
                src={image.src}
                alt={image.alt}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 photo-guide-wide:items-stretch">
          <p className="w-full shrink-0 text-sm font-bold text-text">
            나쁜 사진
          </p>
          <div className="flex w-full min-w-0 flex-col gap-1">
            {BAD_EXAMPLE_IMAGES.map((image, index) => (
              <ExampleThumb
                key={image.src}
                src={image.src}
                alt={image.alt}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
