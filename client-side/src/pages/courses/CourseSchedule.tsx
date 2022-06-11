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
import useAPI from "../../hooks/useApi";
import { appConfig } from "../../configs";
import { DialogHelper } from "../../singleton/dialogHelper";
import { ExamTestController } from "../../api/controllers/examTest";
import { ClassScheduleController } from "../../api/controllers/classScheduleController";
import { ClassScheduleCreate } from "../classSchedule/classScheduleCreate";
import { AccountSingleton } from "../../singleton/account";

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
    roomId: number,
    title: string,
    startDate: Date,
    endDate: Date,
    allDay: boolean,
    sourceData: any,
}

export const RoomSchedule: FC<RoomScheduleProp> = (props) => {
    const [data, setData] = useState<IData[]>([]);
    const [openAddSchedule, setOpenAddSchedule] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [minTime, setMinTime] = useState("08:00");
    const [selectedRoom, setSelectedRoom] = useState(0);
    const [examTestList, setExamTestList] = useState<any[]>([]);
    const [classScheduleList, setClassScheduleList] = useState<any[]>([]);
    const api = useAPI();

    const rootDialog = useRootDialog();

    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = AccountSingleton.instance.isAdmin;

    useEffect(() => {
        // First load
        window.scrollTo(0, 0);
        loadData(selectedDate);
        //  loadShow();
    }, [selectedDate]);

    useEffect(() => {
        let id = 0;
        const dataList: IData[] = [];
        for (let i = 0; i < examTestList.length; i++) {
            const item = examTestList[i];
            dataList.push({
                id: id,
                roomId: Rooms.indexOf(item.location),
                title: `[Thi]: ${item.name}`,
                startDate: new Date(item.dateTimeStart),
                endDate: new Date(item.dateTimeEnd),
                allDay: false,
                sourceData: item,
            });
            id++;
        }
        for (let i = 0; i < classScheduleList.length; i++) {
            const item = classScheduleList[i];
            dataList.push({
                id: id,
                roomId: Rooms.indexOf(item.location),
                title: `[Học]: ${item.classTitle}`,
                startDate: new Date(item.dateTimeStart),
                endDate: new Date(item.dateTimeEnd),
                allDay: false,
                sourceData: item,
            });
            id++;
        }
        setData(dataList);
    }, [examTestList, classScheduleList]);

    function loadData(date: Date) {
        const params = new URLSearchParams({
            dateTimeStart: parse("00:00", "HH:mm", date).toISOString(),
            dateTimeEnd: parse("23:59", "HH:mm", date).toISOString(),
        })
        api.get(
            `${appConfig.backendUri}/schedule/select?${params.toString()}`
        ).then(res => {
            if (res.result) {
                setExamTestList(res.data["examTestList"]);
                setClassScheduleList(res.data["classScheduleList"]);
            }
            else {
                DialogHelper.showError(res.errorMessage);
            }
        })
    }

    console.log("Render with");
    console.log("SelectedData", selectedDate);
    console.log("Data", data);

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    }

    const FlexibleSpace = (({ ...restProps }) => (
        <StyledToolbarFlexibleSpace {...restProps} className={classes.flexibleSpace}>
            {(isAdmin) ?
                <Stack direction='row' spacing={2} className={classes.flexContainer}>
                    <Button
                        onClick={() => {
                            rootDialog.openDialog({
                                children: <ExamTestCreate method={EDIT_METHOD.create}
                                    title="Thêm ca thi"
                                    onSuccess={() => {
                                        loadData(selectedDate);
                                        rootDialog.closeDialog();
                                    }}
                                    onClose={() => rootDialog.closeDialog()}>
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
                                children: <ClassScheduleCreate method={EDIT_METHOD.create}
                                    title="Thêm lịch học"
                                    onSuccess={() => {
                                        loadData(selectedDate);
                                        rootDialog.closeDialog();
                                    }}
                                    onClose={() => rootDialog.closeDialog()}
                                >

                                </ClassScheduleCreate>
                            })
                        }}

                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}>
                        Thêm lịch học
                    </Button>
                </Stack> : <></>
            }
        </StyledToolbarFlexibleSpace>
    ));

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
    const resources = getRoomsResource();
    const grouping = [{
        resourceName: 'roomId',
    }];

    return <Box>
        <Paper sx={{ mb: 2, borderRadius: "10px", marginTop: 2 }}>
            <Scheduler
                data={data}
                //   height={660}
                locale={"vi-VN"}
            >
                <ViewState
                    currentDate={selectedDate}
                    onCurrentDateChange={handleDateChange}
                />
                <EditingState
                    onCommitChanges={async (change) => {
                        if (change.deleted !== undefined) {
                            console.log("OnDeleted", change.deleted);

                            if (!isNaN(Number(change.deleted))) {
                                const item = data.find(d => d.id === Number(change.deleted));
                                console.log("OnDeleted Item", item);
                                if (item) {
                                    let res: any;

                                    if (item.title.includes("[Thi]")) {
                                        res = await new ExamTestController().deleteFromDB([item.sourceData.id], api);
                                    }
                                    else if (item.title.includes("[Học]")) {
                                        res = await new ClassScheduleController(api).deleteFromDB([item.sourceData.id]);
                                    }

                                    if (res.result) {
                                        loadData(selectedDate);
                                    }
                                    else {
                                        DialogHelper.showError(res.errorMessage);
                                    }
                                }
                            }
                        }
                    }}
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
                    flexibleSpaceComponent={FlexibleSpace} />
                <DateNavigator />
                <TodayButton> </TodayButton>
                { (isAdmin)?
                <AppointmentTooltip  showDeleteButton />:  <AppointmentTooltip/>}
                <ConfirmationDialog />
                <GroupingPanel />
            </Scheduler>
        </Paper>
    </Box>
}
