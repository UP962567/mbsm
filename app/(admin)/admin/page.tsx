import { getCountAccesses } from '@/actions/admin/get-count-accesses';
import { getCountRequests } from '@/actions/admin/get-count-requests';
import { getCountStore } from '@/actions/admin/get-count-stores';
import { getCountUsers } from '@/actions/admin/get-count-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs';
import { Calculator, User2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const { userId } = auth();

  const user = auth();
  const userIdOrg = auth().session?.createdAt;

  if (!userId) {
    redirect('/sign-in')
  }

  const getStoresCount = await getCountStore();
  const getUserCount = await getCountUsers();
  const getRequestsCount = await getCountRequests();
  const getAccessCount = await getCountAccesses();



  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between">
            <Heading title="Dashboard" description="Admin dashboard careful!" />
          </div>
          <Separator />
          <div className="grid grid-cols-4 gap-4">

            <Card>
              <a href={"/admin/stores"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total <b style={{ color: 'green' }}>Stores</b>
                  </CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStoresCount}</div>
                </CardContent>
              </a>
            </Card>

            <Card>
              <a href={"/admin/users"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total <b style={{ color: 'green' }}>Users</b>
                  </CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getUserCount}</div>
                </CardContent>
              </a>
            </Card>

            <Card>
              <a href={"/admin/usaccess"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total <b style={{ color: 'green' }}>Accesses</b>
                  </CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAccessCount}</div>
                </CardContent>
              </a>
            </Card>

            <Card>
              <a href={"/admin/requests"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total <b style={{ color: 'red' }}>Requests</b>
                  </CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getRequestsCount}</div>
                </CardContent>
              </a>
            </Card>

          </div>
        </div>
      </div >
    </div>
  )
}

export default page