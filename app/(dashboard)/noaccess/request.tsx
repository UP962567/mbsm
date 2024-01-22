"use client";

import React from 'react';
import { UserButton, auth } from "@clerk/nextjs";
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { da } from 'date-fns/locale';

type User = {
    id: number;
    uuid: string;
    fullName: string;
    email: string;
    contact: string;
    username: string;
    password: string;
    location: string;
    role: string;
    status: string;
}

const RequestAccessPage = ({ data }: { data: User[] }) => {
    const router = useRouter();

    const { isSignedIn, user, isLoaded } = useUser();
    const [loading, setLoading] = React.useState(false);

    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [contact, setContact] = React.useState("");
    const [location, setLocation] = React.useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => { setUsername(event.target.value); };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value); };
    const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => { setContact(event.target.value); };
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => { setLocation(event.target.value); };


    const user_data = {
        uuid: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.fullName,
        phone: contact,
        username: username,
        password: password,
        address: location,
        role: "USER",
        status: "PENDING",
        active: false
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(user_data)
        try {
            setLoading(true);

            await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/admin/requests`, user_data);

            router.refresh();
            toast.success("Data saved successfully.");
        } catch (error: any) {
            toast.error('Something went wrong.' + error);
        } finally {
            setLoading(false);
        }
    };

    const doesUserExist = () => {
        return data.some((userData) => userData.uuid === user?.id);
    };

    const userExists = doesUserExist();

    if (userExists) {
        return (
            <>
                <nav className="bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center justify-between">
                                <div className="flex-shrink-0">
                                    <Image width="80" height="80" src="https://storage.ma-dy.com/fivemserver/albanian.png" alt="Workflow" />
                                </div>

                                <div className="ml-10 flex space-x-4 items-end  mr-auto justify-end">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto mt-4">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Request Access <b>{user?.fullName}</b>
                        </h2>
                        <button

                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Your already have requested access.
                        </button>

                    </div>
                </div>
            </>);
    }

    return (
        <>
            <nav className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center justify-between">
                            <div className="flex-shrink-0">
                                <Image width="80" height="80" src="https://storage.ma-dy.com/fivemserver/albanian.png" alt="Workflow" />
                            </div>

                            <div className="ml-10 flex space-x-4 items-end  mr-auto justify-end">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto mt-4">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Request Access <b>{user?.fullName}</b>
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="rounded-md shadow-sm items-center">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    User UUID
                                </label>
                                <input
                                    id="uuid"
                                    name="uuid"
                                    type="text"
                                    autoComplete="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={user?.id}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={user?.emailAddresses[0].emailAddress ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Full name"
                                    value={user?.fullName ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Contact number
                                </label>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="number"
                                    autoComplete="contact"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Contact"
                                    onChange={handleContactChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Username"
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    autoComplete="location"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Location"
                                    onChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Request Access
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RequestAccessPage;
