"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/src/lib/auth-actions";

const initialState = {} as { error?: string; success?: string };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Lupa Password</h1>
      <form action={formAction} style={{ display: "grid", gap: 12 }}>
        <label>
          <div>Email</div>
          <input name="email" type="email" required style={{ width: "100%", padding: 10 }} />
        </label>

        {state.error ? <p style={{ color: "crimson" }}>{state.error}</p> : null}
        {state.success ? <p style={{ color: "green" }}>{state.success}</p> : null}

        <button type="submit" disabled={pending} style={{ padding: 12 }}>
          {pending ? "Mengirim..." : "Kirim link reset"}
        </button>
      </form>

      <p>
        <Link href="/login">Kembali ke login</Link>
      </p>
    </main>
  );
}
