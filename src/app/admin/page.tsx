import { AdminPanel } from '@/components/AdminPanel';
import { SectionHeader } from '@/components/SectionHeader';

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <SectionHeader eyebrow="Content" title="Admin" />
      <AdminPanel />
    </div>
  );
}
