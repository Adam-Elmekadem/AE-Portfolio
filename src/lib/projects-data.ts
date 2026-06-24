import projectsJson from "@/data/projects.json";

export interface Collaborator {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  color: string;
  accentColor: string;
  live?: string;
  images: string[];
  coverImage: string;
  story: {
    headline: string;
    paragraphs: string[];
  };
  whyBuilt: {
    headline: string;
    paragraphs: string[];
  };
  collaborators: Collaborator[];
}

export const projects = projectsJson as Project[];
