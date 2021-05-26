import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Typography,
	CardHeader,
	Avatar,
	IconButton,
	Box,
	Link,
} from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
	},
	avatar: {
		backgroundColor: "red",
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
}) => {
	const classes = useStyles();

	return (
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
									}}
								>
									<ConfirmationNumberOutlinedIcon fontSize="large" />
									{max_seats}/{event_data.sold}
								</Typography>
								<Typography
									style={{
										color: "#fff",
									}}
								>
									<FavoriteBorderIcon fontSize="large" />
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
							<Typography variant="h6" component="h2">
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
						>
							<DateRangeIcon fontSize="small" />{" "}
							<span>&nbsp;</span>
							{date.toLocaleDateString()}
						</Typography>

						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
							gutterBottom
						>
							<AccessTimeIcon fontSize="small" />{" "}
							<span>&nbsp;</span>
							{date.toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Typography>

						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
							gutterBottom
						>
							<LocationOnOutlinedIcon fontSize="small" />{" "}
							<span>&nbsp;</span>
							{locations}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Link>
	);
};

export default EventCard;
