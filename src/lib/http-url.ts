export function validateHttpUrl(value: string, fieldName = "URL") {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`${fieldName} harus berupa URL lengkap yang valid.`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${fieldName} harus menggunakan protokol HTTP atau HTTPS.`);
  }

  return url.toString();
}