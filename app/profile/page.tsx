import Profile from "@/components/pages/profile/profile/Profile"

import { generateProfileMetadata } from "@/helper/meta/Metadata"

export async function generateMetadata() {
    return generateProfileMetadata();
}

export default function page() {
    return (
        <Profile />
    )
}
