"use client";

import { BookingModel } from "@/components/modals/hotel-booking-modal";
import { useEffect, useState } from "react";

export const BookingProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <BookingModel />
        </>
    );
}