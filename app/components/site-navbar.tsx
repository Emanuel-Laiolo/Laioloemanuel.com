"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SectionItem = {
  id: string;
  label: string;
};

export function SiteNavbar({
  sections,
}: {
  sections: readonly SectionItem[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "hero");
  const [navSize, setNavSize] = useState({ width: 0, height: 0 });
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateSize = () => {
      setNavSize({
        width: nav.offsetWidth,
        height: nav.offsetHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;

    const resolveActive = () => {
      const focusY = window.innerHeight * 0.34;
      let bestId = sections[0]?.id ?? "hero";
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
  }, [sections]);

  const svgRect = useMemo(() => {
    const inset = 1.1;
    const width = Math.max(navSize.width, 1);
    const height = Math.max(navSize.height, 1);

    return {
      width,
      height,
      x: inset,
      y: inset,
      rectWidth: Math.max(width - inset * 2, 1),
      rectHeight: Math.max(height - inset * 2, 1),
      radius: Math.max((height - inset * 2) / 2, 1),
    };
  }, [navSize]);

  return (
    <header className="sticky top-0 z-30">
      <div className="flex justify-center px-4 pt-4 sm:px-10 lg:px-16">
        <nav
          ref={navRef}
          aria-label="Primary"
          className="site-nav relative inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full px-2 py-2 md:inline-flex"
        >
          {navSize.width > 0 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${svgRect.width} ${svgRect.height}`}
            >
              <rect
                x={svgRect.x}
                y={svgRect.y}
                width={svgRect.rectWidth}
                height={svgRect.rectHeight}
                rx={svgRect.radius}
                fill="rgba(6,7,10,0.78)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.1"
              />

              <rect
                x={svgRect.x}
                y={svgRect.y}
                width={svgRect.rectWidth}
                height={svgRect.rectHeight}
                rx={svgRect.radius}
                pathLength={100}
                fill="none"
                stroke="rgba(255,255,255,0.96)"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeDasharray="14 86"
                className="nav-trace"
              />
            </svg>
          )}

          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveId(section.id);

                  const element = document.getElementById(section.id);
                  if (!element) return;

                  const rect = element.getBoundingClientRect();
                  const absoluteTop = window.scrollY + rect.top;
                  const targetTop = absoluteTop - (window.innerHeight - rect.height) / 2;

                  window.scrollTo({
                    top: Math.max(targetTop, 0),
                    behavior: "smooth",
                  });
                }}
                className={`relative z-10 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/[0.08] text-[var(--foreground)]"
                    : "text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                }`}
              >
                {section.label}
              </a>
            );
          })}

          <style jsx>{`
            .site-nav {
              isolation: isolate;
            }

            .nav-trace {
              animation: navTrace 5.8s linear infinite;
            }

            @keyframes navTrace {
              from {
                stroke-dashoffset: 0;
              }
              to {
                stroke-dashoffset: -100;
              }
            }
          `}</style>
        </nav>
      </div>
    </header>
  );
}