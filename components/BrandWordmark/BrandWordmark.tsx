type BrandWordmarkProps = {
  className?: string;
};

/**
 * Header wordmark: Smart (green) + Ботаник (near-white), без подписи URL.
 * SVG для чёткого масштабирования на светлом фоне.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SmartБотаник"
    >
      <text
        x="0"
        y="28"
        fontFamily="var(--font-hanken), Hanken Grotesk, system-ui, sans-serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        <tspan fill="var(--color-primary-container)">Smart</tspan>
        <tspan fill="var(--color-on-surface)">Ботаник</tspan>
      </text>
    </svg>
  );
}
