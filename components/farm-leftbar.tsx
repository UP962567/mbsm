"use client";

import classNames from "classnames";
import { ArrowRightLeft, Bath, BookOpenCheck, Calendar, Flower, LandPlot, PackagePlus, Rabbit, Radar, Shapes, Sunrise, Tractor, TreePine, TrendingDown, TrendingUp, Users, Workflow } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const SidebarFarm = () => {
    const [toggleCollapse, setToggleCollapse] = useState(true);
    const [isCollapsible, setIsCollapsible] = useState(true);
    const params = useParams();


    const menuItems = [
        { id: 1, label: "Location", icon: Radar, link: `/${params.storeId}/locations` },
        { id: 2, label: "Field", icon: LandPlot, link: `/${params.storeId}/fields` },
        { id: 3, label: "Trees", icon: TreePine, link: `/${params.storeId}/trees` },
        { id: 4, label: "Barn", icon: Flower, link: `/${params.storeId}/barns` },
        { id: 5, label: "Animal", icon: Rabbit, link: `/${params.storeId}/animals` },
        { id: 6, label: "Equiment", icon: Shapes, link: `/${params.storeId}/equipments` },
        { id: 7, label: "Vehicle", icon: Tractor, link: `/${params.storeId}/vehicles` },
        { id: 10, label: "Worker", icon: Users, link: `/${params.storeId}/workers` },
        { id: 8, label: "Outcome", icon: TrendingDown, link: `/${params.storeId}/outcome` },
        { id: 9, label: "Income", icon: TrendingUp, link: `/${params.storeId}/income` },
        { id: 11, label: "Daily", icon: Sunrise, link: `/${params.storeId}/daily` },
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

export default SidebarFarm;