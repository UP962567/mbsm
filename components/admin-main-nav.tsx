"use client";

import prismadb from "@/lib/prismadb";
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
        { href: `/admin/stores`, label: "Stores", active: pathname === `/admin/stores`, },
        { href: `/admin/users`, label: "Users", active: pathname === `/admin/users`, },
        { href: `/admin/usaccess`, label: "USAccess", active: pathname === `/admin/usaccess`, },
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