"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { excoApi } from "@/lib/api/content";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";
import type { ExcoMember } from "@/lib/types/api";

const DEFAULT_COLOR = "bg-[#B3DEE2] text-slate-700";

export default function Exco() {
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [members, setMembers] = useState<ExcoMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    excoApi
      .list()
      .then(setMembers)
      .catch((err) => setError(getUserMessage(err, "Unable to load team members.")));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "#exco", start: "top 85%", once: true },
        },
      );
    }

    if (carouselRef.current && members.length > 0) {
      const cards = carouselRef.current.querySelectorAll(".exco-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: carouselRef.current, start: "top 88%", once: true },
        },
      );
    }
  }, [members.length]);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const center = track.scrollLeft + track.clientWidth / 2;
    const slides = Array.from(track.querySelectorAll(".carousel-slide")) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    if (closest !== activeIndex) setActiveIndex(closest);
  };

  const goToSlide = (index: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slides = Array.from(track.querySelectorAll(".carousel-slide")) as HTMLElement[];
    const slide = slides[index];
    if (slide) {
      const offset = slide.offsetLeft - track.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  return (
    <section id="exco" className="py-16 md:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div ref={headerRef} className="max-w-3xl space-y-4 mb-10 md:mb-16 exco-header">
          <span className="text-sm font-bold tracking-wide text-[#6aabaf] uppercase block">Executive Committee</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800">
            The Team Behind the Research
          </h2>
          <p className="text-slate-600 text-base font-normal">
            Our student leadership coordinates field projects, manages the peer-review pipeline for our journal, and organizes society events across campus.
          </p>
        </div>

        {error && <ContentMessage message={error} variant="error" />}
        {!error && members.length === 0 && <ContentMessage message={EMPTY_MESSAGES.exco} />}

        {members.length > 0 && (
          <div ref={carouselRef} id="exco-carousel" className="relative -mx-4 sm:mx-0">
            <p className="text-xs text-slate-500 text-center mb-3 md:hidden">Swipe to meet the team</p>
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="carousel-track edge-fade flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 px-4 sm:px-1 scrollbar-hide snap-x snap-mandatory"
            >
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className="carousel-slide exco-card shrink-0 w-[min(85vw,320px)] sm:w-[55vw] lg:w-[calc(25%-1.125rem)] group border border-white/60 rounded-3xl p-6 bg-white/60 backdrop-blur-md text-center transition-[border-color,box-shadow,transform] duration-500 hover:border-[#B3DEE2] hover:shadow-xl"
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl font-display font-bold text-xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-105 ${member.colorClass ?? DEFAULT_COLOR} group-hover:rotate-2`}
                  >
                    {member.initials ?? member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">{member.name}</h4>
                  <p className="text-sm font-semibold text-[#6aabaf] mt-1 mb-3">{member.role}</p>
                  <p className="text-base text-slate-600 font-normal leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8" id="exco-dots">
              {members.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-[#6aabaf] w-6" : "bg-[#B3DEE2] w-2.5"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
