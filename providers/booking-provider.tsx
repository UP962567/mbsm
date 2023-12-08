"use client";

import { BookingModel } from "@/components/modals/hotel-booking-modal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const BookingProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [addons, setAddons] = useState([]);

    const params = useParams();

    useEffect(() => {
        setIsMounted(true);

        const fetchGroup = () => {
            fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/rooms`)
                .then(res => res.json())
                .then(data => setRooms(data))
                .catch(err => console.log(err));
        };

        const fetchAddons = () => {
            fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/addons`)
                .then(res => res.json())
                .then(data => setAddons(data))
                .catch(err => console.log(err));
        };

        fetchGroup();
        fetchAddons();
    }, [params.storeId]); // Include params.storeId as a dependency

    if (!isMounted) return null;

    return (
        <>
            <BookingModel
                initialData={null}
                rooms={rooms}
                addons={addons}
            />
        </>
    );
}
