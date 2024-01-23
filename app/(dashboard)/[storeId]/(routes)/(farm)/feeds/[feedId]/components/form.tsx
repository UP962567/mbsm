"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { FarmFeed } from "@prisma/client"
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
import { Checkbox } from "@/components/ui/checkbox"

interface FormProps {
  initialData: FarmFeed | null;
};

export const Former: React.FC<FormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [bought, setBought] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [outOfUse, setOutOfUse] = useState<boolean | undefined>(undefined);

  const title = initialData ? 'Edit Feed' : 'Create Feed';
  const description = initialData ? 'Edit a Feed.' : 'Add a new Feed';
  const toastMessage = initialData ? 'Feed updated.' : 'Feed created.';
  const action = initialData ? 'Save changes' : 'Create';

  const initialDataWithConvertedPrice = initialData ? {
    ...initialData,
    price: initialData.price ? initialData.price.toString() : '0',
  } : null;

  const form = useForm({
    defaultValues: initialDataWithConvertedPrice ? {
      ...initialData,
      quantity: parseFloat(String(initialData?.quantity)) || undefined,
    } : {
      name: '',
      information: '',
      quantity: 0,
      bought: new Date(),
      price: 0,
      type: '',
      outOfUse: false,
    }
  });

  const data = {
    name: name,
    information: information,
    type: type,
    quantity: quantity,
    bought: bought,
    price: price,
    outOfUse: outOfUse,
  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/feeds/${params.feedId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/feeds`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/feeds`);
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
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/feeds/${params.feedId}`);
      router.refresh();
      router.push(`/${params.storeId}/feeds`);
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
                      placeholder="Information about the Feed"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Price per Feed"
                      type="number"
                      value={field.value ? field.value.toString() : ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setPrice(parseFloat(event.target.value));
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
                      placeholder="Total numbers of feeds bought"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setQuantity(parseFloat(event.target.value));
                      }}
                    />
                  </FormControl>
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
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);  // This is necessary to update form control
                      setType(value);  // Update the locationId state
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a type of usage" >
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="ANIMALS" value="ANIMALS">ANIMALS</SelectItem>
                      <SelectItem key="BARNS" value="BARNS">BARNS</SelectItem>
                      <SelectItem key="TREES" value="TREES">TREES</SelectItem>

                    </SelectContent>
                  </Select>
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