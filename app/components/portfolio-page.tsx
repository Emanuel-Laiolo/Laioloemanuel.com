"use client";

import { useEffect, useState } from "react";
import { BackgroundEnvironment } from "./background-environment";
import { IntroHero } from "./intro-hero";
import { ContactSection } from "./contact-section";
import { ExperienceFlow } from "./experience-flow";
import { SiteNavbar } from "./site-navbar";
import { SkillsGlobe } from "./skills-globe";

const sections = [
  { id: "hero", label: "Intro", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "projects", label: "Experience", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
] as const;

type SectionId = (typeof sections)[number]["id"];

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
          Math.abs(rect.bottom - focusY)
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = section.id;
        }
      }

      setActiveId((current) => (current === bestId ? current : bestId));
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

      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <aside className="fixed left-7 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
      <nav
        aria-label="Section progress"
        className="rounded-full border border-white/[0.08] bg-[rgba(6,7,10,0.72)] px-3 py-4 backdrop-blur-xl"
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
      <div className="rounded-[1.6rem] border border-white/[0.05] bg-[rgba(4,5,8,0.72)] px-3 py-8 sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14 lg:py-[4.5rem]">
        <div className="relative overflow-visible">
          <SkillsGlobe />
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return <ExperienceFlow />;
}

export function PortfolioPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <BackgroundEnvironment />
      <SideProgress />
      <SiteNavbar sections={sections} />

      <main className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-col overflow-x-clip px-4 pb-20 sm:px-10 sm:pb-24 lg:px-16">
        <IntroHero />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}