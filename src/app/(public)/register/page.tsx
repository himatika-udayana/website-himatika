"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/src/lib/auth-actions";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <main style={{ maxWidth: 520, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Registrasi Anggota</h1>
      <form action={formAction} style={{ display: "grid", gap: 12 }}>
        <label>
          <div>Email</div>
          <input name="email" type="email" required style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          <div>Nama lengkap</div>
          <input name="fullName" required style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          <div>NIM</div>
          <input name="nim" required maxLength={10} style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          <div>Angkatan</div>
          <input name="angkatan" required maxLength={4} style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          <div>Password</div>
          <input name="password" type="password" required style={{ width: "100%", padding: 10 }} />
        </label>

        {state.error ? <p style={{ color: "crimson" }}>{state.error}</p> : null}

        <button type="submit" disabled={pending} style={{ padding: 12 }}>
          {pending ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p>
        Sudah punya akun? <Link href="/login">Login</Link>
      </p>
    </main>
  );
}
