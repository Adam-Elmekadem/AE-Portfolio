import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects-data";
import ProjectDetail from "@/components/ui/ProjectDetail";

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project  = projects.find(p => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Adam Elmekadem`,
    description: project.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      url: `/work/${slug}`,
      title: `${project.title} | Adam Elmekadem`,
      description: project.description,
      images: [{ url: project.coverImage, width: 1200, height: 800, alt: project.title }],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project  = projects.find(p => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
