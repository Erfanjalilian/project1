import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SITE_NAME } from "@/lib/constants/site";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex flex-col leading-none transition-opacity hover:opacity-80",
        className,
      )}
      aria-label={`${SITE_NAME} home`}
    >
      <span className="font-display text-2xl font-semibold tracking-[0.18em] text-obsidian md:text-3xl">
        ATELIER
      </span>
      <span className="mt-1 font-display text-sm font-light tracking-[0.45em] text-champagne md:text-base">
        NOIR
      </span>
    </Link>
  );
}
