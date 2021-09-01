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
	root:{
		height: "100%"
	},
	avatar: {
		backgroundColor: "red",
	},
	text: {
		color: "#4E4E55",
		marginBottom: "18px",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		position:"absolute",
		bottom: "0px",
	},
	topicName:{
		WebkitLineClamp: "2",
		maxWidth:"100%",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		overflow: "hidden",
		textOverflow: "ellipsis",
		"@media (min-width: 990px) and (max-width: 1024px)": {
			/* For landscape layouts only */
			WebkitLineClamp: "3",
		  }
	},
	cardHeight:{
		height:"100%"
	},
	contentPosition:{
		paddingBottom:"25px",
		height:"100%"
	}
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
				<CardActionArea className={classes.cardHeight}>
					<CardMedia
						component="img"
						alt={image}
						height="195"
						width="357"
						image={image}
						title={name}
						className={classes.imagePosition}
					/>
					<CardContent className={classes.contentPosition} >
						<Typography
							variant="h6"
							component="h2"
							className={`${classes.topicName} h-100`}
							title = {name}
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
							
							{count} {
								count == 1 ?" Event" : " Events"
							}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Link>
	);
};

export default TopicCard;
