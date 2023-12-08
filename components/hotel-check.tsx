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
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface Item {
    userId: string;
    uuid: string;
    hotel_monthly_booking: boolean;
    hotel_monthly_clients: boolean;
    hotel_monthly_revenue: boolean;
    hotel_total_booking: boolean;
    hotel_total_clients: boolean;
    hotel_total_revenue: boolean;
    hotel_total_rooms: boolean;

    hotel_filter_row: string;
}

interface DropdownMenuCheckboxesProps {
    data: Item | null;
}

export function HotelDropdownMenuCheckboxes({ data }: DropdownMenuCheckboxesProps) {
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
            setCheck(data.hotel_total_booking || false);
            setCheck1(data.hotel_monthly_booking || false);
            setCheck2(data.hotel_total_clients || false);
            setCheck3(data.hotel_monthly_clients || false);
            setCheck4(data.hotel_total_rooms || false);
            setCheck5(data.hotel_total_revenue || false);
            setCheck6(data.hotel_monthly_revenue || false);
            setPosition(data.hotel_filter_row || "2")
        }
    }, [data]);

    const checkUpdate = async () => { if (check) { setCheck(false); update.hotel_total_booking = false; } else { setCheck(true); update.hotel_total_booking = true; } await onSubmit(); }
    const checkUpdate1 = async () => { if (check1) { setCheck1(false); update.hotel_monthly_booking = false } else { setCheck1(true); update.hotel_monthly_booking = true; } await onSubmit(); }
    const checkUpdate2 = async () => { if (check2) { setCheck2(false); update.hotel_total_clients = false } else { setCheck2(true); update.hotel_total_clients = true; } await onSubmit(); }
    const checkUpdate3 = async () => { if (check3) { setCheck3(false); update.hotel_monthly_clients = false } else { setCheck3(true); update.hotel_monthly_clients = true; } await onSubmit(); }
    const checkUpdate4 = async () => { if (check4) { setCheck4(false); update.hotel_total_rooms = false } else { setCheck4(true); update.hotel_total_rooms = true; } await onSubmit(); }
    const checkUpdate5 = async () => { if (check5) { setCheck5(false); update.hotel_total_revenue = false } else { setCheck5(true); update.hotel_total_revenue = true; } await onSubmit(); }
    const checkUpdate6 = async () => { if (check6) { setCheck6(false); update.hotel_monthly_revenue = false } else { setCheck6(true); update.hotel_monthly_revenue = true; } await onSubmit(); }

    const possitionClicked2 = async () => { setPosition("3"); update.hotel_filter_row = "3";; await onSubmit(); }
    const possitionClicked3 = async () => { setPosition("4"); update.hotel_filter_row = "4";; await onSubmit(); }
    const possitionClicked4 = async () => { setPosition("5"); update.hotel_filter_row = "5";; await onSubmit(); }
    const possitionClicked5 = async () => { setPosition("6"); update.hotel_filter_row = "6";; await onSubmit(); }
    const possitionClicked6 = async () => { setPosition("7"); update.hotel_filter_row = "7";; await onSubmit(); }
    const possitionClicked7 = async () => { setPosition("8"); update.hotel_filter_row = "8";; await onSubmit(); }
    const update = {
        hotel_total_booking: check,
        hotel_monthly_booking: check1,
        hotel_total_clients: check2,
        hotel_monthly_clients: check3,
        hotel_total_rooms: check4,
        hotel_total_revenue: check5,
        hotel_monthly_revenue: check6,
        hotel_filter_row: position,
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

                <DropdownMenuCheckboxItem checked={check} onCheckedChange={checkUpdate} > total_booking </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={check2} onCheckedChange={checkUpdate2} > total_clients </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={check4} onCheckedChange={checkUpdate4} > total_rooms </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem checked={check5} onCheckedChange={checkUpdate5} > total_revenue </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={check1} onCheckedChange={checkUpdate1} > monthly_booking </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={check3} onCheckedChange={checkUpdate3} > monthly_clients </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={check6} onCheckedChange={checkUpdate6} > monthly_revenue </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuLabel className="flex items-center justify-center">
                    <Button variant="green" size="sm" onClick={onSubmit}> Update </Button>
                </DropdownMenuLabel> */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger> <Settings className="mr-2 h-4 w-4" /> <span>Change Colums</span> </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                <DropdownMenuRadioItem onClick={possitionClicked2} value="3">3 Colums</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem onClick={possitionClicked3} value="4">4 Colums</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem onClick={possitionClicked4} value="5">5 Colums</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem onClick={possitionClicked5} value="6">6 Colums</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem onClick={possitionClicked6} value="7">7 Colums</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem onClick={possitionClicked7} value="8">8 Colums</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            {/* <DropdownMenuItem> <MessageSquare className="mr-2 h-4 w-4" /> <span>Message</span> </DropdownMenuItem>
                            <DropdownMenuItem> <PlusCircle className="mr-2 h-4 w-4" /> <span>More...</span> </DropdownMenuItem> */}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
