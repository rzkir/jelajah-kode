"use client";

import * as React from "react";

import {
  ArrowLeftRight,
  Command,
  PieChart,
  Newspaper,
  LayoutDashboard,
  SquareUser,
  BriefcaseBusiness,
  Podcast,
  BookAlert,
  BarChart3,
  UserStar,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { NavProjects } from "@/components/nav-projects";

import { NavEngagement } from "@/components/nav-engagement";

import Link from "next/link";

import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth } from "@/utils/context/AuthContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      icon: BriefcaseBusiness,
      isActive: false,
      items: [
        {
          title: "Products",
          url: "/dashboard/products/products",
        },
        {
          title: "Products Category",
          url: "/dashboard/products/category",
        },
        {
          title: "Products Framework",
          url: "/dashboard/products/framework",
        },
        {
          title: "Products Tags",
          url: "/dashboard/products/tags",
        },
        {
          title: "Products Type",
          url: "/dashboard/products/type",
        },
      ],
    },
    {
      title: "Articles",
      url: "/dashboard/articles",
      icon: Newspaper,
      items: [
        {
          title: "Articles",
          url: "/dashboard/articles/articles",
        },
        {
          title: "Articles Category",
          url: "/dashboard/articles/category",
        },
        {
          title: "Articles Tags",
          url: "/dashboard/articles/tags",
        },
      ],
    },
    {
      title: "Transactions",
      url: "dashboard/transactions",
      icon: ArrowLeftRight,
      items: [
        {
          title: "Transactions",
          url: "/dashboard/transactions/transactions",
        },
        {
          title: "Pending",
          url: "/dashboard/transactions/pending",
        },
        {
          title: "Success",
          url: "/dashboard/transactions/success",
        },
        {
          title: "Canceled",
          url: "/dashboard/transactions/canceled",
        },
        {
          title: "Expired",
          url: "/dashboard/transactions/expired",
        },
      ],
    },
    {
      title: "Management Users",
      url: "/dashboard/management-users",
      icon: SquareUser,
      items: [
        {
          title: "Users",
          url: "/dashboard/management-users/user",
        },
        {
          title: "Verified",
          url: "/dashboard/management-users/verified",
        },
        {
          title: "Active",
          url: "/dashboard/management-users/active",
        },
        {
          title: "Inactive",
          url: "/dashboard/management-users/inactive",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Rekaputasi",
      url: "/dashboard/laporan/rekaputasi",
      icon: BarChart3,
    },
    {
      name: "Penjualan Products",
      url: "/dashboard/laporan/penjualan-products",
      icon: PieChart,
    },
    {
      name: "Ratings",
      url: "/dashboard/laporan/ratings",
      icon: UserStar,
    },
    {
      name: "Bug Reports",
      url: "/dashboard/laporan/bug-reports",
      icon: BookAlert,
    },
  ],
  engagement: [
    {
      name: "Subscription",
      url: "/dashboard/subscription",
      icon: Podcast,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth();

  // Create user object for NavUser component based on authenticated user
  const currentUser = user
    ? {
      name: user.name,
      email: user.email,
      picture: user.picture || "/avatars/default.jpg", // Use picture if available, otherwise default
    }
    : null;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Kodera</span>
                  <span className="truncate text-xs">Digital Products Marketplace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavEngagement engagement={data.engagement} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} onSignOut={signOut} />
      </SidebarFooter>
    </Sidebar>
  );
}
