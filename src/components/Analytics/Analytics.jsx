import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
	Grid,
	FormControl,
	Select,
	Button,
	Typography,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import EventsAnalytics from "./EventsAnalytics";
import { Card } from "../common/Card";
import { getEvents } from "../../utils/getEvents";
import { getUserDetails } from "../../config/serverAPIs";
import Header from "../common/Header";
import EmptyStateAnalytics from "../EmptyStateAnalytics";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "../../styles/customCalendar.css";
import { getPhoenixDAOMarketValue } from "../../utils/graphApis";
import Web3 from "web3";
import MyEvents from "../MyEvents";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import { getTodayData } from "../../utils/graphApis";
import { SelectAllOutlined } from "@material-ui/icons";
import { useStyles } from "./styles";
import Top5Events from "./Top5Events";
import TicketsByLocation from "./TicketsByLocation";
import { pricingFormatter } from "../../utils/pricingSuffix";

const Analytics = (props, context) => {
	const classes = useStyles();
	const [graphDays, setGraphDays] = useState([]);
	const [userDetails, setUserDetails] = useState([]);
	const [revenueCategory, setrevenueCategory] =
		useState("eventRevenueInPhnx");
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

	const [customDate, setCustomDate] = useState({
		startDate: "",
		endDate: "",
	});

	useEffect(()=>{	
		console.log("width: ", window.innerWidth)
	},[window.innerWidth])

	useEffect(() => {
		if (props.eventName) {
			setEventNames(props.eventName[0]);
		}
	}, [props.eventName]);
	useEffect(() => {
		getViewsAndFavourites();
		handleTimeStampChange();
	}, [props.graphData, customDate.startDate, customDate.endDate]);

	useEffect(() => {
		getDollarRevenue();
	}, [graphDays]);

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
						fontSize: (window.innerWidth > 600)?16:12,
						callback: function(value, index, values) {
							return pricingFormatter('$' + value,"$");
						}
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
						fontSize: (window.innerWidth > 600)?16:12,
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
	const data = (canvas, graph) => {
		const ctx = canvas.getContext("2d");
		var gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, "#F2F2FD");
		gradient.addColorStop(1, "rgba(242, 242, 253, 0)");
		return {
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

	const handleEvent = (event, picker) => {
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

	const TopEvents = () => {
		if (events.length == 0) {
			return (
				<p
					className="text-center not-found"
					style={{ marginTop: "40px" }}
				>
					<span role="img" aria-label="thinking">
						🤔
					</span>
					&nbsp;No events found.{" "}
					<a href="/createevent">Create an Event</a>
				</p>
			);
		} else {
			return events.map((event, index) => (
				<Grid container className={classes.row3}>
					<Grid
						xl={3}
						lg={3}
						sm={3}
						xs={3}
						className={classes.ticketSold}
					>
						<i
							className="fa fa-ticket-alt"
							title="My Tickets"
							style={{ color: "#73727D", paddingRight: "10px" }}
						></i>
						{event.tktTotalQuantitySold}
					</Grid>
					<Grid
						xl={6}
						lg={6}
						sm={6}
						xs={6}
						className={`${classes.city} h-100`}
					>
						{event.name}
					</Grid>
					<Grid
						xl={3}
						lg={3}
						sm={3}
						xs={3}
						className={classes.ticketSold}
						style={{ textAlign: "end" }}
					>
						{revenueCategory == "eventRevenueInPhnx"
							? pricingFormatter(
									(
										event.eventRevenueInPhnx /
										1000000000000000000
									).toFixed(3) + " PHNX",
									"PHNX"
							  )
							: pricingFormatter(
									"$" +
										(
											event.eventRevenueInDollar /
											1000000000000000000
										).toFixed(3),
									"$"
							  )}
					</Grid>
				</Grid>
			));
		}
	};
	const handleRevenue = (event) => {
		setrevenueCategory(event.target.value);
	};

	//used to calculate data between ranges
	const dayHelper = (day, data) => {
		settimeLabel("DATE");
		let newDataObj = {};
		const timeDataArr = data;
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

		const todayTimeStamp = Number(moment().unix());
		const today = new Date();
		const d = new Date(today.setHours(0, 0, 0, 0));
		d.setDate(d.getDate() - day);
		d.setHours(0, 0, 0, 0);
		d.setUTCHours(0, 0, 0, 0);
		const calculatedTimestamp = moment(d).unix() + 172800;
		const d1 = new Date(today.setHours(0, 0, 0, 0));
		d1.setDate(d1.getDate() - (day + day));
		d1.setHours(0, 0, 0, 0);
		d1.setUTCHours(0, 0, 0, 0);
		const calculatedTimestamp1 = moment(d1).unix() + 172800;
		let dataArr = [];
		for (let i = calculatedTimestamp; i <= todayTimeStamp; i = i + 86400) {
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
		for (
			let i = calculatedTimestamp1;
			i <= calculatedTimestamp - 86400;
			i = i + 86400
		) {
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

		setTimeStamp(timestamp);
		let today = Math.floor(Date.now() / 1000);
		let elapsedTime = today - timestamp;
		if (props.graphData.length != 0) {
			let graphForDays = [];
			let difference = [];
			if (timestamp === "86400") {
				settimeLabel("TIME");
				if (props.todayGraphData.length > 0) {
					const minutes = moment().minutes();
					const createdDate = moment().minutes(0).seconds(0).unix();
					graphForDays = props.todayGraphData;
					difference = await getTodayData(
						props.accounts,
						Number(createdDate - 172800)
					);
				}
			} else if (timestamp === "custom") {
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

				difference = props.graphData.filter(
					(event) =>
						moment(newStartDate).unix() <= event.startTimeStamp &&
						event.startTimeStamp <= moment(newEndDate).unix()
				);
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
			setGraphDays(graphForDays);
			let totalDollarRevenue = 0;
			let totalPhnxRevenue = 0;
			let soldTicket = 0;
			let totalDollarPrev = 0;
			let totalPhnxPrev = 0;
			let totalSoldTicketsPrev = 0;
			difference.forEach((event) => {
				if (timestamp === "86400") {
					const createdDate = moment().minutes(0).seconds(0).unix();
					if (event.startTimeStamp <= createdDate - 86400) {
						totalDollarPrev += Number(
							Web3.utils.fromWei(
								event.totalDollarRevenue.toString()
							)
						);
						totalSoldTicketsPrev += Number(
							event.soldTickets.toString()
						);
						totalPhnxPrev += Number(
							Web3.utils.fromWei(
								event.totalPhnxRevenue.toString()
							)
						);
					}
				} else {
					totalDollarPrev += Number(
						Web3.utils.fromWei(event.totalDollarRevenue.toString())
					);
					totalSoldTicketsPrev += Number(
						event.soldTickets.toString()
					);
					totalPhnxPrev += Number(
						Web3.utils.fromWei(event.totalPhnxRevenue.toString())
					);
				}
			});
			if (graphForDays.length > 0) {
				graphForDays.forEach((event) => {
					totalDollarRevenue += Number(
						Web3.utils.fromWei(event.totalDollarRevenue.toString())
					);

					soldTicket += Number(event.soldTickets.toString());
					totalPhnxRevenue +=
						event.totalPhnxRevenue / 1000000000000000000;
				});
				let liveDollarRevenue = await getPhoenixDAOMarketValue(
					totalDollarRevenue
				);
				setLiveDollarRevenue(liveDollarRevenue);
				setDollarRevenue(totalDollarRevenue.toFixed(3));
				setPhnxRevenue(totalPhnxRevenue.toFixed(3));
				setSoldTicket(soldTicket);
				let lastIndex = graphForDays.length - 1;
				let originalNumber = Web3.utils.fromWei(
					graphForDays[0].totalDollarRevenue.toString()
				);
				let newNumber = Web3.utils.fromWei(
					graphForDays[lastIndex].totalDollarRevenue.toString()
				);
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
				let dollartDifference =
					totalDollarRevenue - (totalDollarRevenue - totalDollarPrev);
				setdollarDifference(
					totalDollarPrev > totalDollarRevenue
						? -(totalDollarPrev - totalDollarRevenue)
						: totalDollarRevenue - totalDollarPrev
				);
				let revenueDifference =
					totalPhnxRevenue - (totalPhnxRevenue - totalPhnxPrev);
				setRevenueDifference(
					totalPhnxPrev > totalPhnxRevenue
						? -(totalPhnxPrev - totalPhnxRevenue)
						: totalPhnxRevenue - totalPhnxPrev
				);
				let ticketsDifference =
					soldTicket - (soldTicket - totalSoldTicketsPrev);
				setTicketDifference(
					totalSoldTicketsPrev > soldTicket
						? -(totalSoldTicketsPrev - soldTicket)
						: soldTicket - totalSoldTicketsPrev
				);
			} else {
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
						<Card
							color="#E5AB00"
							click={getDollarRevenue}
							imageSrc="/images/icons/Dollar.png"
							header="Dollar Revenue"
							value={"$" + dollarRevenue}
							profit={dollarChange}
							diffrence={dollarDifference.toFixed(3)}
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
							value={phnxRevenue + " PHNX"}
							profit={phnxChange}
							diffrence={phnxDifference.toFixed(3)}
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
							diffrence={ticketDifference.toFixed(3)}
							entity="Tickets"
							days={timeStamp}
							startDate={customDate.startDate}
							endDate={customDate.endDate}
						/>
					</Grid>
					<Grid container style={{ margin: "70px 0px" }}>
						{provideGraph()}
					</Grid>
					<EventsAnalytics
						userDetails={userDetails}
						createdEvents={props.eventName.length}
						ticketBought={props.ticketBought}
					/>
					<TicketsByLocation
						eventName={props.eventName}
						eventNames={eventNames}
						handleEvent={props.handleEvent}
						handleEventName={handleEventName}
						TicketSales={props.TicketSales}
					/>
					<Top5Events
						timeStamp={timeStamp}
						revenueCategory={revenueCategory}
						handleRevenue={handleRevenue}
					>
						<TopEvents />
					</Top5Events>
				</Grid>
			) : (
				<Grid
					container
					className={`${classes.emptyContent} ${classes.content}`}
				>
					<Grid container style={{ paddingBottom: "30px" }}>
						<EmptyStateAnalytics />
					</Grid>
					<Grid>
						<EventsAnalytics
							userDetails={userDetails}
							createdEvents={props.eventName.length}
							ticketBought={props.ticketBought}
						/>
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
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(Analytics, mapStateToProps);
export default AppContainer;
