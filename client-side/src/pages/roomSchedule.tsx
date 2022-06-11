import { Container, Typography, Stack } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import Page from "../components/Page";
import { appConfig } from "../configs";
import useAPI from "../hooks/useApi";
import { DialogHelper } from "../singleton/dialogHelper";
import  { RoomSchedule } from "./courses/CourseSchedule";
import { BasicPage, BasicPageProps } from "./_builder/PageBuilder";



const RoomSchedulePage = () => {
    const api = useAPI();
    const navigate = useNavigate();
    return (
        // @ts-ignore
        <Page title="Dashboard | Room Schedule" style={{ paddingLeft: "20px" }}>
            <Container style={{ maxWidth: '1920px' }}>
                <Stack  mb={1.5}>
                    <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                        Lịch phòng
                    </Typography>
                    <RoomSchedule></RoomSchedule>
                </Stack>
            </Container>
        </Page>
    )
}
export default RoomSchedulePage;