"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, ActivitySquare, TreePine, Microscope, Globe2, ChevronRight } from "lucide-react";
import Image from "next/image";

const pillarsData = [
  {
    icon: User,
    title: "Human Health",
    desc: "Public health, safe food and water, sustainable cities, and tracking the spread of zoonotic diseases across communities.",
    initiative: "Ocean & Sky Initiative",
    color: "bg-[#B3DEE2]/50 text-[#6aabaf]",
    borderColor: "border-[#B3DEE2]/50 hover:shadow-[#B3DEE2]/30",
    bottomBorder: "border-[#B3DEE2]/60",
    textColor: "text-[#6aabaf]",
  },
  {
    icon: ActivitySquare,
    title: "Animal Health",
    desc: "Monitoring wildlife biodiversity, domestic livestock safety, antimicrobial resistance, and habitat preservation.",
    initiative: "Rainbow Yellow Scope",
    color: "bg-[#CCD5AE]/50 text-[#8a9478]",
    borderColor: "border-[#CCD5AE]/50 hover:shadow-[#CCD5AE]/30",
    bottomBorder: "border-[#CCD5AE]/60",
    textColor: "text-[#8a9478]",
  },
  {
    icon: TreePine,
    title: "Environmental Health",
    desc: "Combating deforestation, studying soil biomes, protecting climate integrity, and safeguarding plant and ecosystem wellbeing.",
    initiative: "Forest & Lime Focus",
    color: "bg-[#B3DEE2]/50 text-[#6aabaf]",
    borderColor: "border-[#B3DEE2]/50 hover:shadow-[#B3DEE2]/30",
    bottomBorder: "border-[#B3DEE2]/60",
    textColor: "text-[#6aabaf]",
  },
  {
    icon: Microscope,
    title: "Research & Data",
    desc: "Synthesizing global data points, supporting lab research, and publishing cross-disciplinary findings on global health.",
    initiative: "Data Syndicate",
    color: "bg-amber-100 text-amber-600",
    borderColor: "border-amber-200/50 hover:shadow-amber-200/30",
    bottomBorder: "border-amber-200/60",
    textColor: "text-amber-600",
  },
  {
    icon: Globe2,
    title: "Policy & Advocacy",
    desc: "Engaging with institutional leaders, advocating for eco-conscious legislation, and spreading public awareness.",
    initiative: "Global Action Plan",
    color: "bg-indigo-100 text-indigo-500",
    borderColor: "border-indigo-200/50 hover:shadow-indigo-200/30",
    bottomBorder: "border-indigo-200/60",
    textColor: "text-indigo-500",
  },
];

export default function Pillars() {
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            once: true,
          },
        }
      );
    }

    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll(".pillar-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    }
  }, []);

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

    if (closest !== activeIndex) {
      setActiveIndex(closest);
    }
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
    <section id="about" className="py-16 md:py-32 relative bg-transparent overflow-hidden">
      <div className="absolute bottom-0 right-0 md:right-10 w-[240px] sm:w-[320px] md:w-[480px] pointer-events-none mix-blend-multiply origin-bottom opacity-20 md:opacity-40 border-b-2 border-slate-200/50 pb-2">
        <Image src="/assets/one_health.png" alt="" width={480} height={480} className="w-full h-auto" aria-hidden="true" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div ref={headerRef} className="max-w-3xl space-y-4 mb-10 md:mb-16 pillars-header">
          <span className="text-sm font-bold tracking-wide text-[#8a9478] uppercase">Our Research Focus</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800">
            Understanding our radical interdependence
          </h2>
          <p className="text-slate-600 text-base font-normal">
            Our student publishing and field projects are categorized into these core areas, helping us track how human, animal, and environmental wellbeing are linked.
          </p>
        </div>

        <div ref={carouselRef} id="pillars-carousel" className="relative -mx-4 sm:mx-0">
          <p className="text-xs text-slate-500 text-center mb-3 md:hidden">Swipe to explore pillars</p>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="carousel-track edge-fade flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 px-4 sm:px-1 scrollbar-hide snap-x snap-mandatory"
          >
            {pillarsData.map((pillar, i) => (
              <div
                key={i}
                className={`carousel-slide pillar-card shrink-0 w-[min(88vw,340px)] sm:w-[70vw] lg:w-[calc(33.333%-1rem)] bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-[24px] md:rounded-[32px] border shadow-sm group hover:shadow-2xl transition-[border-color,box-shadow,transform] duration-500 flex flex-col justify-between min-h-[280px] md:min-h-[350px] ${pillar.borderColor}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 ${pillar.color}`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-4">{pillar.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed font-normal">{pillar.desc}</p>
                </div>
                <div className={`pt-6 flex justify-between items-center text-sm font-semibold border-t mt-6 ${pillar.bottomBorder} ${pillar.textColor}`}>
                  <span>{pillar.initiative}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8" id="pillars-dots">
            {pillarsData.map((_, i) => (
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
      </div>
    </section>
  );
}
