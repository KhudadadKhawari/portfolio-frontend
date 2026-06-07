import { SectionHeader } from '@/components/SectionHeader';
import { api } from '@/lib/api';

export default async function CertificationsPage() {
  const certifications = await api.certifications().catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <SectionHeader eyebrow="Credentials" title="Certifications" />
      <div className="grid gap-4 md:grid-cols-2">
        {certifications.map((certification) => (
          <article key={certification.id} className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">{certification.name}</h2>
            <p className="mt-1 text-sm font-medium text-steel">{certification.issuer}</p>
            {certification.description ? <p className="mt-3 text-stone-700">{certification.description}</p> : null}
            {certification.credential_url ? (
              <a href={certification.credential_url} className="mt-3 inline-block text-sm font-semibold text-coral underline">Credential</a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
