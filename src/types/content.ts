export type Asset = {
  id: number;
  object_key: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  category: string;
  url: string;
  created_at: string;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  repository_url?: string | null;
  live_url?: string | null;
  tags: string[];
  featured: boolean;
  assets: Asset[];
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Certification = {
  id: number;
  name: string;
  issuer: string;
  issued_at?: string | null;
  credential_url?: string | null;
  description?: string | null;
  assets: Asset[];
  created_at: string;
  updated_at: string;
};
