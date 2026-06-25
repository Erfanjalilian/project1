import Link from "next/link";
import {
  AtSign,
  Bookmark,
  Camera,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants/navigation";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants/site";

const socialIcons = {
  Instagram: Camera,
  Facebook: Globe,
  Twitter: AtSign,
  Pinterest: Bookmark,
} as const;

export function Footer() {
  return (
    <footer className="gradient-premium text-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5 lg:col-span-1">
            <div className="[&_span]:text-ivory [&_span:last-child]:text-champagne">
              <Logo />
            </div>
            <p className="max-w-xs text-sm leading-7 text-ivory/70">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon =
                  socialIcons[social.label as keyof typeof socialIcons];

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-ivory/10 p-2.5 text-ivory/80 transition-all duration-300 hover:border-champagne hover:text-champagne"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.24em] text-champagne">
              Shop
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.24em] text-champagne">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.24em] text-champagne">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-ivory/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                <span>742 Madison Avenue, New York, NY 10065</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-champagne" />
                <span>+1 (212) 555-0198</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-champagne" />
                <span>concierge@ateliernoir.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-ivory/60">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-champagne/90">
            Designed by Engineer Erfan Jalilian
          </p>
        </div>
      </Container>
    </footer>
  );
}
