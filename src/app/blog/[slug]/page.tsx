import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';

export default async function BlogDetailPage({ params }: Readonly<{ params: { slug: string } }>) {
  const post = await api.post(params.slug).catch(() => null);
  if (!post) {
    notFound();
    return null;
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/blog" className="text-sm font-semibold text-coral underline">Back to blog</Link>
      <h1 className="mt-4 text-4xl font-bold text-ink">{post.title}</h1>
      <p className="mt-6 whitespace-pre-wrap text-lg leading-8 text-stone-700">{post.content}</p>
    </article>
  );
}
