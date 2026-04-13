import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Clients from "./components/Clients";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Clients />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
