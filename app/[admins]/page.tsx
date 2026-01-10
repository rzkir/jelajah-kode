import AdminProfile from "@/components/pages/admins/AdminProfile"

import { fetchAdminById, fetchAdminProducts, fetchAdminArticles } from "@/utils/fetching/FetchAdmins"

import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
        admins: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { admins: adminId } = await params

    if (!adminId) {
        notFound()
    }

    // Fetch admin data and initial products/articles in parallel
    const [admin, productsData, articlesData] = await Promise.all([
        fetchAdminById(adminId),
        fetchAdminProducts(adminId, 1, 12),
        fetchAdminArticles(adminId, 1, 12),
    ])

    if (!admin) {
        notFound()
    }

    return (
        <AdminProfile
            adminId={adminId}
            initialAdmin={admin}
            initialProducts={productsData.data}
            initialArticles={articlesData.data}
        />
    )
}
