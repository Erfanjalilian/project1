"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { fetchContact } from "@/lib/api/client";

interface ContactInfo {
  id: string;
  address: string;
  telephone: string;
  mobile: string;
  email: string;
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const contactRes = await fetchContact();

        if (contactRes.success) {
          setContact(contactRes.data as unknown as ContactInfo);
        } else {
          setError("Failed to load contact information");
        }
      } catch (err) {
        console.error("Error loading contact data:", err);
        setError("Failed to load contact information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <Container className="py-20 md:py-28">
          <p className="text-center text-muted">Loading...</p>
        </Container>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Container className="py-20 md:py-28">
          <div className="glass-panel rounded-2xl p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container className="py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.28em] text-champagne">
          Get In Touch
        </p>
        <h1 className="font-display mt-4 text-4xl font-light text-obsidian md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          We'd love to hear from you. Reach out to us through any of our contact
          channels.
        </p>

        {contact && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            {contact.address && (
              <div className="glass-panel rounded-3xl p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10">
                  <svg
                    className="h-6 w-6 text-champagne"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-display mt-4 text-lg text-obsidian">Address</h3>
                <p className="mt-2 text-muted">{contact.address}</p>
              </div>
            )}

            {/* Telephone */}
            {contact.telephone && (
              <div className="glass-panel rounded-3xl p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10">
                  <svg
                    className="h-6 w-6 text-champagne"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l2.498 0.202c.322.026.641-.088.86-.253l5.09-3.85A1 1 0 0123 4.07V20a2 2 0 01-2 2h-1a1 1 0 00-1 1v-1a1 1 0 00-1-1H10a1 1 0 00-1 1v1a1 1 0 00-1 1H4a2 2 0 01-2-2V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-display mt-4 text-lg text-obsidian">Telephone</h3>
                <a
                  href={`tel:${contact.telephone}`}
                  className="mt-2 text-champagne hover:text-white transition-colors"
                >
                  {contact.telephone}
                </a>
              </div>
            )}

            {/* Mobile */}
            {contact.mobile && (
              <div className="glass-panel rounded-3xl p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10">
                  <svg
                    className="h-6 w-6 text-champagne"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-display mt-4 text-lg text-obsidian">Mobile</h3>
                <a
                  href={`tel:${contact.mobile}`}
                  className="mt-2 text-champagne hover:text-white transition-colors"
                >
                  {contact.mobile}
                </a>
              </div>
            )}

            {/* Email */}
            {contact.email && (
              <div className="glass-panel rounded-3xl p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10">
                  <svg
                    className="h-6 w-6 text-champagne"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-display mt-4 text-lg text-obsidian">Email</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 text-champagne hover:text-white transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Contact Form Info */}
        <div className="glass-panel mt-16 rounded-3xl p-8 md:p-12">
          <h2 className="font-display text-2xl text-obsidian">Send us a message</h2>
          <p className="mt-4 text-muted">
            For inquiries and custom requests, please feel free to contact us
            using the information above or visit our showroom for a premium
            shopping experience.
          </p>
          <p className="mt-4 text-sm text-champagne">
            Our team typically responds within 24 hours.
          </p>
        </div>
      </Container>
    </PageTransition>
  );
}
