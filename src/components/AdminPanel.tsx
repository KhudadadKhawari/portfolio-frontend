'use client';

import { LogIn, Save, Upload } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

export function AdminPanel() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await api.login(field(form, 'username'), field(form, 'password'));
    setToken(result.access_token);
    setMessage('Signed in');
  }

  async function handleProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.createProject(token, {
      title: field(form, 'title'),
      slug: field(form, 'slug'),
      summary: field(form, 'summary'),
      description: field(form, 'description'),
      tags: field(form, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
      featured: form.get('featured') === 'on',
    });
    setMessage('Project saved');
    event.currentTarget.reset();
  }

  async function handlePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.createPost(token, {
      title: field(form, 'title'),
      slug: field(form, 'slug'),
      excerpt: field(form, 'excerpt'),
      content: field(form, 'content'),
      published: true,
    });
    setMessage('Post saved');
    event.currentTarget.reset();
  }

  async function handleCertification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.createCertification(token, {
      name: field(form, 'name'),
      issuer: field(form, 'issuer'),
      issued_at: field(form, 'issued_at'),
      credential_url: field(form, 'credential_url'),
      description: field(form, 'description'),
    });
    setMessage('Certification saved');
    event.currentTarget.reset();
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api.upload(token, form);
    setMessage('File uploaded');
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-5">
      {message ? <div className="rounded bg-moss px-4 py-3 text-sm font-medium text-white">{message}</div> : null}
      {token ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <form onSubmit={handleProject} className="grid gap-3 rounded-lg border border-stone-300 bg-white p-4">
            <h2 className="text-lg font-semibold">Project</h2>
            <input name="title" placeholder="Title" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="slug" placeholder="slug" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="summary" placeholder="Summary" className="rounded border border-stone-300 px-3 py-2" required />
            <textarea name="description" placeholder="Description" className="min-h-28 rounded border border-stone-300 px-3 py-2" required />
            <input name="tags" placeholder="FastAPI, Docker, GitHub Actions" className="rounded border border-stone-300 px-3 py-2" />
            <label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" /> Featured</label>
            <button className="inline-flex w-fit items-center gap-2 rounded bg-moss px-4 py-2 text-white" title="Save project">
              <Save size={18} /> Save
            </button>
          </form>

          <form onSubmit={handlePost} className="grid gap-3 rounded-lg border border-stone-300 bg-white p-4">
            <h2 className="text-lg font-semibold">Blog Post</h2>
            <input name="title" placeholder="Title" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="slug" placeholder="slug" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="excerpt" placeholder="Excerpt" className="rounded border border-stone-300 px-3 py-2" required />
            <textarea name="content" placeholder="Content" className="min-h-32 rounded border border-stone-300 px-3 py-2" required />
            <button className="inline-flex w-fit items-center gap-2 rounded bg-moss px-4 py-2 text-white" title="Save post">
              <Save size={18} /> Save
            </button>
          </form>

          <form onSubmit={handleCertification} className="grid gap-3 rounded-lg border border-stone-300 bg-white p-4">
            <h2 className="text-lg font-semibold">Certification</h2>
            <input name="name" placeholder="Name" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="issuer" placeholder="Issuer" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="issued_at" placeholder="2026-06" className="rounded border border-stone-300 px-3 py-2" />
            <input name="credential_url" placeholder="Credential URL" className="rounded border border-stone-300 px-3 py-2" />
            <textarea name="description" placeholder="Description" className="min-h-24 rounded border border-stone-300 px-3 py-2" />
            <button className="inline-flex w-fit items-center gap-2 rounded bg-moss px-4 py-2 text-white" title="Save certification">
              <Save size={18} /> Save
            </button>
          </form>

          <form onSubmit={handleUpload} className="grid gap-3 rounded-lg border border-stone-300 bg-white p-4">
            <h2 className="text-lg font-semibold">Upload</h2>
            <input name="category" placeholder="project-screenshot" className="rounded border border-stone-300 px-3 py-2" required />
            <input name="project_id" placeholder="Project ID" className="rounded border border-stone-300 px-3 py-2" />
            <input name="certification_id" placeholder="Certification ID" className="rounded border border-stone-300 px-3 py-2" />
            <input name="file" type="file" className="rounded border border-stone-300 px-3 py-2" required />
            <button className="inline-flex w-fit items-center gap-2 rounded bg-coral px-4 py-2 text-white" title="Upload file">
              <Upload size={18} /> Upload
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="grid gap-3 rounded-lg border border-stone-300 bg-white p-4">
          <input name="username" placeholder="Username" className="rounded border border-stone-300 px-3 py-2" required />
          <input name="password" placeholder="Password" type="password" className="rounded border border-stone-300 px-3 py-2" required />
          <button className="inline-flex w-fit items-center gap-2 rounded bg-steel px-4 py-2 text-white" title="Sign in">
            <LogIn size={18} /> Sign in
          </button>
        </form>
      )}
    </div>
  );
}
