import Link from "next/link";
import {
  FiArrowRight as ArrowRight,
  FiClock as Clock,
  FiGlobe as Globe,
  FiMail as Mail,
  FiMapPin as MapPin,
  FiPhone as Phone,
  FiSend as Send,
} from "react-icons/fi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "@/src/components/ui/reveal";
import { beranda } from "@/src/data/beranda";
import { faq } from "@/src/data/faq";
import { portalMenu } from "@/src/data/portal-menu";
import { getAllPosts } from "@/src/lib/blog";
import { PostTypeBadge } from "@/src/components/public/post-type-details";

const mapEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2707.949100937901!2d115.17011348708772!3d-8.799166212800733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd244bc3acab8d9%3A0x7fba454d24527b74!2sFakultas%20Matematika%20dan%20Ilmu%20Pengetahuan%20Alam!5e0!3m2!1sid!2sid!4v1786333704890!5m2!1sid!2sid";
export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  return (
    <main className="overflow-x-hidden bg-white">
      <style>{`@keyframes kenburns{0%{transform:scale(1)}100%{transform:scale(1.08)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}`}</style>
      <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full">
          <div className="h-full w-full bg-[url('/images/HERO.png')] bg-cover bg-center [animation:kenburns_18s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/45 to-blue-950/10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="relative mx-auto flex w-full flex-1 max-w-7xl flex-col justify-center px-4 pb-20 pt-24 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Himpunan Mahasiswa Prodi Matematika
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-amber-400">{beranda.namaWebsite}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-100 sm:text-lg">
            {beranda.visi}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tentang-kami"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              Pelajari Lebih Lanjut{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <span className="text-2xl text-white/70 [animation:float_2.2s_ease-in-out_infinite]">
            ⌄
          </span>
        </div>
      </section>
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Portal &amp; <span className="text-blue-600">Layanan</span>{" "}
              HIMATIKA
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Temukan halaman utama dan layanan organisasi dalam tampilan
              ringkas.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portalMenu.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex h-full items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
              >
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Buka{" "}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <Reveal className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Tentang Kami <span className="text-blue-600">HIMATIKA</span>
              </h2>
              <p className="mt-4 text-justify leading-relaxed text-slate-700">
                "Program Studi Matematika FMIPA Universitas Udayana resmi memperoleh izin penyelenggaraan melalui SK Dirjen Dikti Nomor 2843/D/T/2001 pada 31 Agustus 2001 dan mulai menerima mahasiswa angkatan pertama pada tahun akademik 2001/2002. Sejak berdiri, program studi ini telah melalui berbagai proses evaluasi, perpanjangan izin, dan akreditasi untuk meningkatkan mutu pendidikan. Akreditasi pertama diperoleh pada tahun 2008 dengan peringkat B, yang kemudian diperpanjang pada tahun 2013 dan 2018. Selanjutnya, berdasarkan keputusan LAMSAMA Nomor 079/SK/LAMSAMA/Akred/S/VII/2023, Program Studi Matematika Universitas Udayana memperoleh akreditasi Baik Sekali yang berlaku mulai 31 Juli 2023 hingga 31 Juli 2028.
              </p>
            </div>
            <Link
              href="/tentang-kami"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm"
            >
              Selengkapnya{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={150} className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={beranda.youtubeEmbed}
                  title="Video Profil HIMATIKA"
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Reveal delay={150}>
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Artikel &amp; <span className="text-blue-600">Berita</span>{" "}
                  Terkini
                </h2>
                <p className="mt-3 text-slate-600">
                  Update kegiatan, prestasi, dan informasi terbaru HIMATIKA.
                </p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold text-blue-600"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <PostTypeBadge type={post.tipe} />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {post.judul}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {post.ringkasan}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                  >
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            Pertanyaan Umum
          </h2>
          <p className="mt-3 text-center text-slate-600">
            Jawaban atas hal-hal yang paling sering ditanyakan.
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-10">
          <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Accordion>
              {faq.map((item, index) => (
                <AccordionItem key={item.pertanyaan} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600">
                    {item.pertanyaan}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    {item.jawaban}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </Reveal>
      </section>
      <Reveal delay={250}>
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Hubungi Kami
              </h2>
              <p className="mt-3 text-slate-600">
                Kami senang mendengar dari mahasiswa, alumni, maupun mitra.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="flex gap-3 text-sm text-slate-600">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-700" />
                  {beranda.kontak.alamat}
                </p>
                <p className="flex gap-3 text-sm text-slate-600">
                  <Mail className="h-5 w-5 flex-shrink-0 text-blue-700" />
                  {beranda.kontak.email}
                </p>
                <p className="flex gap-3 text-sm text-slate-600">
                  <Phone className="h-5 w-5 flex-shrink-0 text-blue-700" />
                  {beranda.kontak.telepon} (WhatsApp)
                </p>
                <p className="flex gap-3 text-sm text-slate-600">
                  <Globe className="h-5 w-5 flex-shrink-0 text-blue-700" />
                  {beranda.kontak.website}
                </p>
                <p className="flex gap-3 text-sm text-slate-600">
                  <Clock className="h-5 w-5 flex-shrink-0 text-blue-700" />
                  Senin - Jumat, 09.00 - 16.00 WITA
                </p>
              </Card>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <iframe
                  src={mapEmbed}
                  className="h-full min-h-64 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Lokasi Sekretariat HIMATIKA"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-2xl bg-blue-900 px-8 py-14 text-center shadow-sm sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Siap Berkembang Bersama HIMATIKA?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-blue-100">
                Jadilah bagian dari komunitas mahasiswa Matematika yang aktif
                berkarya.
              </p>
              <form className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-1.5 pl-5">
                <input
                  aria-label="Pesan singkat"
                  placeholder="Tulis pesan singkat Anda..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-blue-200/70 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Kirim"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
