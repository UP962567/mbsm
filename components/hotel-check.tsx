"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

// eslint-disable-next-line
export function DropdownMenuCheckboxes() {
    const [check, setCheck] = React.useState<Checked>(true)
    const [check1, setCheck1] = React.useState<Checked>(true)
    const [check2, setCheck2] = React.useState<Checked>(true)
    const [check3, setCheck3] = React.useState<Checked>(true)
    const [check4, setCheck4] = React.useState<Checked>(true)

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
                    onCheckedChange={setCheck}
                >
                    Total Revenue
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check1}
                    onCheckedChange={setCheck1}
                >
                    Monthly Revenue
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check2}
                    onCheckedChange={setCheck2}
                >
                    Total Booking
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check3}
                    onCheckedChange={setCheck3}
                >
                    Total Rooms
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={check4}
                    onCheckedChange={setCheck4}
                >
                    Total Clients
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
