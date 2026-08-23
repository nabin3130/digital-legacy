"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const availableServices = [
  { name: "Kakao", slug: "kakao", logo: "/logos/kakao.webp", group: "Korean", keywords: ["kakao", "kakaotalk", "daum"] },
  { name: "Naver", slug: "naver", logo: "/logos/naver.svg", group: "Korean", keywords: ["naver", "blog", "mybox"] },
  { name: "Samsung", slug: "samsung", logo: "/logos/samsung.svg", group: "Korean", keywords: ["samsung", "galaxy", "cloud"] },
  { name: "Instagram", slug: "instagram", logo: "/logos/instagram.webp", group: "Global", keywords: ["instagram", "threads", "insta"] },
  { name: "Google", slug: "google", logo: "/logos/google.svg", group: "Global", keywords: ["google", "gmail", "youtube"] },
  { name: "Meta", slug: "meta", logo: "/logos/meta.svg", group: "Global", keywords: ["meta", "facebook", "messenger"] },
  { name: "Apple", slug: "apple", logo: "/logos/apple.svg", group: "Global", keywords: ["apple", "icloud"] },
  { name: "X", slug: "x", logo: "/logos/x.svg", group: "Global", keywords: ["x", "twitter"] },
];

const domesticServices = availableServices.filter((service) => service.group === "Korean");
const internationalServices = availableServices.filter((service) => service.group === "Global");

export default function EnglishHomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSoundOn, setIsSoundOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const startVideo = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startVideo();
    } else {
      video.addEventListener("canplay", startVideo, { once: true });
    }

    const resumeAfterTabReturn = () => {
      if (document.visibilityState === "visible") startVideo();
    };
    document.addEventListener("visibilitychange", resumeAfterTabReturn);

    return () => {
      video.removeEventListener("canplay", startVideo);
      document.removeEventListener("visibilitychange", resumeAfterTabReturn);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return availableServices.filter((service) =>
      service.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)) ||
      service.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchResults.length > 0) router.push(`/en/company/${searchResults[0].slug}`);
  }

  async function toggleOceanSound() {
    const video = videoRef.current;
    if (!video) return;

    if (isSoundOn) {
      video.muted = true;
      setIsSoundOn(false);
    } else {
      try {
        video.removeAttribute("muted");
        video.muted = false;
        video.volume = 1.0;
        await video.play();
        setIsSoundOn(true);
      } catch (error) {
        console.error("Audio playback error:", error);
        video.muted = true;
        setIsSoundOn(false);
      }
    }
  }

  return (
    <main>
      <section className="hero hero-video">
        <div className="hero-media" aria-hidden="true">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            poster="/media/ocean-hero-poster.jpg"
          >
            <source src="/media/ocean-hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">DIGITAL LEGACY NAVIGATOR / 01</p>
            <h1>
              <span>Your digital memories remain.</span>
              <span>We help you decide what comes next.</span>
            </h1>
            <p className="hero-description">
              Find pre-planning options, steps after a death, required documents, and official request paths in one place.
            </p>

            <form className="company-search" onSubmit={handleSubmit}>
              <input
                className="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search companies or services"
                placeholder="Search a company or service"
                autoComplete="off"
              />

              {normalizedQuery && (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((service) => (
                      <Link className="search-result" href={`/en/company/${service.slug}`} key={service.slug}>
                        <span className="search-result-logo"><img src={service.logo} alt="" /></span>
                        <strong>{service.name}</strong>
                        <span className="result-arrow" aria-hidden="true">→</span>
                      </Link>
                    ))
                  ) : (
                    <p className="search-empty">No results found.</p>
                  )}
                </div>
              )}
            </form>

            <button
              className="ocean-sound-toggle"
              type="button"
              aria-pressed={isSoundOn}
              onClick={toggleOceanSound}
            >
              <span className="sound-icon" aria-hidden="true">{isSoundOn ? "◉" : "○"}</span>
              {isSoundOn ? "Sound off" : "Sound on"}
            </button>
          </div>
        </div>
      </section>

      <section className="available-services-section" id="services">
        <div className="container">
          <div className="available-services-heading">
            <p className="eyebrow">AVAILABLE PATHS / 02</p>
            <h2>Available services</h2>
            <p>Choose the service for the account you need to manage.</p>
          </div>

          <div className="service-groups">
            {[
              { title: "Korean services", services: domesticServices },
              { title: "Global services", services: internationalServices },
            ].map((group) => (
              <section className="service-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="available-services">
                  {group.services.map((service) => (
                    <Link className="available-service" href={`/en/company/${service.slug}`} key={service.slug}>
                      <span className="available-service-logo"><img src={service.logo} alt="" /></span>
                      <strong>{service.name}</strong>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

