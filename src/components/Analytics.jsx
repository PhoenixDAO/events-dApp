import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { Grid, FormControl, Select, Button } from "@material-ui/core";
// import {Graph} from "../utils/graph";
import { Doughnut, Line } from "react-chartjs-2";
import EventsAnalytics from "./EventsAnalytics";
import { Card } from "./common/Card";
import { getEvents } from "../utils/getEvents";
import { getUserDetails } from "../config/serverAPIs";
import Header from "./common/Header";
import EmptyStateAnalytics from "./EmptyStateAnalytics";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
// you will also need the css that comes with bootstrap-daterangepicker
import "bootstrap-daterangepicker/daterangepicker.css";
import "../styles/customCalendar.css";
import { getPhoenixDAOMarketValue } from "../utils/graphApis";
import Web3 from "web3";
import MyEvents from "./MyEvents";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import { getTodayData } from "../utils/graphApis";
import { SelectAllOutlined } from "@material-ui/icons";
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
	menuPaper: {
		maxHeight: "200px",
	},
	select: {
		width: "170px",
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
			paddingRight: "25px !important",
			"@media (max-width: 600px)":{
				maxWidth:"150px"
			},
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
	emptyContent: {
		padding: "0 !important",
	},
	EmptyRow: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		marginBottom: "25px",
		[theme.breakpoints.down("xs")]: {
			display: "grid",
		},
		"& > div": {
			flex: "0 0 100%",
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
	button: {
		"@media screen and (max-width: 1200px) and (min-width: 900px)": {
			width: "30%",
			height: "45px",
		},
		margin: theme.spacing(1),
		fontFamily: "'Aeonik', sans-serif",
		background: "#413AE2",
		color: "white",
		textTransform: "Capitalize",
		// maxHeight: 54,
		// maxWidth: 230,
		"&:focus": {
			outline: "none",
		},
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

const Analytics = (props, context) => {
	const classes = useStyles();
	// const [graphData, setGraphData] = useState([]);
	// const [todayGraphData, setTodayGraphData] = useState([]);
	const [graphDays, setGraphDays] = useState([]);
	const [userDetails, setUserDetails] = useState([]);
	// const [TicketSales, setTicketSales] = useState([]);
	// const [eventName, setEventName] = useState([]);
	const [revenueCategory, setrevenueCategory] =
		useState("eventRevenueInPhnx");
	// const [ticketBought, setTicketBought] = useState(0);
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
	const [legend, setlegend] = useState("REVENUE ($) ");
	const [timeLabel, settimeLabel] = useState("TIME");
	const [eventNames, setEventNames] = useState("");
	// const [startDate, setStartDate] = useState("");
	// const [endDate, setEndDate] = useState("");
	const [customDate, setCustomDate] = useState({
		startDate: "",
		endDate: "",
	});
	const [reload, setReload] = useState(false);
	useEffect(() => {
		if (props.eventName) {
			setEventNames(props.eventName[0]);
		}
	}, [props.eventName]);
	useEffect(() => {
		// getPhnxRevenue();
		getViewsAndFavourites();
		handleTimeStampChange();
		console.log("recalled");
		// loadApis();
	}, [props.graphData, customDate.startDate, customDate.endDate]);

	useEffect(() => {
		getDollarRevenue();
	}, [graphDays]);
	// const loadApis = async () => {
	// 	const eventName = await getEventName(props.accounts);
	// 	setEventName(eventName);
	// 	if (eventName.length != 0) {
	// 		const tickets = await generateJSON(eventName[0].eventId);
	// 		setTicketSales(tickets);
	// 	}
	// 	const blockChainTickets = await props.eventsContract.methods
	// 		.ticketsOf(props.accounts)
	// 		.call();
	// 	setTicketBought(blockChainTickets.length);
	// 	// const timeData = await getTimeData(props.accounts);
	// 	const timeData = await getTimeData(
	// 		props.accounts
	// 	);
	// 	console.log("timeData", timeData);
	// 	setGraphData(timeData);
	// 	console.log("timestamp", Number(moment().unix()));
	// 	const todayData = await getTodayData(
	// 		props.accounts,
	// 		Number(moment().unix()- 86400)
	// 	);
	// 	console.log("time stamp--- ", moment().unix())
	// 	console.log("todayData", todayData);
	// 	setTodayGraphData(todayData);
	// 	handleTimeStampChange(null, todayData);
	// };

	const handleEventName = (e) => {
		setEventNames({ eventId: e.target.value });
	};
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
						labelString: legend,
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
						labelString: timeLabel,
						fontSize: 14,
						fontColor: "#73727D",
					},
				},
			],
		},
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
		labels: props.TicketSales.map((event) => {
			return event.location;
		}),
		datasets: [
			{
				data: props.TicketSales.map((event) => {
					return event.ticketSold;
				}),
				backgroundColor: chartColors,
				hoverBackgroundColor: chartColors,
			},
		],
	};

	const handleEvent = (event, picker) => {
		console.log("startdate", moment(picker.startDate._d).unix());
		console.log("enddate", moment(picker.endDate._d).unix());
		// setStartDate(moment(picker.startDate._d).unix());
		// setEndDate(moment(picker.endDate._d).unix());
		setCustomDate({
			startDate: moment(picker.startDate._d).unix(),
			endDate: moment(picker.endDate._d).unix(),
		});
	};
	const getPhnxRevenue = () => {
		let phxRevenue = [];
		let phnxLabel = [];
		let phxData = {};
		setlegend("REVENUE (PHNX) ");
		console.log(graphDays);
		for (let i = 0; i < graphDays.length; i++) {
			let key = graphDays[i].startTimeStamp;
			if (key in phxData) {
				phxData[key].totalPhnxRevenue =
					Number(phxData[key].totalPhnxRevenue) +
					Number(graphDays[i].totalPhnxRevenue);
			} else {
				phxData[key] = {
					startTimeStamp: graphDays[i].startTimeStamp,
					totalPhnxRevenue: graphDays[i].totalPhnxRevenue,
				};
			}
		}
		const phxKey = Object.keys(phxData);
		for (let i = 0; i < phxKey.length; i++) {
			const obj = phxData[phxKey[i]];
			phxRevenue.push(
				Web3.utils.fromWei(obj.totalPhnxRevenue.toString())
			);
			if (timeStamp == 86400) {
				phnxLabel.push(moment.unix(obj.startTimeStamp).format("HH:mm"));
			} else {
				phnxLabel.push(moment.unix(obj.startTimeStamp).format("DD/MM"));
			}
		}
		setDollarClicked(false);
		setSoldClicked(false);
		setPhnxClicked(true);
		setPhnxRev(phxRevenue);
		setLabels(phnxLabel);
	};

	const getSoldTickets = () => {
		let soldTickets = [];
		let soldLabel = [];
		let soldData = {};
		setlegend("NO. OF TICKETS SOLD");
		for (let i = 0; i < graphDays.length; i++) {
			let key = graphDays[i].startTimeStamp;
			if (key in soldData) {
				soldData[key].soldTickets =
					Number(soldData[key].soldTickets) +
					Number(graphDays[i].soldTickets);
			} else {
				soldData[key] = {
					startTimeStamp: graphDays[i].startTimeStamp,
					soldTickets: graphDays[i].soldTickets,
				};
			}
		}

		const soldKey = Object.keys(soldData);
		for (let i = 0; i < soldKey.length; i++) {
			const obj = soldData[soldKey[i]];
			soldTickets.push(obj.soldTickets);
			if (timeStamp == 86400) {
				soldLabel.push(moment.unix(obj.startTimeStamp).format("HH:mm"));
			} else {
				soldLabel.push(moment.unix(obj.startTimeStamp).format("DD/MM"));
			}
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
		setlegend("REVENUE ($)");
		for (let i = 0; i < graphDays.length; i++) {
			let key = graphDays[i].startTimeStamp;
			if (key in dollarData) {
				dollarData[key].totalDollarRevenue =
					Number(dollarData[key].totalDollarRevenue) +
					Number(graphDays[i].totalDollarRevenue);
			} else {
				dollarData[key] = {
					startTimeStamp: graphDays[i].startTimeStamp,
					totalDollarRevenue: graphDays[i].totalDollarRevenue,
				};
			}
		}
		const dollarKey = Object.keys(dollarData);
		for (let i = 0; i < dollarKey.length; i++) {
			const obj = dollarData[dollarKey[i]];
			dollarRev.push(
				Web3.utils.fromWei(obj.totalDollarRevenue.toString())
			);
			if (timeStamp == 86400) {
				dollarLabel.push(
					moment.unix(obj.startTimeStamp).format("HH:mm")
				);
			} else {
				dollarLabel.push(
					moment.unix(obj.startTimeStamp).format("DD/MM")
				);
			}
		}
		setPhnxClicked(false);
		setSoldClicked(false);
		setDollarClicked(true);
		setDollarRev(dollarRev);
		setLabels(dollarLabel);
	};

	const TicketAnalytics = () => {
		if (props.TicketSales.length == 0) {
			return <Grid className={classes.noTicket}>No tickets sold</Grid>;
		} else {
			return props.TicketSales.map((event, index) => (
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
			setUserDetails(userDetails.result.result.userHldr);
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

	const dayHelper = (day, data) => {
		settimeLabel("DATE");
		let newDataObj = {};
		const timeDataArr = data;
		console.log("Day helper", data);
		for (let i = 0; i < timeDataArr.length; i++) {
			if (newDataObj[timeDataArr[i].startTimeStamp]) {
				const soldTickets = Number(
					newDataObj[timeDataArr[i].startTimeStamp].soldTickets
				);
				const totalDollarRevenue = Number(
					newDataObj[timeDataArr[i].startTimeStamp].totalDollarRevenue
				);
				const totalPhnxRevenue = Number(
					newDataObj[timeDataArr[i].startTimeStamp].totalPhnxRevenue
				);
				newDataObj[timeDataArr[i].startTimeStamp] = {
					...timeDataArr[i],
					soldTickets:
						soldTickets + Number(timeDataArr[i].soldTickets),
					totalDollarRevenue:
						totalDollarRevenue +
						Number(timeDataArr[i].totalDollarRevenue),
					totalPhnxRevenue:
						totalPhnxRevenue +
						Number(timeDataArr[i].totalPhnxRevenue),
				};
			} else {
				newDataObj[timeDataArr[i].startTimeStamp] = timeDataArr[i];
			}
		}

		console.log("newDataObj", newDataObj);
		const todayTimeStamp = Number(moment().unix());
		console.log("todayTimeStamp", todayTimeStamp);
		const today = new Date();
		const d = new Date(today.setHours(0, 0, 0, 0));
		d.setDate(d.getDate() - day);
		d.setHours(0, 0, 0, 0);
		d.setUTCHours(0, 0, 0, 0);
		const calculatedTimestamp = moment(d).unix() + 172800;
		console.log("calculatedTimestamp", calculatedTimestamp);

		const d1 = new Date(today.setHours(0, 0, 0, 0));
		d1.setDate(d1.getDate() - (day + day));
		d1.setHours(0, 0, 0, 0);
		d1.setUTCHours(0, 0, 0, 0);
		const calculatedTimestamp1 = moment(d).unix() + 172800;
		console.log("calculatedTimestamp1", calculatedTimestamp1);

		let dataArr = [];
		for (let i = calculatedTimestamp; i <= todayTimeStamp; i = i + 86400) {
			console.log("newDataObj[i]", newDataObj[i]);
			if (newDataObj[i]) {
				dataArr.push(newDataObj[i]);
			} else {
				dataArr.push({
					startTimeStamp: i,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
			}
		}

		let dataArr1 = [];
		for (let i = calculatedTimestamp1; i <= todayTimeStamp; i = i + 86400) {
			console.log("newDataObj[i]", newDataObj[i]);
			if (newDataObj[i]) {
				dataArr1.push(newDataObj[i]);
			} else {
				dataArr1.push({
					startTimeStamp: i,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
			}
		}

		return {
			dataArr,
			dataArr1,
		};
	};

	//filterations and calculations of earnuings card section
	const handleTimeStampChange = async (event) => {
		let timestamp;
		if (event) {
			timestamp = event.target.value;
		} else {
			timestamp = timeStamp;
		}
		// let element = document.getElementsByClassName("daterangepicker");

		// 		if(timestamp == "custom")
		// 		{
		// 			element[0].setAttribute("style", "top: 272.6px; left: auto;right: 0px;display: block;");

		// console.log("element",element[0]);
		// 		}
		// 		else{
		// 			element[0].style.display="none";
		// 		}

		setTimeStamp(timestamp);
		let today = Math.floor(Date.now() / 1000);
		let elapsedTime = today - timestamp;
		console.log("graph", props.graphData);
		if (props.graphData.length != 0) {
			let graphForDays = [];
			let difference = [];
			console.log("called herer");
			if (timestamp === "86400") {
				settimeLabel("TIME");
				console.log("graphData", "called here");
				if (props.todayGraphData.length > 0) {
					console.log(
						"graphData",
						"else if called here",
						props.todayGraphData
					);
					graphForDays = props.todayGraphData;
					difference = await getTodayData(
						props.accounts,
						Number(moment().unix() - 172800)
					);
				}
			} else if (timestamp === "custom") {
				console.log(
					"graphData",
					props.graphData,
					"start",
					customDate.startDate,
					"end",
					customDate.endDate
				);
				graphForDays = props.graphData.filter(
					(event) =>
						customDate.startDate <= event.startTimeStamp &&
						event.startTimeStamp <= customDate.endDate
				);

				let newEndDate = moment
					.unix(customDate.startDate)
					.format("YYYY-MM-DD");
				let betweenDays = Math.ceil(
					moment
						.duration(
							moment
								.unix(customDate.endDate)
								.diff(moment.unix(customDate.startDate))
						)
						.asDays()
				);
				let newStartDate = moment(newEndDate).subtract(
					betweenDays,
					"days"
				);
				console.log(
					"newStartDate",
					moment(newStartDate).unix(),
					"betweenDays",
					betweenDays,
					"newEndDate",
					moment(newEndDate).unix()
				);

				difference = props.graphData.filter(
					(event) =>
						moment(newStartDate).unix() <= event.startTimeStamp &&
						event.startTimeStamp <= moment(newEndDate).unix()
				);
				console.log("graph for days for custom", graphForDays);
				console.log("difference", difference);
			} else if (timestamp === "604800") {
				const { dataArr, dataArr1 } = dayHelper(7, props.graphData);
				graphForDays = dataArr;
				difference = dataArr1;
			} else if (timestamp === "2419200") {
				const { dataArr, dataArr1 } = dayHelper(28, props.graphData);
				graphForDays = dataArr;
				difference = dataArr1;
			} else if (timestamp === "7776000") {
				const { dataArr, dataArr1 } = dayHelper(90, props.graphData);
				graphForDays = dataArr;
				difference = dataArr1;
			}
			// else {
			// 	settimeLabel("DATE");
			// 	console.log("graphData", props.graphData);
			// 	graphForDays = props.graphData.filter(
			// 		(event) => event.startTimeStamp >= elapsedTime
			// 	);
			// }
			setGraphDays(graphForDays);
			console.log("graph", graphForDays);
			let totalDollarRevenue = 0;
			let totalPhnxRevenue = 0;
			let soldTicket = 0;
			let totalDollarPrev = 0;
			let totalPhnxPrev = 0;
			let totalSoldTicketsPrev = 0;
			difference.forEach((event) => {
				totalDollarPrev += Number(
					Web3.utils.fromWei(event.totalDollarRevenue.toString())
				);
				console.log("totalDollarPrev", totalDollarPrev);
				totalSoldTicketsPrev += Number(event.soldTickets.toString());
				totalPhnxPrev += Number(
					Web3.utils.fromWei(event.totalPhnxRevenue.toString())
				);
			});
			if (graphForDays.length > 0) {
				graphForDays.forEach((event) => {
					totalDollarRevenue += Number(
						Web3.utils.fromWei(event.totalDollarRevenue.toString())
					);
					console.log("totalDollarRevenue", totalDollarRevenue);
					soldTicket += Number(event.soldTickets.toString());
					totalPhnxRevenue += Number(
						Web3.utils.fromWei(event.totalPhnxRevenue.toString())
					);
				});

				console.log("DIFFERENCE", difference);
				// totalPhnxRevenue = parseFloat(totalPhnxRevenue).toFixed(3);
				// totalDollarRevenue = parseFloat(totalPhnxRevenue).toFixed(3);
				console.log("totalDollarRevenue", totalDollarRevenue);
				let liveDollarRevenue = await getPhoenixDAOMarketValue(
					totalDollarRevenue
				);
				setLiveDollarRevenue(liveDollarRevenue);
				setDollarRevenue(totalDollarRevenue.toFixed(3));
				setPhnxRevenue(totalPhnxRevenue.toFixed(6));
				setSoldTicket(soldTicket);
				//calculate data for change and difference of cards
				let lastIndex = graphForDays.length - 1;
				let originalNumber = Web3.utils.fromWei(
					graphForDays[0].totalDollarRevenue.toString()
				);
				let newNumber = Web3.utils.fromWei(
					graphForDays[lastIndex].totalDollarRevenue.toString()
				);
				console.log("phnx", originalNumber, newNumber);
				let PHNXoriginalNumber = Web3.utils.fromWei(
					graphForDays[0].totalPhnxRevenue.toString()
				);
				let PHNXnewNumber = Web3.utils.fromWei(
					graphForDays[lastIndex].totalPhnxRevenue.toString()
				);
				let PhnxChange, price;
				price = ((newNumber - originalNumber) / originalNumber) * 100;
				PhnxChange =
					((PHNXnewNumber - PHNXoriginalNumber) /
						PHNXoriginalNumber) *
					100;
				let ticketChange =
					((graphForDays[lastIndex].soldTickets -
						graphForDays[0].soldTickets) /
						graphForDays[0].soldTickets) *
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
				// originalNumber = Web3.utils.fromWei(graphForDays[0].totalDollarRevenue);
				// newNumber = Web3.utils.fromWei(graphForDays[lastIndex].totalDollarRevenue);
				let dollartDifference =
					totalDollarRevenue - (totalDollarRevenue - totalDollarPrev);
				setdollarDifference(
					totalDollarPrev > totalDollarRevenue
						? -dollartDifference
						: totalDollarRevenue
				);
				let revenueDifference =
					totalPhnxRevenue - (totalPhnxRevenue - totalPhnxPrev);
				setRevenueDifference(
					totalPhnxPrev > totalPhnxRevenue
						? -revenueDifference
						: totalPhnxRevenue
				);
				let ticketsDifference =
					soldTicket - (soldTicket - totalSoldTicketsPrev);
				setTicketDifference(
					totalSoldTicketsPrev > soldTicket
						? -ticketsDifference
						: soldTicket
				);
			} else {
				console.log(
					"GRpah for day else called",
					graphForDays,
					dollarRevenue
				);
				setDollarRevenue(0);
				setPhnxRevenue(0);
				setSoldTicket(0);
				setLiveDollarRevenue(0);
				setPhnxChange(0);
				setDollarChange(0);
				let dollartDifference =
					totalDollarRevenue - (totalDollarRevenue - totalDollarPrev);
				setdollarDifference(
					totalDollarPrev > totalDollarRevenue
						? -dollartDifference
						: totalDollarRevenue
				);
				let revenueDifference =
					totalPhnxRevenue - (totalPhnxRevenue - totalPhnxPrev);
				setRevenueDifference(
					totalPhnxPrev > totalPhnxRevenue
						? -revenueDifference
						: totalPhnxRevenue
				);
				let ticketsDifference =
					soldTicket - (soldTicket - totalSoldTicketsPrev);
				setTicketDifference(
					totalSoldTicketsPrev > soldTicket
						? -ticketsDifference
						: soldTicket
				);
			}
		}
	};
	// const calculatePercentage =() =>{
	//         let price = (((newNumber - orignalNumber) / orignalNumber) * 100);
	// }
	// chandleEvent = async (event) => {
	// 	const tickets = await generateJSON(Number(event.target.value));
	// 	setTicketSales(tickets);
	// };

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
			{props.eventName.length > 0 ? (
				<Grid container className={classes.content}>
					<Grid className={classes.row}>
						<h3 className={classes.heading}>Earnings</h3>

						<div>
							<FormControl
								variant="outlined"
								className={classes.select}
							>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									fullWidth
									value={timeStamp}
									onChange={handleTimeStampChange}
									displayEmpty
									// className={classes.menuPaper}
									MenuProps={{
										classes: {
											paper: classes.menuPaper,
										},
										getContentAnchorEl: null,
										anchorOrigin: {
											vertical: "bottom",
											horizontal: "left",
										},
									}}
								>
									<MenuItem
										value="86400"
										style={{
											fontFamily: "'Aeonik', sans-serif",
										}}
									>
										Today
									</MenuItem>
									<MenuItem
										value="604800"
										style={{
											fontFamily: "'Aeonik', sans-serif",
										}}
									>
										Last 7 Days
									</MenuItem>
									<MenuItem
										value="2419200"
										style={{
											fontFamily: "'Aeonik', sans-serif",
										}}
									>
										Last 28 Days
									</MenuItem>
								</Select>
								{/* <Select
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
							</option>*/}
								{/* <option value="604800">Last 7 Days</option>
									<option value="2419200">
										Last 28 Days
									</option>
							
								</Select> */}
							</FormControl>
							<DateRangePicker
								initialSettings={{
									showDropdowns: true,
								}}
								onShow={
									timeStamp === "custom"
										? (e, p) =>
												console.log(
													"event",
													e,
													"picker",
													p
												)
										: null
								}
								onEvent={handleEvent}
								style={{ display: "none" }}
							>
								<Button
									variant="contained"
									color="primary"
									size="large"
									className={classes.button}
									onClick={(e) => setTimeStamp("custom")}
								>
									Custom
								</Button>
							</DateRangePicker>
						</div>
					</Grid>
					<Grid container style={{ justifyContent: "space-evenly" }}>
						{console.log("DOLLAR REVENUE", dollarRevenue)}
						<Card
							color="#E5AB00"
							click={getDollarRevenue}
							imageSrc="/images/icons/Dollar.png"
							header="Dollar Revenue"
							value={"$" + dollarRevenue}
							profit={dollarChange}
							diffrence={Math.abs(dollarDifference).toFixed(3)}
							entity="$"
							days={timeStamp}
							startDate={customDate.startDate}
							endDate={customDate.endDate}
							liveDollarRevenue={liveDollarRevenue}
						/>
						<Card
							color="#413AE2"
							click={getPhnxRevenue}
							imageSrc="/images/icons/PHNX.png"
							header="Phnx Revenue"
							value={phnxRevenue + "PHNX"}
							profit={phnxChange}
							diffrence={Math.abs(phnxDifference).toFixed(3)}
							entity="PHNX"
							days={timeStamp}
							startDate={customDate.startDate}
							endDate={customDate.endDate}
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
							startDate={customDate.startDate}
							endDate={customDate.endDate}
						/>
					</Grid>
					<Grid container style={{ margin: "70px 0px" }}>
						{provideGraph()}
						{/* <Line data={data} options={chartOptions} /> */}
					</Grid>
					<EventsAnalytics
						userDetails={userDetails}
						createdEvents={props.eventName.length}
						ticketBought={props.ticketBought}
					/>
					<Grid className={classes.box}>
						<Grid className={classes.row}>
							<Grid className={classes.row}>
								<h5 className={classes.heading2}>
									Ticket sales by Location
								</h5>
							</Grid>
							<Grid
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								{props.eventName.length > 0 ? (
									<div>
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
											{/* <Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											fullWidth
											value={props.eventName[0].eventId}
											onChange={props.handleEvent}
											displayEmpty
											className={classes.menuPaper}
											MenuProps={{
												classes: {
													paper: classes.menuPaper,
												},
												getContentAnchorEl: null,
												anchorOrigin: {
												vertical: "bottom",
												horizontal: "left"}
											}}
										>
										{props.eventName.map(
													(event) => {
														return (
															<MenuItem
															style={{
																fontFamily:
																	"'Aeonik', sans-serif",
															}}
																value={
																	event.eventId
																}
															>
																{event.name}
															</MenuItem>
														);
													})}
										</Select> */}
											{/* {console.log("event name", (eventNames)&&eventNames['eventId'])} */}
											{eventNames && (
												<Select
													fullWidth
													// value={state.age}
													value={
														eventNames &&
														eventNames["eventId"]
													}
													onChange={(e) => {
														props.handleEvent(e);
														handleEventName(e);
													}}
													inputProps={{
														name: "age",
														id: "outlined-age-native-simple",
													}}
													MenuProps={{
														classes: {
															paper: classes.menuPaper,
														},
														getContentAnchorEl:
															null,
														anchorOrigin: {
															vertical: "bottom",
															horizontal: "left",
														},
													}}
												>
													{props.eventName.map(
														(event) => {
															return (
																<option
																	style={{
																		fontFamily:
																			"'Aeonik', sans-serif",
																	}}
																	value={
																		event.eventId
																	}
																>
																	{event.name}
																</option>
															);
														}
													)}
												</Select>
											)}
										</FormControl>
									</div>
								) : null}
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
									<option value="eventRevenueInPhnx">
										PHNX
									</option>
									<option value="eventRevenueInDollar">
										Dollar
									</option>
								</Select>
							</FormControl>
						</Grid>

						<Grid
							className={classes.box}
							style={{ marginTop: "30px" }}
						>
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
			) : (
				<Grid
					container
					className={`${classes.emptyContent} ${classes.content}`}
				>
					<Grid className={classes.EmptyRow}>
						<EmptyStateAnalytics />
					</Grid>
				</Grid>
			)}
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
