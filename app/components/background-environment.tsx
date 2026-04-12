"use client";

import { useMemo } from "react";

type Star = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

function buildStars(count: number, seedOffset: number): Star[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 1 + seedOffset * 71;
    const wave = Math.sin(seed * 12.9898) * 43758.5453;
    const alt = Math.sin(seed * 7.113) * 21345.1731;

    return {
      left: (wave - Math.floor(wave)) * 100,
      top: (alt - Math.floor(alt)) * 100,
      size: 0.55 + ((seed * 17) % 5) * 0.34,
      opacity: 0.12 + ((seed * 19) % 58) / 100,
      duration: 4.4 + ((seed * 23) % 8) * 0.62,
      delay: ((seed * 29) % 14) * -0.38,
    };
  });
}

export function BackgroundEnvironment() {
  const starsFar = useMemo(() => buildStars(110, 1), []);
  const starsMid = useMemo(() => buildStars(72, 2), []);
  const starsNear = useMemo(() => buildStars(38, 3), []);
  const starsBright = useMemo(() => buildStars(18, 4), []);

  const renderStars = (
    stars: Star[],
    prefix: string,
    sizeOffset = 0,
    opacityMultiplier = 1,
    durationOffset = 0,
    extraClassName = ""
  ) =>
    stars.map((star, index) => (
      <span
        key={`${prefix}-${index}`}
        className={`absolute rounded-full bg-white ${extraClassName}`}
        style={{
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: `${star.size + sizeOffset}px`,
          height: `${star.size + sizeOffset}px`,
          opacity: Math.min(0.95, star.opacity * opacityMultiplier),
          animation: `star-twinkle ${star.duration + durationOffset}s ease-in-out ${star.delay}s infinite`,
        }}
      />
    ));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="space-base" />
      <div className="space-accent space-accent-left" />
      <div className="space-accent space-accent-right" />
      <div className="space-vignette" />

      <div className="absolute inset-0">
        {renderStars(starsFar, "far", 0, 0.82, 0.8)}
      </div>

      <div className="absolute inset-0">
        {renderStars(starsMid, "mid", 0.15, 0.95, 0.3)}
      </div>

      <div className="absolute inset-0 opacity-90">
        {renderStars(starsNear, "near", 0.35, 1.06, 0)}
      </div>

      <div className="absolute inset-0">
        {renderStars(starsBright, "bright", 0.6, 1.12, -0.2, "star-bright")}
      </div>

      <style jsx>{`
        .space-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #030304 0%, #020203 54%, #010102 100%);
        }

        .space-accent {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .space-accent-left {
          background: linear-gradient(
            115deg,
            rgba(70, 98, 190, 0.08) 0%,
            rgba(70, 98, 190, 0.03) 16%,
            transparent 34%
          );
          opacity: 0.48;
        }

        .space-accent-right {
          background: linear-gradient(
            245deg,
            rgba(86, 64, 178, 0.065) 0%,
            rgba(86, 64, 178, 0.025) 14%,
            transparent 30%
          );
          opacity: 0.42;
        }

        .space-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0) 54%,
            rgba(0, 0, 0, 0.18) 100%
          );
        }

        .star-bright {
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}