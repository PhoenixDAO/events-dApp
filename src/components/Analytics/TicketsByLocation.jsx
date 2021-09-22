import React from "react";
import { useStyles } from "./styles";
import {
	Grid,
	FormControl,
	Select,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";

const TicketsByLocation = (props) => {
	const classes = useStyles();
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
				bottom: 25,
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
    const chartColors = ["#ACFFE3", "#96A6FF", "#FF8795", "#E8B56B", "#D0A6F2"];

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

	return (
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
							<FormControl
								variant="outlined"
								className={classes.formControls}
							>
								<Typography
									variant="p"
									className={`${classes.sortBy}`}
								>
									Event
								</Typography>
								{props.eventNames && (
									<Select
										fullWidth
										value={
											props.eventNames &&
											props.eventNames["eventId"]
										}
										onChange={(e) => {
											props.handleEvent(e);
											props.handleEventName(e);
										}}
										inputProps={{
											name: "age",
											id: "outlined-age-native-simple",
										}}
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
										className={classes.selectWidth}
									>
										{props.eventName.map((event) => {
											return (
												<MenuItem
													style={{
														fontFamily:
															"'Aeonik', sans-serif",
														width: "350px",
													}}
													value={event.eventId}
												>
													{event.name}
												</MenuItem>
											);
										})}
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
					<Doughnut id="doughnut" data={data2} options={options2} />
					<img src="/images/graph.svg" className={classes.image} />
				</Grid>
			</Grid>
		</Grid>
	);
};

export default TicketsByLocation;
