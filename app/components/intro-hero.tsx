"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

const firstNameLetters = [
  { letter: "E", x: -120, y: -52, rotate: -10 },
  { letter: "m", x: 86, y: 34, rotate: 8 },
  { letter: "a", x: -78, y: 62, rotate: -7 },
  { letter: "n", x: 62, y: -68, rotate: 7 },
  { letter: "u", x: -58, y: 52, rotate: -6 },
  { letter: "e", x: 72, y: -34, rotate: 6 },
  { letter: "l", x: -52, y: -76, rotate: -8 },
] as const;

const lastNameLetters = [
  { letter: "L", x: 112, y: -56, rotate: 9 },
  { letter: "a", x: -86, y: 58, rotate: -7 },
  { letter: "i", x: 44, y: 72, rotate: 5 },
  { letter: "o", x: -92, y: -34, rotate: -8 },
  { letter: "l", x: 64, y: 44, rotate: 5 },
  { letter: "o", x: -56, y: -72, rotate: -6 },
] as const;

const metaItems = ["Based in Krakow", "Open to relocation", "English fluent"];

export function IntroHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const roleRef = useRef<HTMLParagraphElement | null>(null);
  const firstNameRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lastNameRef = useRef<(HTMLSpanElement | null)[]>([]);
  const statementRef = useRef<HTMLParagraphElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const metaRef = useRef<(HTMLLIElement | null)[]>([]);
  const ctaRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const cellRef = useRef<HTMLDivElement | null>(null);
  const membraneOuterRef = useRef<HTMLDivElement | null>(null);
  const membraneInnerRef = useRef<HTMLDivElement | null>(null);
  const membraneSheenRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const role = roleRef.current;
      const statement = statementRef.current;
      const paragraph = paragraphRef.current;
      const visual = visualRef.current;
      const cell = cellRef.current;
      const membraneOuter = membraneOuterRef.current;
      const membraneInner = membraneInnerRef.current;
      const membraneSheen = membraneSheenRef.current;
      const portrait = portraitRef.current;

      if (!role || !statement || !paragraph || !visual || !cell || !membraneOuter || !membraneInner || !membraneSheen || !portrait) {
        return;
      }

      const firstLetters = firstNameRef.current.filter(Boolean);
      const lastLetters = lastNameRef.current.filter(Boolean);
      const meta = metaRef.current.filter(Boolean);
      const ctas = ctaRef.current.filter(Boolean);

      gsap.set(role, { y: 16, opacity: 0, filter: "blur(6px)" });

      firstLetters.forEach((letter, index) => {
        const config = firstNameLetters[index];
        gsap.set(letter, {
          x: config.x,
          y: config.y,
          rotation: config.rotate,
          opacity: 0,
          filter: "blur(10px)",
        });
      });

      lastLetters.forEach((letter, index) => {
        const config = lastNameLetters[index];
        gsap.set(letter, {
          x: config.x,
          y: config.y,
          rotation: config.rotate,
          opacity: 0,
          filter: "blur(10px)",
        });
      });

      gsap.set(statement, { y: 18, opacity: 0, filter: "blur(6px)" });
      gsap.set(paragraph, { y: 20, opacity: 0, filter: "blur(6px)" });
      gsap.set(meta, { y: 18, opacity: 0 });
      gsap.set(ctas, { y: 22, opacity: 0, scale: 0.985 });
      gsap.set(visual, { x: 22, opacity: 0 });
      gsap.set(cell, { scale: 0.95, opacity: 0, rotate: -4 });
      gsap.set([membraneOuter, membraneInner, membraneSheen], { opacity: 0, scale: 1.02 });
      gsap.set(portrait, { y: 18, scale: 1.03, opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.to(role, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.28 });
      timeline.to(
        [...firstLetters, ...lastLetters],
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.028,
        },
        "-=0.08"
      );
      timeline.to(statement, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.34 }, "-=0.24");
      timeline.to(paragraph, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.36 }, "-=0.22");
      timeline.to(visual, { x: 0, opacity: 1, duration: 0.38 }, "-=0.26");
      timeline.to(cell, { scale: 1, opacity: 1, rotate: 0, duration: 0.54 }, "<");
      timeline.to([membraneOuter, membraneInner, membraneSheen], { opacity: 1, scale: 1, duration: 0.62, stagger: 0.06 }, "-=0.44");
      timeline.to(portrait, { y: 0, scale: 1, opacity: 1, duration: 0.58 }, "-=0.42");
      timeline.to(meta, { y: 0, opacity: 1, duration: 0.28, stagger: 0.04 }, "-=0.22");
      timeline.to(ctas, { y: 0, opacity: 1, scale: 1, duration: 0.28, stagger: 0.05 }, "-=0.14");

      const cellX = gsap.quickTo(cell, "x", { duration: 0.5, ease: "power3.out" });
      const cellY = gsap.quickTo(cell, "y", { duration: 0.5, ease: "power3.out" });
      const cellRotate = gsap.quickTo(cell, "rotate", { duration: 0.6, ease: "power3.out" });
      const outerX = gsap.quickTo(membraneOuter, "x", { duration: 0.65, ease: "power3.out" });
      const outerY = gsap.quickTo(membraneOuter, "y", { duration: 0.65, ease: "power3.out" });
      const innerX = gsap.quickTo(membraneInner, "x", { duration: 0.58, ease: "power3.out" });
      const innerY = gsap.quickTo(membraneInner, "y", { duration: 0.58, ease: "power3.out" });
      const sheenX = gsap.quickTo(membraneSheen, "x", { duration: 0.72, ease: "power3.out" });
      const sheenY = gsap.quickTo(membraneSheen, "y", { duration: 0.72, ease: "power3.out" });
      const portraitX = gsap.quickTo(portrait, "x", { duration: 0.48, ease: "power3.out" });
      const portraitY = gsap.quickTo(portrait, "y", { duration: 0.48, ease: "power3.out" });

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = visual.getBoundingClientRect();
        const relativeX = (event.clientX - bounds.left) / bounds.width;
        const relativeY = (event.clientY - bounds.top) / bounds.height;

        const x = gsap.utils.clamp(0, 1, relativeX);
        const y = gsap.utils.clamp(0, 1, relativeY);

        const moveX = (x - 0.5) * 34;
        const moveY = (y - 0.5) * 28;

        cellX(moveX * 0.72);
        cellY(moveY * 0.72);
        cellRotate((x - 0.5) * 7);
        outerX(moveX * 1.2);
        outerY(moveY * 1.2);
        innerX(moveX * 0.9);
        innerY(moveY * 0.9);
        sheenX(moveX * 1.45);
        sheenY(moveY * 1.45);
        portraitX(moveX * 0.24);
        portraitY(moveY * 0.24);
      };

      const handlePointerLeave = () => {
        cellX(0);
        cellY(0);
        cellRotate(0);
        outerX(0);
        outerY(0);
        innerX(0);
        innerY(0);
        sheenX(0);
        sheenY(0);
        portraitX(0);
        portraitY(0);
      };

      visual.addEventListener("pointermove", handlePointerMove);
      visual.addEventListener("pointerleave", handlePointerLeave);

      gsap.to(cell, {
        y: "+=16",
        x: "-=8",
        duration: 3.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cell, {
        rotate: 2.4,
        duration: 5.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(membraneOuter, {
        scaleX: 1.055,
        scaleY: 0.958,
        rotate: 3.6,
        borderRadius: "50% 50% 58% 42% / 44% 38% 62% 56%",
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(membraneInner, {
        scaleX: 0.968,
        scaleY: 1.04,
        rotate: -4.2,
        borderRadius: "48% 52% 44% 56% / 42% 50% 50% 58%",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(membraneSheen, {
        scaleX: 1.07,
        scaleY: 0.948,
        rotate: 6,
        borderRadius: "52% 48% 56% 44% / 46% 40% 60% 54%",
        duration: 2.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => {
        visual.removeEventListener("pointermove", handlePointerMove);
        visual.removeEventListener("pointerleave", handlePointerLeave);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="hero"
      className="flex min-h-[100svh] scroll-mt-28 items-center overflow-hidden border-b border-[var(--border)] py-20"
    >
      <div className="mx-auto flex w-full max-w-[76rem] items-center justify-center px-6 sm:px-10 lg:px-0">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(30rem,36rem)] xl:grid-cols-[minmax(0,1fr)_minmax(34rem,40rem)] xl:gap-10">
          <div className="max-w-[42rem] space-y-10">
            <p
              ref={roleRef}
              className="text-[0.72rem] font-medium uppercase tracking-[0.38em] text-[var(--foreground-soft)]"
            >
              Software Developer
            </p>

            <div className="space-y-6">
              <h1
                aria-label="Emanuel Laiolo"
                className="text-[4rem] font-semibold leading-[0.9] tracking-[-0.09em] text-[var(--foreground)] sm:text-[5.2rem] lg:text-[6.4rem]"
              >
                <span className="block">
                  {firstNameLetters.map((item, index) => (
                    <span
                      key={`first-${item.letter}-${index}`}
                      ref={(node) => {
                        firstNameRef.current[index] = node;
                      }}
                      aria-hidden="true"
                      className="inline-block will-change-transform"
                    >
                      {item.letter}
                    </span>
                  ))}
                </span>

                <span className="mt-1 block">
                  {lastNameLetters.map((item, index) => (
                    <span
                      key={`last-${item.letter}-${index}`}
                      ref={(node) => {
                        lastNameRef.current[index] = node;
                      }}
                      aria-hidden="true"
                      className="inline-block will-change-transform"
                    >
                      {item.letter}
                    </span>
                  ))}
                </span>
              </h1>

              <p
                ref={statementRef}
                className="max-w-[39rem] text-xl leading-8 tracking-[-0.025em] text-[var(--foreground)]/92 sm:text-[1.7rem] sm:leading-10"
              >
                Building clean web products, practical tools, and modern digital
                experiences.
              </p>

              <p
                ref={paragraphRef}
                className="max-w-[35rem] text-base leading-8 text-[var(--foreground-muted)] sm:text-lg"
              >
                Programming Technician from UTN, based in Krakow, with
                experience across web development, e-commerce, and software
                products, and a growing focus on AI-assisted workflows.
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {metaItems.map((item, index) => (
                <li
                  key={item}
                  ref={(node) => {
                    metaRef.current[index] = node;
                  }}
                  className="text-sm tracking-[-0.01em] text-[var(--foreground-soft)]"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <a
                ref={(node) => {
                  ctaRef.current[0] = node;
                }}
                href="#projects"
                className="inline-flex w-fit min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-8 text-sm font-semibold tracking-[-0.01em] shadow-[0_10px_30px_rgba(255,255,255,0.08)] transition hover:bg-white/92"
                style={{ color: "#050505" }}
              >
                View Projects
              </a>

              <a
                ref={(node) => {
                  ctaRef.current[1] = node;
                }}
                href="/resume.pdf"
                className="inline-flex w-fit min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[var(--border-strong)] px-7 text-sm font-medium text-[var(--foreground)] transition hover:border-white/40 hover:bg-white/[0.03]"
              >
                Resume
              </a>
            </div>
          </div>

          <div className="relative mx-auto flex h-[40rem] w-full max-w-[36rem] items-end justify-center lg:mx-0 lg:ml-auto xl:h-[45rem] xl:max-w-[40rem]">
            <div
              ref={visualRef}
              className="relative h-full w-full will-change-transform"
            >
              <div
                ref={cellRef}
                className="absolute right-[2%] top-[4%] z-0 h-[88%] w-[88%] rounded-[46%_54%_52%_48%/42%_38%_62%_58%]"
              >
                <div
                  ref={membraneOuterRef}
                  className="absolute inset-0 rounded-[46%_54%_52%_48%/42%_38%_62%_58%] border border-white/[0.08] bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.05),rgba(255,255,255,0.018)_18%,rgba(255,255,255,0.004)_34%,transparent_46%),radial-gradient(circle_at_70%_78%,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_18%,transparent_34%)] backdrop-blur-[2px] shadow-[inset_0_0_20px_rgba(255,255,255,0.018)]"
                />

                <div
                  ref={membraneInnerRef}
                  className="absolute inset-[2.8%] rounded-[45%_55%_50%_50%/40%_44%_56%_60%] border border-white/[0.05] shadow-[inset_0_0_18px_rgba(255,255,255,0.012)]"
                />

                <div
                  ref={membraneSheenRef}
                  className="absolute inset-[1.4%] rounded-[47%_53%_51%_49%/43%_39%_61%_57%] bg-[conic-gradient(from_220deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.028)_48deg,transparent_86deg,transparent_220deg,rgba(255,255,255,0.018)_292deg,transparent_336deg)] opacity-80 mix-blend-screen"
                />
              </div>

              <div
                ref={portraitRef}
                className="absolute inset-y-[8%] right-[7%] z-10 flex w-[78%] items-end justify-center overflow-hidden rounded-[44%_56%_50%_50%/40%_44%_56%_60%]"
              >
                <Image
                  src="/profile.png"
                  alt="Portrait of Emanuel Laiolo"
                  width={860}
                  height={1220}
                  priority
                  sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 32rem, 72vw"
                  className="relative z-10 h-auto max-h-[39rem] w-auto max-w-none object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)] xl:max-h-[43rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
