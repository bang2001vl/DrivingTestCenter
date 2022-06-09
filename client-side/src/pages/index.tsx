import { Container, Grid, Typography } from "@mui/material";
import { compareAsc, differenceInBusinessDays, differenceInCalendarDays } from "date-fns";
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";
import { useEffect, useState } from "react";
import DashboardChart from "../components/dashboardChart";
import AppWidgetSummary from "../components/dashboardItem";
import Page from "../components/Page";
import { appConfig } from "../configs";
import useAPI from "../hooks/useApi";
import { DialogHelper } from "../singleton/dialogHelper";

interface IData {
    countNewStudent: number,
    countPreStartClass: number,
    countPreStartExamTest: number,
    revenueReportDailyList: { rdate: string, totalRevenue: number }[],
}
const HomePage = () => {
    const api = useAPI();

    const [statisticData, setStatisticData] = useState<IData>({
        countNewStudent: 0,
        countPreStartClass: 0,
        countPreStartExamTest: 0,
        revenueReportDailyList: [],
    });
    const [dateTimeStart] = useState(addMonths(new Date(), -1));
    const [dateTimeEnd] = useState(new Date());

    useEffect(() => {
        api.get<IData>(`${appConfig.backendUri}/statistic/dashboard?dateTimeStart=${dateTimeStart.toISOString()}&dateTimeEnd=${dateTimeEnd.toISOString()}`)
            .then(res => {
                if (res.result && res.data) {
                    console.log("Before", res.data.revenueReportDailyList);
                    
                    const rs: any[] = [];
                    let a = dateTimeStart;
                    res.data.revenueReportDailyList.sort((a, b)=> compareAsc(new Date(a.rdate), new Date(b.rdate)));
                    res.data.revenueReportDailyList.forEach(e => {
                        const d = new Date(e.rdate);
                        while(a < d && differenceInCalendarDays(a, d) < 0){
                            rs.push({rdate: a.toISOString(), totalRevenue: 0});
                            a = addDays(a, 1);
                        }
                        rs.push(e);
                        a = addDays(a, 1);
                    });
                    while(differenceInCalendarDays(a, dateTimeEnd) <= 0){
                        rs.push({rdate: a.toISOString(), totalRevenue: 0});
                        a = addDays(a, 1);
                    }
                    res.data.revenueReportDailyList = rs;
                    console.log("After", res.data.revenueReportDailyList);
                    setStatisticData(res.data);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
    }, [dateTimeStart, dateTimeEnd]);

    const getMonthRevenue = ()=>{
        let rs = 0;
        statisticData.revenueReportDailyList.forEach(e => rs += e.totalRevenue);
        return rs;
    }

    return (
        //@ts-ignore
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Chào mừng trở lại,
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Doanh thu tuần" total={getMonthRevenue()} icon={'fa-solid:money-bill-wave'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Học viên mới" total={statisticData.countNewStudent} color="info" icon={'carbon:user-avatar-filled'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Lớp học sắp mở" total={statisticData.countPreStartClass} color="warning" icon={'academicons:preregistered'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Kỳ thi sắp mở" total={statisticData.countPreStartExamTest} color="success" icon={'healthicons:i-exam-multiple-choice'} sx={undefined} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={12}>
                        <DashboardChart
                            title="Doanh thu tháng"
                            subheader=""
                            chartLabels={statisticData.revenueReportDailyList.map(e => format(new Date(e.rdate), "dd/MM"))}
                            chartData={[
                                {
                                    name: `${format(dateTimeStart, "dd/MM")} - ${format(dateTimeEnd, "dd/MM")}`,
                                    type: 'area',
                                    fill: 'gradient',
                                    data: statisticData.revenueReportDailyList.map(e => e.totalRevenue),
                                },
                                // {
                                //     name: 'Tháng trước',
                                //     type: 'line',
                                //     fill: 'solid',
                                //     data: [3000, 25000, 3006, 3000, 40005, 30005, 64000, 5200, 5900, 36000, 39000],
                                // },
                            ]}
                        />
                    </Grid>

                </Grid>
            </Container>
        </Page>
    )
}

export default HomePage;