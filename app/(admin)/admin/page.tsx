import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const page = () => {
    const { userId } = auth();

    const user = auth();
    const userIdOrg = auth().session?.createdAt;

    if (!userId) {
        redirect('/sign-in')
    }


  return (
    <div>
        <div>
            <h1>{user.userId}</h1>
            <p>{user.orgRole}</p>
            <p>{userIdOrg}</p>
            <p>Admin Page</p>
        </div>
    </div>
  )
}

export default page