export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop?bestSelling=true", label: "Best Sellers" },
    { href: "/shop?highestDiscount=true", label: "Special Offers" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Account" },
  ],
  support: [
    { href: "/contact", label: "Customer Service" },
    { href: "/cart", label: "Shopping Cart" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://pinterest.com", label: "Pinterest" },
] as const;
