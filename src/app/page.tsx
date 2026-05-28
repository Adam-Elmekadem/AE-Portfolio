"use client";

import { useState } from "react";
import BurgerMenu from "@/components/ui/BurgerMenu";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Competences from "@/components/sections/Competences";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Loader from "@/components/ui/Loader";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <BurgerMenu />
      <SmoothScroll>
        <main>
          <Hero />
          <Work />
          <About />
          <Competences />
          <Experience />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
