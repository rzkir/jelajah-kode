interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbItems(
  pathname: string | null
): BreadcrumbItem[] {
  if (!pathname || pathname === "/") {
    return [{ name: "Home", url: "/" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "Home", url: "/" }];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip dynamic segments (IDs) - they're usually not meaningful in breadcrumbs
    // But we can include them if needed
    const isDynamicSegment =
      /^[a-f0-9]{24}$/i.test(segment) || segment.match(/^\[.*\]$/);

    // Format segment name for display
    let name = segment;

    // Handle common route names
    if (segment === "dashboard") {
      name = "Dashboard";
    } else if (segment === "products") {
      name = "Products";
    } else if (segment === "articles") {
      name = "Articles";
    } else if (segment === "categories") {
      name = "Categories";
    } else if (segment === "tags") {
      name = "Tags";
    } else if (segment === "types") {
      name = "Types";
    } else if (segment === "framework") {
      name = "Framework";
    } else if (segment === "transactions") {
      name = "Transactions";
    } else if (segment === "management-users") {
      name = "Management Users";
    } else if (segment === "laporan") {
      name = "Laporan";
    } else if (segment === "subscription") {
      name = "Subscription";
    } else if (segment === "rekaputasi") {
      name = "Rekaputasi";
    } else if (segment === "penjualan-products") {
      name = "Penjualan Products";
    } else if (segment === "pending") {
      name = "Pending";
    } else if (segment === "success") {
      name = "Success";
    } else if (segment === "canceled") {
      name = "Canceled";
    } else if (segment === "expired") {
      name = "Expired";
    } else if (segment === "verified") {
      name = "Verified";
    } else if (segment === "active") {
      name = "Active";
    } else if (segment === "inactive") {
      name = "Inactive";
    } else if (segment === "user") {
      name = "User";
    } else if (segment === "accounts") {
      name = "Accounts";
    } else if (segment === "new") {
      name = "New";
    } else if (segment === "edit") {
      name = "Edit";
    } else if (segment === "about") {
      name = "About";
    } else if (segment === "contact") {
      name = "Contact";
    } else if (segment === "search") {
      name = "Search";
    } else if (segment === "documentation") {
      name = "Documentation";
    } else if (segment === "license-agreement") {
      name = "License Agreement";
    } else if (segment === "privacy-policy") {
      name = "Privacy Policy";
    } else if (segment === "refund-policy") {
      name = "Refund Policy";
    } else if (segment === "terms-of-service") {
      name = "Terms of Service";
    } else if (segment === "ratings") {
      name = "Ratings";
    } else if (segment === "signin") {
      name = "Sign In";
    } else if (segment === "signup") {
      name = "Sign Up";
    } else if (segment === "forget-password") {
      name = "Forget Password";
    } else if (segment === "verification") {
      name = "Verification";
    } else if (segment === "change-password") {
      name = "Change Password";
    } else if (segment === "reset-password") {
      name = "Reset Password";
    } else {
      // Capitalize first letter and replace hyphens with spaces
      name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // For dynamic segments, we might want to skip or use a generic name
    // For now, we'll include them but with a formatted name
    if (isDynamicSegment && index === segments.length - 1) {
      // Last segment is likely a detail page, use generic name
      const parentSegment = segments[index - 1];
      if (parentSegment === "categories") {
        name = "Category";
      } else if (parentSegment === "tags") {
        name = "Tag";
      } else if (parentSegment === "types") {
        name = "Type";
      } else if (parentSegment === "products") {
        name = "Product";
      } else if (parentSegment === "articles") {
        name = "Article";
      } else {
        name = "Details";
      }
    }

    items.push({
      name,
      url: currentPath,
    });
  });

  return items;
}
