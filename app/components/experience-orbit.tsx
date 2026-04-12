"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StackItem = {
  label: string;
  icon: string;
  iconType?: "emoji" | "image";
};

type ExperienceItem = {
  id: string;
  title: string;
  shortTitle: string;
  role: string;
  period: string;
  location: string;
  orbitLabel: string;
  accent: string;
  summary: string;
  description: string;
  stack: StackItem[];
  highlights: string[];
  result: string;
  orbit: number;
  speed: number;
  initialAngle: number;
};

const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "intothepoker",
    title: "intothepoker.com",
    shortTitle: "IntoThePoker",
    role: "Full Ecommerce Build",
    period: "Oct. 2025 — Feb. 2026",
    location: "Self-employed",
    orbitLabel: "Live Commerce",
    accent: "#91c6ff",
    summary:
      "A real Shopify ecommerce build with a custom theme, self-directed frontend work, and a scalable foundation for catalogue, checkout, and orders.",
    description:
      "Built and managed a full ecommerce platform on Shopify. I created the theme design myself, handled the frontend implementation, improved the shopping experience, and used Shopify as the backend foundation for catalogue, checkout, and order operations.",
    stack: [
      {
        label: "Shopify",
        icon: "https://cdn.simpleicons.org/shopify/7AB55C",
        iconType: "image",
      },
      {
        label: "Custom Theme",
        icon: "https://cdn.simpleicons.org/css/1572B6",
        iconType: "image",
      },
      {
        label: "Frontend UI",
        icon: "https://cdn.simpleicons.org/react/61DAFB",
        iconType: "image",
      },
      {
        label: "Ecommerce UX",
        icon: "https://cdn.simpleicons.org/figma/F24E1E",
        iconType: "image",
      },
    ],
    highlights: [
      "Created the theme design from scratch.",
      "Built the frontend around a cleaner shopping experience.",
      "Set up a scalable commerce base for real operations.",
    ],
    result: "A live store with its own identity and a real commercial foundation.",
    orbit: 1,
    speed: 0.14,
    initialAngle: -18,
  },
  {
    id: "yogalorena",
    title: "YogaLorena.com | VOD Platform",
    shortTitle: "YogaLorena VOD",
    role: "FullStack Lead · Partner",
    period: "Dec. 2025 — Jan. 2026",
    location: "Krakow · Remote",
    orbitLabel: "Production App",
    accent: "#b6a7ff",
    summary:
      "A subscription VOD platform built end-to-end with payments, authentication, database, and secure video delivery, launched with real users.",
    description:
      "The goal was to create a complete web app where users could buy subscriptions and stream secure video. I worked as full stack developer and partner, taking the platform from MVP to production release.",
    stack: [
      {
        label: "Stripe",
        icon: "https://cdn.simpleicons.org/stripe/635BFF",
        iconType: "image",
      },
      {
        label: "Supabase",
        icon: "https://cdn.simpleicons.org/supabase/3ECF8E",
        iconType: "image",
      },
      {
        label: "Cloudflare Stream",
        icon: "https://cdn.simpleicons.org/cloudflare/F38020",
        iconType: "image",
      },
      {
        label: "Full Stack",
        icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
        iconType: "image",
      },
    ],
    highlights: [
      "Integrated Stripe for real subscription payments.",
      "Implemented authentication and database with Supabase.",
      "Used Cloudflare Stream for protected, fast playback.",
    ],
    result: "A live platform processing real payments with active users.",
    orbit: 2,
    speed: -0.09,
    initialAngle: 42,
  },
  {
    id: "yoga4poker",
    title: "Yoga4Poker",
    shortTitle: "Yoga4Poker",
    role: "Co-Founder",
    period: "Feb. 2025 — Aug. 2025",
    location: "Yoga Lorena ecosystem",
    orbitLabel: "Niche Product",
    accent: "#78efd0",
    summary:
      "A niche high-performance concept connecting yoga, mental wellbeing, and poker performance through product thinking and positioning.",
    description:
      "I co-founded Yoga4Poker as a specialised high-performance program designed to bridge mental wellbeing and professional gaming performance. I worked on strategic vision, market positioning, and translating complex ideas into a concrete digital offer.",
    stack: [
      {
        label: "Product Strategy",
        icon: "https://cdn.simpleicons.org/notion/FFFFFF",
        iconType: "image",
      },
      {
        label: "Positioning",
        icon: "https://cdn.simpleicons.org/target/FFFFFF",
        iconType: "image",
      },
      {
        label: "Digital Lessons",
        icon: "https://cdn.simpleicons.org/youtube/FF0000",
        iconType: "image",
      },
      {
        label: "Niche Offer",
        icon: "https://cdn.simpleicons.org/shopify/7AB55C",
        iconType: "image",
      },
    ],
    highlights: [
      "Helped shape a differentiated niche offer.",
      "Worked with experts to turn complex ideas into actionable lessons.",
      "Built a clearer strategic identity around the product.",
    ],
    result: "A distinctive niche product with a strong positioning angle.",
    orbit: 1,
    speed: 0.16,
    initialAngle: 132,
  },
  {
    id: "solver-support",
    title: "Poker Strategy Software Solutions",
    shortTitle: "Solver Support",
    role: "Support Team · Python Solver",
    period: "May 2023 — Aug. 2024",
    location: "Self-employed",
    orbitLabel: "Technical Product",
    accent: "#ffd08a",
    summary:
      "A technical support role around mathematical poker software, with real exposure to code, product logic, and solver-driven workflows.",
    description:
      "I was hired into the support department of a company building mathematical solver software. To do the job properly, I had to learn the codebase, product functionality, and internal logic of a desktop application written in Python.",
    stack: [
      {
        label: "Python",
        icon: "https://cdn.simpleicons.org/python/3776AB",
        iconType: "image",
      },
      {
        label: "JSON",
        icon: "https://cdn.simpleicons.org/json/FFFFFF",
        iconType: "image",
      },
      {
        label: "Algorithms",
        icon: "https://cdn.simpleicons.org/python/3776AB",
        iconType: "image",
      },
      {
        label: "Statistics",
        icon: "https://cdn.simpleicons.org/pandas/150458",
        iconType: "image",
      },
    ],
    highlights: [
      "Learned product internals, not just surface-level support.",
      "Worked around code, features, and technical product logic.",
      "Bridged user needs with complex software behaviour.",
    ],
    result: "A strong base in technical product understanding and decision-heavy software.",
    orbit: 2,
    speed: 0.11,
    initialAngle: 208,
  },
  {
    id: "quantitative-project",
    title: "Quantitative Project Group",
    shortTitle: "Quantitative Project",
    role: "Custom Software Projects",
    period: "Mar. 2022 — Apr. 2023",
    location: "Self-employed",
    orbitLabel: "Quant Systems",
    accent: "#ff9fae",
    summary:
      "Custom software work around bankroll management, EV, probability, statistics, and solver-driven decision systems for poker players.",
    description:
      "I worked with a group dedicated to delivering custom software projects for poker players. My contribution focused on risk, EV, and probability-driven decision support, using large datasets and solver-based workflows.",
    stack: [
      {
        label: "Custom Software",
        icon: "https://cdn.simpleicons.org/github/FFFFFF",
        iconType: "image",
      },
      {
        label: "Risk Models",
        icon: "https://cdn.simpleicons.org/scikitlearn/F7931E",
        iconType: "image",
      },
      { label: "EV", icon: "♠️" },
      {
        label: "Large Datasets",
        icon: "https://cdn.simpleicons.org/postgresql/4169E1",
        iconType: "image",
      },
    ],
    highlights: [
      "Built software around concrete player-specific needs.",
      "Worked with risk models, EV logic, and quantitative reasoning.",
      "Contributed to bankroll, stats, range, and solver-oriented tools.",
    ],
    result: "Early exposure to building software for complex, quantitative problems.",
    orbit: 3,
    speed: -0.07,
    initialAngle: 272,
  },
  {
    id: "utn",
    title: "UTN · Programming Technician",
    shortTitle: "UTN",
    role: "Education",
    period: "Aug. 2025 — Jul. 2027",
    location: "Online",
    orbitLabel: "Foundation",
    accent: "#9dc4ff",
    summary:
      "University training designed to reinforce real programming and software development fundamentals over the long term.",
    description:
      "My programming studies at UTN serve as a structured way to reinforce technical fundamentals and long-term thinking. Not as a substitute for practical work, but as a serious base to build on.",
    stack: [
      {
        label: "Programming",
        icon: "https://cdn.simpleicons.org/c/00599C",
        iconType: "image",
      },
      {
        label: "Software Development",
        icon: "https://cdn.simpleicons.org/git/F05032",
        iconType: "image",
      },
      {
        label: "Fundamentals",
        icon: "https://cdn.simpleicons.org/devbox/FFFFFF",
        iconType: "image",
      },
      {
        label: "Long-term Growth",
        icon: "https://cdn.simpleicons.org/bookstack/FFFFFF",
        iconType: "image",
      },
    ],
    highlights: [
      "Formal study running in parallel with real-world work.",
      "Focus on fundamentals rather than shallow tooling.",
      "A deliberate base for long-term technical growth.",
    ],
    result: "A more durable technical foundation for the next stage of growth.",
    orbit: 1,
    speed: -0.14,
    initialAngle: 314,
  },
];

const ORBIT_RADII = {
  1: { x: 145, y: 100 },
  2: { x: 225, y: 156 },
  3: { x: 300, y: 206 },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function applyOrbitSpacing(rawAngles: Record<string, number>) {
  const next = { ...rawAngles };
  const minAngleByOrbit: Record<number, number> = {
    1: 50,
    2: 38,
    3: 30,
  };

  for (const orbit of [1, 2, 3]) {
    const orbitItems = EXPERIENCE_ITEMS.filter((item) => item.orbit === orbit)
      .map((item) => ({
        id: item.id,
        angle: normalizeAngle(next[item.id] ?? item.initialAngle),
      }))
      .sort((a, b) => a.angle - b.angle);

    if (orbitItems.length < 2) continue;

    const minGap = minAngleByOrbit[orbit] ?? 32;

    for (let pass = 0; pass < orbitItems.length * 3; pass += 1) {
      let adjusted = false;

      for (let i = 0; i < orbitItems.length; i += 1) {
        const current = orbitItems[i];
        const nextItem = orbitItems[(i + 1) % orbitItems.length];
        const currentAngle = normalizeAngle(current.angle);
        const nextAngleRaw = normalizeAngle(nextItem.angle);
        const nextAngle = i === orbitItems.length - 1 ? nextAngleRaw + 360 : nextAngleRaw;
        const gap = nextAngle - currentAngle;

        if (gap < minGap) {
          const push = (minGap - gap) / 2;
          current.angle = normalizeAngle(current.angle - push);
          nextItem.angle = normalizeAngle(nextItem.angle + push);
          adjusted = true;
        }
      }

      if (!adjusted) break;
    }

    for (const item of orbitItems) {
      next[item.id] = normalizeAngle(item.angle);
    }
  }

  return next;
}

function OrbitalNode({
  item,
  angle,
  active,
  onSelect,
}: {
  item: ExperienceItem;
  angle: number;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const radians = (angle * Math.PI) / 180;
  const orbitRadius = ORBIT_RADII[item.orbit as keyof typeof ORBIT_RADII];
  const x = Math.cos(radians) * orbitRadius.x;
  const y = Math.sin(radians) * orbitRadius.y;
  const depth = clamp((Math.sin(radians) + 1) / 2, 0, 1);
  const scale = active ? 1.06 : 0.98 + depth * 0.06;
  const opacity = active ? 1 : 0.78 + depth * 0.16;
  const zIndex = Math.round(20 + depth * 20 + (active ? 28 : 0));

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(${x}px, ${y}px)`, zIndex }}
      aria-pressed={active}
    >
      <span className="relative block -translate-x-1/2 -translate-y-1/2">
        <span
          className="absolute left-1/2 top-1/2 -z-10 h-24 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition duration-500"
          style={{
            background: `radial-gradient(circle, ${item.accent}${active ? "72" : "26"} 0%, ${item.accent}${active ? "22" : "08"} 56%, transparent 80%)`,
            opacity: active ? 1 : 0.45,
          }}
        />

        <span
          className={`relative block w-[12.5rem] rounded-[1.3rem] border px-4 py-3.5 text-left backdrop-blur-xl transition duration-300 ${
            active
              ? "border-white/28 bg-white/[0.12] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_30px_rgba(147,197,255,0.18),0_18px_54px_rgba(0,0,0,0.42)]"
              : "border-white/[0.08] bg-white/[0.045]"
          }`}
          style={{ transform: `scale(${scale})`, opacity }}
        >
          <span className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.28em] text-white/42">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.accent }}
            />
            {item.orbitLabel}
          </span>

          <span className="mt-2 block text-[1rem] font-medium leading-5 tracking-[-0.02em] text-white/92">
            {item.shortTitle}
          </span>

          <span className="mt-1 block text-[0.7rem] text-white/38">{item.period}</span>
        </span>
      </span>
    </button>
  );
}

function StackMarquee({ item }: { item: ExperienceItem }) {
  const renderIcon = (tech: StackItem) => {
    if (tech.iconType === "image") {
      return (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.045]">
          <img
            src={tech.icon}
            alt={tech.label}
            className="h-3.5 w-3.5 object-contain"
            loading="lazy"
          />
        </span>
      );
    }

    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.045] text-[0.65rem] text-white/78">
        {tech.icon}
      </span>
    );
  };

  return (
    <div className="rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] px-3 py-3">
      <div className="flex flex-wrap gap-2.5">
        {item.stack.map((tech) => (
          <div
            key={tech.label}
            className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-[rgba(255,255,255,0.035)] px-3 py-1.5 text-[0.78rem] font-medium tracking-[0.01em] text-white/74"
          >
            {renderIcon(tech)}
            <span className="whitespace-nowrap">{tech.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperiencePanel({ item }: { item: ExperienceItem }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(8,10,16,0.92),rgba(5,6,10,0.98))] p-6 backdrop-blur-xl sm:p-7 lg:p-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background: `radial-gradient(circle at 18% 18%, ${item.accent}24 0%, transparent 60%)`,
        }}
      />

      <div className="relative space-y-7">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex rounded-full border px-3 py-1 text-[0.66rem] uppercase tracking-[0.26em]"
            style={{
              borderColor: `${item.accent}55`,
              color: item.accent,
              backgroundColor: `${item.accent}12`,
            }}
          >
            {item.orbitLabel}
          </span>

          <span className="text-[0.72rem] uppercase tracking-[0.24em] text-white/34">
            {item.period}
          </span>
        </div>

        <div className="space-y-3 border-b border-white/[0.06] pb-6">
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-white/34">
            {item.role} · {item.location}
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.045em] text-white/94 sm:text-[2rem]">
            {item.title}
          </h3>
          <p className="max-w-2xl text-[0.98rem] leading-8 text-white/64">
            {item.description}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-white/34">
            Highlights
          </p>

          <div className="grid gap-3">
            {item.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex gap-3 rounded-[1rem] border border-white/[0.06] bg-white/[0.03] px-4 py-3"
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
                <p className="text-sm leading-6 text-white/58">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
          <div className="space-y-3">
            <p className="text-[0.72rem] uppercase tracking-[0.26em] text-white/34">
              Stack / Focus
            </p>
            <StackMarquee item={item} />
          </div>

          <div className="rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/34">
              Result
            </p>
            <p className="mt-3 text-sm leading-6 text-white/60">{item.result}</p>
          </div>
        </div>
      </div>
      <style jsx>{``}</style>
    </div>
  );
}

export function ExperienceOrbit() {
  const [activeId, setActiveId] = useState(EXPERIENCE_ITEMS[0].id);
  const [angles, setAngles] = useState<Record<string, number>>(() =>
    Object.fromEntries(EXPERIENCE_ITEMS.map((item) => [item.id, item.initialAngle])),
  );

  const activeItem = useMemo(
    () => EXPERIENCE_ITEMS.find((item) => item.id === activeId) ?? EXPERIENCE_ITEMS[0],
    [activeId],
  );

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const update = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.03);
      lastTimeRef.current = time;

      setAngles((current) => {
        const next = { ...current };

        for (const item of EXPERIENCE_ITEMS) {
          next[item.id] = normalizeAngle(next[item.id] + item.speed * delta * 60);
        }

        return applyOrbitSpacing(next);
      });

      rafRef.current = window.requestAnimationFrame(update);
    };

    rafRef.current = window.requestAnimationFrame(update);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      id="projects"
      className="scroll-mt-28 border-b border-[var(--border)] py-24 sm:py-32 lg:py-40"
    >
      <div className="space-y-12 lg:space-y-16">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
            Experience Map
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl lg:text-[2.9rem]">
            Real projects, real execution, real progression.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Explore the work, the context, and the decisions behind each stage — from foundations to shipped products.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,29rem)] xl:items-center">
          <div className="relative overflow-visible rounded-[2.2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(146,169,255,0.08),rgba(255,255,255,0.02)_34%,rgba(255,255,255,0.01)_48%,rgba(0,0,0,0)_76%),linear-gradient(180deg,rgba(6,8,13,0.84),rgba(4,5,8,0.97))] px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[46rem]">
            <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_56%)]" />

            <div className="absolute left-6 top-6 z-30 rounded-[1.2rem] border border-white/[0.08] bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/38">
                Instruction
              </p>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Choose a project or experience to inspect it.
              </p>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[37rem] w-[37rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

            <div className="relative flex min-h-[40rem] items-center justify-center overflow-visible">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(145,175,255,0.24)_0%,rgba(145,175,255,0.12)_28%,rgba(255,255,255,0.04)_52%,rgba(0,0,0,0)_74%)] blur-xl" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.12] bg-[linear-gradient(180deg,rgba(24,28,42,0.92),rgba(10,12,18,0.96))] shadow-[0_0_40px_rgba(129,157,255,0.2),inset_0_1px_0_rgba(255,255,255,0.14)]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),rgba(120,146,214,0.12)_42%,rgba(0,0,0,0.2)_100%)]">
                <span className="text-center text-[0.58rem] font-semibold uppercase leading-[1.45] tracking-[0.34em] text-white/78">
                  WORK
                  <br />
                  EXPERIENCE
                </span>
              </div>

              {EXPERIENCE_ITEMS.map((item) => (
                <OrbitalNode
                  key={item.id}
                  item={item}
                  angle={angles[item.id] ?? item.initialAngle}
                  active={item.id === activeId}
                  onSelect={setActiveId}
                />
              ))}
            </div>
          </div>

          <ExperiencePanel item={activeItem} />
        </div>
      </div>
    </section>
  );
}
