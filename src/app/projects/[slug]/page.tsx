import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';

export default async function ProjectDetailPage({ params }: Readonly<{ params: { slug: string } }>) {
  const project = await api.project(params.slug).catch(() => null);
  if (!project) {
    notFound();
    return null;
  }

  return (
    <article className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/projects" className="text-sm font-semibold text-coral underline">Back to projects</Link>
      <h1 className="mt-4 text-4xl font-bold text-ink">{project.title}</h1>
      <p className="mt-4 text-lg leading-8 text-stone-700">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => <span key={tag} className="rounded bg-white px-2 py-1 text-sm text-moss">{tag}</span>)}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {project.assets.map((asset) => asset.content_type.startsWith('image/') ? (
          <div key={asset.id} className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={asset.url} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        ) : null)}
      </div>
    </article>
  );
}
