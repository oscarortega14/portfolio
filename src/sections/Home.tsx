import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Scene from '@/three/Scene';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

export default function Home() {
  return (
    <>
      <Scene />
      <Navigation />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
