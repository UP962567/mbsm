import React, { useEffect, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from "moment";
import Timeline from 'react-calendar-timeline';
import axios from 'axios';
import { Button as ButtonUI } from '@/components/ui/button';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Separator } from '@/components/ui/separator';


const CalendarCode = ({ params }) => {
    const [loading, setLoading] = useState(false);
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
        console.log("Clicked: " + itemId, moment(time).format());
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


    //////////////////////////////////////////////////////////////////////////////////////////////// Get Data

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

    //////////////////////////////////////////////////////////////////////////////////////////////// Modify Data

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

    const onSubmit = async () => {
        try {
            setLoading(true);
            await axios.post(`/${process.env.NEXT_PUBLIC_API_URL}/${params.storeId}/bookings`, data);
            toast.success("Booking created successfully");
        } catch (error) {
            toast.error('Something went wrong: ' + error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
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
                    <ButtonUI variant="default" onClick={onPrevClick}>{"<< Month"}</ButtonUI>
                    <ButtonUI onClick={onTodayClick}>{"| Present |"}</ButtonUI>
                    <ButtonUI variant="default" onClick={onNextClick}>{"Month >>"}</ButtonUI>
                </div>
                <div>
                    <ButtonUI variant="green" onClick={handleOpenCreateClick}>{"Create"}</ButtonUI>
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

                <Dialog id='createbooking' open={openTop} onClose={(event) => setOpenTop(false)}>
                    <DialogTitle fontSize={24}>Create Booking</DialogTitle>
                    <DialogContent>
                        <DialogContentText fontSize={14}>
                            Please Enter the <b><u>Start date</u></b> and <b><u>End date</u></b>
                        </DialogContentText>

                        <Separator />

                        <div className='flex-col-1'>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Enter Room ID (Like: 204)"
                                type="number"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setDataGroup(event.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Enter Comment (client: Maliq Dyrma)"
                                type="text"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setDataTitle(event.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="start_date"
                                label=""
                                value={time}
                                type="date"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setDataStart(event.target.value)}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="end_date"
                                label=""
                                type="date"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setDataEnd(event.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => setOpenTop(false)}>Cancel</Button>
                        <Button onClick={(event) => handleSubmitCreate()}>Sent</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default CalendarCode