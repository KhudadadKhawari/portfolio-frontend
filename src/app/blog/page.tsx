import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { api } from '@/lib/api';

export default async function BlogPage() {
  const posts = await api.posts().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <SectionHeader eyebrow="Notes" title="Blog" />
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">{post.title}</h2>
            <p className="mt-2 text-stone-700">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold text-coral underline">Read</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
