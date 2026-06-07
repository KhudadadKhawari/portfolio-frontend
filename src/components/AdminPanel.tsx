'use client';

import { LogIn, LogOut, Save, Upload } from 'lucide-react';
import { FormEvent, useState, useSyncExternalStore } from 'react';
import { ApiError, api } from '@/lib/api';

const adminTokenStorageKey = 'portfolio-admin-token';
const adminTokenChangedEvent = 'portfolio-admin-token-changed';

type AdminMessage = {
  type: 'success' | 'error';
  text: string;
};

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

function getStoredAdminToken() {
  if (globalThis.window === undefined) {
    return '';
  }

  return globalThis.localStorage.getItem(adminTokenStorageKey) || '';
}

function subscribeToAdminToken(onStoreChange: () => void) {
  if (globalThis.window === undefined) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === adminTokenStorageKey) {
      onStoreChange();
    }
  };

  globalThis.addEventListener('storage', handleStorage);
  globalThis.addEventListener(adminTokenChangedEvent, onStoreChange);

  return () => {
    globalThis.removeEventListener('storage', handleStorage);
    globalThis.removeEventListener(adminTokenChangedEvent, onStoreChange);
  };
}

function notifyAdminTokenChanged() {
  globalThis.dispatchEvent(new Event(adminTokenChangedEvent));
}

function storeAdminToken(token: string) {
  globalThis.localStorage.setItem(adminTokenStorageKey, token);
  notifyAdminTokenChanged();
}

function removeAdminToken() {
  globalThis.localStorage.removeItem(adminTokenStorageKey);
  notifyAdminTokenChanged();
}

function removeEmptyFormValues(form: FormData, names: string[]) {
  names.forEach((name) => {
    const value = form.get(name);
    if (typeof value === 'string' && value.trim() === '') {
      form.delete(name);
    }
  });
}

export function AdminPanel() {
  const token = useSyncExternalStore(subscribeToAdminToken, getStoredAdminToken, () => '');
  const [message, setMessage] = useState<AdminMessage | null>(null);

  function showSuccess(text: string) {
    setMessage({ type: 'success', text });
  }

  function showError(error: unknown, fallback: string) {
    if (error instanceof ApiError && error.status === 401) {
      removeAdminToken();
    }

    setMessage({ type: 'error', text: error instanceof Error ? error.message : fallback });
  }

  function handleLogout() {
    removeAdminToken();
    showSuccess('Signed out');
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = await api.login(field(form, 'username'), field(form, 'password'));
      storeAdminToken(result.access_token);
      showSuccess('Signed in');
    } catch (error) {
      showError(error, 'Sign in failed');
    }
  }

  async function handleProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    removeEmptyFormValues(form, ['project_id', 'certification_id']);

    try {
      await api.createProject(token, {
        title: field(form, 'title'),
        slug: field(form, 'slug'),
        summary: field(form, 'summary'),
        description: field(form, 'description'),
        tags: field(form, 'tags').split(',').map((tag) => tag.trim()).filter(Boolean),
        featured: form.get('featured') === 'on',
      });
      showSuccess('Project saved');
      formElement.reset();
    } catch (error) {
      showError(error, 'Project could not be saved');
    }
  }

  async function handlePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.createPost(token, {
        title: field(form, 'title'),
        slug: field(form, 'slug'),
        excerpt: field(form, 'excerpt'),
        content: field(form, 'content'),
        published: true,
      });
      showSuccess('Post saved');
      formElement.reset();
    } catch (error) {
      showError(error, 'Post could not be saved');
    }
  }

  async function handleCertification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.createCertification(token, {
        name: field(form, 'name'),
        issuer: field(form, 'issuer'),
        issued_at: field(form, 'issued_at'),
        credential_url: field(form, 'credential_url'),
        description: field(form, 'description'),
      });
      showSuccess('Certification saved');
      formElement.reset();
    } catch (error) {
      showError(error, 'Certification could not be saved');
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.upload(token, form);
      showSuccess('File uploaded');
      formElement.reset();
    } catch (error) {
      showError(error, 'File could not be uploaded');
    }
  }

  return (
    <div className="space-y-5">
      {message ? (
        <output
          className={`rounded px-4 py-3 text-sm font-medium text-white ${message.type === 'error' ? 'bg-coral' : 'bg-moss'}`}
        >
          {message.text}
        </output>
      ) : null}
      {token ? (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-ink"
              title="Sign out"
            >
              <LogOut size={18} /> Sign out
            </button>
          </div>
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
