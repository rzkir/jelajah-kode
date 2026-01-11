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

export const getStatusVariant = (status: string) => {
  switch (status) {
    case "success":
      return "default";
    case "pending":
      return "secondary";
    case "expired":
    case "canceled":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
