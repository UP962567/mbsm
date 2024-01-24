"use client";

import { CalendarIcon, Edit, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns"
import * as z from "zod"
import axios from "axios";

import { cn } from "@/lib/utils"

import { ClientData } from "./harvest/client";
import { ClientDataFeed } from "./feed/client";

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
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiList } from "@/components/ui/api-list";
import { ClientDataMedicine } from "./medicine/client";

type Farm = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  feedType: string;
  bought: Date;
  sold: Date | null;
  price: string | null;
  outOfUse: boolean;
  locationId: string;
  locationName: string;
};

type FarmHarvest = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  productId: string;
  harvested: Date;
};

type FarmFeedU = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  used: Date;
  feedId: string;
  productId: string;
};

type FarmFeed = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  type: string;
  outOfUse: boolean;
  price: number | null;
  bought: Date;
};

type FarmMedicineU = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  used: Date;
  medicineId: string;
  productId: string;
};

type FarmMedicine = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  information: string;
  type: string;
  outOfUse: boolean;
  price: number | null;
  bought: Date;
};


export const Client = ({ data, harvest, feedU, feed, medicineU, medicine }:
  { data: Farm[]; harvest: FarmHarvest[]; feedU: FarmFeedU[]; feed: FarmFeed[]; medicine: FarmMedicine[]; medicineU: FarmMedicineU[]; }) => {
  const [open, setOpen] = useState(false)
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const params = useParams();
  const router = useRouter();

  // Harvest
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [harvested, setHarvested] = useState<Date | undefined>(undefined);

  // Feed
  const [nameFeed, setNameFeed] = useState<string | undefined>(undefined);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [quantityFeed, setQuantityFeed] = useState<number | undefined>(undefined);
  const [productIdFeed, setProductIdFeed] = useState<string | undefined>(undefined);
  const [feedId, setFeedId] = useState<string | undefined>(undefined);
  const [used, setUsed] = useState<Date | undefined>(undefined);

  // Medicine
  const [nameMedicine, setNameMedicine] = useState<string | undefined>(undefined);
  const [informationMedicine, setInformationMedicine] = useState<string | undefined>(undefined);
  const [quantityMedicine, setQuantityMedicine] = useState<number | undefined>(undefined);
  const [productIdMedicine, setProductIdMedicine] = useState<string | undefined>(undefined);
  const [medicineId, setMedicineId] = useState<string | undefined>(undefined);
  const [usedMedicine, setUsedMedicine] = useState<Date | undefined>(undefined);

  // Medicine Form
  // -----------------------------------------------------------------------------------------------------------------

  const formSchemaMedicine = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    quantity: z.number().min(1, {
      message: "Quantity must be at least 2 characters.",
    }),
    medicineId: z.string().min(2, {
      message: "FeedDataID is not correct.",
    }),
    productId: z.string().min(2, {
      message: "ProductDataID is not correct.",
    }),
    used: z.date().min(new Date(-1), {
      message: "Used date has an error.",
    }),
    information: z.string().min(2, {
      message: "Information must be at least 2 characters.",
    }),
  })

  const formMedicine = useForm({
    resolver: zodResolver(formSchemaMedicine),
    defaultValues: {
      name: "",
      quantity: 0, // Default to a number
      medicineId: "",
      productId: "",
      used: new Date(),
      information: "",
    },
  });

  const onSubmitDataMedicine = {
    name: nameMedicine,
    quantity: quantityMedicine,
    information: informationMedicine,
    productId: productIdMedicine,
    medicineId: medicineId,
    used: usedMedicine,
  }

  const onSubmitMedicine = async () => {
    try {
      setLoading(true);

      await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/more/medicines_used`, onSubmitDataMedicine);

      router.refresh();
      router.push(`/${params.storeId}/animals`);
      toast.success("Data saved successfully.");
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setMedicineId(undefined);
      setNameMedicine(undefined);
      setQuantityMedicine(undefined);
      setProductIdMedicine(undefined);
      setUsedMedicine(undefined);
      setInformationMedicine(undefined);
      setOpenTwo(false);
      setLoading(false);

    }
  };

  const medicineUuids = new Set(medicine.map(f => f.uuid));

  const medicineIdToNameMap = medicine.reduce((acc, f) => {
    acc[f.uuid] = f.name;
    return acc;
  }, {} as { [key: string]: string });

  const productIdToNameMapMedicine = data.reduce((acc, farm) => {
    acc[farm.uuid] = farm.name;
    return acc;
  }, {} as { [key: string]: string });

  const relevantMedicinesWithFeedName = medicineU
    .filter(fu => medicineUuids.has(fu.medicineId))
    .map(fu => ({
      ...fu,
      medicine: medicineIdToNameMap[fu.medicineId] || "Unknown",
      animal: productIdToNameMapMedicine[fu.productId] || "Unknown"
    }));

  // -----------------------------------------------------------------------------------------------------------------
  // Medicine Form



  // Feed Form
  // -----------------------------------------------------------------------------------------------------------------

  const formSchemaFeed = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    quantity: z.number().min(1, {
      message: "Quantity must be at least 2 characters.",
    }),
    feedId: z.string().min(2, {
      message: "FeedDataID is not correct.",
    }),
    productId: z.string().min(2, {
      message: "ProductDataID is not correct.",
    }),
    used: z.date().min(new Date(-1), {
      message: "Used date has an error.",
    }),
    information: z.string().min(2, {
      message: "Information must be at least 2 characters.",
    }),
  })

  const formFeed = useForm({
    resolver: zodResolver(formSchemaFeed),
    defaultValues: {
      name: "",
      quantity: 0, // Default to a number
      feedId: "",
      productId: "",
      used: new Date(),
      information: "",
    },
  });

  const onSubmitDataFeed = {
    name: nameFeed,
    quantity: quantityFeed,
    information: information,
    productId: productIdFeed,
    feedId: feedId,
    used: used,
  }

  const onSubmitFeed = async () => {
    try {
      setLoading(true);

      await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/more/feeds_used`, onSubmitDataFeed);

      router.refresh();
      router.push(`/${params.storeId}/animals`);
      toast.success("Data saved successfully.");
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setFeedId(undefined);
      setNameFeed(undefined);
      setQuantityFeed(undefined);
      setProductIdFeed(undefined);
      setUsed(undefined);
      setInformation(undefined);
      setOpenOne(false);
      setLoading(false);
    }
  };

  const feedUuids = new Set(feed.map(f => f.uuid));

  const feedIdToNameMap = feed.reduce((acc, f) => {
    acc[f.uuid] = f.name;
    return acc;
  }, {} as { [key: string]: string });

  const productIdToNameMap = data.reduce((acc, farm) => {
    acc[farm.uuid] = farm.name;
    return acc;
  }, {} as { [key: string]: string });

  const relevantFeedsWithFeedName = feedU
    .filter(fu => feedUuids.has(fu.feedId))
    .map(fu => ({
      ...fu,
      feeded: feedIdToNameMap[fu.feedId] || "Unknown",
      animal: productIdToNameMap[fu.productId] || "Unknown"
    }));

  // Feed Form
  // -----------------------------------------------------------------------------------------------------------------


  // -----------------------------------------------------------------------------------------------------------------
  // Harvest Form


  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    quantity: z.number().min(1, {
      message: "Quantity must be at least 2 characters.",
    }),
    productId: z.string().min(2, {
      message: "AnimalId is not correct.",
    }),
    harvested: z.date().min(new Date(-1), {
      message: "Harvest date must be in the future.",
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 0, // Default to a number
      productId: "",
      harvested: new Date(),
    },
  });

  const onSubmitData = {
    name: name,
    quantity: quantity,
    productId: productId,
    harvested: harvested,
  }

  const onSubmitHarvest = async () => {
    try {
      setLoading(true);

      await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/harvests`, onSubmitData);

      router.refresh();
      router.push(`/${params.storeId}/animals`);
      toast.success("Data saved successfully.");
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setName(undefined);
      setQuantity(undefined);
      setProductId(undefined);
      setHarvested(undefined);
      setOpen(false);
      setLoading(false);
    }
  };

  const animalUuids = new Set(data.map(animal => animal.uuid));

  const animalIdToNameMap = data.reduce((acc, animal) => {
    acc[animal.uuid] = animal.name;
    return acc;
  }, {} as { [key: string]: string });

  const relevantHarvestsWithProductName = harvest
    .filter(h => animalUuids.has(h.productId))
    .map(h => ({
      ...h,
      productName: animalIdToNameMap[h.productId] || "Unknown"
    }));

  // Harvest Form
  // -----------------------------------------------------------------------------------------------------------------

  return (
    <>
      <Separator />
      <div className="flex items-center justify-between">
        <Heading title={`Animals (${data.length})`} description="Manage Animals" />
        <Button onClick={() => router.push(`/${params.storeId}/animals/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {data.map((data) => (
          <Card key={data.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name: <b>{data.name}</b></CardTitle>
              <Button onClick={() => router.push(`/${params.storeId}/animals/${data.uuid}`)}>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Quantity: <b>{data.quantity}</b></div>
              <div className="text-sm font-medium">Price/Seed: <b>{data.price}</b> </div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Location of Field: <b>{data.locationName}</b> </div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Planted: <b>{data.bought.toLocaleDateString()}</b> </div>
              <div className="text-sm font-medium">Collected: <b>{data.sold?.toLocaleDateString()}</b> </div>
              <Separator className="m-2" />
              <div className="text-sm font-medium">Food: <b>{data.feedType}</b> </div>
              <div className="text-sm font-medium">Information: <b>{data.information}</b> </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Separator />

      <div className="flex items-center justify-between">
        <Heading title={`Harvests (${relevantHarvestsWithProductName.length})`} description="Manage Harvests" />

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Harvests </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Havested product</DrawerTitle>
              <DrawerDescription>Please complete all the field.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHarvest)} className="space-y-8 w-full">
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

                    <Button name="harvest" type="button" onClick={onSubmitHarvest} className="md:col-span-4" variant="green">Submit</Button>

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
        <ClientData data={relevantHarvestsWithProductName} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Heading title={`Feeds (${relevantFeedsWithFeedName.length})`} description="Manage Feeds" />

        <Drawer open={openOne} onOpenChange={setOpenOne}>
          <DrawerTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Feeds </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Feeds</DrawerTitle>
              <DrawerDescription>Please complete all the field.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">

              <Form {...formFeed}>
                <form onSubmit={formFeed.handleSubmit(onSubmitFeed)} className="space-y-8 w-full">
                  <div className="md:grid md:grid-cols-3 gap-4">

                    <FormField
                      control={formFeed.control}
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
                                setNameFeed(event.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formFeed.control}
                      name="information"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Information</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Information how you used the feed"
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
                      control={formFeed.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Total number used in KG/L/Pieces"
                              type="number"
                              value={field.value || ''}
                              onChange={(event) => {
                                const numberValue = parseFloat(event.target.value);
                                // Update the local state if needed - though it might be redundant with react-hook-form
                                setQuantityFeed(numberValue);
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
                      control={formFeed.control}
                      name="feedId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feed</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);  // This is necessary to update form control
                              setFeedId(value);  // Update the locationId state
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
                              {feed.map((category) => (
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
                      control={formFeed.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feed</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);  // This is necessary to update form control
                              setProductIdFeed(value);  // Update the locationId state
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
                      name="used"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feed Time</FormLabel>
                          <br />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !used && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {used ? format(used, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={used}
                                onSelect={starter => {
                                  setUsed(starter);
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

                    <Button name="feed" type="button" onClick={onSubmitFeed} className="md:col-span-3" variant="green">Submit</Button>

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
        <ClientDataFeed data_feed={relevantFeedsWithFeedName} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Heading title={`Medicines (${relevantMedicinesWithFeedName.length})`} description="Manage Medicines" />

        <Drawer open={openTwo} onOpenChange={setOpenTwo}>
          <DrawerTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Medicines </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Medicines</DrawerTitle>
              <DrawerDescription>Please complete all the field.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">

              <Form {...formMedicine}>
                <form onSubmit={formMedicine.handleSubmit(onSubmitFeed)} className="space-y-8 w-full">
                  <div className="md:grid md:grid-cols-3 gap-4">

                    <FormField
                      control={formMedicine.control}
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
                                setNameMedicine(event.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formMedicine.control}
                      name="information"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Information</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Information how you used the medicine"
                              value={field.value || ''}
                              onChange={(event) => {
                                field.onChange(event);
                                setInformationMedicine(event.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formMedicine.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Total number used in KG/L/Pieces"
                              type="number"
                              value={field.value || ''}
                              onChange={(event) => {
                                const numberValue = parseFloat(event.target.value);
                                // Update the local state if needed - though it might be redundant with react-hook-form
                                setQuantityMedicine(numberValue);
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
                      control={formMedicine.control}
                      name="medicineId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);  // This is necessary to update form control
                              setMedicineId(value);  // Update the locationId state
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
                              {medicine.map((category) => (
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
                      control={formMedicine.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Animal</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={(value) => {
                              field.onChange(value);  // This is necessary to update form control
                              setProductIdMedicine(value);  // Update the locationId state
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
                      control={formMedicine.control}
                      name="used"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine Time</FormLabel>
                          <br />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[280px] justify-start text-left font-normal",
                                  !usedMedicine && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {usedMedicine ? format(usedMedicine, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={usedMedicine}
                                onSelect={starter => {
                                  setUsedMedicine(starter);
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

                    <Button name="medicine" type="button" onClick={onSubmitMedicine} className="md:col-span-3" variant="green">Submit</Button>

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
        <ClientDataMedicine data_medicine={relevantMedicinesWithFeedName} />
      </div>

      <Separator />

      <Heading title="API" description="API Calls for Animals" />
      <Separator />
      <ApiList entityName="animals" entityIdName="animalId" />
    </>
  );
};