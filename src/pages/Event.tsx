import Header from "@/components/Header";
import EventSection from "@/components/EventSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Event = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EventSection />
      </main>
      <Footer />
    </div>
  );
};

export default Event;

