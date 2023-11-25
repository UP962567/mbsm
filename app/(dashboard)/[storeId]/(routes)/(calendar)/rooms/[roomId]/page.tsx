import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const ColorPage = async ({
  params
}: {
  params: { roomId: string, storeId: string }
}) => {
  const data = await prismadb.calendarRoom.findUnique({
    where: {
      uuid: params.roomId,
      storeId: params.storeId
    }
  });

  const floors = await prismadb.calendarFloor.findMany({
    where: {
      storeId: params.storeId
    }
  });


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data}
          floors={floors}
        />
      </div>
    </div>
  );
}

export default ColorPage;