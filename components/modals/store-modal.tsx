"use client";

import * as z from 'zod';
import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';

const formSchema = z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters long.'),
    type: z.string().min(3, 'Store type must be at least 3 characters long.'),
})

export const StoreModal = () => {

    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);

        if (values.type === "STORE" || values.type === "HOTEL" || values.type === "FARM") {
            try {
                setLoading(true);

                const response = await axios.post('/api/stores', values);

                toast.success("Store created successfully.");

                window.location.assign(`/${response.data.id}`);

            } catch (error) {
                toast.error("Something went wrong.");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Invalid type.');
        }
    }

    return (
        <Modal
            title='Create Store'
            description='Add a new store to manage products and categories.'
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}>

            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder='Unit name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />


                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder='STORE, HOTEL, FARM' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <div className='pt-6 space-x-2 flex items-center justify-end 2-full'>
                                <Button disabled={loading} variant='destructive' onClick={storeModal.onClose}>Cancel</Button>
                                <Button disabled={loading} variant='secondary' type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )

}