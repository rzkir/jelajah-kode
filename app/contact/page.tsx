import { Fragment } from "react/jsx-runtime";

import Contact from "@/components/pages/contact/Contact"

import { ContactPageMetadata } from "@/helper/meta/Metadata"

import BreadcrumbScript from "@/helper/breadchumb/Script"

export const metadata = ContactPageMetadata;

export default function page() {
    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
    ];

    return (
        <Fragment>
            <BreadcrumbScript items={breadcrumbItems} />
            <Contact />
        </Fragment>
    )
}
