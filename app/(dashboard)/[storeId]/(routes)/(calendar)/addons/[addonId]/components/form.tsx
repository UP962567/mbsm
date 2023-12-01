"use client"

import axios from "axios"
import { format } from "date-fns"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { CalendarAddon } from "@prisma/client"
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

interface FormProps {
  initialData: CalendarAddon | null;
};

export const Former: React.FC<FormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleB, setTitleB] = useState<string | undefined>(undefined);
  const [priceB, setPriceB] = useState<number | undefined>(undefined);

  const title = initialData ? 'Edit Addon' : 'Create Addon';
  const description = initialData ? 'Edit a Addon.' : 'Add a new Addon';
  const toastMessage = initialData ? 'Addon updated.' : 'Addon created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm({
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)) || undefined,
    } : {
      title: '',
      price: 0,
    }
  });

  const data = {
    title: titleB,
    price: priceB,
  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/addons/${params.bookingId}`, data);
      } else {
        await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/addons`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/addons`);
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
      await axios.delete(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/addons/${params.bookingId}`);
      router.refresh();
      router.push(`/${params.storeId}/addons`);
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
              control={form.control}
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
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Price"
                      type="number"
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event);
                        setPriceB(parseFloat(event.target.value));
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