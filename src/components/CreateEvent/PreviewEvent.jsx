import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Button,
	Divider,
	Grid,
	Typography,
	Link,
} from "@material-ui/core";
import {
	DateRange,
	AccessTime,
	LocationOnOutlined,
	ConfirmationNumberOutlined,
	FavoriteBorder,
	Favorite,
	LaunchSharp,
	Send,
} from "@material-ui/icons";
import eventpreviewplaceholder from "../Images/eventpreviewplaceholder.png";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import EventPreviewPage from "./EventPreviewPage";
import { pricingFormatter } from "../../utils/pricingSuffix";

var moment = require("moment");

const useStyles = makeStyles((theme) => ({
	main: {
		display: "flex",
		justifyContent: "end",
		// marginRight: 0,
		[theme.breakpoints.down("md")]: {
			justifyContent: "center",
			marginRight: 0,
		},
	},
	root: {
		maxWidth: 365,
		width: "100%",
		"& .MuiCardContent-root": {
			padding: "16px 16px 0px",
		},
	},
	avatar: {
		backgroundColor: "red",
	},

	row: {
		display: "flex",
		borderTop: "1px solid #E4E4E7",
		marginLeft: "-16px",
		marginRight: "-16px",
		padding: "0px 16px",
	},
	text: {
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
	shareButton: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		"&:focus": {
			outline: "none",
		},
	},
	sendTicket: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontFamily: "'Aeonik', sans-serif",
		fontSize: 17,
		fontWeight: 500,
		"&:focus": {
			outline: "none",
		},
		borderLeft: "1px solid #E4E4E7",
		borderRadius: "0px",
	},
	FavoriteIcon: {
		border: "none",
		backgroundColor: "transparent",
		fontSize: 15,
		fontWeight: 500,
		backgroundColor: "white",
		borderRadius: "50%",
		width: "32px",
		height: "32px",
		"&:focus": {
			outline: "none",
		},
	},
	eventinfo: {
		fontSize: "22px",
		fontWeight: "700",
		fontFamily: "'Aeonik', sans-serif",
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		textAlign: "end",
		fontFamily: "'Aeonik', sans-serif",
	},
	starting: {
		color: "#73727D",
		fontSize: "14px",
		marginBottom: "0px",
		fontWeight: "400",
		fontFamily: "'Aeonik', sans-serif",
	},
	price: {
		color: "#413AE2",
		maxWidth: "34.333%",
		textAlign: "end",
		fontWeight: "700",
		fontSize: "17px",
		fontFamily: "'Aeonik', sans-serif",
		"& p": {
			marginBottom: "0px",
		},
		minHeight: "71px",
	},
	previewEventButton: {
		color: "#413AE2",
		fontWeight: "700",
		fontSize: "18px",
		fontFamily: "'Aeonik', sans-serif",
		textTransform: "capitalize",
	},
	eventTitle: {
		color: "#1E1E22",
		maxWidth: "65.66%",
		fontSize: 16,
		maxHeight: "52px",
		fontWeight: 700,
		fontFamily: "'Aeonik', sans-serif",
		wordBreak: "break-word",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: "2",
		overflow: "hidden",
		textOverflow: "ellipsis",
		// "@media (min-width: 990px) and (max-width: 1024px)": {
		// /* For landscape layouts only */
		// WebkitLineClamp: "3",
		// 	}
	},
}));

export default function PreviewEvent({ fields, activeStep }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const {
		eventName,
		eventOrganizer,
		eventTopic,
		eventCategory,
		eventLocation,
		eventLink,
		restrictWallet: oneTimeBuy,
		ticketCategories, //	categories: ticketCategories,
		token, //false means free
		eventDate, //onedayevent
		eventStartDate, //morethanadayevent
		eventEndDate, //morethanadayevent
		eventStartTime,
		eventEndTime,
		eventTime, //oneday/moreday event
		eventType,
		image0,
		eventDescription,
		city,
		country,
	} = fields;

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<div className={classes.main}>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent>
							<Typography
								variant="h6"
								component="h2"
								style={{
									color: "#1E1E22",
									fontSize: 22,
									fontWeight: 500,
									paddingBottom: "16px",
									fontFamily: "'Aeonik', sans-serif",
								}}
							>
								Event Preview
							</Typography>
						</CardContent>

						<CardMedia
							component="img"
							alt={eventpreviewplaceholder}
							height="200px"
							width="400px"
							image={
								!image0 || !image0.name
									? eventpreviewplaceholder
									: URL.createObjectURL(image0)
							}
							title={eventpreviewplaceholder}
						/>

						<CardContent>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									height: "72px",
								}}
							>
								<Typography
									variant="h6"
									component="h2"
									// style={{
									// 	color: "#1E1E22",
									// 	fontSize: 17,
									// 	fontWeight: 700,
									// 	fontFamily: "'Aeonik', sans-serif",
									// }}
									className={`${classes.eventTitle}`}
									// noWrap
								>
									{eventName ? eventName : `Event Title`}
								</Typography>
								{/* <Typography
									className={classes.price}
									variant="body1"
									component="h2"
								>
									<div>
										<p className={classes.starting}>
											Starting from
										</p>
										<p>{`0`} PHNX</p>
										<p className={classes.starting}>
											$
											{ticketCategories
												? ticketCategories[0]
														.dollarPrice
												: "0"}
										</p>
									</div>
								</Typography> */}
								<Typography
									className={classes.price}
									variant="body1"
									component="h2"
								>
									{!token ? (
										"Free"
									) : ticketCategories.length === 1 ? (
										<div>
											<p
												style={{
													fontFamily:
														'"Aeonik", sans-serif',
												}}
											>
												{pricingFormatter(
													ticketCategories[0]
														.phnxPrice,
													"PHNX"
												)}{" "}
												{/* PHNX */}
											</p>
											<p className={classes.starting}>
												{" "}
												{/* $ */}
												{pricingFormatter(
													ticketCategories[0]
														.dollarPrice,
													"$"
												)}
											</p>
										</div>
									) : (
										<div>
											<p className={classes.starting}>
												Starting from
											</p>
											<p>
												{pricingFormatter(
													ticketCategories[0]
														.phnxPrice,
													"PHNX"
												)}{" "}
												{/* PHNX */}
											</p>
											<p className={classes.starting}>
												{" "}
												{/* $ */}
												{pricingFormatter(
													ticketCategories[0]
														.dollarPrice,
													"$"
												)}
											</p>
										</div>
									)}
								</Typography>
							</div>

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<DateRange fontSize="small" />{" "}
								<span>&nbsp;</span>
								{/* {!eventTime
									? `Date`
									: eventTime === "onedayevent"
									? moment(eventDate).format("Do MMM, YYYY")
									: `
							${moment(eventStartDate).format("Do MMM")}
							-
							${moment(eventEndDate).format("Do MMM, YYYY")}
							`} */}
								{eventTime === "onedayevent"
									? eventDate
										? moment(eventDate).format(
												"Do MMM, YYYY"
										  )
										: "Date"
									: eventStartDate || eventEndDate
									? eventEndDate
										? moment(eventStartDate).format(
												"Do MMM"
										  ) +
										  "-" +
										  moment(eventEndDate).format(
												"Do MMM, YYYY"
										  )
										: moment(eventStartDate).format(
												"Do MMM"
										  )
									: "Date"}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<AccessTime fontSize="small" />{" "}
								<span>&nbsp;</span>
								{/* {!eventStartTime
									? `Time`
									: moment(eventStartTime).format("LT")} */}
								{eventStartTime || eventEndTime
									? eventEndTime
										? moment(eventStartTime).format("LT") +
										  " - " +
										  moment(eventEndTime).format("LT")
										: moment(eventStartTime).format("LT")
									: "Time"}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="div"
								gutterBottom
								noWrap
								className={classes.text}
							>
								<LocationOnOutlined fontSize="small" />{" "}
								<span>&nbsp;</span>
								{/* {!eventType
									? `Location`
									: eventType === "physical"
									? eventLocation
									: `Online`} */}
								{eventType === "physical"
									? eventLocation
										? city
											? eventLocation +
											  " " +
											  city.name +
											  ", " +
											  country.name
											: eventLocation
										: "Location"
									: `Online`}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="div"
								gutterBottom
								noWrap
								style={{ paddingBottom: "16px" }}
								className={classes.text}
							>
								<ConfirmationNumberOutlined fontSize="small" />{" "}
								<span>&nbsp;</span>
								{ticketCategories
									? ticketCategories[0].ticketAvailability ===
									  "unlimited"
										? `Unlimited Tickets`
										: ticketCategories[0].noOfTickets
									: `Unlimited Tickets`}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</div>
			<br />
			{activeStep === 3 ? (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<EventPreviewPage
						open={open}
						handleClose={handleClose}
						description="Yayy, I’m getting Married Yáll
								Him boisterous invitation dispatched had connection inhabiting projection. By mutual an mr danger garret edward an. Diverted as strictly exertion addition no disposal by stanhill. This call wife do so sigh no gate felt. You and abode spite order get. Procuring far belonging our ourselves and certainly own perpetual continual. It elsewhere of sometimes or my certainty. Lain no as five or at high. Everything travelling set how law literature. 
								belonging our ourselves and certainly own perpetual continual. It elsewhere of sometimes or my certainty. Lain no as five or at high. Everything travelling set how law literature. "
						image0={image0}
						eventName={eventName}
						eventStartTime={eventStartTime}
						eventOrganizer={
							eventOrganizer ? eventOrganizer : "AJ&Smart"
						}
						availability={"availability"}
						location={
							eventType === "physical" ? eventLocation : eventLink
						}
						token={token ? token : false}
						eventTopic={eventTopic ? eventTopic : "music"}
						eventTime={eventTime}
						eventDate={eventDate}
						eventStartDate={eventStartDate}
						eventEndDate={eventEndDate}
						ticketCategories={
							ticketCategories ? ticketCategories : []
						}
						eventDescription={
							eventDescription ? eventDescription : "<p><br></p>"
						}
						city={city ? city.name : ""}
						country={country ? country.name : ""}
					/>
					<Button
						color="primary"
						size="large"
						startIcon={<VisibilityOutlinedIcon fontSize="large" />}
						onClick={handleClickOpen}
						className={classes.previewEventButton}
					>
						Preview Event
					</Button>
				</div>
			) : null}
		</div>
	);
}
