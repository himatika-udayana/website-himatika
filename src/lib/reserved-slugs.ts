export const RESERVED_SLUGS = [
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "tentang-kami",
  "divisi",
  "blog",
  "faq",
  "anggota",
  "admin",
  "auth",
  "api",
  "_next",
] as const;

export const RESERVED_SLUG_SET: ReadonlySet<string> = new Set(RESERVED_SLUGS);