import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import UseCases from "./components/UseCases";
import Clients from "./components/Clients";
import Pricing from "./components/Pricing";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Services />
      <UseCases />
      <Clients />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
