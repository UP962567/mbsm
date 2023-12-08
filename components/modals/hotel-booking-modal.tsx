"use client";

import axios from 'axios';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from "date-fns"
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { CalendarBooking } from "@prisma/client"
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
};

export const BookingModel: React.FC<FormProps> = ({
    initialData,
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

    const bookingModal = useBookingModal();

    const [loading, setLoading] = useState(false);

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

    ///////////////////////////////////////////////

    const [rooms, setRooms] = useState([]);
    const [addons, setAddons] = useState([]);

    useEffect(() => {
        fetchGroup()
        fetchAddons()
    }, [])

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


    ///////////////////////////////////////////////

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
        // console.log(data)
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

            <div className='box-content'>
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