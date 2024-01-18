import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const PageTree = async ({
  params
}: {
  params: { treeId: string , storeId: string }
}) => {
  const data = await prismadb.farmTree.findUnique({
    where: {
      uuid: params.treeId,
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

export default PageTree;