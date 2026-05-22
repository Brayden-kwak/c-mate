/** InfoBox `.ic` — mockup infobox.info (16×16, font-weight 700, text-info) */
type Props = {
  className?: string;
};

export const InfoBoxIcon = ({ className = "" }: Props) => {
  return (
    <span
      className={`inline-flex size-4 shrink-0 items-center justify-center font-bold leading-none text-info ${className}`}
      aria-hidden="true"
    >
      ⓘ
    </span>
  );
};
