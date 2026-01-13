import AdminProfile from "@/components/pages/admins/AdminProfile"

import { fetchAdminById, fetchAdminProducts } from "@/utils/fetching/FetchAdmins"

import { generateAdminsPageMetadata } from "@/helper/meta/Metadata"

import { notFound } from "next/navigation"

import { Metadata } from "next"

interface PageProps {
    params: Promise<{
        admins: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return generateAdminsPageMetadata(params)
}

export default async function Page({ params }: PageProps) {
    const { admins: adminId } = await params

    if (!adminId) {
        notFound()
    }

    // Fetch admin data and initial products/popular products in parallel
    const [admin, productsData, popularProductsData] = await Promise.all([
        fetchAdminById(adminId),
        fetchAdminProducts(adminId, 1, 12),
        fetchAdminProducts(adminId, 1, 12, "popular"),
    ])

    if (!admin) {
        notFound()
    }

    return (
        <AdminProfile
            adminId={adminId}
            initialAdmin={admin}
            initialProducts={productsData.data}
            initialPopularProducts={popularProductsData.data}
        />
    )
}
