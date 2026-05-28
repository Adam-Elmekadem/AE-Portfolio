"use client";

import { useState } from "react";
import BurgerMenu from "@/components/ui/BurgerMenu";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Competences from "@/components/sections/Competences";
import SoftSkills from "@/components/sections/SoftSkills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Guestbook from "@/components/sections/Guestbook";
import Loader from "@/components/ui/Loader";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function HomeClient() {
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
          <SoftSkills />
          <Experience />
          <Guestbook />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
