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
var moment = require("moment");

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
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
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		textAlign: "end",
	},
	starting: {
		color: "#73727D",
		fontSize: "14px",
		marginBottom: "0px",
		fontWeight: "400",
	},
	price: {
		color: "#413AE2",
		fontWeight: "700",
		fontSize: "17px",
		"& p": {
			marginBottom: "0px",
		},
		minHeight: "71px",
	},
}));

export default function PreviewEvent({ fields }) {
	const classes = useStyles();
	const [tktQnty, setTktQnty] = useState(0);

	const {
		eventName,
		eventOrganizer,
		eventTopic,
		eventCategory,
		eventLocation,
		restrictWallet: oneTimeBuy,
		categories: ticketCategories,
		token,
		eventDate, //onedayevent
		eventStartDate, //morethanadayevent
		eventEndDate, //morethanadayevent
		eventStartTime,
		eventEndTime,
		eventTime, //oneday/moreday event
		eventType,
		image0,
	} = fields;

	console.log("fields @ preview", fields);

	useEffect(() => {
		const { categories: ticketCategories } = fields;
		let totalTktQnty = 0;
		if (ticketCategories) {
			for (var i = 0; i < ticketCategories.length; i++) {
				totalTktQnty =
					parseInt(totalTktQnty) +
					parseInt(ticketCategories[i].noOfTickets);
			}
			setTktQnty(totalTktQnty);
		}
	}, [fields]);

	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardContent>
					<Typography
						variant="h6"
						component="h2"
						style={{
							color: "#1E1E22",
							fontSize: 17,
							fontWeight: 700,
							paddingBottom: "16px",
						}}
					>
						Event Preview
					</Typography>
				</CardContent>

				<CardMedia
					component="img"
					alt={eventpreviewplaceholder}
					height="200"
					image={
						!image0
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
						}}
					>
						<Typography
							variant="h6"
							component="h2"
							style={{
								color: "#1E1E22",
								fontSize: 17,
								fontWeight: 700,
							}}
							noWrap
						>
							{eventName ? eventName : `Event Title`}
						</Typography>
						<Typography
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
										? ticketCategories[0].dollarPrice
										: "0"}
								</p>
							</div>
						</Typography>
					</div>

					<Typography
						variant="body2"
						color="textSecondary"
						component="p"
						gutterBottom
						className={classes.text}
					>
						<DateRange fontSize="small" /> <span>&nbsp;</span>
						{!eventTime
							? `Date`
							: eventTime === "onedayevent"
							? moment(eventDate).format("Do MMM, YYYY")
							: `
							${moment(eventStartDate).format("Do MMM")}
							-
							${moment(eventEndDate).format("Do MMM, YYYY")}

							`}
					</Typography>

					<Typography
						variant="body2"
						color="textSecondary"
						component="p"
						gutterBottom
						className={classes.text}
					>
						<AccessTime fontSize="small" /> <span>&nbsp;</span>
						{!eventStartTime
							? `Time`
							: moment(eventStartTime).format("LT")}
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
						{!eventType
							? `Location`
							: !eventType === "physical"
							? `Online`
							: eventLocation}
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
						{!eventCategory
							? `Number of Tickets`
							: tktQnty === 0
							? `Unlimited Tickets`
							: tktQnty}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
