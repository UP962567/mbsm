import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const PageBarn = async ({
  params
}: {
  params: { barnId: string , storeId: string }
}) => {
  const data = await prismadb.farmBarn.findUnique({
    where: {
      uuid: params.barnId,
      storeId: params.storeId
    }
  });

  const data1 = await prismadb.farmLocation.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const data2 = await prismadb.farmField.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data} 
        location={data1}
        fieldmap={data2}
        />
      </div>
    </div>
  );
}

export default PageBarn;