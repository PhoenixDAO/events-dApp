import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography,
	Link,
} from "@material-ui/core";

import EventNoteIcon from "@material-ui/icons/EventNote";

const useStyles = makeStyles((theme) => ({
	avatar: {
		backgroundColor: "red",
	},
	text: {
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const TopicCard = ({ image, name, slug, count }) => {
	const classes = useStyles();

	return (
		<Link
			underline="none"
			component={RouterLink}
			to={"/topic/" + slug + "/" + 1}
			style={{ textDecoration: "none" }}
		>
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
								fontFamily: "'Aeonik', sans-serif",
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
							<EventNoteIcon fontSize="small" />{" "}
							<span>&nbsp;</span>
							{count} Events
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Link>
	);
};

export default TopicCard;
