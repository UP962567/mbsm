"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { FarmField, FarmLocation, FarmTree } from "@prisma/client"
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
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface FormProps {
  initialData: FarmTree | null;
  location: FarmLocation[];
  fieldmap: FarmField[];
};

export const Former: React.FC<FormProps> = ({
  initialData, location, fieldmap
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [locationId, setLocationId] = useState<string | undefined>(undefined);
  const [fieldId, setFieldId] = useState<string | undefined>(undefined);
  const [planted, setPlanted] = useState<Date | undefined>(undefined);
  const [harvest, setHarvest] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);

  const title = initialData ? 'Edit Tree' : 'Create Tree';
  const description = initialData ? 'Edit a Tree.' : 'Add a new Tree';
  const toastMessage = initialData ? 'Tree updated.' : 'Tree created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    defaultValues: initialData ? {
      ...initialData,
      quantity: parseFloat(String(initialData?.quantity)) || undefined,
      price: parseFloat(String(initialData?.price)) || undefined,
    } : {
      name: '',
      type: '',
      information: '',
      quantity: 0,
      planted: new Date(),
      harvest: new Date(),
      price: 0,
      locationId: '',
      fieldId: '',
    }
  });

  const data = {
    name: name,
    type: type,
    information: information,
    quantity: quantity,
    planted: planted,
    harvest: harvest,
    price: price,
    locationId: locationId,
    fieldId: fieldId,
  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/trees/${params.treeId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/trees`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/trees`);
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
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/trees/${params.treeId}`);
      router.refresh();
      router.push(`/${params.storeId}/trees`);
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Type of the tree"
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
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Information</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Information about the tree"
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
                      placeholder="Price per tree"
                      type="number"
                      value={field.value || ''}
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
                      placeholder="Total numbers of trees in the field"
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
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
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
              name="fieldId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);  // This is necessary to update form control
                      setFieldId(value);  // Update the locationId state
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a field" >
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldmap.map((category) => (
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
              name="planted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planted</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !planted && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {planted ? format(planted, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={planted}
                        onSelect={starter => {
                          setPlanted(starter);
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
              name="harvest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harvest Time</FormLabel>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !harvest && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {harvest ? format(harvest, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={harvest}
                        onSelect={starter => {
                          setHarvest(starter);
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