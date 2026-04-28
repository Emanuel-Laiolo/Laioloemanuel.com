"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const EMAIL = "emalaiolo@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/emanuel-laiolo";

type RevealState = {
  intro: boolean;
  content: boolean;
};

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [revealed, setRevealed] = useState<RevealState>({
    intro: false,
    content: false,
  });

  const introRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1700);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    const entries = [
      { key: "intro" as const, element: introRef.current },
      { key: "content" as const, element: contentRef.current },
    ].filter((entry) => entry.element);

    if (!entries.length) return;

    const observer = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const match = entries.find((item) => item.element === entry.target);
          if (!match) return;

          setRevealed((current) => ({
            ...current,
            [match.key]: true,
          }));

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.24,
        rootMargin: "0px 0px -12% 0px",
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

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <section
      id="contact"
      className="scroll-mt-28 py-20 sm:py-28 lg:py-36"
      aria-labelledby="contact-heading"
    >
      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        onPointerMove={handlePointerMove}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />

        <div
          className="pointer-events-none absolute left-1/2 top-8 h-72 w-[82%] max-w-[64rem] -translate-x-1/2 rounded-full opacity-80 blur-3xl"
          style={{
            background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(145,198,255,0.13), rgba(182,167,255,0.07) 28%, rgba(255,255,255,0.025) 48%, transparent 74%)`,
          }}
        />

        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] px-5 py-8 shadow-[0_32px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(145,198,255,0.12),transparent_34%),radial-gradient(circle_at_92%_100%,rgba(182,167,255,0.08),transparent_36%)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.78fr)] lg:gap-14">
            <div
              ref={introRef}
              className={`transition duration-700 ease-out ${
                revealed.intro
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-6 opacity-0 blur-[8px]"
              }`}
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.34em] text-white/42">
                Contact
              </p>

              <h2
                id="contact-heading"
                className="mt-5 max-w-4xl text-[2.45rem] font-semibold leading-[0.95] tracking-[-0.07em] text-white sm:text-[3.45rem] lg:text-[4.25rem]"
              >
                For recruiters, teams, and clients building something real.
              </h2>

              <p className="mt-6 max-w-2xl text-[1rem] leading-8 text-white/58 sm:text-[1.08rem]">
                I’m open to conversations around developer opportunities,
                freelance web projects, product interfaces, and technical
                execution with a clear goal.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.45rem] border border-white/[0.08] bg-black/20 p-5">
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/38">
                    For recruiters
                  </p>
                  <p className="mt-3 text-[1.02rem] font-semibold tracking-[-0.03em] text-white">
                    Junior developer profile with product sense.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    Frontend, web fundamentals, Shopify, React/Next.js, and a
                    strong learning curve.
                  </p>
                </div>

                <div className="rounded-[1.45rem] border border-white/[0.08] bg-black/20 p-5">
                  <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/38">
                    For clients
                  </p>
                  <p className="mt-3 text-[1.02rem] font-semibold tracking-[-0.03em] text-white">
                    Clean websites and product-focused builds.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/50">
                    Landing pages, ecommerce, portfolio sites, product flows,
                    and modern web execution.
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={contentRef}
              className={`flex flex-col justify-end gap-4 transition duration-700 ease-out ${
                revealed.content
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-6 opacity-0 blur-[8px]"
              }`}
              style={{ transitionDelay: "120ms" }}
            >
              <a
                href={`mailto:${EMAIL}`}
                className="group relative overflow-hidden rounded-[1.55rem] border border-white/[0.1] bg-black/25 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.045]"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(145,198,255,0.16),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/38">
                      Email
                    </p>

                    <p className="mt-4 break-all text-[1.05rem] font-semibold tracking-[-0.035em] text-white sm:text-[1.12rem]">
                      {EMAIL}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-white/46">
                      Best for project details, hiring conversations, or direct
                      collaboration.
                    </p>
                  </div>

                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.045] text-white/72 transition group-hover:border-white/[0.22] group-hover:bg-white/[0.075] group-hover:text-white">
                    <ArrowUpRightIcon />
                  </span>
                </div>
              </a>

              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-[1.55rem] border border-white/[0.1] bg-black/25 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.045]"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(182,167,255,0.16),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/38">
                      LinkedIn
                    </p>

                    <p className="mt-4 truncate text-[1.05rem] font-semibold tracking-[-0.035em] text-white sm:text-[1.12rem]">
                      emanuel-laiolo
                    </p>

                    <p className="mt-3 text-sm leading-6 text-white/46">
                      Best for profile, background, recruitment, and
                      professional context.
                    </p>
                  </div>

                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.045] text-white/72 transition group-hover:border-white/[0.22] group-hover:bg-white/[0.075] group-hover:text-white">
                    <ArrowUpRightIcon />
                  </span>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="group relative overflow-hidden rounded-[1.55rem] border border-white/[0.1] bg-white/[0.035] p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.06]"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between gap-5">
                  <div>
                    <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/38">
                      Quick Action
                    </p>

                    <p className="mt-3 text-[1.02rem] font-semibold tracking-[-0.03em] text-white">
                      {copied ? "Email copied" : "Copy email address"}
                    </p>
                  </div>

                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-black/22 text-white/72 transition group-hover:border-white/[0.22] group-hover:bg-white/[0.075] group-hover:text-white">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}