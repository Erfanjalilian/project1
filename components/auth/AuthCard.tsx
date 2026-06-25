"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

export function AuthCard({ children, className, title, subtitle }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl rounded-2xl p-8 md:p-12 glass-panel",
        className,
      )}
    >
      <div className="mb-6 flex w-full items-center justify-between">
        <Logo />
      </div>

      {title && (
        <div className="mb-2">
          <h2 className="font-display text-3xl font-light text-obsidian">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      )}

      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}

export default AuthCard;
