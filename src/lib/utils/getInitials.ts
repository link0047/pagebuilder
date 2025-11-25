type GetInitialsOptions = {
  limit?: number
};

export function getInitials(name: unknown, options: GetInitialsOptions = {}): string {
  if (typeof name !== "string") return "";

  const normalized = name.trim();
  if (normalized.length === 0) return "";

  const parts = normalized.split(/\s+/);
  const limit = options.limit ?? 2;
  let initials = "";

  if (limit === 2 && parts.length > 1) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    initials = `${first.substring(0, 1)}${last.substring(0, 1)}`;
  } else {
    initials = parts
      .slice(0, limit)
      .map((part) => part.substring(0, 1))
      .join("");
  }

  return initials.toUpperCase();
}