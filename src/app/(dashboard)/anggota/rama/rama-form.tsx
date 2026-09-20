"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitAspirasi, type RamaActionResult } from "@/src/lib/actions/rama";

type Category = {
  id: string;
  urutan: number;
  namaKategori: string;
  deskripsi: string | null;
};

export default function RamaForm({ semesterId, categories }: { semesterId: string; categories: Category[] }) {
  const [answers, setAnswers] = useState(
    categories.map((category) => ({ kategoriId: category.id, kepuasan: 0, isiAspirasi: "" }))
  );
  const router = useRouter();
  const [result, setResult] = useState<RamaActionResult | null>(null);
  const [pending, setPending] = useState(false);

  function updateAnswer(index: number, patch: Partial<(typeof answers)[number]>) {
    setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? { ...answer, ...patch } : answer));
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
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
      {categories.map((category, index) => {
        const answer = answers[index];

        return (
          <fieldset key={category.id} style={{ display: "grid", gap: 12, padding: 16 }}>
            <legend>{category.urutan ?? index + 1}. {category.namaKategori}</legend>
            {category.deskripsi ? <p>{category.deskripsi}</p> : null}
            <label>
              Kepuasan
              <select
                value={answer.kepuasan || ""}
                onChange={(event) => updateAnswer(index, { kepuasan: Number(event.target.value) })}
                required
              >
                <option value="" disabled>Pilih nilai</option>
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Isi aspirasi
              <textarea
                value={answer.isiAspirasi}
                onChange={(event) => updateAnswer(index, { isiAspirasi: event.target.value })}
                required
                rows={4}
              />
            </label>
          </fieldset>
        );
      })}

      {result && !result.ok ? <p role="alert" style={{ color: "crimson" }}>{result.error}</p> : null}
      <button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Kirim aspirasi"}</button>
    </form>
  );
}
