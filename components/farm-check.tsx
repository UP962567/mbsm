"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios"
import { toast } from "react-hot-toast"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"

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

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface Item {
    id: number;
    uuid: string;
    farm_count_location: boolean;
    farm_count_animal: boolean;
    farm_count_field: boolean;
    farm_count_worker: boolean;
    farm_count_tree: boolean;
    farm_count_barn: boolean;
    farm_count_equipment: boolean;
    farm_count_vehicle: boolean;

    farm_filter_row: string;
}

interface DropdownMenuCheckboxesProps {
    data: Item | null;
}

export function FarmDropdownMenuCheckboxes({ data }: DropdownMenuCheckboxesProps) {
    const params = useParams();
    const route = useRouter();

    const [check, setCheck] = useState<Checked>(false)
    const [check1, setCheck1] = useState<Checked>(false)
    const [check2, setCheck2] = useState<Checked>(false)
    const [check3, setCheck3] = useState<Checked>(false)
    const [check4, setCheck4] = useState<Checked>(false)
    const [check5, setCheck5] = useState<Checked>(false)
    const [check6, setCheck6] = useState<Checked>(false)
    const [check7, setCheck7] = useState<Checked>(false)

    const [position, setPosition] = useState("5")

    useEffect(() => {
        if (data) {
            setCheck(data.farm_count_location || false);
            setCheck1(data.farm_count_animal || false);
            setCheck2(data.farm_count_barn || false);
            setCheck3(data.farm_count_tree || false);
            setCheck4(data.farm_count_field || false);
            setCheck5(data.farm_count_vehicle || false);
            setCheck6(data.farm_count_worker || false);
            setCheck7(data.farm_count_equipment || false);

            setPosition(data.farm_filter_row || "8")

        }
    }, [data]); // Only run the effect when data changes

    const checkUpdate = async () => { if (check) { setCheck(false); update.farm_count_location = false; } else { setCheck(true); update.farm_count_location = true; } await onSubmit(); }
    const checkUpdate1 = async () => { if (check1) { setCheck1(false); update.farm_count_animal = false } else { setCheck1(true); update.farm_count_animal = true; } await onSubmit(); }
    const checkUpdate2 = async () => { if (check2) { setCheck2(false); update.farm_count_barn = false } else { setCheck2(true); update.farm_count_barn = true; } await onSubmit(); }
    const checkUpdate3 = async () => { if (check3) { setCheck3(false); update.farm_count_tree = false; } else { setCheck3(true); update.farm_count_tree = true; } await onSubmit(); }
    const checkUpdate4 = async () => { if (check4) { setCheck4(false); update.farm_count_field = false; } else { setCheck4(true); update.farm_count_field = true; } await onSubmit(); }
    const checkUpdate5 = async () => { if (check5) { setCheck5(false); update.farm_count_vehicle = false; } else { setCheck5(true); update.farm_count_vehicle = true; } await onSubmit(); }
    const checkUpdate6 = async () => { if (check6) { setCheck6(false); update.farm_count_worker = false; } else { setCheck6(true); update.farm_count_worker = true; } await onSubmit(); }
    const checkUpdate7 = async () => { if (check7) { setCheck7(false); update.farm_count_equipment = false; } else { setCheck7(true); update.farm_count_equipment = true; } await onSubmit(); }

    const possitionClicked2 = async () => { setPosition("3"); update.farm_filter_row = "3";; await onSubmit(); }
    const possitionClicked3 = async () => { setPosition("4"); update.farm_filter_row = "4";; await onSubmit(); }
    const possitionClicked4 = async () => { setPosition("5"); update.farm_filter_row = "5";; await onSubmit(); }
    const possitionClicked5 = async () => { setPosition("6"); update.farm_filter_row = "6";; await onSubmit(); }
    const possitionClicked6 = async () => { setPosition("7"); update.farm_filter_row = "7";; await onSubmit(); }
    const possitionClicked7 = async () => { setPosition("8"); update.farm_filter_row = "8";; await onSubmit(); }

    const update = {
        farm_count_location: check,
        farm_count_animal: check1,
        farm_count_barn: check2,
        farm_count_tree: check3,
        farm_count_field: check4,
        farm_count_vehicle: check5,
        farm_count_worker: check6,
        farm_count_equipment: check7,
        farm_filter_row: position
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

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger> <CreditCard className="mr-2 h-4 w-4" /> <span>Count</span> </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                <DropdownMenuCheckboxItem checked={check} onCheckedChange={checkUpdate}> <CreditCard className="mr-2 h-4 w-4" /> count_location </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check1} onCheckedChange={checkUpdate1}> <CreditCard className="mr-2 h-4 w-4" /> count_animal </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check2} onCheckedChange={checkUpdate2}> <CreditCard className="mr-2 h-4 w-4" /> count_barn </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check3} onCheckedChange={checkUpdate3}> <CreditCard className="mr-2 h-4 w-4" /> count_tree </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check4} onCheckedChange={checkUpdate4}> <CreditCard className="mr-2 h-4 w-4" /> count_field </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check5} onCheckedChange={checkUpdate5}> <CreditCard className="mr-2 h-4 w-4" /> count_vehicle </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check6} onCheckedChange={checkUpdate6}> <CreditCard className="mr-2 h-4 w-4" /> count_worker </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem checked={check7} onCheckedChange={checkUpdate7}> <CreditCard className="mr-2 h-4 w-4" /> count_equipment </DropdownMenuCheckboxItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

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
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
