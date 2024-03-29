"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { FarmField, FarmLocation } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface FormProps {
  initialData: FarmField | null;
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
  const [type, setType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<number | undefined>(undefined);
  const [created, setCreated] = useState<Date>();


  const title = initialData ? 'Edit Field' : 'Create Field';
  const description = initialData ? 'Edit a Field.' : 'Add a new Field';
  const toastMessage = initialData ? 'Field updated.' : 'Field created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    defaultValues: initialData ? {
      ...initialData,
      size: parseFloat(String(initialData?.size)) || undefined,
    } : {
      name: '',
      information: '',
      locationId: '',
      type: '',
      status: '',
      size: 0,
    }
  });

  const data = {
    name: name,
    locationId: locationId,
    size: size,
    information: information,
    type: type,
    status: status,
    created: created,
  }

  const onSubmit = async () => {
    console.log(data)
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/fields/${params.fieldId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/fields`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/fields`);
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
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/fields/${params.fieldId}`);
      router.refresh();
      router.push(`/${params.storeId}/fields`);
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
                      placeholder="Name of the field (Field 1, Field 2, etc.)"
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
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Hectars</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size of the field (in hectars)"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setSize(parseFloat(event.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Type of the field (rocky, flat, etc.)"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setType(event.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Status (planted, not planted, etc.)"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setStatus(event.target.value);
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
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Information about the field"
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
              name="created"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !created && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {created ? format(created, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={created}
                        onSelect={starter => {
                          setCreated(starter);
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

          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};