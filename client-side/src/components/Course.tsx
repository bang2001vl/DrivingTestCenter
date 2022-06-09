import { Circle, RsvpTwoTone } from "@mui/icons-material";
import { Typography, Card, Stack, Box, Divider, Avatar } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC, useRef, useState } from "react";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import { MyThumb } from "./myThumb";

export interface CourseProps {
    name: string,
    price: number,
    location: string,
    dateStart: Date,
    dateEnd: Date,
    maxMember: number,
    countMember: number,
    item?: any,
    onDelete?: (data: any) => void,
    onEdit?: (data: any) => void,
    onDetail?: (data: any) => void,
}

export const CourseCard: FC<CourseProps> = (props) => {
    let dateFormat = "dd/MM/yyyy";

    function getStatus() {
        const now = new Date();
        if (isBefore(props.dateStart, now)) {
            return {
                text: "Sắp mở",
                color: "#1BB3E3",
            }
        }
        else if (isAfter(props.dateEnd, now)) {
            return {
                text: "Kết thúc",
                color: "#E31B1B",
            };
        }
        else {
            return {
                text: "Đang thực hiện",
                color: "#00DB99",
            };
        }
    }

    const getActions = ()=>{
        const actions = [];
        if(props.onDelete){
            actions.push({
                label: "Delete",
                iconURI: "eva:trash-2-outline",
                onClick: props.onDelete
            });
        }
        if(props.onEdit){
            actions.push({
                label: "Edit",
                iconURI: "eva:edit-fill",
                onClick: props.onDetail
            });
        }
        if(props.onDetail){
            actions.push({
                label: "Detail",
                iconURI: "eva:person-add-outline",
                onClick: props.onDetail
            });
        }
        return actions;
    }

    return <Card sx={{ minHeight: 200, p: 2 }} >
        <Stack direction='row' justifyContent='space-between'>

            <Stack direction='column' spacing={0.5}>
                <Typography variant="h6" noWrap>
                    {props.name}
                </Typography>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                    <Circle style={{color: getStatus().color, fontSize:'8px'}}></Circle>
                    <Typography
                        variant="subtitle2"
                        color={getStatus().color} >
                        {getStatus().text}
                    </Typography>
                </Stack>

            </Stack>

            <ItemMoreMenu
                data={props.item}
                items={getActions()}
            ></ItemMoreMenu>

        </Stack>
        <Stack direction='row' sx={{ paddingTop: '10px', verticalAlign: "center" }} justifyContent="space-between">
            <Stack direction='row' spacing={4} alignItems="center">
                <Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bắt đầu</Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '13px' }}>{`${format(props.dateStart, dateFormat)} `}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Kết thúc</Typography>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '13px' }}>{`${format(props.dateEnd, dateFormat)} `}</Typography>
                </Stack>
            </Stack>
            <Stack spacing={1}
                style={{ backgroundColor: "#f9f9f9", borderRadius: "5px" }}
                padding={1}
                direction='row'
                divider={<Divider orientation="vertical" flexItem />}>
                <Stack textAlign='center' width={50}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '13px' }}>{props.countMember}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Học viên</Typography>
                </Stack>
                <Stack textAlign='center' width={50}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '13px' }}>{props.maxMember}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tối đa</Typography>
                </Stack>
            </Stack>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: '#00DB99', fontSize: '13', marginTop: "15px" }}>Giảng viên</Typography>
        <Stack>
            <Avatar style={{ height: "30px", width: "30px" }}></Avatar>
        </Stack>

    </Card>

}