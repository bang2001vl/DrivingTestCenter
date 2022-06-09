import { Container, Grid, Typography } from "@mui/material";
import DashboardChart from "../components/dashboardChart";
import AppWidgetSummary from "../components/dashboardItem";
import Page from "../components/Page";

const HomePage = () => {
    // const getDate()
    // {
    //     return 1;
    // }
    return (
        //@ts-ignore
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Chào mừng trở lại,
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Doanh thu tuần" total={7140000} icon={'fa-solid:money-bill-wave'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Học viên mới" total={135} color="info" icon={'carbon:user-avatar-filled'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Lượt đăng ký mới" total={172} color="warning" icon={'academicons:preregistered'} sx={undefined} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Kỳ thi sắp mở" total={2} color="success" icon={'healthicons:i-exam-multiple-choice'} sx={undefined} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={12}>
                        <DashboardChart
                            title="Doanh thu tháng"
                            subheader=""
                            chartLabels={[
                                '01/01',
                                '02/01',
                                '03/01',
                                '04/01',
                                '05/01',
                                '06/01',
                                '07/01',
                                '08/01',
                                '09/01',
                                '10/01',
                                '11/01',
                              ]}
                            chartData={[
                                {
                                    name: 'Tháng 1/2022',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: [44000, 55000, 41000, 67000, 22000, 43000, 21000, 41000, 56000, 27000, 43000],
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