"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "./ui/separator";

export function SecondNav({
    className,
    ...pops
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();
    const routes = [
        { href: `/${params.storeId}/billboards`, label: "Billboards", active: pathname === `/${params.storeId}/billboards`, },
        { href: `/${params.storeId}/categories`, label: "Categories", active: pathname === `/${params.storeId}/categories`, },
        { href: `/${params.storeId}/products`, label: "Products", active: pathname === `/${params.storeId}/products`, },
    ];

    const routes_extra = [
        { href: `/${params.storeId}/tags`, label: "Tags", active: pathname === `/${params.storeId}/tags`, },
        { href: `/${params.storeId}/sizes`, label: "Sizes", active: pathname === `/${params.storeId}/sizes`, },
        { href: `/${params.storeId}/colors`, label: "Colors", active: pathname === `/${params.storeId}/colors`, },
        { href: `/${params.storeId}/zcategories`, label: "ZCategories", active: pathname === `/${params.storeId}/zcategories`, },
    ];

    return (

        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
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

            <Separator orientation="vertical" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    {routes_extra.map((route) => (
                        <DropdownMenuItem key={route.href}>
                            <Link
                                as={route.href}
                                key={route.href}
                                href={route.href}
                                className={
                                    cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}
                            >
                                {route.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" />
            <Link
                key="/settings"
                href={`/${params.storeId}/settings`}
                className="text-sm font-medium transition-colors hover:text-primary text-red"
                style={{ color: "red" }}
            >
                Settings
            </Link>
        </nav>
    )
};