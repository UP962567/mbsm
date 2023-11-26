import React, { useEffect, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from "moment";
import Timeline from 'react-calendar-timeline';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

const CalendarCode = ({ params }) => {
    
    const [visibleTimeStart, setVisibleTimeStart] = useState();
    const [visibleTimeEnd, setVisibleTimeEnd] = useState();
    const [open, setOpen] = useState(false);
    const [openTop, setOpenTop] = useState(false);
    const [groupId, setGroupId] = useState();
    const [time, setTime] = useState();
    const [dataTitle, setDataTitle] = useState();
    const [dataStart, setDataStart] = useState();
    const [dataEnd, setDataEnd] = useState();
    const [dataGroup, setDataGroup] = useState();

    useEffect(() => {
        const visibleTimeStart1 = moment().startOf("months").valueOf();
        const visibleTimeEnd1 = moment().startOf("months").add(1, "months").valueOf();

        setVisibleTimeStart(visibleTimeStart1);
        setVisibleTimeEnd(visibleTimeEnd1);
    }, [])


    const handleCanvasClick = (groupId, time) => {
        console.log("Canvas single clicked", groupId, moment(time).format());
    };

    const handleCanvasDoubleClick = (groupId, time) => {
        setTime(time);
        setGroupId(groupId);
        setOpen(true);
    };

    const handleOpenCreateClick = () => {
        setOpenTop(true);
    };

    const handleCanvasContextMenu = (group, time) => {
        console.log("Canvas context menu", group, moment(time).format());
    };

    const handleItemClick = (itemId, _, time) => {
        console.log("Clicked: " + itemId, moment(time).format() + " --- " + Date());
    };

    const handleItemSelect = (itemId, _, time) => {
        console.log("Selected: " + itemId, moment(time).format());
    };

    const handleItemDoubleClick = (itemId, _, time) => {
        console.log("Double Click: " + itemId, moment(time).format());
    };

    const handleItemContextMenu = (itemId, _, time) => {
        console.log("Context Menu: " + itemId, moment(time).format());
    };


    //////////////////////////////////////////////////////////////////////////////////////////////// editing eding
    const [item, setItems] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchData()
        fetchGroup()
    }, [])

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

    const itemer = item.map((item) => {
        return {
            id: item.id,
            group: item.group,
            title: item.title,
            start_time: moment(item.start_time),
            end_time: moment(item.end_time),
            className: "Group" + item.group,
        }
    });

    console.log("Items: ", item)
    console.log("Groups: ", groups)
    console.log("Itemer: ", itemer)




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

    const productData = {
        title: dataTitle,
        start_time: dataStart,
        end_time: dataEnd,
        group: groupId,
        className: "Group" + groupId,
    };

    const productDataCreate = {
        title: dataTitle,
        start_time: dataStart,
        end_time: dataEnd,
        group: dataGroup,
        canMove: false,
        className: "bg-green-500",
    };

    const handleSubmit = async () => {
        axios
            .post(process.env.REACT_APP_API_KEY + 'addcalendar', productData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
                // Handle error: display error message or take other actions
            });
        fetchData();
        setOpen(false);
    };

    const handleSubmitCreate = async () => {
        axios
            .post(process.env.REACT_APP_API_KEY + 'addcalendar', productDataCreate)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
                // Handle error: display error message or take other actions
            });
        fetchData();
        setOpenTop(false);
    };

    return (
        <div className="h-10 w-[560px]">
            <div className="flex items-center justify-between m-4">
                <div className="space-x-2">
                    <Button variant="default" onClick={onPrevClick}>{"<< Month"}</Button>
                    <Button onClick={onTodayClick}>{"| Present |"}</Button>
                    <Button variant="default" onClick={onNextClick}>{"Month >>"}</Button>
                </div>
                <div>
                    <Button variant="green" onClick={() => { }}>{"Create"}</Button>
                </div>
            </div>
            <div className="">
                <React.StrictMode>
                    <Timeline
                        groups={groups}
                        items={itemer}
                        defaultTimeStart={moment().add(-2, 'day')}
                        defaultTimeEnd={moment().add(2, 'day')}

                        //////////////////// Code Editor Start
                        visibleTimeStart={visibleTimeStart}
                        visibleTimeEnd={visibleTimeEnd}
                        sidebarWidth={150}
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
            </div>
        </div>
    )
}

export default CalendarCode