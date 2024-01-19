"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { FarmLocation, FarmWorker } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface FormProps {
  initialData: FarmWorker | null;
  location: FarmLocation[];
};

export const Former: React.FC<FormProps> = ({
  initialData, location
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [contact, setContact] = useState<number | undefined>(undefined);
  const [holidays, setHolidays] = useState<number | undefined>(undefined);
  const [sickdays, setSickdays] = useState<number | undefined>(undefined);
  const [wage, setWage] = useState<number | undefined>(undefined);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);

  const title = initialData ? 'Edit Worker' : 'Create Worker';
  const description = initialData ? 'Edit a Worker.' : 'Add a new Worker';
  const toastMessage = initialData ? 'Worker updated.' : 'Worker created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    defaultValues: initialData ? {
      ...initialData,
      wage: parseFloat(String(initialData?.wage)) || undefined,
      contact: parseFloat(String(initialData?.contact)) || undefined,
      holidays: parseFloat(String(initialData?.holidays)) || undefined,
      sickdays: parseFloat(String(initialData?.sickdays)) || undefined,
    } : {
      name: '',
      role: '',
      contact: '',
      information: '',
      start: '',
      end: '',
      holidays: '',
      sickdays: '',
      wage: '',
      locationId: '',
    }
  });

  const data = {
    name: name,
    role: role,
    contact: contact,
    information: information,
    start: start,
    end: end,
    holidays: holidays,
    sickdays: sickdays,
    wage: wage,
    locationId: locationId,
  }

  const onSubmit = async () => {
    console.log(data)
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/workers/${params.workerId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/workers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/workers`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/workers/${params.workerId}`);
      router.refresh();
      router.push(`/${params.storeId}/workers`);
      toast.success('Data deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products using this data first.' + error);
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
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name of the worker"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setName(event.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Information</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Information about the worker"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setInformation(event.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Roel of the worker"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setRole(event.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Number of contact"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        // Convert the input value to an integer
                        const intValue = parseInt(event.target.value, 10);
                        // Use isNaN to check if the conversion is successful
                        if (!isNaN(intValue)) {
                          // Update the field with the integer value
                          field.onChange(intValue);
                          // Update the state if necessary
                          setContact(intValue);
                        } else {
                          // Handle invalid input, e.g., empty string
                          field.onChange(undefined);
                          setContact(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Wage of the user"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        // Convert the input value to an integer
                        const intValue = parseInt(event.target.value, 10);
                        // Use isNaN to check if the conversion is successful
                        if (!isNaN(intValue)) {
                          // Update the field with the integer value
                          field.onChange(intValue);
                          // Update the state if necessary
                          setWage(intValue);
                        } else {
                          // Handle invalid input, e.g., empty string
                          field.onChange(undefined);
                          setWage(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Location</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);  // This is necessary to update form control
                      setLocationId(value);  // Update the locationId state
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a location" >
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {location.map((category) => (
                        <SelectItem key={category.id} value={category.uuid}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
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
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
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
                        onSelect={starter => {
                          setEnd(starter);
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
              control={form.control}
              name="sickdays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sickdays</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Number of sickdays"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        // Convert the input value to an integer
                        const intValue = parseInt(event.target.value, 10);
                        // Use isNaN to check if the conversion is successful
                        if (!isNaN(intValue)) {
                          // Update the field with the integer value
                          field.onChange(intValue);
                          // Update the state if necessary
                          setSickdays(intValue);
                        } else {
                          // Handle invalid input, e.g., empty string
                          field.onChange(undefined);
                          setSickdays(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holidays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holidays</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Number of holidays"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        // Convert the input value to an integer
                        const intValue = parseInt(event.target.value, 10);
                        // Use isNaN to check if the conversion is successful
                        if (!isNaN(intValue)) {
                          // Update the field with the integer value
                          field.onChange(intValue);
                          // Update the state if necessary
                          setHolidays(intValue);
                        } else {
                          // Handle invalid input, e.g., empty string
                          field.onChange(undefined);
                          setHolidays(undefined);
                        }
                      }}
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