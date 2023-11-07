"use client";

import * as z from 'zod';
import { Modal } from '@/components/ui/model';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const formSchema = z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters long.'),
})

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // TODO Create Store Mutation
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
                            render={({field}) => (
                                <FormItem> 
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Unit name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className='pt-6 space-x-2 flex items-center justify-end 2-full'>
                                <Button variant='destructive' onClick={storeModal.onClose}>Cancel</Button>
                                <Button variant='secondary' type="submit">Continue</Button>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )

}