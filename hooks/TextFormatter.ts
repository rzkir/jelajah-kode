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

export const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "expired":
    case "canceled":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "";
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
