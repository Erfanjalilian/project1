import type { Metadata } from "next";
import "./globals.css";

const cormorantClassName = "font-[Cormorant_Garamond,serif]";
const dmSansClassName = "font-[DM_Sans,sans-serif]";

export const metadata: Metadata = {
  
  other: {
    enamad: "258664399",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${cormorantClassName} ${dmSansClassName}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
