export interface StorySection {
  heading: string;
  body: string;
  imageUrl: string;
}

export interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  reverse: boolean;
  tags: string[];
  year: string;
  story: {
    lead: string;
    sections: StorySection[];
    tools: string[];
  };
}

export const galleryItems: GalleryItemData[] = [
  {
    id: "web-design",
    title: "WEB DESIGN",
    category: "Visual / Interface",
    description:
      "Crafting layouts that communicate clearly — every pixel placed with intent, balancing aesthetics with usability.",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
    reverse: false,
    tags: ["Figma", "UI", "Typography"],
    year: "2024",
    story: {
      lead: "Design is not decoration. It is the architecture of clarity.",
      sections: [
        {
          heading: "THE PROCESS",
          body: "Every project starts with understanding — who uses it, what they need, and what feeling the interface should evoke. Wireframes come first, always. Structure before style. The grid is the foundation everything else is built upon.",
          imageUrl:
            "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "TYPOGRAPHY",
          body: "Type carries the voice of the product. Choosing the right weight, tracking, and rhythm is as important as choosing the right words. I work with type systems that scale — from headline to caption, staying consistent and readable at every size.",
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "COMPONENTS",
          body: "A design system is a living document. Buttons, inputs, cards, modals — each component designed once and reused everywhere, ensuring coherence across every screen of the product.",
          imageUrl:
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=700&q=80&auto=format&fit=crop",
        },
      ],
      tools: ["Figma", "Adobe XD", "Framer", "Storybook"],
    },
  },
  {
    id: "front-end",
    title: "FRONT END",
    category: "Code / Motion",
    description:
      "Building interfaces that move. React, GSAP, and Three.js combined to create experiences that feel alive.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&auto=format&fit=crop",
    reverse: true,
    tags: ["React", "GSAP", "Three.js"],
    year: "2024",
    story: {
      lead: "Code is the medium. Motion is the message.",
      sections: [
        {
          heading: "ANIMATION SYSTEMS",
          body: "GSAP's ScrollTrigger transforms passive pages into active journeys. Every entrance, every transition, every state change is choreographed — not decorative, but purposeful. Motion guides the eye and communicates meaning without a single word.",
          imageUrl:
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "3D IN THE BROWSER",
          body: "React Three Fiber brings WebGL into the component model. Shader materials, instanced meshes, post-processing effects — all composable, all reactive to state. The browser becomes a 3D viewport.",
          imageUrl:
            "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "PERFORMANCE",
          body: "Beautiful is useless if it's slow. Every animation runs on the GPU. Every asset is optimised. Every bundle is split. The goal is 60fps on every device — the animation should feel instant, the page should load faster than the eye can track.",
          imageUrl:
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=700&q=80&auto=format&fit=crop",
        },
      ],
      tools: ["React", "Next.js", "GSAP", "Three.js", "Framer Motion", "TypeScript"],
    },
  },
  {
    id: "branding",
    title: "BRANDING",
    category: "Identity / Print",
    description:
      "Visual identities built from the ground up — logos, palettes, and systems that leave a lasting impression.",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop",
    reverse: false,
    tags: ["Identity", "Color", "Systems"],
    year: "2023",
    story: {
      lead: "A brand is a promise made visible.",
      sections: [
        {
          heading: "IDENTITY FIRST",
          body: "Before any logo is drawn, the brand's character must be defined. What does it stand for? Who does it speak to? What emotions should it evoke? The mark comes last — after the strategy is airtight. A great logo is the symptom of a clear brand, not the cause.",
          imageUrl:
            "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "COLOR & TEXTURE",
          body: "Color does more than look good. It signals. A palette of two carries more authority than a palette of eight. Texture adds tactility to the digital — a grain, a noise layer, a subtle gradient that makes the screen feel physical.",
          imageUrl:
            "https://images.unsplash.com/photo-1571079570759-8b8e9d10edf4?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "BRAND SYSTEMS",
          body: "The logo is only 10% of the brand. The other 90% is how everything else behaves — the typography choices, the image style, the tone of voice, the spacing system. A strong brand system means anyone on the team can design on-brand.",
          imageUrl:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80&auto=format&fit=crop",
        },
      ],
      tools: ["Illustrator", "Figma", "Photoshop", "After Effects"],
    },
  },
  {
    id: "full-stack",
    title: "FULL STACK",
    category: "Back End / APIs",
    description:
      "From database schema to REST API to polished UI — complete products built with Laravel, Node.js, and MySQL.",
    imageUrl:
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=600&q=80&auto=format&fit=crop",
    reverse: true,
    tags: ["Laravel", "Node.js", "MySQL"],
    year: "2024",
    story: {
      lead: "Great products are built end to end, not stitched together.",
      sections: [
        {
          heading: "ARCHITECTURE",
          body: "A well-designed database schema is the foundation of a maintainable application. Normalisation, indexing, foreign key constraints — these decisions made early prevent entire categories of bugs later. I design schemas that evolve gracefully as requirements change.",
          imageUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "API DESIGN",
          body: "A REST API is a product with developers as its users. Clear naming, consistent responses, proper status codes, and comprehensive error messages make the difference between an API that developers love and one they tolerate. Documentation is not optional.",
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=700&q=80&auto=format&fit=crop",
        },
        {
          heading: "DEPLOYMENT",
          body: "Code that runs on localhost is not a product. CI/CD pipelines, environment configuration, zero-downtime deployments, and monitoring transform a project into a service. Infrastructure as code means the environment is reproducible and auditable.",
          imageUrl:
            "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=700&q=80&auto=format&fit=crop",
        },
      ],
      tools: ["Laravel", "Node.js", "MySQL", "Docker", "Git", "Vercel"],
    },
  },
];
