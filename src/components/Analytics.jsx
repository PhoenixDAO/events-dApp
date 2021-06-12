import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
    Grid,
    IconButton,
    Button,
    FormControl,
    Select,
    Typography,
} from "@material-ui/core";
import BuyPHNXButton from "./common/BuyPhnxButton"
import { KeyboardBackspace } from "@material-ui/icons";
// import {Graph} from "../utils/graph";
import { Line } from 'react-chartjs-2';
import EventsAnalytics from "./EventsAnalytics";

const useStyles = makeStyles((theme) => ({
    content: {
        backgroundColor: "white",
        margin: "40px 0px",
        padding: "50px",
        borderRadius: "8px"
    },
    select: {
        width: "170px",
        marginTop: "10px",
        marginBottom: "10px",
        height: "40px",
        "& .MuiSelect-outlined": {
            padding: "10px",
        },
        [theme.breakpoints.down("xs")]: {
            width: "auto",
            minWidth: "141px",
        },
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "flexEnd",
        marginBottom: "25px",


    },
    heading: {
        display: "flex",
        alignItems: "center",
        color: "#413AE2",
        fontSize: "28px",
        fontWeight: "600",
    },
    box: {
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "20px",
        "&:active": {
            border: "8px solid #F2F2FD"
        },
        "&:focus": {
            border: "8px solid #F2F2FD",
            outline: "none"
        },
        backgroundColor: "white",
        maxWidth: "31%",
        textAlign: "inherit"
    },
    yellow: {
        borderLeft: "4px solid #E5AB00",
    },
    blue: {
        borderLeft: "4px solid #413AE2",

    },
    purple: {
        borderLeft: "4px solid #963AE2",

    },
    dollar: {
        color: "#73727D",
        textTransform: "uppercase"
    },
    total: {
        color: "#1E1E22",
        fontSize: "24px",
        fontWeight: "700",
        paddingRight: "10px"
    },
    green: {
        backgroundColor: "#E6FEF3",
        color: '#07A287',
        width: "57px",
        textAlign: "center",
        borderRadius: "10px"
    },
    red: {
        backgroundColor: "#FEECEC",
        color: '#F43C3C',
        width: "57px",
        textAlign: "center",
        borderRadius: "10px"
    },
    status: {
        fontSize: "14px",
        color: "#73727D",
        paddingTop: "15px"
    },
   
}));

const Analytics = (props, context) => {
    const {
        // event_data,
        // date,

    } = props;

    useEffect(() => {
        getPhnxRevenue();

    }, []);
    const classes = useStyles();
    const [graphData, setGraphData] = useState("");
    const goBack = () => {
        this.props.history.goBack();
    }
    //for graph datasets
    let dataset = [];
    const getPhnxRevenue = () => {
        dataset = [1, 2, 34, 5, 6, 7]
        setGraphData(dataset);
    }
    const getDollarRevenue = () => {
        dataset = [2, 5, 2, 8, 3, 2]
        setGraphData(dataset);
    }
    const getSoldTickets = () => {
        dataset = [4, 7, 8, 93, 32, 21];
        setGraphData(dataset);
    }

    const chartOptions = {
        // capBezierPoints: true,
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                gridLines: {
                    drawBorder: true,
                    display: true,
                    borderDash: [8, 4],
                },
                ticks: {
                    display: true,
                    fontColor: "black",
                    fontWeight: "700",
                    fontSize: 16
                },
                scaleLabel: {
                    display: true,
                    labelString: 'REVENUE',
                    fontSize: 14,
                    fontColor: "#73727D",
                }
            }],
            xAxes: [{
                gridLines: {
                    drawBorder: false,
                    display: false,
                },
                ticks: {
                    display: true, //this will remove only the label
                    fontColor: "black",
                    fontWeight: "700",
                    fontSize: 16
                },
                scaleLabel: {
                    display: true,
                    labelString: 'DATE',
                    fontSize: 14,
                    fontColor: "#73727D"
                }
            }],
        },
    };
    const data = (canvas) => {
        const ctx = canvas.getContext('2d')
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#F2F2FD');
        gradient.addColorStop(1, 'rgba(242, 242, 253, 0)');

        return {
            labels: ["jan", "feb", "march", "april", "may"],

            datasets: [
                {
                    backgroundColor: gradient,
                    pointColor: "#fff",
                    fill: 'start',
                    pointHighlightStroke: "#ff6c23",
                    pointRadius: 7,
                    pointBackgroundColor: "white",
                    data: graphData,
                    type: 'line',
                    borderColor: '#7E7AEB',
                    borderWidth: 2,
                },
            ]
        }
    }

    return (
        <div>
            <Grid className="header3">
                <h2>
                    <IconButton
                        aria-label="delete"
                        onClick={goBack}
                    >
                        <KeyboardBackspace
                            fontSize="large"
                            style={{ fill: "#1E1E22" }}
                        />
                    </IconButton>
                    <span>&nbsp;&nbsp;</span>
                    Analytics
                </h2>
                <div>
                    <BuyPHNXButton />
                </div>
            </Grid>
            <Grid container className={classes.content}>
                <Grid className={classes.row}>
                    <h3 className={classes.heading}>
                        Earnings
                    </h3>
                    <FormControl
                        variant="outlined"
                        className={classes.select}
                    >
                        <Select
                            native
                            // value={state.age}
                            // onChange={handleChange}
                            inputProps={{
                                name: "age",
                                id: "outlined-age-native-simple",
                            }}
                        >

                            <option value="Today">
                                Today
                            </option>
                            <option
                                aria-label="None"
                                value="Yesterday"
                            >
                                Yesterday
                                </option>
                            <option value="Last 7 Days">
                                Last 7 Days
												</option>
                            <option value="Last 28 Days">
                                Last 28 Days
												</option>
                            <option value="Last 90 Days">
                                Last 90 Days
												</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container style={{ justifyContent: "space-evenly" }}>
                    <Grid lg={4} item className={[classes.box, classes.yellow]} onClick={getDollarRevenue} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>Dollar Revenue</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>$2640</Typography>
                            <Typography className={classes.red}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You made an extra $300k in the last 7 days</Typography>
                    </Grid>
                    <Grid lg={4} item className={[classes.box, classes.blue]} onClick={getPhnxRevenue} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>PHNX Revenue</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>2640PHNX</Typography>
                            <Typography className={classes.red}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You made an extra $300k in the last 7 days
                    </Typography>
                    </Grid>
                    <Grid lg={4} item className={[classes.box, classes.purple]} onClick={getSoldTickets} component="button">
                        <img
                            src={"/images/icons/Dollar.png"}
                            className={classes.phoenix}
                            alt="Event Price"
                        />
                        <Typography className={classes.dollar}>Tickets Sold</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography className={classes.total}>640</Typography>
                            <Typography className={classes.green}>+10%</Typography>
                        </div>

                        <Typography className={classes.status}>You sold 5 Tickets less this last 7 days
                    </Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ margin: "70px 0px" }}>
                    <Line data={data} options={chartOptions} />

                </Grid>
               <EventsAnalytics/>
            </Grid>
        </div>
    );
};
Analytics.contextTypes = {
    drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {

    return {
        contracts: state.contracts,
        accounts: state.accounts[0],
        networkId: state.web3.networkId,
    };
};

const AppContainer = drizzleConnect(Analytics, mapStateToProps);
export default AppContainer;
