"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios"
import { toast } from "react-hot-toast"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from 'next/navigation';

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface Item {
    userId: string;
    uuid: string;
    store_total_revenue: boolean;
    store_total_sales: boolean;
    store_total_products: boolean;
    store_total_category: boolean;
    store_total_sizes: boolean;
    store_total_colors: boolean;
    store_total_tags: boolean;

    store_filter_row: string;
    // Add other properties as needed
}

interface DropdownMenuCheckboxesProps {
    data: Item | null; // Adjust the type as needed
}

export function StoreDropdownMenuCheckboxes({ data }: DropdownMenuCheckboxesProps) {
    const params = useParams();
    const route = useRouter();

    const [check, setCheck] = useState<Checked>(false)
    const [check1, setCheck1] = useState<Checked>(false)
    const [check2, setCheck2] = useState<Checked>(false)
    const [check3, setCheck3] = useState<Checked>(false)
    const [check4, setCheck4] = useState<Checked>(false)
    const [check5, setCheck5] = useState<Checked>(false)
    const [check6, setCheck6] = useState<Checked>(false)

    const [position, setPosition] = useState("5")

    useEffect(() => {
        if (data) {
            setCheck(data.store_total_revenue || false);
            setCheck1(data.store_total_sales || false);
            setCheck2(data.store_total_products || false);
            setCheck3(data.store_total_category || false);
            setCheck4(data.store_total_sizes || false);
            setCheck5(data.store_total_colors || false);
            setCheck6(data.store_total_tags || false);
            setPosition(data.store_filter_row || "2")

        }
    }, [data]); // Only run the effect when data changes

    const checkUpdate = async () => { if (check) { setCheck(false); update.store_total_revenue = false; } else { setCheck(true); update.store_total_revenue = true; } await onSubmit(); }
    const checkUpdate1 = async () => { if (check1) { setCheck1(false); update.store_total_sales = false } else { setCheck1(true); update.store_total_sales = true; } await onSubmit(); }
    const checkUpdate2 = async () => { if (check2) { setCheck2(false); update.store_total_products = false } else { setCheck2(true); update.store_total_products = true; } await onSubmit(); }
    const checkUpdate3 = async () => { if (check3) { setCheck3(false); update.store_total_category = false; } else { setCheck3(true); update.store_total_category = true; } await onSubmit(); }
    const checkUpdate4 = async () => { if (check4) { setCheck4(false); update.store_total_sizes = false; } else { setCheck4(true); update.store_total_sizes = true; } await onSubmit(); }
    const checkUpdate5 = async () => { if (check5) { setCheck5(false); update.store_total_colors = false; } else { setCheck5(true); update.store_total_colors = true; } await onSubmit(); }
    const checkUpdate6 = async () => { if (check6) { setCheck6(false); update.store_total_tags = false; } else { setCheck6(true); update.store_total_tags = true; } await onSubmit(); }

    const possitionClicked2 = async () => { setPosition("3"); update.store_filter_row = "3";; await onSubmit(); }
    const possitionClicked3 = async () => { setPosition("4"); update.store_filter_row = "4";; await onSubmit(); }

    const update = {
        store_total_revenue: check,
        store_total_sales: check1,
        store_total_products: check2,
        store_total_category: check3,
        store_total_sizes: check4,
        store_total_colors: check5,
        store_total_tags: check6,
        store_filter_row: position
    }

    const onSubmit = async () => {
        try {
            await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/hotelfilter`, update)
            toast.success('Filter Updated');
            route.refresh();
        } catch (error) {
            toast.error('Something went wrong on filters.')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Cards</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Card Data</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                    checked={check}
                    onCheckedChange={checkUpdate}
                >
                    total_revenue
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check1}
                    onCheckedChange={checkUpdate1}
                >
                    total_sales
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check2}
                    onCheckedChange={checkUpdate2}
                >
                    total_products
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check3}
                    onCheckedChange={checkUpdate3}
                >
                    total_category
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check4}
                    onCheckedChange={checkUpdate4}
                >
                    total_sizes
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check5}
                    onCheckedChange={checkUpdate5}
                >
                    total_colors
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check6}
                    onCheckedChange={checkUpdate6}
                >
                    total_tags
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuLabel className="flex items-center justify-center">
                    <Button variant="green" size="sm" onClick={onSubmit}> Update </Button>
                </DropdownMenuLabel> */}
                <DropdownMenuLabel>Card Colums</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    <DropdownMenuRadioItem onClick={possitionClicked2} value="3">3 Colums</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem onClick={possitionClicked3} value="4">4 Colums</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
