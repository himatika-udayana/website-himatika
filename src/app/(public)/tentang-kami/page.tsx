import Link from "next/link";
import Image from "next/image";
import { profil } from "@/src/data/profil";
import { Reveal } from "@/src/components/ui/reveal";

export default function ProfilPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <style>{`@keyframes logo-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes glow-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.6;transform:scale(1.08)}}`}</style>
      <section className="relative overflow-hidden px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/HERO.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2563eb_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#be185d_0%,transparent_30%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-200">
            <Link href="/" className="hover:text-white">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-medium text-white">Tentang Kami</span>
          </nav>
          <span className="inline-flex rounded-xl bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            About HIMATIKA
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Sejarah &amp; <span className="text-blue-400">Visi Misi</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Pelajari perjalanan sejarah, visi, misi, dan nilai yang menjadi
            pedoman HIMATIKA.
          </p>
        </div>
      </section>
      <Reveal>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative mx-auto max-w-7xl">
            <div className="rounded-xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Sejarah
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Prodi <span className="text-blue-600">Matematika</span>
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{profil.sejarah}</p>
              <ol className="mt-8 space-y-6 border-l-2 border-blue-200 pl-6 lg:flex lg:items-start lg:gap-8 lg:space-y-0 lg:border-l-0 lg:pl-0">
                {profil.timeline.map((item) => (
                  <li
                    key={item.title}
                    className="relative lg:flex-1 lg:border-t-2 lg:border-blue-200 lg:pt-7"
                  >
                    <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow-md lg:left-0 lg:-top-[9px]" />
                    <p className="text-sm font-semibold text-blue-700">
                      {item.year || "[PLACEHOLDER]"}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal delay={100}>
        <section className="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Arah Organisasi
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Visi dan Misi
              </h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-800 p-8 text-white shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
                  Visi
                </p>
                <p className="mt-4 text-xl font-medium leading-relaxed">
                  {profil.visi}
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                  Misi
                </p>
                <ul className="mt-4 space-y-4">
                  {profil.misi.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                        ✓
                      </span>
                      <span className="text-sm leading-relaxed text-slate-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal delay={200}>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-300/30 shadow-inner [animation:logo-float_5s_ease-in-out_infinite]">
                <span className="absolute inset-4 rounded-full bg-cyan-300/30 blur-3xl [animation:glow-pulse_4s_ease-in-out_infinite]" />
                {profil.logo ? (
                  <Image
                    src={profil.logo}
                    alt="Logo HIMATIKA"
                    width={160}
                    height={160}
                    className="relative z-10 h-40 w-40 object-contain"
                  />
                ) : null}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
                Identitas Visual
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Filosofi Logo
              </h2>
              <p className="mt-4 text-slate-600">
                Setiap elemen pada logo HIMATIKA memiliki makna yang
                merepresentasikan karakter organisasi.
              </p>
              <div className="mt-6 space-y-4">
                {profil.filosofiLogo.map((item, index) => (
                  <article
                    key={item.nama}
                    className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-3">
                      {item.gambar ? (
                        <Image
                          src={item.gambar}
                          alt={item.nama}
                          width={32}
                          height={32}
                          className="h-8 w-8 flex-shrink-0 object-contain"
                        />
                      ) : (
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.nama}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.deskripsi}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
