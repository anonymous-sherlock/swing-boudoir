import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import CompetitionsSection from "@/components/CompetitionsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CompetitionsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
