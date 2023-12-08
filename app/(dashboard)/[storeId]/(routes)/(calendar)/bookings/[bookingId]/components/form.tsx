"use client"

import axios from "axios"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"

import { CalendarAddon, CalendarBooking, CalendarRoom } from "@prisma/client"

import { CalendarIcon, Trash } from "lucide-react"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { cn } from "@/lib/utils"

interface FormProps {
  initialData: CalendarBooking | null;
  rooms: CalendarRoom[];
  addons: CalendarAddon[] | null;
};

export const Former: React.FC<FormProps> = ({
  initialData, rooms, addons
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();
  const [titleB, setTitleB] = useState<string | undefined>(undefined);
  const [groupB, setGroupB] = useState<number | undefined>(undefined);
  const [priceB, setPriceB] = useState<number | undefined>(undefined);
  const [clientsB, setClietsB] = useState<number | undefined>(undefined);
  const [discountB, setDiscountB] = useState<number | undefined>(undefined);
  const [dailyB, setDailyB] = useState<string | undefined>(undefined);

  const title = initialData ? 'Edit Booking' : 'Create Booking';
  const description = initialData ? 'Edit a Booking.' : 'Add a new Booking';
  const toastMessage = initialData ? 'Booking updated.' : 'Booking created.';
  const action = initialData ? 'Save changes' : 'Create';

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
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings/${params.bookingId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/bookings`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings/${params.bookingId}`);
      router.refresh();
      router.push(`/${params.storeId}/bookings`);
      toast.success('Data deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this data first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
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

          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};