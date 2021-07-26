import React, { useState, useEffect, useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Grid, FormControl, Select } from "@material-ui/core";
// import {Graph} from "../utils/graph";
import { Doughnut, Line } from "react-chartjs-2";
import EventsAnalytics from "./EventsAnalytics";
import { Card } from "./common/Card";
import { getEvents } from "../utils/getEvents";
import { getUserDetails } from "../config/serverAPIs";
import Header from "./common/Header";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import axios from "axios";
import {
	generateJSON,
	getEventName,
	getTimeData,
	getTodayData,
	getPhoenixDAOMarketValue,
} from "../utils/graphApis";
import Web3 from "web3";
import MyEvents from "./MyEvents";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
	content: {
		backgroundColor: "white",
		margin: "40px 0px",
		padding: "50px",
		borderRadius: "8px",
		paddingBottom: "80px",
		[theme.breakpoints.down("xs")]: {
			padding: "10px",
		},
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
			display: "grid",
		},
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
		width: "100%",
	},
	heading2: {
		fontSize: "20px",
		fontWeight: "700",
	},
	row2: {
		display: "flex",
		justifyContent: "space-between",
		padding: "10px",
		"& span": {
			color: "#73727D",
			fontSize: "18px",
			marginBottom: "15px",
		},
	},
	city: {
		fontSize: "18px",
		fontWeight: "600",
		letterSpacing: "0.5px",
		display: "flex",
		alignItems: "baseline",
		[theme.breakpoints.down("xs")]: {
			fontSize: "16px",
		},
	},
	ticketSold: {
		color: "#4E4E55",
		paddingRight: "10px",
		fontSize: "18px",
		[theme.breakpoints.down("xs")]: {
			fontSize: "16px",
		},
	},
	row3: {
		display: "flex",
		justifyContent: "space-between",
		padding: "15px 0px",
		borderBottom: "1px solid #E4E4E7",
		margin: "0px 10px",
		"&:last-child": {
			borderBottom: "none",
		},
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
			backgroundSize: "300px 100px",
		},
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
		width: "100%",
	},
	header: {
		color: "#73727D",
		fontSize: "18px",
		marginBottom: "15px",
	},
	image: {
		position: "absolute",
		paddingTop: "25px",
		width: "14%",
		zIndex: 0,
		[theme.breakpoints.down("xl")]: {
			width: "7%",
		},
		[theme.breakpoints.down("lg")]: {
			width: "14%",
		},
		[theme.breakpoints.down("md")]: {
			width: "14%",
		},
		[theme.breakpoints.down("sm")]: {
			width: "30%",
		},
		[theme.breakpoints.down("xs")]: {
			width: "20%",
			paddingTop: "13px",
		},
	},
	noTicket: {
		fontSize: "18px",
		fontWeight: "600",
		letterSpacing: "0.5px",
		padding: "10px",
	},
}));

//for doughnut chart
const chartColors = ["#ACFFE3", "#96A6FF", "#FF8795", "#E8B56B", "#D0A6F2"];

//doughnut chart options
const options2 = {
	legend: {
		display: false,
		position: "right",
	},
	elements: {
		arc: {
			borderWidth: 0,
		},
	},
	layout: {
		margin: {
			bottom: 25, //set that fits the best
		},
	},
	plugins: {
		doughnutlabel: {
			labels: [
				{
					text: "550",
					font: {
						size: 20,
						weight: "bold",
					},
				},
				{
					text: "total",
				},
			],
		},
	},
	cutoutPercentage: 85,
	tooltips: {
		zIndex: 99,
		callbacks: {
			title: function (tooltipItem, data) {
				return data["labels"][tooltipItem[0]["index"]];
			},
			label: function (tooltipItem, data) {
				return (
					data["datasets"][0]["data"][tooltipItem["index"]] +
					" Tickets"
				);
			},
			// afterLabel: function (tooltipItem, data) {
			//     var dataset = data['datasets'][0];
			//     var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
			//     return '(' + percent + '%)';
			// }
		},
		backgroundColor: "black",
		titleFontSize: 16,
		xPadding: 15,
		yPadding: 15,
		titleFontColor: "#fff",
		bodyFontColor: "#E4E4E7",
		bodyFontSize: 14,
		displayColors: false,
		position: "nearest",
		yAlign: "bottom",
		x: 40,
		y: 40,
	},
};
//line chart options
const chartOptions = {
	// capBezierPoints: true,
	legend: {
		display: false,
	},
	scales: {
		yAxes: [
			{
				gridLines: {
					drawBorder: true,
					display: true,
					borderDash: [8, 4],
				},
				ticks: {
					display: true,
					fontColor: "black",
					fontWeight: "700",
					fontSize: 16,
				},
				scaleLabel: {
					display: true,
					labelString: "REVENUE",
					fontSize: 14,
					fontColor: "#73727D",
				},
			},
		],
		xAxes: [
			{
				gridLines: {
					drawBorder: false,
					display: false,
				},
				ticks: {
					display: true, //this will remove only the label
					fontColor: "black",
					fontWeight: "700",
					fontSize: 16,
				},
				scaleLabel: {
					display: true,
					labelString: "DATE",
					fontSize: 14,
					fontColor: "#73727D",
				},
			},
		],
	},
};

const Analytics = (props, context) => {
	const classes = useStyles();
	const [graphData, setGraphData] = useState([]);
	const [todayGraphData, setTodayGraphData] = useState([]);
	const [graphDays, setGraphDays] = useState([]);
	const [userDetails, setUserDetails] = useState([]);
	const [TicketSales, setTicketSales] = useState([]);
	const [eventName, setEventName] = useState([]);
	const [revenueCategory, setrevenueCategory] =
		useState("eventRevenueInPhnx");
	const [ticketBought, setTicketBought] = useState(0);
	const [timeStamp, setTimeStamp] = useState("86400");
	const [dollarRevenue, setDollarRevenue] = useState(0);
	const [phnxRevenue, setPhnxRevenue] = useState(0);
	const [soldTicket, setSoldTicket] = useState(0);
	const [dollarChange, setDollarChange] = useState(0);
	const [phnxChange, setPhnxChange] = useState(0);
	const [ticketSoldChange, setTicketSoldChange] = useState(0);
	const [dollarDifference, setdollarDifference] = useState(0);
	const [phnxDifference, setRevenueDifference] = useState(0);
	const [ticketDifference, setTicketDifference] = useState(0);
	const [liveDollarRevenue, setLiveDollarRevenue] = useState(0);
	const [dollarClicked, setDollarClicked] = useState(true);
	const [dollarRev, setDollarRev] = useState([]);
	const [soldClicked, setSoldClicked] = useState(false);
	const [soldTickets, setSoldTickets] = useState([]);
	const [phnxClicked, setPhnxClicked] = useState(false);
	const [phnxRev, setPhnxRev] = useState([]);
	const [labels, setLabels] = useState([]);
	useEffect(() => {
		// getPhnxRevenue();
		getViewsAndFavourites();
		loadApis();
	}, []);
	const loadApis = async () => {
		const eventName = await getEventName(props.accounts);
		setEventName(eventName);
		if (eventName.length != 0) {
			const tickets = await generateJSON(eventName[0].eventId);
			setTicketSales(tickets);
		}
		const blockChainTickets = await props.eventsContract.methods
			.ticketsOf(props.accounts)
			.call();
		setTicketBought(blockChainTickets.length);
		// const timeData = await getTimeData(props.accounts);
		const timeData = await getTimeData(
			"0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b"
		);
		console.log("timeData", timeData);
		setGraphData(timeData);
		console.log("timestamp", Number(moment().unix()));
		const todayData = await getTodayData(
			"0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b",
			Number(moment().unix())
		);
		console.log("todayData", todayData);
		setTodayGraphData(todayData);
		handleTimeStampChange(null, todayData);
	};
	const events = getEvents({
		_isMounted: true,
		accounts: props.accounts,
		revenueCategory: revenueCategory,
	});
	// console.log("events", events);
	//for graph datasets
	let dataset = [];
	const data = (canvas, graph) => {
		const ctx = canvas.getContext("2d");
		var gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, "#F2F2FD");
		gradient.addColorStop(1, "rgba(242, 242, 253, 0)");
		return {
			// labels: ["jan", "feb", "march", "april", "may"],
			labels: labels,
			datasets: [
				{
					backgroundColor: gradient,
					pointColor: "#fff",
					fill: "start",
					pointHighlightStroke: "#FF6C23",
					pointRadius: 7,
					pointBackgroundColor: "white",
					data: graph,
					type: "line",
					borderColor: "#7E7AEB",
					borderWidth: 2,
				},
			],
		};
	};
	const data2 = {
		maintainAspectRatio: false,
		responsive: false,
		labels: TicketSales.map((event) => {
			return event.location;
		}),
		datasets: [
			{
				data: TicketSales.map((event) => {
					return event.ticketSold;
				}),
				backgroundColor: chartColors,
				hoverBackgroundColor: chartColors,
			},
		],
	};

	const getPhnxRevenue = () => {
		let phxRevenue = [];
		let phnxLabel = [];
		let phxData = {};
		console.log(graphDays);
		for (let i = 0; i < graphDays.length; i++) {
			let key;
			if (timeStamp === "86400") {
				key = graphDays[i].hourStartTimeStamp;
			} else {
				key = graphDays[i].dayStartTimeStamp;
			}
			if (key in phxData) {
				phxData[key].totalPhnxRevenueInDay =
					Number(phxData[key].totalPhnxRevenueInDay) +
					Number(graphDays[i].totalPhnxRevenueInDay);
			} else {
				phxData[key] = {
					dayStartTimeStamp: graphDays[i].dayStartTimeStamp,
					totalPhnxRevenueInDay: graphDays[i].totalPhnxRevenueInDay,
				};
			}
		}
		const phxKey = Object.keys(phxData);
		for (let i = 0; i < phxKey.length; i++) {
			const obj = phxData[phxKey[i]];
			phxRevenue.push(
				Web3.utils.fromWei(obj.totalPhnxRevenueInDay.toString())
			);
			phnxLabel.push(moment.unix(obj.dayStartTimeStamp).format("DD/MM"));
		}
		setDollarClicked(false);
		setSoldClicked(false);
		setPhnxClicked(true);
		setPhnxRev(phxRevenue);
		setLabels(phnxLabel);
	};

	const getSoldTickets = () => {
		const {hourStartTimeStamp,soldTicketsInHour,totalDollarRevenueInHour } = todayGraphData;
		console.log("data",hourStartTimeStamp);
		let soldTickets = [];
		let soldLabel = [];
		let soldData = {};
		for (let i = 0; i < graphDays.length; i++) {
			let key;
			if (timeStamp === "86400") {
				key = todayGraphData[i].hourStartTimeStamp;
			} else {
				key = graphDays[i].dayStartTimeStamp;
			}
			if (key in soldData) {
				soldData[key].soldTicketsInDay =
					Number(soldData[key].soldTicketsInDay) +
					Number(graphDays[i].soldTicketsInDay);
			} else {
				soldData[key] = {
					dayStartTimeStamp: graphDays[i].dayStartTimeStamp,
					soldTicketsInDay: graphDays[i].soldTicketsInDay,
				};
			}
		}

		const soldKey = Object.keys(soldData);
		for (let i = 0; i < soldKey.length; i++) {
			const obj = soldData[soldKey[i]];
			soldTickets.push(obj.soldTicketsInDay);
			soldLabel.push(moment.unix(obj.dayStartTimeStamp).format("DD/MM"));
		}
		setPhnxClicked(false);
		setDollarClicked(false);
		setSoldClicked(true);
		setSoldTickets(soldTickets);
		setLabels(soldLabel);
	};

	const getDollarRevenue = () => {
		let dollarRev = [];
		let dollarLabel = [];
		let dollarData = {};
		for (let i = 0; i < graphDays.length; i++) {
			let key;
			if (timeStamp === "86400") {
				key = graphDays[i].hourStartTimeStamp;
			} else {
				key = graphDays[i].dayStartTimeStamp;
			}
			if (key in dollarData) {
				dollarData[key].totalDollarRevenueInDay =
					Number(dollarData[key].totalDollarRevenueInDay) +
					Number(graphDays[i].totalDollarRevenueInDay);
			} else {
				dollarData[key] = {
					dayStartTimeStamp: graphDays[i].dayStartTimeStamp,
					totalDollarRevenueInDay:
						graphDays[i].totalDollarRevenueInDay,
				};
			}
		}
		const dollarKey = Object.keys(dollarData);
		for (let i = 0; i < dollarKey.length; i++) {
			const obj = dollarData[dollarKey[i]];
			dollarRev.push(
				Web3.utils.fromWei(obj.totalDollarRevenueInDay.toString())
			);
			dollarLabel.push(
				moment.unix(obj.dayStartTimeStamp).format("DD/MM")
			);
		}
		setPhnxClicked(false);
		setSoldClicked(false);
		setDollarClicked(true);
		setDollarRev(dollarRev);
		setLabels(dollarLabel);
	};

	const TicketAnalytics = () => {
		if (TicketSales.length == 0) {
			return <Grid className={classes.noTicket}>No tickets sold</Grid>;
		} else {
			return TicketSales.map((event, index) => (
				<Grid className={classes.row3}>
					<Grid className={classes.city}>
						<div
							className={classes.highlighter}
							style={{ backgroundColor: chartColors[index] }}
						></div>
						{event.location}
					</Grid>
					<Grid className={classes.ticketSold}>
						{event.ticketSold}
					</Grid>
				</Grid>
			));
		}
	};
	const getViewsAndFavourites = async () => {
		const userDetails = await getUserDetails({
			address: props.accounts,
			networkId: props.networkId,
		});
		if (!userDetails.error) {
			setUserDetails(userDetails.result.result);
		} else {
		}
	};
	const Top5Events = () => {
		if (events.length == 0) {
			// console.log("MyEvents", events);
			return (
				<p
					className="text-center not-found"
					style={{ marginTop: "40px" }}
				>
					<span role="img" aria-label="thinking">
						🤔
					</span>
					&nbsp;No events found.{" "}
					<a href="/createevent">Try creating one.</a>
				</p>
			);
		} else {
			return events.map((event, index) => (
				<Grid container className={classes.row3}>
					<Grid lg={3} className={classes.ticketSold}>
						<i
							className="fa fa-ticket-alt"
							title="My Tickets"
							style={{ color: "#73727D", paddingRight: "10px" }}
						></i>
						{event.tktTotalQuantitySold}
					</Grid>
					<Grid lg={6} className={classes.city}>
						{event.name}
					</Grid>
					<Grid
						lg={3}
						className={classes.ticketSold}
						style={{ textAlign: "end" }}
					>
						{revenueCategory == "eventRevenueInPhnx"
							? (
									event.eventRevenueInPhnx /
									1000000000000000000
							  ).toFixed(2) + " PHNX"
							: "$ " +
							  (
									event.eventRevenueInDollar /
									1000000000000000000
							  ).toFixed(2)}
					</Grid>
				</Grid>
			));
		}
	};
	const handleRevenue = (event) => {
		setrevenueCategory(event.target.value);
	};

	//filterations and calculations of earnuings card section
	const handleTimeStampChange = async (event, todayDat) => {
		let timestamp;
		// getTimeData(props.accounts);
		if (event) {
			timestamp = event.target.value;
		} else {
			timestamp = timeStamp;
		}
		setTimeStamp(timestamp);
		let today = Math.floor(Date.now() / 1000);
		let elapsedTime = today - timestamp;
		console.log(graphData);
		let graphDatahldr;
		// if (timestamp === "86400") {
		// 	graphDatahldr = todayDat;
		// } else {
		// 	graphDatahldr = graphData;
		// }
		if (graphData.length != 0) {
			let graphForDays;
			// if (timestamp === "86400") {
			// 	console.log("today filter was called");
			// 	console.log(todayDat);
			// 	graphForDays = todayDat;
			// 	setT
			// } else {
				graphForDays = graphData.filter(
					(event) => event.dayStartTimeStamp >= elapsedTime
				);
			// }

			setGraphDays(graphForDays);
			// setGraphData(graphForDays);
			console.log("graph", graphForDays);
			if (graphForDays.length != 0) {
				let totalDollarRevenue = 0;
				let totalPhnxRevenue = 0;
				let soldTicket = 0;
				graphForDays.forEach((event) => {
					totalDollarRevenue += Number(
						Web3.utils.fromWei(event.totalDollarRevenueInDay.toString())
					);
					soldTicket += Number(event.soldTicketsInDay.toString());
					totalPhnxRevenue += Number(
						Web3.utils.fromWei(event.totalPhnxRevenueInDay.toString())
					);
				});
				totalPhnxRevenue = parseFloat(totalPhnxRevenue).toFixed(3);
				totalDollarRevenue = parseFloat(totalPhnxRevenue).toFixed(3);
				console.log("totalDollarRevenue", totalDollarRevenue);
				let liveDollarRevenue = await getPhoenixDAOMarketValue(
					totalDollarRevenue
				);
				setLiveDollarRevenue(liveDollarRevenue);
				setDollarRevenue(totalDollarRevenue);
				setPhnxRevenue(totalPhnxRevenue);
				setSoldTicket(soldTicket);
				//calculate data for change and difference of cards
				let lastIndex = graphForDays.length - 1;
				let originalNumber = Web3.utils.fromWei(
					graphForDays[0].totalDollarRevenueInDay
				);
				let newNumber = Web3.utils.fromWei(
					graphForDays[lastIndex].totalDollarRevenueInDay
				);
				console.log("phnx", originalNumber, newNumber);
				let PHNXoriginalNumber = Web3.utils.fromWei(
					graphForDays[0].totalPhnxRevenueInDay
				);
				let PHNXnewNumber = Web3.utils.fromWei(
					graphForDays[lastIndex].totalPhnxRevenueInDay
				);
				let PhnxChange, price;
				price = ((newNumber - originalNumber) / originalNumber) * 100;
				PhnxChange =
					((PHNXnewNumber - PHNXoriginalNumber) /
						PHNXoriginalNumber) *
					100;
				let ticketChange =
					((graphForDays[lastIndex].soldTicketsInDay -
						graphForDays[0].soldTicketsInDay) /
						graphForDays[0].soldTicketsInDay) *
					100;
				if (!isFinite(price)) {
					price = 100;
				}
				if (!isFinite(PhnxChange)) {
					PhnxChange = 100;
				}
				if (!isFinite(ticketChange)) {
					ticketChange = 100;
				}
				setPhnxChange(PhnxChange);
				setDollarChange(price);
				setTicketSoldChange(ticketChange);
				console.log("new", newNumber, originalNumber);
				// originalNumber = Web3.utils.fromWei(graphForDays[0].totalDollarRevenueInDay);
				// newNumber = Web3.utils.fromWei(graphForDays[lastIndex].totalDollarRevenueInDay);
				let priceDifference = newNumber - originalNumber;
				setdollarDifference(priceDifference);
				let revenueDifference = PHNXnewNumber - PHNXoriginalNumber;
				setRevenueDifference(revenueDifference);
				setTicketDifference(
					graphForDays[lastIndex].soldTicketsInDay -
						graphForDays[0].soldTicketsInDay
				);
			} else {
				setDollarRevenue(0);
				setPhnxRevenue(0);
				setSoldTicket(0);
				setLiveDollarRevenue(0);
				setPhnxChange(0);
				setDollarChange(0);
				setTicketSoldChange(0);
				setdollarDifference(0);
				setTicketDifference(0);
				setRevenueDifference(0);
			}
		}
	};
	// const calculatePercentage =() =>{
	//         let price = (((newNumber - orignalNumber) / orignalNumber) * 100);
	// }
	const handleEvent = async (event) => {
		const tickets = await generateJSON(Number(event.target.value));
		setTicketSales(tickets);
	};
	const provideGraph = () => {
		if (dollarClicked) {
			return (
				<Line
					data={(canvas) => data(canvas, dollarRev)}
					options={chartOptions}
				/>
			);
		} else if (soldClicked) {
			return (
				<Line
					data={(canvas) => data(canvas, soldTickets)}
					options={chartOptions}
				/>
			);
		} else if (phnxClicked) {
			return (
				<Line
					data={(canvas) => data(canvas, phnxRev)}
					options={chartOptions}
				/>
			);
		}
	};
	return (
		<div>
			<Header title="Analytics" page="analytics" phnxButton="true" />
			<Grid container className={classes.content}>
				<Grid className={classes.row}>
					<h3 className={classes.heading}>Earnings</h3>

					<FormControl variant="outlined" className={classes.select}>
						<Select
							native
							value={timeStamp}
							onChange={handleTimeStampChange}
							inputProps={{
								name: "age",
								id: "outlined-age-native-simple",
							}}
						>
							<option value="86400">Today</option>
							{/* <option aria-label="None" value="Yesterday">
								Yesterday
							</option> */}
							<option value="604800">Last 7 Days</option>
							<option value="2419200">Last 28 Days</option>
							<option value="7776000">Last 90 Days</option>
						</Select>
					</FormControl>
				</Grid>
				<Grid container style={{ justifyContent: "space-evenly" }}>
					<Card
						color="#E5AB00"
						click={getDollarRevenue}
						imageSrc="/images/icons/Dollar.png"
						header="Dollar Revenue"
						value={"$" + dollarRevenue}
						profit={dollarChange}
						diffrence={dollarDifference}
						entity="$"
						days={timeStamp}
						liveDollarRevenue={liveDollarRevenue}
					/>
					<Card
						color="#413AE2"
						click={getPhnxRevenue}
						imageSrc="/images/icons/PHNX.png"
						header="Phnx Revenue"
						value={phnxRevenue + "PHNX"}
						profit={phnxChange}
						diffrence={phnxDifference}
						entity="PHNX"
						days={timeStamp}
					/>
					<Card
						color="#963AE2"
						click={getSoldTickets}
						imageSrc="/images/icons/Events.png"
						header="Tickets Sold"
						value={soldTicket}
						profit={ticketSoldChange}
						diffrence={ticketDifference}
						entity="Tickets"
						days={timeStamp}
					/>
				</Grid>
				<Grid container style={{ margin: "70px 0px" }}>
					{provideGraph()}
					{/* <Line data={data} options={chartOptions} /> */}
				</Grid>
				<EventsAnalytics
					userDetails={userDetails}
					createdEvents={eventName.length}
					ticketBought={ticketBought}
				/>
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
									onChange={handleEvent}
									inputProps={{
										name: "age",
										id: "outlined-age-native-simple",
									}}
								>
									{eventName.map((event) => {
										return (
											<option value={event.eventId}>
												{event.name}
											</option>
										);
									})}
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
							<Doughnut
								id="doughnut"
								data={data2}
								options={options2}
							/>
							<img
								src="/images/graph.svg"
								className={classes.image}
							/>
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
								onChange={handleRevenue}
								inputProps={{
									name: "age",
									id: "outlined-age-native-simple",
								}}
							>
								<option value="eventRevenueInPhnx">PHNX</option>
								<option value="eventRevenueInDollar">
									Dollar
								</option>
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
		// contracts: state.contracts,
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(Analytics, mapStateToProps);
export default AppContainer;
