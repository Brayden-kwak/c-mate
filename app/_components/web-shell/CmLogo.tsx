import Image from "next/image";

const LOGO_SRC = "/images/logo/logo.png";

type CmLogoProps = {
  className?: string;
  eager?: boolean;
};

export function CmLogo({
  className = "h-7 w-auto",
  eager = false,
}: CmLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="크리스천메이트"
      width={140}
      height={40}
      className={className}
      priority={eager}
    />
  );
}
