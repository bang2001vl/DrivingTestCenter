import { ChangeSet, EditingState, GroupingState, IntegratedEditing, IntegratedGrouping, ViewState } from "@devexpress/dx-react-scheduler";
import { AppointmentForm, Appointments, AppointmentTooltip, ConfirmationDialog, DateNavigator, DayView, GroupingPanel, Resources, Scheduler, TodayButton, Toolbar } from "@devexpress/dx-react-scheduler-material-ui";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import React, { FC, useEffect, useState } from "react";
import Iconify from '../../components/Iconify';
import { styled } from '@mui/material/styles';
import { useRootDialog } from "../../hooks/rootDialog";
import { Box, Container, Stack, Typography } from "@mui/material";
import { addMinutes, isAfter, isBefore, parse } from "date-fns";
import { ActionMeta, MultiValue } from "react-select";
import Rooms from "../../_mocks_/rooms";
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors";
import { FormIkRoom } from "../../components/FormIK/Selectors/Rooms"
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection";
import { ExamCreateUI } from "../exam/examCreateUI";
import { EDIT_METHOD } from "../examCreate";
import { ExamTestCreate } from "../examTest/examTestCreate";

const PREFIX = 'Demo';
const classes = {
    flexibleSpace: `${PREFIX}-flexibleSpace`,
    flexContainer: `${PREFIX}-flexContainer`,
}

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
        flex: 'none',
    },
    [`& .${classes.flexContainer}`]: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface RoomScheduleProp {
    oldData?: any[],
    onSubmitData?: (data: any) => void
    onClickCancel?: () => void
}
interface ISelectable<T = any> {
    label: string,
    value: T
}

interface IData {
    id: number,
    classId: number,
    roomId: number,
    title: string,
    startDate: Date,
    endDate: Date,
    allDay: boolean,
}

function parseScheduleDetail(data: any) {
    const result: IData = {
        id: data.id,
        classId: data.classId,
        roomId: data.roomId,
        title: data.movie.title,
        startDate: new Date(data.dateTimeStart),
        endDate: new Date(data.dateTimeEnd),
        allDay: false,
    }
    return result;
}


export const RoomSchedule: FC<RoomScheduleProp> = (props) => {
    const [data, setData] = useState<IData[]>([]);
    const [openAddSchedule, setOpenAddSchedule] = useState(false);
    const [added, setAdded] = useState<IData[]>([]);
    const [deleted, setDeleted] = useState<IData[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [minTime, setMinTime] = useState("08:00");
    const [selectedRoom, setSelectedRoom] = useState(0);

    const rootDialog = useRootDialog();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // First load
        window.scrollTo(0, 0);
        //  loadShow();
    }, [selectedDate]);


    console.log("Render with");
    console.log("SelectedData", selectedDate);
    console.log("Data", data);

    const handleSubmit = () => {
        if (props.onSubmitData) {
            props.onSubmitData({
                added: added.map(e => ({
                    classId: Number(e.classId),
                    roomId: Number(e.roomId),
                    dateTimeStart: e.startDate.toISOString(),
                    dateTimeEnd: e.endDate.toISOString(),
                })),
                deleted: deleted.map(e => e.id)
            });
        }
    }

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    }

    const getnewid = () => {
        let temp = 1;
        data.forEach(e => {
            temp = temp > e.id ? e.id : temp;
        });
        added.forEach(e => {
            temp = temp > e.id ? e.id : temp;
        });
        return temp + 1;
    }

    const commitChanges = (change: ChangeSet) => {
        if (change.added) {
            console.log("added showtime", change.added);

            if (validShowTime(change.added as any)) {
                const startingAddedId = getnewid();
                setAdded(added.concat([{ id: startingAddedId, ...change.added } as any]));
            }
        }
        if (change.changed) {
            console.log("changed showtime", change.changed);
            // data = data.map(showTime => (
            //     change.changed![showTime.id] ? { ...showTime, ...change.changed![showTime.id] } : showTime));
        }
        if (change.deleted !== undefined) {
            console.log("deleted showtime", change.deleted);
            const showId = change.deleted;
            let temp = added.find(e => e.id === showId);
            if (temp) {
                setAdded(added.filter(e => e !== temp));
            } else {
                temp = data.find(e => e.id === showId);
                if (temp) {
                    setDeleted(deleted.concat([temp]));
                }
            }
        }
    }

    const validShowTime = (showTime: IData) => {
        let isValid = true;
        showTimes.forEach(e => {
            let timeConflict = isBefore(e.startDate, showTime.startDate)
                ? isAfter(e.endDate, showTime.startDate)
                : isBefore(e.startDate, showTime.endDate);
            if (timeConflict) {
                if (e.roomId === showTime.roomId) {
                    window.alert("Khung giờ có lịch khác!");
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    const onSelectedShowtimeChange = (newValue: MultiValue<ISelectable>, actionMeta: ActionMeta<ISelectable>) => {
        setSelectedRoom(parseInt((newValue as unknown as ISelectable).value));
    }

    const FlexibleSpace = (({ ...restProps }) => (
        <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
            <Stack direction='row' spacing={2} className={classes.flexContainer}>
                <Button
                    onClick={() => {
                        rootDialog.openDialog({
                            children: <ExamTestCreate method={EDIT_METHOD.create}  onSuccess={()=>rootDialog.closeDialog()} onClose={()=>rootDialog.closeDialog()}>
                            </ExamTestCreate>

                        })
                    }}
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                >
                    Thêm ca thi
                </Button>
                <Button
                    onClick={() => {
                        rootDialog.openDialog({
                            children: <Stack>
                                <Typography variant="h4" gutterBottom style={{ color: "#3C557A" }}>Thêm lịch học</Typography>
                            </Stack>
                    })
                }}
            
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}>
                    Thêm lịch học
                </Button>
            </Stack>
        </StyledToolbarFlexibleSpace>
    ));

    const onConfirmAddSchedule = () => {
        const startDateTime = parse(minTime, "HH:mm", selectedDate);
        const endDateTime = parse(minTime, "HH:mm", selectedDate);
        const startingAddedId = getnewid;
        const newShow = {
            id: startingAddedId,
            title: "",
            roomId: selectedRoom,
            startDate: startDateTime,
            endDate: endDateTime,
            allDay: false,
        };
        commitChanges({
            added: newShow
        });
        setOpenAddSchedule(false);
    }
    function getRoomsResource() {
        const rooms: { id: number; text: string; }[] = [];
        Rooms.map((item, index) => {
            rooms.push({
                id: index,
                text: item,
            })
        })

        return [{
            fieldName: 'roomId',
            title: 'Room',
            instances: rooms,
        }];
    }
    const showTimes = data
        .filter(e => !deleted.includes(e))
        .concat(added);

    const resources = getRoomsResource();
    const grouping = [{
        resourceName: 'roomId',
    }];

    return <Box>
        <Paper sx={{ mb: 2, borderRadius: "10px", marginTop: 2 }}>
            <Scheduler
                data={showTimes}
                height={660}
                locale={"vi-VN"}
            >
                <ViewState
                    currentDate={selectedDate}
                    onCurrentDateChange={handleDateChange}
                />
                <EditingState
                    onCommitChanges={commitChanges}
                />
                <GroupingState
                    grouping={grouping}
                />
                <DayView
                    startDayHour={6}
                    endDayHour={24}
                    cellDuration={90}
                />
                <Appointments />
                <Resources
                    data={resources}
                    mainResourceName="roomId" />

                <IntegratedEditing />
                <IntegratedGrouping />
                <Toolbar
                    flexibleSpaceComponent={FlexibleSpace}
                />
                <DateNavigator />
                <TodayButton> </TodayButton>
                <AppointmentTooltip showDeleteButton />
                <ConfirmationDialog />
                <GroupingPanel />
            </Scheduler>
        </Paper>
    </Box>
}
