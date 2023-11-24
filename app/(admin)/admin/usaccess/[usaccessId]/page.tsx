import prismadb from "@/lib/prismadb";

import { DataForm } from "./components/form";

const ColorPage = async ({
  params
}: {
  params: { usaccessId: string }
}) => {
  const data = await prismadb.storeToUser.findUnique({
    where: {
      uuid: params.usaccessId
    }
  });

  const stores = await prismadb.store.findMany({
  });

  const users = await prismadb.user.findMany({
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DataForm initialData={data}
        users={users}
        stores={stores}
        />
      </div>
    </div>
  );
}

export default ColorPage;