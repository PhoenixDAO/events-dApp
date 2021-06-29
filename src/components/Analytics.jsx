import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Grid, FormControl, Select } from "@material-ui/core";
import BuyPHNXButton from "./common/BuyPhnxButton";
// import {Graph} from "../utils/graph";
import { Doughnut, Line } from "react-chartjs-2";
import EventsAnalytics from "./EventsAnalytics";
import { Card } from "./common/Card";
import { getEvents } from "../utils/getEvents";
import { getUserDetails } from "../config/serverAPIs";

const useStyles = makeStyles((theme) => ({
    content: {
        backgroundColor: "white",
        margin: "40px 0px",
        padding: "50px",
        borderRadius: "8px",
        paddingBottom: "80px",
        [theme.breakpoints.down("xs")]: {
            padding: "10px",
        }
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
        },
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        marginBottom: "25px",
        [theme.breakpoints.down("xs")]: {
            display: "grid"
        }
    },
    heading: {
        display: "flex",
        alignItems: "center",
        color: "#413AE2",
        fontSize: "28px",
        fontWeight: "600",
        alignItems: "center",
    },
    box: {
        border: "1px solid #E4E4E7",
        borderRadius: "8px",
        padding: "30px 20px",
        backgroundColor: "white",
        textAlign: "inherit",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "40px",
        width: "100%"
    },
    heading2: {
        fontSize: "20px",
        fontWeight: "700"
    },
    row2: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        "& span": {
            color: "#73727D",
            fontSize: "18px",
            marginBottom: "15px"
        }
    },
    city: {
        fontSize: "18px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        display: "flex",
        alignItems: "baseline",
        [theme.breakpoints.down("xs")]: {
            fontSize: "16px",
        }
    },
    ticketSold: {
        color: "#4E4E55",
        paddingRight: "10px",
        fontSize: "18px",
        [theme.breakpoints.down("xs")]: {
            fontSize: "16px",
        }
    },
    row3: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 0px",
        borderBottom: "1px solid #E4E4E7",
        margin: "0px 10px"
    },
    chartDiv: {
        // background: `url('/images/graph.svg') no-repeat center 87px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            marginTop: "35px",
            // background: `url('/images/graph.svg') no-repeat center`,
        },
        [theme.breakpoints.down("xs")]: {
            marginTop: "35px",
            // background: `url('/images/graph.svg') no-repeat center`,
            backgroundSize: "300px 100px"
        }
    },
    highlighter: {
        width: "10px",
        height: "10px",
        display: "flex",
        borderRadius: "50%",
        marginRight: "12px",
    },
    Top5Events: {
        marginTop: "60px",
        width: "100%"
    },
    header: {
        color: "#73727D",
        fontSize: "18px",
        marginBottom: "15px"
    },
    image: {
        position: "absolute",
        paddingTop: "25px",
        width: "14%",
        zIndex:0,
        [theme.breakpoints.down("xl")]: {
            width: "7%"
        },
        [theme.breakpoints.down("lg")]: {
            width: "14%"
        },
        [theme.breakpoints.down("md")]: {
            width: "14%"
        },
        [theme.breakpoints.down("sm")]: {
            width: "30%"
        },
        [theme.breakpoints.down("xs")]: {
            width: "20%",
            paddingTop:"13px"
        }
    }
}));

const TicketSales = [
	{
		eventCity: "melbourne",
		TicketSold: 9,
	},
	{
		eventCity: "karachi",
		TicketSold: 9,
	},
	{
		eventCity: "Sydney",
		TicketSold: 8,
	},
	{
		eventCity: "Singapore",
		TicketSold: 8,
	},
	{
		eventCity: "New York",
		TicketSold: 4,
	},
];
//for doughnut chart
const chartColors = ["#ACFFE3", "#96A6FF", "#FF8795", "#E8B56B", "#D0A6F2"];
const data2 = {
	maintainAspectRatio: false,
	responsive: false,
	labels: TicketSales.map((event) => {
		return event.eventCity;
	}),
	datasets: [
		{
			data: TicketSales.map((event) => {
				return event.TicketSold;
			}),
			backgroundColor: chartColors,
			hoverBackgroundColor: chartColors,
		},
	],
};
//doughnut chart options
    const options2 = {
        legend: {
            display: false,
            position: "right"
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        layout: {
            margin: {
               bottom: 25  //set that fits the best
            }
         },
        plugins: {
            doughnutlabel: {
                labels: [{
                    text: '550',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }, {
                    text: 'total'
                }]
            }
        },
        cutoutPercentage: 85,
        tooltips: {
           zIndex: 99 ,
            callbacks: {
                title: function (tooltipItem, data) {
                    return (data['labels'][tooltipItem[0]['index']]);
                },
                label: function (tooltipItem, data) {
                    return data['datasets'][0]['data'][tooltipItem['index']] + " Tickets";
                },
                // afterLabel: function (tooltipItem, data) {
                //     var dataset = data['datasets'][0];
                //     var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
                //     return '(' + percent + '%)';
                // }
            },
            backgroundColor: 'black',
            titleFontSize: 16,
            xPadding: 15,
            yPadding: 15,
            titleFontColor: '#fff',
            bodyFontColor: '#E4E4E7',
            bodyFontSize: 14,
            displayColors: false,
            position: 'nearest',
            yAlign: 'bottom',
            x:40,
y:40
        }
    };
    //line chart options
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
    
const Analytics = (props, context) => {
	// const {
	//     // event_data,
	//     // date,

	// } = props;
	useEffect(() => {
		getPhnxRevenue();
		getViewsAndFavourites();
	}, []);
	const classes = useStyles();
	const [graphData, setGraphData] = useState("");
	const [userDetails, setUserDetails] = useState(null)
	const goBack = () => {
		this.props.history.goBack();
	};
	//for graph datasets
	let dataset = [];

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
                    pointHighlightStroke: "#FF6C23",
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

	const getPhnxRevenue = () => {
		dataset = [1, 2, 34, 0, 6, 7];
		setGraphData(dataset);
	};
	const getDollarRevenue = () => {
		dataset = [2, 5, 2, 8, 3, 2];
		setGraphData(dataset);
	};
	const getSoldTickets = () => {
		dataset = [4, 7, 8, 93, 32, 21];
		setGraphData(dataset);
	};
	const TicketAnalytics = () => {
		return TicketSales.map((event, index) => (
			<Grid className={classes.row3}>
				<Grid className={classes.city}>
					<div
						className={classes.highlighter}
						style={{ backgroundColor: chartColors[index] }}
					></div>
					{event.eventCity}
				</Grid>
				<Grid className={classes.ticketSold}>{event.TicketSold}</Grid>
			</Grid>
		));
	};
	const getViewsAndFavourites = async () =>{
		const userDetails= await getUserDetails({address:props.accounts,networkId:props.networkId});
		if (!userDetails.error){
			setUserDetails(userDetails.result.result);
		}else{
			
		}

	}

	let Events = getEvents({ _isMounted: true, accounts: props.accounts });
	console.log("result", Events);
	const Top5Events = () => {
		return Events.map((event, index) => (
			<Grid className={classes.row3}>
				<Grid lg={3} className={classes.ticketSold}>
					<i
						className="fa fa-ticket-alt"
						title="My Tickets"
						style={{ color: "#73727D", paddingRight: "10px" }}
					></i>
					{event.sold}
				</Grid>
				<Grid lg={6} className={classes.city}>
					{event.name}
				</Grid>
				<Grid
					lg={3}
					className={classes.ticketSold}
					style={{ textAlign: "end" }}
				>
					{event.revenueOfEvent / 1000000000000000000} PHNX
				</Grid>
			</Grid>
		));
	};



	return (
		<div>
			<Grid className="header3">
				<h2>
					Analytics
				</h2>
				<div>
					<BuyPHNXButton />
				</div>
			</Grid>
			<Grid container className={classes.content}>
				<Grid className={classes.row}>
					<h3 className={classes.heading}>Earnings</h3>

					<FormControl variant="outlined" className={classes.select}>
						<Select
							native
							// value={state.age}
							// onChange={handleChange}
							inputProps={{
								name: "age",
								id: "outlined-age-native-simple",
							}}
						>
							<option value="Today">Today</option>
							<option aria-label="None" value="Yesterday">
								Yesterday
							</option>
							<option value="Last 7 Days">Last 7 Days</option>
							<option value="Last 28 Days">Last 28 Days</option>
							<option value="Last 90 Days">Last 90 Days</option>
						</Select>
					</FormControl>
				</Grid>
				<Grid container style={{ justifyContent: "space-evenly" }}>
					<Card
						color="#E5AB00"
						click={getDollarRevenue}
						imageSrc="/images/icons/Dollar.png"
						header="Dollar Revenue"
						value="$2640"
						profit="10%"
					/>
					<Card
						color="#413AE2"
						click={getPhnxRevenue}
						imageSrc="/images/icons/Dollar.png"
						header="Dollar Revenue"
						value="$2640"
						profit="10%"
					/>
					<Card
						color="#963AE2"
						click={getSoldTickets}
						imageSrc="/images/icons/Dollar.png"
						header="Dollar Revenue"
						value="$2640"
						profit="10%"
					/>
				</Grid>
				<Grid container style={{ margin: "70px 0px" }}>
					<Line data={data} options={chartOptions} />
				</Grid>
				<EventsAnalytics userDetails={userDetails}/>
				<Grid className={classes.box}>
					<Grid className={classes.row}>
						<Grid className={classes.row}>
							<h5 className={classes.heading2}>
								Ticket sales by Location
							</h5>
						</Grid>
						<Grid style={{ display: "flex", alignItems: "center" }}>
							<span
								style={{
									color: "#73727D",
									marginRight: "10px",
								}}
							>
								Event
							</span>
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
									<option value="Today">Devfest</option>
									<option aria-label="None" value="Yesterday">
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
					</Grid>

					<Grid container>
						<Grid lg={7} sm={12} xs={12} md={6}>
							<Grid className={classes.row2}>
								<span>Cities</span>
								<span>No of Tickets</span>
							</Grid>
							<TicketAnalytics />
						</Grid>
						<Grid
							lg={5}
							sm={12}
							xs={12}
							md={6}
							className={classes.chartDiv}
						>
							<Doughnut id="doughnut" data={data2} options={options2} />
							<img src="/images/graph.svg" className={classes.image} />
						</Grid>
					</Grid>
				</Grid>

				{/* Top 5 Events */}
				<Grid className={classes.Top5Events}>
					<Grid className={classes.row}>
						<h2 className={classes.heading2}>Top 5 Events</h2>
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
								<option value="Dollar">Dollar</option>

								<option value="PHNX">PHNX</option>
							</Select>
						</FormControl>
					</Grid>

					<Grid className={classes.box} style={{ marginTop: "30px" }}>
						<Grid className={classes.row2}>
							<Grid className={classes.header} lg={3}>
								No of Tickets
							</Grid>
							<Grid className={classes.header} lg={6}>
								Event Name
							</Grid>
							<Grid
								className={classes.header}
								style={{ textAlign: "end" }}
								lg={3}
							>
								Revenue
							</Grid>
						</Grid>
						<Top5Events />
					</Grid>
				</Grid>
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
