"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";
import lgZoom from "lightgallery/plugins/zoom";

const LightGallery = dynamic(() => import("lightgallery/react"), {
  ssr: false,
});

type MediaItem = {
  id: string;
  type: "image" | "video";
  title: string;
  caption: string;
  src: string;
  thumb?: string;
  poster?: string;
  alt: string;
  size?: string;
  available?: boolean;
};

type MediaProject = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  items: MediaItem[];
};

const rawProjects: MediaProject[] = [
  {
    id: "intothepoker",
    title: "IntoThePoker",
    subtitle: "Live commerce build",
    description:
      "Shopify frontend, conversion thinking, product storytelling, and a premium dark visual system translated into a real storefront.",
    accent: "#91c6ff",
    items: [
      {
        id: "intothepoker-home",
        type: "image",
        title: "Homepage direction",
        caption:
          "Landing composition with a premium dark tone, clearer hierarchy, and stronger merchandising rhythm.",
        src: "/project-media/intothepoker/storefront-home.png",
        alt: "IntoThePoker homepage design",
        size: "2536-1598",
      },
      {
        id: "intothepoker-grid",
        type: "image",
        title: "Collection browsing",
        caption:
          "Product grid and category browsing built to keep the store feeling clean, focused, and premium.",
        src: "/project-media/intothepoker/product-grid.png",
        alt: "IntoThePoker collection page",
        size: "2537-1599",
      },
      {
        id: "intothepoker-detail",
        type: "image",
        title: "Product detail",
        caption:
          "Offer presentation and conversion-focused layout around the product page itself.",
        src: "/project-media/intothepoker/product-detail.png",
        alt: "IntoThePoker product detail page",
        size: "2541-1595",
      },
      {
        id: "intothepoker-cart",
        type: "image",
        title: "Cart flow",
        caption:
          "Cart state and pre-checkout layer designed to reduce friction before purchase intent drops.",
        src: "/project-media/intothepoker/cart-drawer.png",
        alt: "IntoThePoker cart flow",
        size: "2535-1599",
      },
      {
        id: "intothepoker-checkout",
        type: "image",
        title: "Trust + checkout",
        caption:
          "A tighter transaction surface with clearer trust signals and less visual noise near the buying moment.",
        src: "/project-media/intothepoker/trust-checkout.png",
        alt: "IntoThePoker checkout trust layer",
        size: "2538-1599",
      },
      {
        id: "intothepoker-demo",
        type: "video",
        title: "Store walkthrough",
        caption:
          "Recorded walkthrough of the storefront, product flow, and interaction feel across the build.",
        src: "/project-media/intothepoker/demo.mp4",
        poster: "/project-media/intothepoker/trust-checkout.png",
        alt: "IntoThePoker demo video",
        size: "2560-1600",
        available: true,
      },
    ],
  },
  {
    id: "yogalorena",
    title: "YogaLorena VOD",
    subtitle: "Production app",
    description:
      "Subscription video platform with access control, payments, protected content, and a cleaner premium member experience.",
    accent: "#b6a7ff",
    items: [
      {
        id: "yogalorena-marketing",
        type: "image",
        title: "Marketing homepage",
        caption:
          "Public-facing homepage used to introduce the offer and lead visitors into the paid experience.",
        src: "/project-media/yogalorena/marketing-home.png",
        alt: "YogaLorena marketing homepage",
        size: "1904-1073",
      },
      {
        id: "yogalorena-login",
        type: "image",
        title: "Login and access",
        caption:
          "Authentication layer for returning members and protected content access.",
        src: "/project-media/yogalorena/login-screen.png",
        alt: "YogaLorena login screen",
        size: "2536-1438",
      },
      {
        id: "yogalorena-home",
        type: "image",
        title: "Member home",
        caption:
          "Private member area with a calmer interface built around clarity and content discovery.",
        src: "/project-media/yogalorena/member-home.png",
        alt: "YogaLorena member home screen",
        size: "2535-1404",
      },
      {
        id: "yogalorena-library",
        type: "image",
        title: "Video library",
        caption:
          "Structured content browsing with a cleaner visual system for library exploration.",
        src: "/project-media/yogalorena/video-library.png",
        alt: "YogaLorena video library",
        size: "2532-1565",
      },
      {
        id: "yogalorena-categories",
        type: "image",
        title: "Category system",
        caption:
          "Content grouped for easier selection and lower friction once the user is inside the product.",
        src: "/project-media/yogalorena/category-grid.png",
        alt: "YogaLorena category grid",
        size: "2539-1599",
      },
      {
        id: "yogalorena-player",
        type: "image",
        title: "Protected playback",
        caption:
          "Member playback experience with the platform already working as a real product, not a mockup.",
        src: "/project-media/yogalorena/video-player.png",
        alt: "YogaLorena video player screen",
        size: "2551-1599",
      },
      {
        id: "yogalorena-demo",
        type: "video",
        title: "Platform walkthrough",
        caption:
          "Recorded demo showing the real flow across browse, access, and content consumption.",
        src: "/project-media/yogalorena/demo.mp4",
        poster: "/project-media/yogalorena/video-player.png",
        alt: "YogaLorena platform walkthrough video",
        size: "2560-1600",
        available: true,
      },
    ],
  },
  {
    id: "fashion-store",
    title: "Fashion Ecommerce",
    subtitle: "Additional commerce build",
    description:
      "A second ecommerce execution with a different visual language, useful to show range beyond a single storefront aesthetic.",
    accent: "#ffb38a",
    items: [
      {
        id: "fashion-store-landing",
        type: "image",
        title: "Landing page",
        caption:
          "Hero-led ecommerce landing direction with stronger editorial styling and clearer top-of-funnel positioning.",
        src: "/project-media/fashion-store/landing.png",
        alt: "Fashion ecommerce landing page",
        size: "2537-1596",
      },
      {
        id: "fashion-store-catalog",
        type: "image",
        title: "Catalog layout",
        caption:
          "Collection browsing and product surfacing with a more fashion-oriented presentation style.",
        src: "/project-media/fashion-store/catalog.png",
        alt: "Fashion ecommerce catalog page",
        size: "2538-1596",
      },
      {
        id: "fashion-store-product",
        type: "image",
        title: "Product page",
        caption:
          "Detailed item view focused on visual confidence, product context, and purchase readiness.",
        src: "/project-media/fashion-store/product-page.png",
        alt: "Fashion ecommerce product page",
        size: "2537-1599",
      },
      {
        id: "fashion-store-demo",
        type: "video",
        title: "Commerce walkthrough",
        caption:
          "Recorded navigation across the second store to show consistency in execution, not just one-off design.",
        src: "/project-media/fashion-store/demo.mp4",
        poster: "/project-media/fashion-store/product-page.png",
        alt: "Fashion ecommerce demo video",
        size: "2560-1600",
        available: true,
      },
    ],
  },
  {
    id: "range-builder",
    title: "Range Builder",
    subtitle: "Poker tools for poker players",
    description:
      "Poker tools for poker players, focused on range construction, combo logic, and faster visual decision support.",
    accent: "#ffd08a",
    items: [
      {
        id: "range-builder-grid",
        type: "image",
        title: "Range matrix",
        caption:
          "Core hand-grid interface for building and adjusting ranges visually.",
        src: "/project-media/range-builder/range-grid.png",
        alt: "Range builder hand matrix",
        size: "2557-1522",
      },
      {
        id: "range-builder-combos",
        type: "image",
        title: "Combo controls",
        caption:
          "Finer control layer for specific hand combinations and range editing logic.",
        src: "/project-media/range-builder/combos-panel.png",
        alt: "Range builder combo controls",
        size: "2551-1522",
      },
      {
        id: "range-builder-config",
        type: "image",
        title: "Configuration panel",
        caption:
          "Auxiliary controls and setup detail that make the tool usable for real workflow iteration.",
        src: "/project-media/range-builder/configurator.png",
        alt: "Range builder configuration panel",
        size: "2555-1521",
      },
    ],
  },
];

const projects: MediaProject[] = rawProjects.map((project) => ({
  ...project,
  items: [...project.items].sort((a, b) => {
    if (a.type === b.type) return 0;
    if (a.type === "video") return -1;
    return 1;
  }),
}));

function buildCaptionHtml(item: MediaItem) {
  return `<div class="lg-project-caption"><h4>${item.title}</h4><p>${item.caption}</p></div>`;
}

function getPreviewSrc(item: MediaItem) {
  if (item.poster) return item.poster;
  if (item.thumb) return item.thumb;
  return item.src;
}

function isPlayableVideo(item: MediaItem) {
  return item.type === "video" && item.available;
}

function isOpenableItem(item: MediaItem) {
  if (item.type === "image") return true;
  return item.type === "video" && item.available;
}

export function ProjectMediaGallery() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryLinksRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const pointerStartX = useRef<number | null>(null);

  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id === selectedProjectId) ??
      projects[0],
    [selectedProjectId]
  );

  const currentItem =
    selectedProject.items[activeItemIndex] ?? selectedProject.items[0];

  const currentPreview = getPreviewSrc(currentItem);
  const currentIsVideo = isPlayableVideo(currentItem);
  const canOpenCurrent = isOpenableItem(currentItem);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveItemIndex(0);
  }, [selectedProjectId]);

  const goToItem = (direction: "prev" | "next") => {
    setActiveItemIndex((current) => {
      const lastIndex = selectedProject.items.length - 1;

      if (direction === "prev") {
        return current === 0 ? lastIndex : current - 1;
      }

      return current === lastIndex ? 0 : current + 1;
    });
  };

  const openCurrentInGallery = () => {
    if (!canOpenCurrent) return;
    galleryLinksRef.current[activeItemIndex]?.click();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) < 55) return;

    if (distance > 0) {
      goToItem("prev");
    } else {
      goToItem("next");
    }
  };

  return (
    <section
      id="media"
      ref={sectionRef}
      className="scroll-mt-28 border-b border-[var(--border)] py-14 sm:py-18 lg:py-22"
      aria-labelledby="project-media-heading"
    >
      <div
        className={`space-y-7 transition duration-700 ease-out sm:space-y-8 lg:space-y-10 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-6">
          <p className="text-[0.66rem] font-medium uppercase tracking-[0.32em] text-[var(--foreground-subtle)]">
            Selected Project Media
          </p>

          <h2
            id="project-media-heading"
            className="mt-3 text-[1.85rem] font-semibold tracking-[-0.045em] text-white sm:text-[2.2rem] lg:whitespace-nowrap lg:text-[2.55rem] xl:text-[2.8rem]"
          >
            Screens and videos from selected projects
          </h2>

          <p className="mx-auto mt-3 max-w-4xl text-[0.92rem] leading-7 text-[var(--foreground-muted)] sm:text-[0.98rem]">
            A focused gallery of product screens, walkthroughs, and interface
            captures from selected builds.
          </p>
        </div>

        <div
          className="project-media-selector mx-auto flex w-full max-w-7xl flex-nowrap justify-start gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-6 lg:justify-center lg:px-8"
          aria-label="Project media selector"
        >
          {projects.map((project) => {
            const isActive = project.id === selectedProject.id;

            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedProjectId(project.id)}
                className={`group relative min-w-[12.4rem] shrink-0 overflow-hidden rounded-[1.15rem] border px-4 py-3 text-left transition-all duration-300 ease-out sm:min-w-[13.2rem] sm:px-5 sm:py-3.5 ${
                  isActive
                    ? "border-white/[0.48] bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.055))] text-white"
                    : "border-white/[0.12] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.018))] text-white/74 hover:border-white/[0.24] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.03))] hover:text-white"
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 1px ${project.accent}36, 0 18px 44px rgba(0,0,0,0.24), 0 0 28px ${project.accent}16, inset 0 1px 0 rgba(255,255,255,0.08)`
                    : "0 12px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                  style={{
                    background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block truncate text-[0.92rem] font-semibold tracking-[-0.025em]">
                      {project.title}
                    </span>

                    <span
                      className={`mt-0.5 block truncate text-[0.84rem] transition ${
                        isActive
                          ? "text-white/62"
                          : "text-white/44 group-hover:text-white/58"
                      }`}
                    >
                      {project.subtitle}
                    </span>
                  </div>

                  <span
                    className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                      isActive
                        ? "border-white/[0.18] bg-white/[0.07]"
                        : "border-white/[0.08] bg-white/[0.025] group-hover:border-white/[0.14] group-hover:bg-white/[0.04]"
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: project.accent,
                        boxShadow: isActive
                          ? `0 0 0 6px ${project.accent}12, 0 0 18px ${project.accent}72`
                          : "none",
                      }}
                    />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="relative"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartX.current = null;
          }}
        >
          <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#04060a] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-black/48 to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-black/48 to-transparent sm:w-28" />

            <div className="absolute inset-0">
              {(currentItem.type === "image" || currentItem.poster) && (
                <Image
                  key={`${currentItem.id}-background`}
                  src={currentPreview}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority={activeItemIndex === 0}
                  sizes="(max-width: 767px) 100vw, 1200px"
                  className="scale-105 object-cover opacity-18 blur-2xl"
                />
              )}

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%),linear-gradient(180deg,rgba(3,5,9,0.04)_0%,rgba(3,5,9,0.14)_42%,rgba(3,5,9,0.36)_100%)]" />
            </div>

            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              <button
                type="button"
                onClick={openCurrentInGallery}
                disabled={!canOpenCurrent}
                aria-label={
                  canOpenCurrent
                    ? `${currentItem.title} - open media`
                    : `${currentItem.title} - media unavailable`
                }
                className={`absolute inset-0 z-10 block h-full w-full ${
                  canOpenCurrent ? "cursor-zoom-in" : "cursor-default"
                }`}
              >
                {currentIsVideo ? (
                  <video
                    key={currentItem.src}
                    src={currentItem.src}
                    poster={currentItem.poster}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    key={currentItem.src}
                    src={currentPreview}
                    alt={currentItem.alt}
                    fill
                    priority={activeItemIndex === 0}
                    sizes="(max-width: 767px) 100vw, 1200px"
                    className="object-contain"
                  />
                )}
              </button>

              <div className="pointer-events-none absolute right-4 top-4 z-30 rounded-full border border-white/[0.14] bg-[rgba(6,8,12,0.82)] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-white/74 shadow-[0_10px_25px_rgba(0,0,0,0.28)] backdrop-blur-md sm:right-5 sm:top-5">
                {String(activeItemIndex + 1).padStart(2, "0")} /{" "}
                {String(selectedProject.items.length).padStart(2, "0")}
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => goToItem("prev")}
                  aria-label="Show previous media item"
                  className="pointer-events-auto inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-white/[0.22] bg-[rgba(6,8,12,0.92)] text-white shadow-[0_16px_34px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:scale-105 hover:border-white/[0.4] hover:bg-[rgba(6,8,12,0.98)] sm:h-14 sm:w-14"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => goToItem("next")}
                  aria-label="Show next media item"
                  className="pointer-events-auto inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-white/[0.22] bg-[rgba(6,8,12,0.92)] text-white shadow-[0_16px_34px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:scale-105 hover:border-white/[0.4] hover:bg-[rgba(6,8,12,0.98)] sm:h-14 sm:w-14"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {currentIsVideo && (
                <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-full border border-white/[0.14] bg-[rgba(6,8,12,0.82)] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-white/82 shadow-[0_10px_25px_rgba(0,0,0,0.28)] backdrop-blur-md sm:left-5 sm:top-5">
                  Video
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.06] bg-[rgba(255,255,255,0.018)] px-3 py-3 sm:px-4 sm:py-4">
              <div className="project-media-thumbs flex gap-3 overflow-x-auto [scrollbar-width:none]">
                {selectedProject.items.map((item, index) => {
                  const isActive = index === activeItemIndex;
                  const preview = getPreviewSrc(item);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveItemIndex(index)}
                      aria-label={`Show ${item.title}`}
                      aria-pressed={isActive}
                      className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-[1rem] border transition-all duration-300 sm:h-24 sm:w-40 ${
                        isActive
                          ? "border-white/55 opacity-100"
                          : "border-white/[0.1] opacity-62 hover:border-white/[0.24] hover:opacity-100"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? `0 0 0 1px ${selectedProject.accent}44, 0 14px 34px rgba(0,0,0,0.24), 0 0 22px ${selectedProject.accent}18`
                          : "0 10px 24px rgba(0,0,0,0.12)",
                      }}
                    >
                      {item.type === "image" || item.poster ? (
                        <Image
                          src={preview}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/[0.04]" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/8 to-transparent" />

                      {item.type === "video" && (
                        <div className="absolute right-2 top-2 rounded-full border border-white/[0.16] bg-[rgba(6,8,12,0.82)] px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.18em] text-white/74 backdrop-blur">
                          Video
                        </div>
                      )}

                      <div
                        className={`absolute inset-x-0 bottom-0 h-0.5 transition ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundColor: selectedProject.accent }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/[0.06]" />
          </div>

          <LightGallery
            plugins={[lgThumbnail, lgZoom, lgVideo]}
            speed={420}
            download={false}
            counter={false}
            selector="a[data-gallery-item='true']"
            mobileSettings={{
              controls: true,
              showCloseIcon: true,
              download: false,
            }}
          >
            <div className="hidden">
              {selectedProject.items.map((item, index) => {
                if (!isOpenableItem(item)) return null;

                if (item.type === "video") {
                  const videoPayload = JSON.stringify({
                    source: [{ src: item.src, type: "video/mp4" }],
                    attributes: { preload: false, controls: true },
                  });

                  return (
                    <a
                      key={item.id}
                      ref={(node) => {
                        galleryLinksRef.current[index] = node;
                      }}
                      href={item.src}
                      data-gallery-item="true"
                      data-lg-size={item.size ?? "1280-720"}
                      data-poster={item.poster}
                      data-sub-html={buildCaptionHtml(item)}
                      data-video={videoPayload}
                      aria-label={`${item.title} - open video`}
                    >
                      {item.title}
                    </a>
                  );
                }

                return (
                  <a
                    key={item.id}
                    ref={(node) => {
                      galleryLinksRef.current[index] = node;
                    }}
                    href={item.src}
                    data-gallery-item="true"
                    data-lg-size={item.size ?? "1600-900"}
                    data-sub-html={buildCaptionHtml(item)}
                    aria-label={`${item.title} - open image`}
                  >
                    {item.title}
                  </a>
                );
              })}
            </div>
          </LightGallery>
        </div>
      </div>

      <style jsx global>{`
        #media .project-media-selector::-webkit-scrollbar,
        #media .project-media-thumbs::-webkit-scrollbar {
          display: none;
        }

        #media .lg-project-caption {
          padding: 0.4rem 0.2rem;
        }

        #media .lg-project-caption h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.96);
        }

        #media .lg-project-caption p {
          margin: 0.45rem 0 0;
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.68);
        }

        #media button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </section>
  );
}