"use client";

import { useEffect, useState } from "react";
import { BackgroundEnvironment } from "./background-environment";
import { IntroHero } from "./intro-hero";
import { ExperienceFlow } from "./experience-flow";
import { ExperienceOrbit } from "./experience-orbit";
import { SiteNavbar } from "./site-navbar";
import { SkillsGlobe } from "./skills-globe";

const sections = [
  { id: "hero", label: "Intro", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "projects", label: "Experience", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl lg:text-[2.9rem]">
        {title}
      </h2>
      <p className="max-w-xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function SideProgress() {
  const [activeId, setActiveId] = useState<SectionId>("hero");

  useEffect(() => {
    let raf = 0;

    const resolveActive = () => {
      const focusY = window.innerHeight * 0.42;
      let bestId: SectionId = "hero";
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= focusY && rect.bottom >= focusY) {
          bestId = section.id;
          bestDistance = 0;
          break;
        }

        const distance = Math.min(
          Math.abs(rect.top - focusY),
          Math.abs(rect.bottom - focusY),
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = section.id;
        }
      }

      setActiveId(bestId);
    };

    const scheduleResolve = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        resolveActive();
      });
    };

    resolveActive();

    window.addEventListener("scroll", scheduleResolve, { passive: true });
    window.addEventListener("resize", scheduleResolve);

    return () => {
      window.removeEventListener("scroll", scheduleResolve);
      window.removeEventListener("resize", scheduleResolve);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <aside className="fixed left-7 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
      <nav
        aria-label="Section progress"
        className="rounded-full border border-white/[0.08] bg-[rgba(6,7,10,0.72)] px-3 py-4"
      >
        <ol className="flex flex-col gap-4">
          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-label={section.label}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full border transition ${
                      isActive
                        ? "border-white/80 bg-white/80"
                        : "border-white/[0.18] bg-transparent group-hover:border-white/45"
                    }`}
                  />
                  <span
                    className={`text-[0.66rem] uppercase tracking-[0.28em] transition ${
                      isActive
                        ? "text-white/82"
                        : "text-[var(--foreground-subtle)] group-hover:text-white/60"
                    }`}
                  >
                    {section.index}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}

function SkillsSection() {
  return (
    <section
      id="skills"
      className="scroll-mt-28 border-b border-[var(--border)] py-28 sm:py-36 lg:py-44"
    >
      <div className="rounded-[2rem] border border-white/[0.05] bg-[rgba(4,5,8,0.72)] px-6 py-14 sm:px-10 lg:px-14 lg:py-18">
        <div className="relative">
          <SkillsGlobe />
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return <ExperienceFlow />;
}

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-28 py-24 sm:py-32 lg:py-40">
      <div className="rounded-[2.2rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(8,10,16,0.82),rgba(4,5,8,0.98))] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,24rem)] lg:items-stretch lg:gap-10">
          <div className="flex flex-col justify-between rounded-[1.8rem] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] p-7 sm:p-8 lg:p-10">
            <div className="space-y-6">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
                Contact
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl lg:text-[3.2rem]">
                Open to serious opportunities in software, product, and systems.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                I’m looking for the kind of work where technical thinking, execution, and long-term judgment actually matter. If you’re hiring, building, or exploring a strong fit, the best way to reach me is by email or LinkedIn.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="mailto:Emalaiolo@gmail.com"
                className="inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.06] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/[0.1]"
              >
                Send email
              </a>
              <a
                href="https://www.linkedin.com/in/emanuel-laiolo-300b31313/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/[0.08] px-5 py-3 text-sm font-medium text-[var(--foreground-muted)] transition hover:border-white/[0.14] hover:text-[var(--foreground)]"
              >
                View LinkedIn
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/[0.07] bg-[rgba(255,255,255,0.025)] p-6 sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                Email
              </p>
              <a
                href="mailto:Emalaiolo@gmail.com"
                className="mt-4 block break-all text-[1.05rem] font-medium text-[var(--foreground)] transition hover:text-white/72"
              >
                Emalaiolo@gmail.com
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.07] bg-[rgba(255,255,255,0.025)] p-6 sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                LinkedIn
              </p>
              <a
                href="https://www.linkedin.com/in/emanuel-laiolo-300b31313/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 block break-words text-base leading-7 text-[var(--foreground-muted)] transition hover:text-white/78"
              >
                linkedin.com/in/emanuel-laiolo-300b31313
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.07] bg-[rgba(255,255,255,0.02)] p-6 sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                Focus
              </p>
              <p className="mt-4 text-base leading-7 text-[var(--foreground-muted)]">
                Software development, technical product work, systems thinking, and execution-heavy roles with real ownership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortfolioPage() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEnvironment />
      <SideProgress />
      <SiteNavbar sections={sections} />

      <main className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-col px-6 pb-24 sm:px-10 lg:px-16">
        <IntroHero />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}