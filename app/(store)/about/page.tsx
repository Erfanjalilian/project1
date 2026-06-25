"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { PageTransition } from "@/components/ui/PageTransition";
import { Container } from "@/components/ui/Container";
import { fetchAbout, fetchTeam } from "@/lib/api/client";

interface AboutContent {
  id: string;
  introduction: string;
  story: string;
  mission: string;
  vision: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order: number;
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [aboutRes, teamRes] = await Promise.all([
          fetchAbout(),
          fetchTeam(),
        ]);

        if (aboutRes.success) {
          setAbout(aboutRes.data as unknown as AboutContent);
        } else {
          setError("Failed to load about content");
        }

        if (teamRes.success) {
          setTeam(teamRes.data as unknown as TeamMember[]);
        }
      } catch (err) {
        console.error("Error loading about data:", err);
        setError("Failed to load about information. Please try again.");
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
          Our Story
        </p>
        <h1 className="font-display mt-4 text-4xl font-light text-obsidian md:text-5xl">
          About ATELIER NOIR
        </h1>

        {/* Introduction */}
        {about?.introduction && (
          <div className="mt-8 max-w-3xl">
            <p className="text-lg text-muted leading-relaxed">
              {about.introduction}
            </p>
          </div>
        )}

        {/* Story Section */}
        {about?.story && (
          <div className="mt-16">
            <h2 className="font-display text-3xl font-light text-obsidian">
              Our Story
            </h2>
            <div className="glass-panel mt-6 rounded-3xl p-8 md:p-12">
              <p className="whitespace-pre-line text-muted leading-relaxed">
                {about.story}
              </p>
            </div>
          </div>
        )}

        {/* Mission & Vision */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {about?.mission && (
            <div className="glass-panel rounded-3xl p-8 md:p-10">
              <h3 className="font-display text-2xl font-light text-obsidian">
                Our Mission
              </h3>
              <p className="mt-4 whitespace-pre-line text-muted leading-relaxed">
                {about.mission}
              </p>
            </div>
          )}
          {about?.vision && (
            <div className="glass-panel rounded-3xl p-8 md:p-10">
              <h3 className="font-display text-2xl font-light text-obsidian">
                Our Vision
              </h3>
              <p className="mt-4 whitespace-pre-line text-muted leading-relaxed">
                {about.vision}
              </p>
            </div>
          )}
        </div>

        {/* Team Section */}
        {team.length > 0 && (
          <div className="mt-20">
            <p className="text-xs uppercase tracking-[0.28em] text-champagne">
              Meet The Team
            </p>
            <h2 className="font-display mt-4 text-3xl font-light text-obsidian">
              Our Leadership
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="group">
                  <div className="glass-panel overflow-hidden rounded-3xl">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-display text-xl text-obsidian group-hover:text-champagne">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-champagne">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </PageTransition>
  );
}
