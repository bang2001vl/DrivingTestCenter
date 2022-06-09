import { Grid } from "@mui/material";
import { type } from "os";
import { FC } from "react";
import { CourseCard } from "../../components/Course";
interface IProps {
    dataList: IData[],
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
    onDetail?: (data: IData) => void,
}


interface IData {
    id: number,
    name: string,
    price: number,
    location: string,
    dateStart: Date,
    dateEnd: Date,
    maxMember: number,
    countMember: number
}

export type CourseTableProps = IData;

export const CoursesTable: FC<IProps> = (props) => {
    function renderItem(item: IData) {
        return <Grid key={item.id} item xs={12} sm={6} md={4}>
            <CourseCard 
            name={item.name} 
            price={item.price} 
            location={item.location} 
            dateStart={item.dateStart} 
            dateEnd={item.dateEnd} 
            maxMember={item.maxMember} 
            item={item} 
            onDelete={props.onDelete} 
            onEdit={props.onEdit} 
            onDetail={props.onDetail}
            countMember={item.countMember}>
            </CourseCard>
        </Grid>
    }

    return <Grid container spacing={3}>
        {props.dataList.map(e => renderItem(e))}
        {/* <Grid key={1} item xs={12} sm={6} md={4}>
            <CourseCard name='Thi A1' price={20000} location="abc" dateStart={new Date()} dateEnd={new Date()} maxMember={40} onDelete={() => props.onDelete} onEdit={() => props.onEdit} countMember={0}></CourseCard>
        </Grid> */}
    </Grid>
}