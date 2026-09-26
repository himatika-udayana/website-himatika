"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  createRedirectLink,
  deleteRedirectLink,
  toggleActive,
  updateRedirectLink,
} from "@/src/lib/actions/admin/redirect-link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type RedirectLinkRow = {
  id: string;
  slug: string;
  targetUrl: string;
  label: string | null;
  isActive: boolean;
  createdAt: Date;
};

type LinkForm = {
  id: string | null;
  slug: string;
  targetUrl: string;
  label: string;
};

const emptyForm: LinkForm = { id: null, slug: "", targetUrl: "", label: "" };

export default function RedirectLinkManager({ links }: { links: RedirectLinkRow[] }) {
  const [form, setForm] = useState<LinkForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = form.id
        ? await updateRedirectLink(form.id, {
            slug: form.slug,
            targetUrl: form.targetUrl,
            label: form.label,
          })
        : await createRedirectLink(form.slug, form.targetUrl, form.label);
      setMessage(result.ok ? `Redirect link berhasil ${form.id ? "diperbarui" : "dibuat"}.` : result.error);
      if (result.ok) setForm(emptyForm);
    });
  }

  function removeLink(link: RedirectLinkRow) {
    if (!window.confirm(`Hapus redirect /${link.slug}?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteRedirectLink(link.id);
      setMessage(result.ok ? "Redirect link berhasil dihapus." : result.error);
      if (result.ok && form.id === link.id) setForm(emptyForm);
    });
  }

  function changeActive(linkId: string) {
    setMessage("");
    startTransition(async () => {
      const result = await toggleActive(linkId);
      setMessage(result.ok ? "Status redirect link berhasil diperbarui." : result.error);
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={saveLink} className="grid gap-4 border-y border-slate-200 py-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Slug
          <Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="PendaftaranAnggotaHimatika" pattern="[a-zA-Z0-9-]+" required maxLength={120} />
          <span className="block text-xs font-normal text-slate-500">URL pendek: /{form.slug || "slug"}</span>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Target URL
          <Input type="url" value={form.targetUrl} onChange={(event) => setForm({ ...form, targetUrl: event.target.value })} placeholder="https://forms.gle/..." required />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          Label admin <span className="font-normal text-slate-500">(opsional)</span>
          <Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Formulir Pendaftaran Anggota 2026" maxLength={200} />
        </label>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Redirect Link"}</Button>
          {form.id ? <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>Batal Edit</Button> : null}
        </div>
      </form>

      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}

      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Label</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((link) => (
              <tr key={link.id}>
                <td className="px-4 py-4 font-semibold text-slate-900">/{link.slug}</td>
                <td className="max-w-xs truncate px-4 py-4"><a href={link.targetUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline decoration-blue-200 underline-offset-2">{link.targetUrl}</a></td>
                <td className="px-4 py-4 text-slate-700">{link.label || "-"}</td>
                <td className="px-4 py-4"><span className={link.isActive ? "font-semibold text-emerald-700" : "text-slate-500"}>{link.isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => setForm({ id: link.id, slug: link.slug, targetUrl: link.targetUrl, label: link.label ?? "" })}>Edit</Button><Button type="button" variant="outline" disabled={isPending} onClick={() => changeActive(link.id)}>{link.isActive ? "Nonaktifkan" : "Aktifkan"}</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeLink(link)}>Hapus</Button></div></td>
              </tr>
            ))}
            {links.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Belum ada redirect link.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
