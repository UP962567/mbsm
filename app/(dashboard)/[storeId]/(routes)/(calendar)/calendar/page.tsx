"use client"
import CalendarCode from "./components/calendar-code";

// eslint-disable-next-line @next/next/no-async-client-component
const Calendar = ({
  params
}: {
  params: { storeId: string }
}) => {


  return (
    <div className='w-90'>
      <CalendarCode params={params} />
    </div>
  )
}

export default Calendar