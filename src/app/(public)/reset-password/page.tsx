"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/src/lib/auth-actions";

const initialState = {} as { error?: string; success?: string };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Reset Password</h1>
      <form action={formAction} style={{ display: "grid", gap: 12 }}>
        <label>
          <div>Password baru</div>
          <input name="password" type="password" required style={{ width: "100%", padding: 10 }} />
        </label>

        {state.error ? <p style={{ color: "crimson" }}>{state.error}</p> : null}

        <button type="submit" disabled={pending} style={{ padding: 12 }}>
          {pending ? "Memperbarui..." : "Simpan password baru"}
        </button>
      </form>

      <p>
        <Link href="/login">Kembali ke login</Link>
      </p>
    </main>
  );
}
