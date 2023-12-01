import prismadb from "@/lib/prismadb";

import { Former } from "./components/form";

const ColorPage = async ({
  params
}: {
  params: { bookingId: string , storeId: string }
}) => {
  const data = await prismadb.calendarBooking.findUnique({
    where: {
      uuid: params.bookingId,
      storeId: params.storeId
    }
  });

  const rooms = await prismadb.calendarRoom.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const addons = await prismadb.calendarAddon.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Former initialData={data} 
          rooms={rooms}
          addons={addons}
        />
      </div>
    </div>
  );
}

export default ColorPage;