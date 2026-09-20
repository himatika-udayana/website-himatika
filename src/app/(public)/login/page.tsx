"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/src/lib/auth-actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "unverified") {
      setVerificationMessage("Verifikasi email kamu dulu untuk mengisi RAMA");
    }
  }, []);

  return (
    <main style={{ maxWidth: 440, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Login</h1>
      <form action={formAction} style={{ display: "grid", gap: 12 }}>
        <label>
          <div>Email</div>
          <input name="email" type="email" required style={{ width: "100%", padding: 10 }} />
        </label>
        <label>
          <div>Password</div>
          <input name="password" type="password" required style={{ width: "100%", padding: 10 }} />
        </label>

        {verificationMessage ? <p style={{ color: "crimson" }}>{verificationMessage}</p> : null}
        {state.error ? <p style={{ color: "crimson" }}>{state.error}</p> : null}

        <button type="submit" disabled={pending} style={{ padding: 12 }}>
          {pending ? "Memproses..." : "Login"}
        </button>
      </form>

      <p>
        Belum punya akun? <Link href="/register">Daftar</Link>
      </p>
      <p>
        <Link href="/forgot-password">Lupa password?</Link>
      </p>
    </main>
  );
}
