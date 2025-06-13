// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoEdukasiSection from "../components/InfoEdukasiSection";
import TentangKamiSection from "../components/TentangKamiSection";
import TerbaruSection from "../components/TerbaruSection";
import TopMovementSection from "../components/TopMovementSection";
import AnimatedSection from "../components/AnimatedSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20 space-y-16">
        <AnimatedSection delay={0}>
          <HeroSection />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <TerbaruSection />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <TopMovementSection />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <InfoEdukasiSection />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <TentangKamiSection />
        </AnimatedSection>
      </div>
      <Footer />
    </>
  );
};

export default Home;
