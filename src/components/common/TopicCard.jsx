import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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

import EventNoteIcon from "@material-ui/icons/EventNote";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
	},
	avatar: {
		backgroundColor: "red",
	},
	text: {
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
	},
}));

const TopicCard = ({ image, name }) => {
	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardMedia
					component="img"
					alt={image}
					height="195"
					width="357"
					image={image}
					title={name}
				/>
				<CardContent>
					<Typography
						variant="h6"
						component="h2"
						style={{
							color: "#1E1E22",
							fontSize: 17,
							fontWeight: 700,
						}}
					>
						{name}
					</Typography>
					<br />
					<Typography
						variant="body2"
						color="textSecondary"
						component="p"
						gutterBottom
						className={classes.text}
					>
						<EventNoteIcon fontSize="small" /> <span>&nbsp;</span>
						12 Events
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default TopicCard;
