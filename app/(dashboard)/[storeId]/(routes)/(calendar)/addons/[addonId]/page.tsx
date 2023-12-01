import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const ColorPage = async ({
  params
}: {
  params: { addonId: string , storeId: string }
}) => {
  const data = await prismadb.calendarAddon.findUnique({
    where: {
      uuid: params.addonId,
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

export default ColorPage;