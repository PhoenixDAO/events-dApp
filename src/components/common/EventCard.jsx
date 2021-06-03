import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Divider,
	Grid,
	Typography,
	CardHeader,
	Avatar,
	Box,
	Link,
} from "@material-ui/core";
import {
	DateRange,
	AccessTime,
	LocationOnOutlined,
	ConfirmationNumberOutlined,
	FavoriteBorder,
	LaunchSharp,
} from "@material-ui/icons";
import ShareModal from "../common/ShareModal";
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
		padding: "10px",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		"&:focus": {
			outline: "none",
		},
	},
}));

const EventCard = ({
	event_data,
	date,
	image,
	locations,
	myEvent,
	myEventStatURL,
	titleURL,
	max_seats,
	revenue,
	dollarRevenue,
}) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const handleClickOpen = (e) => {
		setOpen(true);
		e.preventDefault();
	};
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<ShareModal
				open={open}
				handleClose={handleClose}
				titleURL={titleURL}
			/>
			<Link
				underline="none"
				component={RouterLink}
				to={myEvent ? myEventStatURL : titleURL}
				style={{ textDecoration: "none" }}
			>
				<Card className={classes.root}>
					<CardActionArea>
						<div style={{ position: "relative" }}>
							<CardMedia
								component="img"
								alt={event_data.name}
								height="200"
								image={image}
								title={event_data.name}
							/>
							<div
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: 10,
										backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)`,
									}}
								>
									<Typography
										style={{
											color: "#fff",
											fontSize: 17,
											fontWeight: 500,
										}}
									>
										<ConfirmationNumberOutlined fontSize="large" />
										<span>&nbsp;</span>
										{event_data.sold}/{max_seats}
									</Typography>
									<Typography
										style={{
											color: "#fff",
										}}
									>
										{!myEvent ? (
											<FavoriteBorder fontSize="large" />
										) : null}
									</Typography>
								</div>
							</div>
						</div>

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
								>
									{event_data.sold >= 2 ? (
										<img
											src="/images/fire.png"
											className="event_badge-hot"
											alt="Hot Icon"
										/>
									) : (
										""
									)}
									{event_data.name}
								</Typography>

								<Typography
									style={{ color: "#413AE2" }}
									variant="body1"
									component="h2"
								>
									Free
								</Typography>
							</div>

							<br />

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<DateRange fontSize="small" />{" "}
								<span>&nbsp;</span>
								{date.toLocaleDateString()}
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
								{date.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
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
								<LocationOnOutlined fontSize="small" />{" "}
								<span>&nbsp;</span>
								{locations}
							</Typography>
							{myEvent ? (
								<Grid item>
									<Divider style={{ marginBottom: "20px" }} />
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										{"Ticket Sold: "}
										<span>&nbsp;</span>
										{event_data.sold}/{max_seats}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										PHNX Revenue: {revenue} PHNX
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
										style={{ marginBottom: "20px" }}
									>
										Dollar Revenue: $ {dollarRevenue}
									</Typography>
									<Divider />

									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
								</Grid>
							) : null}
						</CardContent>
					</CardActionArea>
				</Card>
			</Link>
		</div>
	);
};

export default EventCard;
