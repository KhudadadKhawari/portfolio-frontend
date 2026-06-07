export function SectionHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold uppercase tracking-normal text-coral">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-normal text-ink md:text-4xl">{title}</h1>
    </div>
  );
}
