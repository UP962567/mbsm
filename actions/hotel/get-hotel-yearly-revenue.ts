import prismadb from "@/lib/prismadb"

interface GraphData {
    name: string;
    total: number;
}

export const getPreviewOverwier = async (storeId: string): Promise<GraphData[]> => {
    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const maxYear = year + 1;
    const minYear = year - 3;

    const bookings = await prismadb.calendarBooking.findMany({
        where: {
            storeId,
            start_time: {
                gte: new Date(`${minYear}-01-01T00:00:00Z`),
                lt: new Date(`${maxYear}-01-01T00:00:00Z`),
            },
        },
        include: {
            room: true,
        },
    });

    const yearlyRevenue: { [key: number]: number } = {};

    for (const booking of bookings) {
        const year = booking.start_time.getFullYear();
        let revenueForBooking = booking.totalPrice.toNumber();

        yearlyRevenue[year] = (yearlyRevenue[year] || 0) + revenueForBooking;
    }

    const graphData: GraphData[] = [];

    for (const year in yearlyRevenue) {
        graphData.push({
            name: `${year}`,
            total: yearlyRevenue[parseInt(year)],
        });
    }

    return graphData;
};
