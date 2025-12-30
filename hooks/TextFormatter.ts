export function generateFrameworkId(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\W_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateProjectId(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\W_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
