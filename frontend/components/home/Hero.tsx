"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Microscope, BookOpen, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const getHeroScrollEnd = () => (mobileQuery.matches ? "+=160%" : "+=200%");

    let heroTimeline: gsap.core.Timeline;
    let heroScrollTrigger: ScrollTrigger;

    const buildHeroTimeline = () => {
      if (heroScrollTrigger) heroScrollTrigger.kill();
      if (heroTimeline) heroTimeline.kill();

      gsap.set(stage1Ref.current, { clearProps: "all" });
      gsap.set(stage2Ref.current, { opacity: 0, scale: 0.95 });
      gsap.set(stage3Ref.current, { opacity: 0, scale: 0.95 });

      heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: getHeroScrollEnd(),
          scrub: 1,
          pin: pinWrapperRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      heroScrollTrigger = heroTimeline.scrollTrigger!;

      heroTimeline
        .to(stage1Ref.current, { opacity: 0, scale: 0.92, y: -40, duration: 1 })
        .to(stage2Ref.current, { opacity: 1, scale: 1, duration: 1 }, "-=0.4")
        .to(stage2Ref.current, { opacity: 1, duration: 0.8 })
        .to(stage2Ref.current, { opacity: 0, scale: 1.03, y: -24, duration: 1 })
        .to(stage3Ref.current, { opacity: 1, scale: 1, duration: 1 }, "-=0.4")
        .to(stage3Ref.current, { opacity: 1, scale: 1, duration: 0.6 });
    };

    buildHeroTimeline();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildHeroTimeline();
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    mobileQuery.addEventListener("change", buildHeroTimeline);

    return () => {
      window.removeEventListener("resize", handleResize);
      mobileQuery.removeEventListener("change", buildHeroTimeline);
      if (heroScrollTrigger) heroScrollTrigger.kill();
      if (heroTimeline) heroTimeline.kill();
    };
  }, []);

  return (
    <section ref={triggerRef} id="hero-trigger-context" className="relative bg-transparent w-full">
      <div
        ref={pinWrapperRef}
        id="hero-pin-wrapper"
        className="relative w-full h-[100dvh] min-h-[600px] md:min-h-0 md:h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Blurry Globe Background */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40 pointer-events-none mix-blend-multiply transition-transform duration-1000 scale-110">
          <Image
            src="/assets/globe_illustration.png"
            alt=""
            width={550}
            height={550}
            className="w-[88vw] sm:w-[66vw] md:w-[55vw] max-w-[550px] object-contain opacity-40"
          />
        </div>

        <div
          ref={stage1Ref}
          id="hero-stage-1"
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-5 md:space-y-8 z-30 pt-16 md:pt-0"
        >
          <span className="inline-flex items-center gap-2 bg-[#CCD5AE]/50 backdrop-blur-md border border-[#CCD5AE] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 shadow-sm max-w-[95vw]">
            <span className="w-2 h-2 shrink-0 rounded-full bg-[#6aabaf] animate-ping"></span>
            <span className="text-left sm:text-center">A Student Society for Environmental Inquiry</span>
          </span>
          <h1 className="text-[2rem] leading-tight sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-800">
            Student-led research for<br />
            <span className="gradient-text">ecosystem health.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed px-1">
            We are a collaborative student society dedicated to the One Health approach. Join us to conduct field projects, peer-review findings, and publish research that explores the deep connection between people, animals, and the environment.
          </p>
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" })}
            className="mt-8 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-[#6aabaf] transition-colors">
              Scroll
            </span>
            <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-[#6aabaf] group-hover:bg-[#B3DEE2]/20 transition-all">
              <ArrowDown className="w-4 h-4 animate-bounce group-hover:text-[#6aabaf] transition-colors" />
            </div>
          </button>
        </div>

        <div
          ref={stage2Ref}
          id="hero-stage-2"
          className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 scale-95 px-4 sm:px-6 pt-16 md:pt-0 overflow-y-auto md:overflow-visible"
        >
          <div className="w-full max-w-4xl bg-white/60 backdrop-blur-xl border border-white p-5 sm:p-8 rounded-3xl md:rounded-[40px] shadow-2xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center relative my-auto">
            <div className="md:col-span-7 space-y-3 md:space-y-4 text-left">
              <span className="text-sm font-semibold text-[#6aabaf]">Our Academic Focus</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                Interdisciplinary Research
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                We bring together students from epidemiology, ecology, and veterinary disciplines. Through our student-led initiatives, we turn academic curiosity into published findings and actionable environmental science.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  <Microscope className="w-4 h-4 text-[#8a9478]" /> Empirical Studies
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-[#6aabaf]" /> Student Publications
                </span>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-[#CCD5AE] via-[#B3DEE2] to-[#CCD5AE] relative p-1 flex items-center justify-center animate-spin"
                style={{ animationDuration: "25s" }}
              >
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-slate-700">
                  <HeartPulse className="w-10 h-10 md:w-12 md:h-12 text-[#6aabaf]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={stage3Ref}
          id="hero-stage-3"
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-4 md:space-y-6 z-10 opacity-0 scale-95 pt-16 md:pt-0"
        >
          <span className="text-sm font-semibold text-[#6aabaf]">Our Scholarly Focus</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight px-1">
            Building a portfolio of scientific inquiry and publishing.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal max-w-xl mx-auto px-1">
            Contribute to our peer-reviewed student journal, collaborate on longitudinal field studies, and engage in research methodologies alongside peers and faculty advisors.
          </p>
          <Link
            href="/about"
            className="bg-[#6aabaf] text-white font-semibold text-sm px-6 md:px-8 py-3.5 md:py-4 rounded-full shadow-xl shadow-[#B3DEE2]/40 inline-block transition-transform hover:scale-105"
          >
            Examine Our Research Pillars
          </Link>
        </div>
      </div>
    </section>
  );
}
