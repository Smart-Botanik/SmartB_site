type TomatoIconProps = {
  variant?: "red" | "green" | "orange" | "cherry";
  className?: string;
};

const fills = {
  red: { body: "#e63946", highlight: "#ff6b6b", leaf: "#2d6a4f" },
  green: { body: "#52b788", highlight: "#95d5b2", leaf: "#1b4332" },
  orange: { body: "#f77f00", highlight: "#fcbf49", leaf: "#2d6a4f" },
  cherry: { body: "#c1121f", highlight: "#ff4d6d", leaf: "#40916c" },
};

export function TomatoIcon({ variant = "red", className }: TomatoIconProps) {
  const colors = fills[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 4c-1.5 0-2.8.6-3.6 1.5-.4.5-.7 1-.9 1.6-.3-.1-.6-.2-1-.2-1.2 0-2.2 1-2.2 2.2 0 .8.4 1.5 1 1.9-.3.6-.5 1.3-.5 2 0 2.8 2.8 5.5 6.2 5.5s6.2-2.7 6.2-5.5c0-.7-.2-1.4-.5-2 .6-.4 1-1.1 1-1.9 0-1.2-1-2.2-2.2-2.2-.4 0-.7.1-1 .2-.2-.6-.5-1.1-.9-1.6C18.8 4.6 17.5 4 16 4Z"
        fill={colors.leaf}
      />
      <ellipse cx="16" cy="19" rx="9" ry="10" fill={colors.body} />
      <ellipse cx="13" cy="16" rx="2.5" ry="3.5" fill={colors.highlight} opacity="0.45" />
      <path
        d="M16 9v2.5"
        stroke={colors.leaf}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
