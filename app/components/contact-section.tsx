"use client";

import { useEffect, useRef, useState } from "react";

type RevealState = {
  copy: boolean;
  links: boolean;
};

const EMAIL = "emalaiolo@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/emanuel-laiolo";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState<RevealState>({
    copy: false,
    links: false,
  });
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  const copyRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    const entries = [
      { key: "copy" as const, element: copyRef.current },
      { key: "links" as const, element: linksRef.current },
    ].filter((entry) => entry.element);

    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const match = entries.find((item) => item.element === entry.target);
          if (!match) return;

          setRevealed((current) => ({ ...current, [match.key]: true }));
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    entries.forEach((entry) => observer.observe(entry.element!));

    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
  };

  return (
    <section id="contact" className="scroll-mt-28 py-24 sm:py-32 lg:py-40">
      <div className="relative" onPointerMove={handlePointerMove}>
        <div
          className="pointer-events-none absolute left-1/2 top-[10%] h-56 w-[72%] max-w-[48rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.07), rgba(126,143,255,0.034) 24%, rgba(255,255,255,0.014) 42%, transparent 72%)`,
          }}
        />

        <div className="mx-auto max-w-[58rem]">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,22rem)] lg:gap-8 xl:gap-10">
            <div
              ref={copyRef}
              className={`relative transition-all duration-700 ease-out ${
                revealed.copy
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-6 opacity-0 blur-[8px]"
              }`}
            >
              <div className="space-y-6 lg:max-w-[31rem]">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
                  Contact
                </p>

                <h2 className="max-w-[24rem] text-[2.2rem] font-semibold tracking-[-0.06em] text-[var(--foreground)] sm:text-[3rem] lg:text-[3.35rem]">
                  Open to a clear, thoughtful conversation.
                </h2>

                <p className="max-w-[29rem] text-[1rem] leading-7 text-[var(--foreground-muted)] sm:text-[1.05rem] sm:leading-8">
                  If my profile feels relevant and you’d like to have a clear,
                  friendly, and technical conversation, feel free to reach out.
                  I’d be happy to answer your questions.
                </p>
              </div>
            </div>

            <div
              ref={linksRef}
              className={`relative grid gap-4 lg:translate-y-14 transition-all duration-700 ease-out ${
                revealed.links
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-6 opacity-0 blur-[8px]"
              }`}
              style={{ transitionDelay: "140ms" }}
            >
              <div className="group relative overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.02] px-5 py-5 backdrop-blur-[10px] transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                      Email
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-4 inline-block break-all text-[1rem] font-medium tracking-[-0.03em] text-[var(--foreground)] transition group-hover:text-white"
                    >
                      {EMAIL}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.22em] text-white/58 transition hover:border-white/[0.16] hover:text-white/80"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.02] px-5 py-5 backdrop-blur-[10px] transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(166,178,255,0.12),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[var(--foreground-subtle)]">
                    LinkedIn
                  </p>
                  <p className="mt-4 break-words text-[0.98rem] leading-7 text-[var(--foreground-muted)] transition group-hover:text-[var(--foreground)]">
                    linkedin.com/in/emanuel-laiolo
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
