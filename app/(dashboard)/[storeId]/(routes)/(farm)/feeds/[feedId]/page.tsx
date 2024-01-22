import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const PageBarn = async ({
  params
}: {
  params: { feedId: string , storeId: string }
}) => {
  const data = await prismadb.farmFeed.findUnique({
    where: {
      uuid: params.feedId,
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data} 
        />
      </div>
    </div>
  );
}

export default PageBarn;