/** Google Data Manager normalization rules applied before SHA-256 hashing. */
export function normalizeEmail(value?: string): string | undefined {
  const compact = value?.replace(/\s/g, "").toLowerCase();
  if (!compact || !/^[^@]+@[^@]+\.[^@]+$/.test(compact)) return undefined;

  const at = compact.lastIndexOf("@");
  let localPart = compact.slice(0, at);
  const domain = compact.slice(at + 1);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    localPart = localPart.split("+", 1)[0].replace(/\./g, "");
  }
  if (!localPart) return undefined;
  return `${localPart}@${domain}`;
}

export function normalizePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (value.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return undefined;
}
