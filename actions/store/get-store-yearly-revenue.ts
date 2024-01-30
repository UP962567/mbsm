import prismadb from "@/lib/prismadb"

interface GraphData {
    name: string;
    total: number;
}

export const getYearlyRevenueStore = async (storeId: string): Promise<GraphData[]> => {
    const teardate = new Date;
    const year = teardate.getUTCFullYear();
    const maxYear = year + 1;
    const minYear = year - 9;

    const sales = await prismadb.sales.findMany({
        where: {
            storeId,
            sold: {
                gte: new Date(`${minYear}-01-01T00:00:00Z`),
                lt: new Date(`${maxYear}-01-01T00:00:00Z`),
            },
        },
    });

    const yearlyRevenue: { [key: number]: number } = {};

    for (const sale of sales) {
        const year = sale.sold.getFullYear();
        let revenueForBooking = sale.total.toNumber();

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
