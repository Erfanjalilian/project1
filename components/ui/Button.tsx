import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-obsidian text-ivory hover:bg-[#1a1814] glow-champagne border border-transparent",
  secondary:
    "bg-champagne text-obsidian hover:brightness-105 border border-transparent",
  ghost: "bg-transparent text-obsidian hover:bg-obsidian/5 border border-transparent",
  outline:
    "bg-transparent text-obsidian border border-obsidian/15 hover:border-champagne hover:text-champagne",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.12em]",
  md: "h-11 px-6 text-sm tracking-[0.14em]",
  lg: "h-12 px-8 text-sm tracking-[0.16em]",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-full font-medium uppercase transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={styles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
