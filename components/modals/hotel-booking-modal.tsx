"use client";

import axios from 'axios';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from "date-fns"
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { CalendarAddon, CalendarBooking, CalendarRoom } from "@prisma/client"
import { useBookingModal } from '@/hooks/use-booking-modal';

import { cn } from "@/lib/utils"

import { Modal } from '@/components/ui/modal';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react';

interface FormProps {
    initialData: CalendarBooking | null;
    rooms: CalendarRoom[];
    addons: CalendarAddon[];
};

interface Booking {
    id: number;
    start_time: Date;
    end_time: Date;
    group: number;
}

export const BookingModel: React.FC<FormProps> = ({
    initialData, rooms, addons
}) => {
    const params = useParams();
    const router = useRouter();

    const [start, setStart] = useState<Date>();
    const [end, setEnd] = useState<Date>();
    const [titleB, setTitleB] = useState<string | undefined>(undefined);
    const [groupB, setGroupB] = useState<number | undefined>(undefined);
    const [priceB, setPriceB] = useState<number | undefined>(undefined);
    const [clientsB, setClietsB] = useState<number | undefined>(undefined);
    const [discountB, setDiscountB] = useState<number | undefined>(undefined);
    const [dailyB, setDailyB] = useState<string | undefined>(undefined);
    const [disabledDatesT, setDisabledDatesT] = useState<Date[]>([]);

    const bookingModal = useBookingModal();

    const [loading, setLoading] = useState(false);

    const fetchBookings = async (): Promise<Booking[]> => {
        try {
            const response = await fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings/booked`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings data');
            }
            const data: Booking[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    };

    const getDisabledDatesForGroup = async (group: number): Promise<Date[]> => {
        try {
            const bookings = await fetchBookings(); // Fetch bookings data
            const groupBookings = bookings.filter(booking => booking.group === group);
            const disabledDates: Date[] = [];

            groupBookings.forEach(booking => {
                const startDate = new Date(booking.start_time);
                const endDate = new Date(booking.end_time);

                // Loop through each date between start and end date and add them to disabledDates
                // Start the loop from the day after the start date
                for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
                    disabledDates.push(new Date(date));
                }
            });

            return disabledDates;

        } catch (error) {
            console.error('Error getting disabled dates for group:', error);
            return []; // Return an empty array in case of error
        }
    };

    const form = useForm({
        defaultValues: initialData ? {
            ...initialData,
            group: parseFloat(String(initialData?.group)) || undefined,
        } : {
            title: '',
            start_time: start,
            end_time: end,
            group: undefined,
            clients: 0,
            discount: 0,
            addonId: '',
        }
    });

    const calculateTotalPrice = (): number => {
        if (start && end && rooms && addons) {
            const numberOfNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const selectedRoom = rooms.find((item) => String(item.id) === String(groupB));
            const selectedAddon = addons?.find((item) => String(item.uuid) === String(dailyB));

            if (selectedRoom && selectedRoom.price) {
                const numericPrice = parseFloat(selectedRoom.price.toString());

                if (selectedAddon?.price && clientsB) {
                    const addonPrice = parseFloat(selectedAddon?.price.toString());
                    if (clientsB !== 0 || clientsB !== undefined || addonPrice === 0) {
                        setPriceB((numberOfNights) * ((clientsB * addonPrice) + (numericPrice - (discountB ?? 0))));
                        return (numberOfNights) * (((clientsB * addonPrice)) + (numericPrice - (discountB ?? 0)));
                    }
                }

                else if (!isNaN(numericPrice)) {
                    setPriceB(numberOfNights * numericPrice)
                    return numberOfNights * numericPrice;
                }
            }
        }
        return 0;
    };

    const isRoomIdInRooms = (roomId: number): boolean => {
        return rooms.some(room => room.id === roomId);
    };

    const data = {
        title: titleB,
        group: groupB,
        start_time: start,
        end_time: end,
        totalPrice: priceB,
        discount: discountB,
        clients: clientsB,
        addonId: dailyB,
    }

    const onSubmit = async () => {
        // Check if there are any disabled dates between start and end time
        const disabledDates = await getDisabledDatesForGroup(groupB || 0); // Assuming groupB is defined

        console.log(disabledDates);

        const roomIdExists = isRoomIdInRooms(groupB || 0); // Assuming groupB is defined

        if (!roomIdExists) {
            toast.error('Cannot submit: Room ID does not exist in the rooms list.');
            return;
        }


        if (!start || !end) {
            console.log('Cannot submit: Start and end dates are required.');
            toast.error('Cannot submit: Start and end dates are required.');
            return;
        }

        if (start > end) {
            console.log('Cannot submit: The end date cannot be before the start date.');
            toast.error('Cannot submit: The end date cannot be before the start date.');
            return;
        }

        if (start === end) {
            console.log('Cannot submit: The end date cannot be the same as the start date.');
            toast.error('Cannot submit: The end date cannot be the same as the start date.');
            return;
        }

        // Check if start or end date is disabled
        const isStartDisabled = disabledDates.some(date => date.getTime() === start.getTime());
        // const isEndDisabled = disabledDates.some(date => date.getTime() === end.getTime());

        if (isStartDisabled) {
            // Handle disabled dates scenario
            console.log('Cannot submit: The start or end date is disabled.');
            toast.error('Cannot submit: The start or end date is disabled.');
            return;
        }

        // Check if any date between start and end is disabled
        const isDisabled = disabledDates.some(date => date > start && date < end);

        if (isDisabled) {
            // Handle disabled dates scenario
            console.log('Cannot submit: There are disabled dates within the selected range.');
            toast.error('Cannot submit: There are disabled dates within the selected range.');
            return;
        }

        // Submit the form if validation passes
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings/${params.bookingId}`, data);
            } else {
                await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/calendar`);
            router.forward();
            toast.success("Booking created successfully.");
        } catch (error: any) {
            toast.error('Something went wrong.');
        } finally {
            initialData = null;
            bookingModal.onClose();
            window.location.reload();

            setLoading(false);
        }
    };


    return (
        <Modal
            title='Create new Booking'
            description='Add a new booking to your system.'
            isOpen={bookingModal.isOpen}
            onClose={bookingModal.onClose}>

            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            <FormField
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Name"
                                                value={field.value || ''}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    setTitleB(event.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of room</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Number of People"
                                                type="number"
                                                value={field.value || ''}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    setGroupB(parseInt(event.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={(value) => {
                                                const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
                                                field.onChange(numericValue);
                                                setGroupB(numericValue);
                                            }}
                                            value={field.value ? String(field.value) : undefined}
                                            defaultValue={field.value ? String(field.value) : undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a room">

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {rooms.map((item) => (
                                                    <SelectItem key={item.id} value={String(item.id)}>
                                                        {item.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

<FormField
                                name="start_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <br />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !start && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {start ? format(start, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={start}
                                                    onSelect={starter => {
                                                        setStart(starter);
                                                        field.onChange(starter);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="end_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <br />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal",
                                                        !end && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {end ? format(end, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={end}
                                                    onSelect={ender => {
                                                        setEnd(ender);
                                                        field.onChange(ender);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="addonId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Daily Packets</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={(value) => {
                                                const stringValue = typeof value === 'string' ? value : undefined;
                                                field.onChange(stringValue);
                                                setDailyB(stringValue);
                                            }}
                                            value={field.value ?? undefined}
                                            defaultValue={field.value ?? undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value ?? undefined} placeholder="Select a Packets">

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(addons ?? []).map((data) => (
                                                    <SelectItem key={data.id} value={data.uuid}>
                                                        {data.title + " - $" + data.price + " per person"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="clients"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of People +8</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Number of People"
                                                type="number"
                                                value={field.value || ''}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    setClietsB(parseInt(event.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (- per day)</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Day - Discount"
                                                type="number"
                                                value={field.value || ''}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    setDiscountB(parseInt(event.target.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="totalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                placeholder="Price"
                                                type="number"
                                                value={calculateTotalPrice().toString()}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='pt-6 space-x-2 flex items-center justify-end 2-full'>
                                <Button disabled={loading} variant='destructive' onClick={bookingModal.onClose}>Cancel</Button>
                                <Button disabled={loading} variant='secondary' type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}