// src/pages/Home.jsximport Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoEdukasiSection from "../components/InfoEdukasiSection";
import Navbar from "../components/Navbar";
import TentangKamiSection from "../components/TentangKamiSection";
import TerbaruSection from "../components/TerbaruSection";
import TopMovementSection from "../components/TopMovementSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <HeroSection />
        <TerbaruSection />
        <TopMovementSection />
        <InfoEdukasiSection />
        <TentangKamiSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;
