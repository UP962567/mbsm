"use client";

import classNames from "classnames";
import { ArrowRightLeft, Bath, BookOpenCheck, Calendar, PackagePlus, Workflow } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const SidebarHotel = () => {
    const [toggleCollapse, setToggleCollapse] = useState(false);
    const [isCollapsible, setIsCollapsible] = useState(true);
    const params = useParams();


    const menuItems = [
        { id: 1, label: "Calendar", icon: Calendar, link: `/${params.storeId}/calendar` },
        { id: 2, label: "Floor", icon: Workflow, link: `/${params.storeId}/floors` },
        { id: 3, label: "Room", icon: Bath, link: `/${params.storeId}/rooms` },
        { id: 4, label: "Addon", icon: PackagePlus, link: `/${params.storeId}/addons` },
        { id: 5, label: "Booking", icon: BookOpenCheck, link: `/${params.storeId}/bookings` },
    ];


    const wrapperClasses = classNames(
        "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col border-r border-light-lighter",
        {
            ["w-90"]: !toggleCollapse,
            ["w-20"]: toggleCollapse,
        }
    );

    const collapseIconClasses = classNames(
        "p-4 rounded bg-light-lighter absolute right-0",
        {
            "rotate-180": toggleCollapse,
        }
    );


    const onMouseOver = () => {
        setIsCollapsible(isCollapsible);
    };

    const handleSidebarToggle = () => {
        setToggleCollapse(!toggleCollapse);
    };

    return (
        <div
            className={wrapperClasses}
            onMouseEnter={onMouseOver}
            onMouseLeave={onMouseOver}
            style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between relative">
                    {isCollapsible && (
                        <button
                            className={collapseIconClasses}
                            onClick={handleSidebarToggle}
                        >
                            <ArrowRightLeft />
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-start mt-24">
                    {menuItems.map(({ icon: Icon, ...menu }) => {
                        return (
                            <div key={menu.id}> {/* Add key prop here */}
                                <Link href={menu.link}>
                                    <div className="flex py-4 px-3 items-center w-full h-full">
                                        <div style={{ width: "2.5rem" }}>
                                            <Icon />
                                        </div>
                                        {!toggleCollapse && (
                                            <span
                                                className={classNames(
                                                    "text-md font-medium text-text-light"
                                                )}
                                            >
                                                {menu.label}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SidebarHotel;