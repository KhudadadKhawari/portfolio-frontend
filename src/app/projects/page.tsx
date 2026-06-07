import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeader } from '@/components/SectionHeader';
import { api } from '@/lib/api';

export default async function ProjectsPage() {
  const projects = await api.projects().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <SectionHeader eyebrow="Work" title="Projects" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  );
}
