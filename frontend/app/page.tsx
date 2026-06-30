import Hero from "@/components/home/Hero";
import Pillars from "@/components/home/Pillars";
import Exco from "@/components/home/Exco";
import EventsPreview from "@/components/home/EventsPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import Newsletter from "@/components/home/Newsletter";
import JoinForm from "@/components/home/JoinForm";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Pillars />
      <Exco />
      <EventsPreview />
      <ArticlesPreview />
      <Newsletter />
      <JoinForm />
    </div>
  );
}
