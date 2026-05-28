import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { galleryItems } from "@/lib/gallery-data";
import GalleryDetail from "@/components/ui/svg-scroll-stroke";

/* Required for static export — pre-renders all gallery detail pages */
export function generateStaticParams() {
  return galleryItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = galleryItems.find((g) => g.id === id);
  if (!item) return {};

  return {
    title: item.title,
    description: item.story.lead,
    alternates: { canonical: `/gallery/${id}` },
    openGraph: {
      url: `/gallery/${id}`,
      title: `${item.title} | Adam Elmekadem`,
      description: item.story.lead,
      images: [{ url: item.imageUrl, width: 1200, height: 630, alt: item.title }],
    },
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = galleryItems.find((g) => g.id === id);

  if (!item) notFound();

  return <GalleryDetail item={item} />;
}
