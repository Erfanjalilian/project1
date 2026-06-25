import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Account",
  description: "User dashboard",
};

export default function AccountPage() {
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

  return (
    <PageTransition>
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-2xl p-8 glass-panel">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <h1 className="mt-6 font-display text-3xl font-light text-obsidian">Your Dashboard</h1>
          <p className="mt-2 text-muted">Welcome{user ? `, ${user.username}` : ""} — this is your account dashboard.</p>

          <div className="mt-6">More account features will be available soon.</div>
        </div>
      </Container>
    </PageTransition>
  );
}
