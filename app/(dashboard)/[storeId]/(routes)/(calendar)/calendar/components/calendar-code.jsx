/* eslint-disable no-console */

import React, { useEffect, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from "moment";
import Timeline from 'react-calendar-timeline';
import { Button as ButtonUI } from '@/components/ui/button';
import { useBookingModal } from '@/hooks/use-booking-modal';
import { useRouter } from 'next/navigation';
import { set } from 'date-fns';

const CalendarCode = ({ params }) => {
    const router = useRouter();

    const [visibleTimeStart, setVisibleTimeStart] = useState();
    const [visibleTimeEnd, setVisibleTimeEnd] = useState();

    const bookingModel = useBookingModal();

    useEffect(() => {
        // const visibleTimeStart1 = moment().startOf("months").valueOf();
        // const visibleTimeEnd1 = moment().startOf("months").add(1, "months").valueOf();

        // setVisibleTimeStart(visibleTimeStart1);
        // setVisibleTimeEnd(visibleTimeEnd1);

        const startOfMonth = moment().month(5).startOf('month').valueOf();
        const endOfMonth = moment().month(7).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    }, [])


    const handleCanvasClick = (groupId, time) => {
        console.log("Canvas double clicked", groupId, moment(time).format());
    };

    const handleCanvasDoubleClick = (groupId, time) => {
        router.push(`/${params.storeId}/bookings/new`);
    };

    const handleCanvasContextMenu = (group, time) => {
        console.log("Canvas context menu", group, moment(time).format());
    };

    const handleItemClick = (itemId, _, time) => {
        console.log("Clicked: " + itemId, moment(time).format());
    };

    const handleItemSelect = (itemId, _, time) => {
        console.log("Selected: " + itemId, moment(time).format());
    };

    const findUUIDById = async (itemId) => {
        try {
            const response = await fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings/booked/${itemId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            
            router.push(`/${params.storeId}/bookings/${data.uuid}`);
        } catch (error) {
            console.error('Error fetching UUID:', error);
            return null;
        }
    };

    const handleItemDoubleClick = (itemId, _, time) => {
        findUUIDById(itemId);
    };

    const handleItemContextMenu = (itemId, _, time) => {
        console.log("Context Menu: " + itemId, moment(time).format());
    };


    //////////////////////////////////////////////////////////////////////////////////////////////// Get Data

    const [item, setItems] = useState([]);
    const [groups, setGroups] = useState([]);
    const [addons, setAddons] = useState([]);

    const fetchData = () => {
        fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.log(err));
    };

    const fetchGroup = () => {
        fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/rooms`)
            .then(res => res.json())
            .then(data => setGroups(data))
            .catch(err => console.log(err));
    };

    const fetchAddons = () => {
        fetch(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/addons`)
            .then(res => res.json())
            .then(data => setAddons(data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchData()
        fetchGroup()
        fetchAddons()
    }, [])

    //////////////////////////////////////////////////////////////////////////////////////////////// Modify Data

    const itemer = item.map((item) => {
        const endDate = moment(item.end_time).add(1, 'day'); // Add one day to the end date
        return {
            id: item.id,
            group: item.group,
            title: item.title,
            start_time: moment(item.start_time),
            end_time: moment(item.end_time),
            className: 'rounded-lg shadow-lg items-center justify-center',
            canMove: false,
            canResize: false,
            canChangeGroup: false,
            itemProps: {
                // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
                'data-custom-attribute': 'Random content',
                'aria-hidden': true,
                onDoubleClick: () => { console.log('You clicked double!') }
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////// Get Data End

    const onPrevClick = () => {
        const zoom = visibleTimeEnd - visibleTimeStart;
        setVisibleTimeEnd(visibleTimeEnd - zoom);
        setVisibleTimeStart(visibleTimeStart - zoom);
    };

    const onNextClick = () => {
        const zoom = visibleTimeEnd - visibleTimeStart;
        setVisibleTimeEnd(visibleTimeEnd + zoom);
        setVisibleTimeStart(visibleTimeStart + zoom);
    };

    const onTodayClick = () => {
        const visibleTimeStart1 = moment().startOf("months").valueOf();
        const visibleTimeEnd1 = moment().startOf("months").add(1, "months").valueOf();

        setVisibleTimeStart(visibleTimeStart1);
        setVisibleTimeEnd(visibleTimeEnd1);
    };

    const on5 = () => {
        const startOfMonth = moment().month(4).startOf('month').valueOf();
        const endOfMonth = moment().month(4).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on6 = () => {
        const startOfMonth = moment().month(5).startOf('month').valueOf();
        const endOfMonth = moment().month(5).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on7 = () => {
        const startOfMonth = moment().month(6).startOf('month').valueOf();
        const endOfMonth = moment().month(6).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on8 = () => {
        const startOfMonth = moment().month(7).startOf('month').valueOf();
        const endOfMonth = moment().month(7).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on9 = () => {
        const startOfMonth = moment().month(8).startOf('month').valueOf();
        const endOfMonth = moment().month(8).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on56 = () => {
        const startOfMonth = moment().month(4).startOf('month').valueOf();
        const endOfMonth = moment().month(5).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on67 = () => {
        const startOfMonth = moment().month(5).startOf('month').valueOf();
        const endOfMonth = moment().month(6).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on78 = () => {
        const startOfMonth = moment().month(6).startOf('month').valueOf();
        const endOfMonth = moment().month(7).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const on89 = () => {
        const startOfMonth = moment().month(7).startOf('month').valueOf();
        const endOfMonth = moment().month(8).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };
    const onMain = () => {
        const startOfMonth = moment().month(5).startOf('month').valueOf();
        const endOfMonth = moment().month(7).startOf('month').add(1, "months").valueOf();

        setVisibleTimeStart(startOfMonth);
        setVisibleTimeEnd(endOfMonth);
    };


    return (
        <div className="col-span-2">
            <div className="flex items-center justify-between m-4 ">
                <div className="space-x-2">
                    <ButtonUI variant="default" onClick={onPrevClick}>{"<< Month"}</ButtonUI>
                    <ButtonUI onClick={onTodayClick}>{"| Present |"}</ButtonUI>
                    <ButtonUI variant="default" onClick={onNextClick}>{"Month >>"}</ButtonUI>
                </div>
                <div className="space-x-2">
                    <ButtonUI variant="yellow" onClick={on5}>{"5 Maj"}</ButtonUI>
                    <ButtonUI variant="yellow" onClick={on6}>{"6 Qeshor"}</ButtonUI>
                    <ButtonUI variant="yellow" onClick={on7}>{"7 Korrik"}</ButtonUI>
                    <ButtonUI variant="yellow" onClick={on8}>{"8 Gusht"}</ButtonUI>
                    <ButtonUI variant="yellow" onClick={on9}>{"9 Shtator"}</ButtonUI>
                </div>
                <div className="space-x-2">
                    <ButtonUI variant="orange" onClick={on56}>{"5-6"}</ButtonUI>
                    <ButtonUI variant="orange" onClick={on67}>{"6-7"}</ButtonUI>
                    <ButtonUI variant="orange" onClick={on78}>{"7-8"}</ButtonUI>
                    <ButtonUI variant="orange" onClick={on89}>{"8-9"}</ButtonUI>
                </div>
                <div className="space-x-2">
                    <ButtonUI variant="red" onClick={onMain}>{"6-7-8"}</ButtonUI>
                </div>
                <div>
                    {/* <ButtonUI variant="green" onClick={handleOpenCreateClick}>{"Create"}</ButtonUI> */}
                    <ButtonUI variant="green" onClick={() => { bookingModel.onOpen(); }}>{"Create"}</ButtonUI>
                </div>
            </div>
            <br />
            <div className="">
                {!bookingModel.isOpen ?
                    <React.StrictMode>
                        <Timeline
                            groups={groups}
                            items={itemer}
                            defaultTimeStart={moment().add(-2, 'day')}
                            defaultTimeEnd={moment().add(2, 'day')}

                            //////////////////// Code Editor Start
                            visibleTimeStart={visibleTimeStart}
                            visibleTimeEnd={visibleTimeEnd}
                            sidebarWidth={75}
                            onCanvasClick={handleCanvasClick}
                            onCanvasDoubleClick={handleCanvasDoubleClick}
                            onCanvasContextMenu={handleCanvasContextMenu}
                            onItemClick={handleItemClick}
                            onItemSelect={handleItemSelect}
                            onItemContextMenu={handleItemContextMenu}
                            onItemDoubleClick={handleItemDoubleClick}
                            buffer={1}
                        //////////////////// Code Editor End
                        />
                    </React.StrictMode>
                    : null}
            </div>
        </div>

    )
}

export default CalendarCode