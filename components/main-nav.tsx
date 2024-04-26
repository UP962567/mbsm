"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...pops
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();

    const routes_store = [
        { href: `/${params.storeId}`, label: "Dasboard", active: pathname === `/${params.storeId}`, },
        // { href: `/${params.storeId}/calendar`, label: "Calendar", active: pathname === `/${params.storeId}/calendar`, },
        // { href: `/${params.storeId}/addons`, label: "Addon", active: pathname === `/${params.storeId}/addons`, },
        // { href: `/${params.storeId}/rooms`, label: "Room", active: pathname === `/${params.storeId}/rooms`, },
        // { href: `/${params.storeId}/floors`, label: "Floor", active: pathname === `/${params.storeId}/floors`, },
        // { href: `/${params.storeId}/bookings`, label: "Booking", active: pathname === `/${params.storeId}/bookings`, },
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes_store.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    as={route.href}
                    className={
                        cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
};