import { lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CameraDebugOverlay from '@/three/dev/CameraDebugOverlay';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

const Scene = lazy(() => import('@/three/Scene'));

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Navigation />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
      <Preloader />
      <CameraDebugOverlay />
    </>
  );
}
