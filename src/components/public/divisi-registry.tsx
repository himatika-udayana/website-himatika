"use client";

import { useMemo, useState } from "react";
import { FiChevronRight, FiUsers as Users } from "react-icons/fi";
import { GiBriefcase as Briefcase, GiBullseye as Megaphone, GiGraduateCap as GraduationCap, GiPalette as Palette } from "react-icons/gi";
import { FaCrown as Crown } from "react-icons/fa";
import { RiHandHeartLine as HeartHandshake } from "react-icons/ri";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "@/src/components/ui/reveal";
import type { Bidang, Divisi } from "@/src/types/content";

const bidangList = [
  ["inti", "Pengurus Inti"],
  ["bph", "Badan Pengurus Harian"],
  ["bidang-1-pendidikan-penalaran", "Bidang I Pendidikan dan Penalaran"],
  ["bidang-2-minat-bakat", "Bidang II Minat dan Bakat"],
  [
    "bidang-3-kewirausahaan-kesejahteraan",
    "Bidang III Kewirausahaan dan Kesejahteraan Mahasiswa",
  ],
  ["bidang-4-pengabdian-masyarakat", "Bidang IV Pengabdian Masyarakat"],
  ["bidang-5-komunikasi-informasi", "Bidang V Komunikasi dan Informasi"],
] as const;

const bidangIconMap: Record<Bidang, React.ElementType> = {
  inti: Crown,
  bph: Users,
  "bidang-1-pendidikan-penalaran": GraduationCap,
  "bidang-2-minat-bakat": Palette,
  "bidang-3-kewirausahaan-kesejahteraan": Briefcase,
  "bidang-4-pengabdian-masyarakat": HeartHandshake,
  "bidang-5-komunikasi-informasi": Megaphone,
} as const;

export function DivisiRegistry({ divisi }: { divisi: Divisi }) {
  const [activeBidang, setActiveBidang] =
    useState<(typeof bidangList)[number][0]>("inti");
  const [activeTab, setActiveTab] = useState<"anggota" | "program">("anggota");
  const activeLabel =
    bidangList.find(([key]) => key === activeBidang)?.[1] ?? "Pengurus Inti";
  const members = useMemo(
    () => divisi.pengurus.filter((item) => item.bidang === activeBidang),
    [divisi.pengurus, activeBidang],
  );
  const programs = useMemo(
    () => divisi.programKerja.filter((item) => item.bidang === activeBidang),
    [divisi.programKerja, activeBidang],
  );

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {bidangList.map(([key, label]) => {
            const selected = activeBidang === key;
            const Icon = bidangIconMap[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveBidang(key)}
                className={`flex w-full items-center gap-3 border-l-4 px-5 py-4 text-left transition-colors ${selected ? "border-blue-600 bg-blue-50/80" : "border-transparent hover:bg-slate-50"}`}
              >
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${selected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`flex-1 text-sm font-semibold ${selected ? "text-blue-700" : "text-slate-700"}`}
                >
                  {label}
                </span>
                <FiChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            );
          })}
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900">{activeLabel}</h3>
          <p className="mt-1 text-sm text-slate-500">
            Pilih tampilan anggota atau program kerja bidang ini.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {(["anggota", "program"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab === "anggota" ? "Anggota" : "Program Kerja"}
              </button>
            ))}
          </div>
          {activeTab === "anggota" ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                {members.length} Anggota Terdaftar
              </p>
              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                {members.length ? (
                  members.map((member) => (
                    <Card
                      key={`${member.nama}-${member.jabatan}`}
                      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 px-3 pb-4 pt-4 shadow-lg transition hover:-translate-y-1"
                    >
                      <p className="relative z-10 text-center font-serif text-xs italic font-semibold tracking-wide text-cyan-300 sm:text-sm">
                        {member.jabatan.replaceAll("-", " ")}
                      </p>
                      <div className="relative z-10 mt-3 flex h-32 w-full items-center justify-center sm:h-36">
                        {member.foto ? (
                          <img
                            src={member.foto}
                            alt={member.nama}
                            className="h-full w-auto object-contain"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xl font-bold text-white">
                            {member.nama
                              .replace("[PLACEHOLDER] ", "P")
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="relative z-10 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-2 py-1.5 text-center">
                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                          {member.nama}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-sm text-slate-400">
                    Belum ada anggota pada bidang ini.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {programs.length ? (
                programs.map((program) => (
                  <Card
                    key={program.nama}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <div className="space-y-4 p-5">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {program.nama}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {program.deskripsi}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-sm text-slate-400">
                  Belum ada program kerja pada bidang ini.
                </p>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
