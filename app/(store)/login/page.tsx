import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { AuthCard } from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Login",
  description: "Sign in to your ATELIER NOIR account.",
};

export default function LoginPage() {
  return (
    <PageTransition>
      <Container className="py-20 md:py-28">
        <div className="flex w-full items-center justify-center">
          <AuthCard title="Sign In" subtitle="Access your account.">
            <AuthForm />
          </AuthCard>
        </div>
      </Container>
    </PageTransition>
  );
}
