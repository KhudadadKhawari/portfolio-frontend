import Link from 'next/link';
import { api } from '@/lib/api';
import { ProjectCard } from '@/components/ProjectCard';

export default async function HomePage() {
  const [projects, posts, certifications] = await Promise.all([
    api.projects().catch(() => []),
    api.posts().catch(() => []),
    api.certifications().catch(() => []),
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-coral">Portfolio</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-normal text-ink md:text-5xl">
            Dynamic DevOps portfolio for real CI/CD demos
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-700">
            Projects, posts, certificates, image uploads, container builds, Docker Hub publishing, and single-VPS deployment in one compact teaching app.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded bg-steel px-4 py-2 font-semibold text-white">Projects</Link>
            <Link href="/admin" className="rounded border border-coral px-4 py-2 font-semibold text-coral">Admin</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-lg border border-stone-300 bg-white p-4 shadow-sm">
          <Stat label="Projects" value={projects.length} />
          <Stat label="Posts" value={posts.length} />
          <Stat label="Certs" value={certifications.length} />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-ink">Featured Projects</h2>
          <Link href="/projects" className="text-sm font-semibold text-coral underline">All projects</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {(featured.length ? featured : projects.slice(0, 3)).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded border border-stone-200 p-4 text-center">
      <div className="text-3xl font-bold text-steel">{value}</div>
      <div className="mt-1 text-sm text-stone-600">{label}</div>
    </div>
  );
}
