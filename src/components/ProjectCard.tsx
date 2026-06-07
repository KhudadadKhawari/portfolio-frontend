import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/content';

export function ProjectCard({ project }: Readonly<{ project: Project }>) {
  const firstImage = project.assets?.find((asset) => asset.content_type.startsWith('image/'));

  return (
    <article className="rounded-lg border border-stone-300 bg-white p-4 shadow-sm">
      {firstImage ? (
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded">
          <Image src={firstImage.url} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : (
        <div className="mb-4 grid aspect-video w-full place-items-center rounded bg-steel text-sm font-semibold text-white">
          Project
        </div>
      )}
      <h2 className="text-lg font-semibold text-ink">{project.title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">{project.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded border border-moss/30 px-2 py-1 text-xs text-moss">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className="mt-4 inline-block text-sm font-semibold text-coral underline">
        View project
      </Link>
    </article>
  );
}
