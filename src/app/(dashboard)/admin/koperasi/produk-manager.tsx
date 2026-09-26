"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createProduk, deleteProduk, toggleStatus, updateProduk, type ProdukAdminRow, type ProdukInputData, type ProdukStatus } from "@/src/lib/actions/admin/koperasi-produk";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const emptyForm: ProdukInputData = {
  namaProduk: "",
  deskripsi: "",
  harga: "",
  imageUrl: "",
  status: "TERSEDIA",
  linkGformPesan: "",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

export default function ProdukManager({ products }: { products: ProdukAdminRow[] }) {
  const [form, setForm] = useState<ProdukInputData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = editingId
        ? await updateProduk(editingId, form)
        : await createProduk(form);
      setMessage(result.ok ? `Produk berhasil ${editingId ? "diperbarui" : "ditambahkan"}.` : result.error);
      if (result.ok) {
        setForm(emptyForm);
        setEditingId(null);
      }
    });
  }

  function editProduct(product: ProdukAdminRow) {
    setEditingId(product.id);
    setForm({
      namaProduk: product.namaProduk,
      deskripsi: product.deskripsi ?? "",
      harga: product.harga,
      imageUrl: product.imageUrl ?? "",
      status: product.status,
      linkGformPesan: product.linkGformPesan ?? "",
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function removeProduct(product: ProdukAdminRow) {
    if (!window.confirm(`Hapus produk “${product.namaProduk}”?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteProduk(product.id);
      setMessage(result.ok ? "Produk berhasil dihapus." : result.error);
      if (result.ok && editingId === product.id) cancelEdit();
    });
  }

  function changeStatus(productId: string) {
    setMessage("");
    startTransition(async () => {
      const result = await toggleStatus(productId);
      setMessage(result.ok ? "Status produk berhasil diperbarui." : result.error);
    });
  }

  function updateForm<K extends keyof ProdukInputData>(key: K, value: ProdukInputData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-6 space-y-7">
      <form onSubmit={saveProduct} className="grid gap-4 border-y border-slate-200 py-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Nama produk
          <Input value={form.namaProduk} onChange={(event) => updateForm("namaProduk", event.target.value)} required maxLength={200} />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Harga (Rp)
          <Input type="number" min="0" step="0.01" value={form.harga} onChange={(event) => updateForm("harga", event.target.value)} required />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          Deskripsi <span className="font-normal text-slate-500">(opsional)</span>
          <textarea value={form.deskripsi} onChange={(event) => updateForm("deskripsi", event.target.value)} rows={3} maxLength={10000} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          URL gambar <span className="font-normal text-slate-500">(opsional)</span>
          <Input type="url" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.target.value)} placeholder="https://..." />
          <span className="block text-xs font-normal text-slate-500">Masukkan URL gambar yang sudah tersedia; upload file belum disiapkan.</span>
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Link pemesanan Google Form <span className="font-normal text-slate-500">(opsional)</span>
          <Input type="url" value={form.linkGformPesan} onChange={(event) => updateForm("linkGformPesan", event.target.value)} placeholder="https://forms.gle/..." />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Status produk
          <select value={form.status} onChange={(event) => updateForm("status", event.target.value as ProdukStatus)} className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm">
            <option value="TERSEDIA">Tersedia</option>
            <option value="HABIS">Habis</option>
          </select>
        </label>
        <div className="flex gap-2 self-end">
          <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}</Button>
          {editingId ? <Button type="button" variant="outline" onClick={cancelEdit}>Batal Edit</Button> : null}
        </div>
      </form>

      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}

      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Pemesanan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-4"><div className="flex items-center gap-3">{product.imageUrl ? <img src={product.imageUrl} alt="" className="h-12 w-12 rounded-lg border border-slate-200 object-cover" /> : <span className="h-12 w-12 rounded-lg border border-dashed border-slate-300 bg-slate-50" />}<div><p className="font-semibold text-slate-900">{product.namaProduk}</p><p className="mt-1 max-w-sm text-xs text-slate-500">{product.deskripsi || "Tanpa deskripsi"}</p></div></div></td>
                <td className="px-4 py-4 font-medium text-slate-800">{rupiah.format(Number(product.harga))}</td>
                <td className="max-w-xs truncate px-4 py-4">{product.linkGformPesan ? <a href={product.linkGformPesan} target="_blank" rel="noreferrer" className="text-blue-700 underline decoration-blue-200 underline-offset-2">Buka form</a> : <span className="text-slate-400">-</span>}</td>
                <td className="px-4 py-4"><span className={product.status === "TERSEDIA" ? "font-semibold text-emerald-700" : "font-semibold text-slate-500"}>{product.status === "TERSEDIA" ? "Tersedia" : "Habis"}</span></td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => editProduct(product)}>Edit</Button><Button type="button" variant="outline" disabled={isPending} onClick={() => changeStatus(product.id)}>{product.status === "TERSEDIA" ? "Tandai Habis" : "Tandai Tersedia"}</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeProduct(product)}>Hapus</Button></div></td>
              </tr>
            ))}
            {products.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Belum ada produk koperasi.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
