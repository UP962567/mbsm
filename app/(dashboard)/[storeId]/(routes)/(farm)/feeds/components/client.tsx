"use client";

import { CalendarIcon, Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns"
import * as z from "zod"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";

import { ClientData } from "./harvest/client";
import { Column } from "./harvest/columns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

type farmFeed = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  bought: Date;
  type: string;
  outOfUse: boolean;
  price: string | null;
};

type farmFeedUsed = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  used: Date;
  feedId: string;
};

export const Client = ({ data, feed }: { data: farmFeed[]; feed: farmFeedUsed[] }) => {
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    quantity: z.number().min(2, {
      message: "Quantity must be at least 2 characters.",
    }),
    productId: z.string().min(2, {
      message: "FeedId is not correct.",
    }),
    harvested: z.date().min(new Date(-1), {
      message: "Harvest date must be in the future.",
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Food",
      quantity: 123, // Default to a number
      productId: "",
      harvested: new Date(),
    },
  });


  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [harvested, setHarvested] = useState<Date | undefined>(undefined);

  const onSubmitData = {
    name: name,
    quantity: quantity,
    productId: productId,
    harvested: harvested,
  }

  const onSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/feeds`, onSubmitData);

      router.refresh();
      router.push(`/${params.storeId}/feeds`);
      toast.success("Data saved successfully.");
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setLoading(false);
    }
  };

  const feedUuids = new Set(data.map(feed => feed.uuid));

  const feedIdToNameMap = data.reduce((acc, feed) => {
    acc[feed.uuid] = feed.name;
    return acc;
  }, {} as { [key: string]: string });

  const relevantFeedsWithProductName = feed ? feed
    .filter(m => feedUuids.has(m.feedId))
    .map(m => ({
      ...m,
      productName: feedIdToNameMap[m.feedId] || "Unknown"
    })) : [];
    
  return (
    <>
      <Separator />
      <div className="flex items-center justify-between">
        <Heading title={`Feeds (${data.length})`} description="Manage Feeds" />
        <Button onClick={() => router.push(`/${params.storeId}/feeds/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((feed) => (
          <Card key={feed.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: <b>{feed.name}</b></CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/feeds/${feed.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Quantity: <b>{feed.quantity}</b></div>
              <div className="text-sm font-medium">Price/Pills: <b>{feed.price}</b> </div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Information: <b>{feed.information}</b> </div>
              <div className="text-sm font-medium">Usage Type: <b>{feed.type}</b> </div>
              <div className="text-sm font-medium">Bought: <b>{feed.bought.toLocaleDateString()}</b> </div>
              <div className="text-sm font-medium">Out of Use: <b>{feed.outOfUse}</b> </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Heading title={`Feeds (${relevantFeedsWithProductName.length})`} description="Manage Feeds Usage" />

        <Drawer>
          <DrawerTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Feed Usage </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Feed product</DrawerTitle>
              <DrawerDescription>Please complete all the field.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                  <div className="md:grid md:grid-cols-4 gap-8">

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
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Total numbers of KG of harvest"
                              type="number"
                              value={field.value || ''}
                              onChange={(event) => {
                                const numberValue = parseFloat(event.target.value);
                                // Update the local state if needed - though it might be redundant with react-hook-form
                                setQuantity(numberValue);
                                // Pass the number value to form's `onChange` to ensure the form gets the number
                                field.onChange(numberValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvested</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);  // This is necessary to update form control
                              setProductId(value);  // Update the locationId state
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue={field.value} placeholder="Select Type" >
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data.map((category) => (
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
                                  !harvested && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {harvested ? format(harvested, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={harvested}
                                onSelect={starter => {
                                  setHarvested(starter);
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

                    <Separator className="col-span-full" />

                    <Button type="submit" className="md:col-span-4" variant="green">Submit</Button>

                  </div>
                </form>
              </Form>

            </div>

            <DrawerFooter>
              <DrawerClose>
                <Button variant="destructive">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

      </div >
      <Separator />

      <div className="flex-1 space-y-4">
        <ClientData data={relevantFeedsWithProductName} />
      </div>


      <Separator />
      <Heading title="API" description="API Calls for Feeds" />
      <Separator />
      <ApiList entityName="feeds" entityIdName="feedId" />
    </>
  );
};