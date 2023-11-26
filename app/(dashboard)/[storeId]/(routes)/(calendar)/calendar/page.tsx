"use client"
import CalendarCode from "./components/calendar-code";


const Calendar = async ({
    params
  }: {
    params: { storeId: string }
  }) => {

    return (
        <div className='w-full'>
            <CalendarCode params={params}/>
        </div>
    )
}

export default Calendar