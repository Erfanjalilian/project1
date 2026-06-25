"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/context/CartContext";

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled ? "glass-panel shadow-sm" : "bg-transparent",
      )}
    >
      <Container as="div" className="flex h-20 items-center justify-between">
        <Logo />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm uppercase tracking-[0.18em] transition-colors duration-300",
                  isActive ? "text-champagne" : "text-obsidian/75 hover:text-obsidian",
                )}
              >
                {link.label}
                {isActive ? (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-champagne" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full p-2.5 text-obsidian transition-colors hover:bg-obsidian/5 sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2.5 text-obsidian transition-colors hover:bg-obsidian/5"
            aria-label={`Shopping cart, ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {totalItems > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-semibold text-obsidian">
                {totalItems}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="rounded-full p-2.5 text-obsidian transition-colors hover:bg-obsidian/5 lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <Container className="flex flex-col gap-2 py-6">
              {NAV_LINKS.map((link, index) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.18em] transition-colors",
                        isActive
                          ? "bg-obsidian text-ivory"
                          : "text-obsidian/80 hover:bg-obsidian/5",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Button href="/shop" variant="secondary" className="mt-2 w-full">
                Explore Collection
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
