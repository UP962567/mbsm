"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { FarmEquipment, FarmLocation } from "@prisma/client"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface FormProps {
  initialData: FarmEquipment | null;
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
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [usage, setUsage] = useState<string | undefined>(undefined);
  const [bought, setBought] = useState<Date | undefined>(undefined);
  const [sold, setSold] = useState<Date | undefined>(undefined);
  const [outOfUse, setOutOfUse] = useState<boolean | undefined>(undefined);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);

  const title = initialData ? 'Edit Equipment' : 'Create Equipment';
  const description = initialData ? 'Edit a Equipment.' : 'Add a new Equipment';
  const toastMessage = initialData ? 'Equipment updated.' : 'Equipment created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    defaultValues: initialData ? {
      ...initialData,
    } : {
      name: '',
      quantity: 0,
      information: '',
      usage: '',
      bought: '',
      outOfUse: false,
      locationId: '',
      sold: '',
    }
  });

  const data = {
    name: name,
    quantity: quantity,
    information: information,
    usage: usage,
    bought: bought,
    sold: sold,
    outOfUse: outOfUse,
    locationId: locationId,
  }

  const onSubmit = async () => {
    console.log(data)
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/equipments/${params.equipmentId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/equipments`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/equipments`);
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
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/equipments/${params.equipmentId}`);
      router.refresh();
      router.push(`/${params.storeId}/equipments`);
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
                      placeholder="Name"
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
                      placeholder="Information about the equipment"
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
              name="usage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Information how to use the equipment"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setUsage(event.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Total numbers of equipment"
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
                          setQuantity(intValue);
                        } else {
                          // Handle invalid input, e.g., empty string
                          field.onChange(undefined);
                          setQuantity(undefined);
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
              name="bought"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bought</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !bought && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bought ? format(bought, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bought}
                        onSelect={starter => {
                          setBought(starter);
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
              name="sold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sold</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !sold && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {sold ? format(sold, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={sold}
                        onSelect={starter => {
                          setSold(starter);
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
              name="outOfUse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={outOfUse}
                      onCheckedChange={(checked) => {
                        // Ensure that 'checked' is either true or false, not 'indeterminate'
                        if (checked === 'indeterminate') {
                          // Handle the 'indeterminate' case as per your requirement
                          // For example, you can set it to false or undefined
                          setOutOfUse(false);
                        } else {
                          // If 'checked' is true or false, update the state normally
                          setOutOfUse(checked);
                        }
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Out Of Use</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere.
                    </FormDescription>
                  </div>
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