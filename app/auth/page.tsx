import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { AuthCard } from "@/components/auth/AuthCard";

import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Authentication",
  description: "Sign in or register to your account.",
};

export default function AuthPage() {
  return (
    <PageTransition>
      <Container className="py-16 md:py-24">
        <div className="flex w-full items-center justify-center">
          <AuthCard>
            <AuthForm />
          </AuthCard>
        </div>
      </Container>
    </PageTransition>
  );
}
