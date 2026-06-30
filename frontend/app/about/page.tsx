import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full pt-28 md:pt-40 pb-16 md:pb-24 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-12 md:space-y-16 relative">
      <div className="absolute bottom-0 right-0 md:right-10 w-[240px] sm:w-[320px] md:w-[480px] pointer-events-none mix-blend-multiply origin-bottom opacity-20 md:opacity-40 border-b-2 border-slate-200/50 pb-2 z-0">
        <Image src="/assets/one_health.png" alt="" width={480} height={480} className="w-full h-auto" aria-hidden="true" />
      </div>
      <div className="relative z-10 space-y-4">
        <span className="text-sm font-semibold tracking-wide text-[#6aabaf] block">Institutional Overview</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800">
          Bridging the gap between distinct academic disciplines.
        </h1>
        <p className="text-slate-600 text-base font-normal max-w-3xl leading-relaxed">
          Founded by students committed to the principle that human wellbeing is inextricably linked to planetary health, our society integrates research from medicine, veterinary science, ecology, and public health into a unified framework.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 relative z-10">
        <div className="bg-white/60 backdrop-blur-md p-8 border border-slate-100 rounded-[24px]">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Guided by Global Frameworks</h3>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Our methodological approach and student publishing criteria align strictly with contemporary guidelines established by the World Health Organization (WHO) and the Food and Agriculture Organization (FAO).
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-md p-8 border border-slate-100 rounded-[24px]">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Research Accessibility</h3>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Whether analyzing genomic data in the lab, sampling ecosystems in the field, or modeling public health policy, we facilitate cross-disciplinary mentorship to advance undergraduate and graduate research output.
          </p>
        </div>
      </div>
    </div>
  );
}
