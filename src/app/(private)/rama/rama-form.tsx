"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitAspirasi, type RamaActionResult } from "@/src/lib/actions/rama";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

type Category = {
  id: string;
  urutan: number;
  namaKategori: string;
  deskripsi: string | null;
};

export default function RamaForm({
  semesterId,
  categories,
}: {
  semesterId: string;
  categories: Category[];
}) {
  const [answers, setAnswers] = useState(
    categories.map((category) => ({
      kategoriId: category.id,
      kepuasan: 0,
      isiAspirasi: "",
    })),
  );
  const router = useRouter();
  const [result, setResult] = useState<RamaActionResult | null>(null);
  const [pending, setPending] = useState(false);

  function updateAnswer(
    index: number,
    patch: Partial<(typeof answers)[number]>,
  ) {
    setAnswers((current) =>
      current.map((answer, answerIndex) =>
        answerIndex === index ? { ...answer, ...patch } : answer,
      ),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);

    const nextResult = await submitAspirasi({ semesterId, answers });
    setResult(nextResult);
    setPending(false);

    if (nextResult.ok) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {categories.map((category, index) => {
        const answer = answers[index];

        return (
          <fieldset
            key={category.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
          >
            <legend className="font-semibold text-slate-900">
              {category.urutan ?? index + 1}. {category.namaKategori}
            </legend>
            {category.deskripsi ? (
              <p className="mt-2 text-sm text-slate-600">
                {category.deskripsi}
              </p>
            ) : null}
            <label className="mt-5 block text-sm font-medium text-slate-700">
              Tingkat kepuasan
              <select
                value={answer.kepuasan || ""}
                onChange={(event) =>
                  updateAnswer(index, { kepuasan: Number(event.target.value) })
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Pilih nilai
                </option>
                <option value="1">1 · Sangat Tidak Puas</option>
                <option value="2">2 · Tidak Puas</option>
                <option value="3">3 · Cukup</option>
                <option value="4">4 · Puas</option>
                <option value="5">5 · Sangat Puas</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Isi aspirasi
              <Textarea
                value={answer.isiAspirasi}
                onChange={(event) =>
                  updateAnswer(index, { isiAspirasi: event.target.value })
                }
                required
                rows={4}
                placeholder="Tuliskan masukan atau aspirasi Anda..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </fieldset>
        );
      })}

      {result && !result.ok ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {result.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full rounded-xl">
        {pending ? "Menyimpan..." : "Kirim aspirasi →"}
      </Button>
    </form>
  );
}
