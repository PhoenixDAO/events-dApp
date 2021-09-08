import React, { useState, useEffect } from "react";
import BuyPhnxButton from "./common/BuyPhnxButton";
import { Grid, Divider } from "@material-ui/core";
import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import AccordianCard from "./common/AccordianCard";
import Header from "./common/Header";

const useStyles = makeStyles((theme) => ({
	termsHeader: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: "40px",
		alignItems: "center",
	},
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,

		background: `#FCFCFD !important`,
		opacity: `1 !important`,
	},
	h2Custom: { fontWeight: "bold", fontSize: "xx-large" },

	card: {
		width: "100%",
		"& .MuiAccordionSummary-expandIcon": {
			transform: "unset",
			transition: "unset",
		},
		boxShadow: "none",
		paddingTop: "20px",
		paddingBottom: "20px",
	},
	card: {
		width: 345,
	},
	media: {
		height: 140,
	},
	heading: {
		fontWeight: "600",
		fontSize: "24px",
		lineHeight: "116.6%",
		letterSpacing: "-0.03em",
		color: "#1E1E22",
	},
	description: {
		color: "#4E4E55",
		fontStyle: "normal",
		fontWeight: "normal",
		fontSize: "20px",
		lineHeight: "150%",
	},

	imageContainer: {
		textAlign: "center",
		width: "100%",
		padding: "20px",
		"@media (min-width: 1200px)": {
			padding: "48px",
		},
	},
	image: {
		borderRadius: "12px",
		width: "100%",
		height: "auto",
	},
	gridContainer: {
		background: "#fff",
		marginTop: "35px",
	},
}));

const questions = [
	{
		heading: "What is events dApp?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Can I create Multiple types of tickets?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Do I compulsorily need to use meta mask?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "My Event failed to create, what can I do?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Help!! I can’t connect to metamask",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "What is Matic Mainnet?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Can I shedule an event for later?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Can I create Multiple types of tickets",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading:
			"What could be the possible reasons for event creation failing?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading:
			"What If I’m no longer interested in a ticket, can I get a refund?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Is there a limit to the number of tickets I can buy?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
	{
		heading: "Can I preview event before hosting?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens",
	},
];

const AllQuestionsOnAccordianCards = () => {
	return questions.map((question) => (
		<AccordianCard
			heading={question.heading}
			description={question.description}
		/>
	));
};
const FAQ = (props) => {
	const classes = useStyles();
	const [prevPath, setPrevPath] = useState(-1);
	useEffect(() => {
		if (prevPath == -1) {
			props.executeScroll();
		}
	}, []);
	return (
		<div className="event-page-wrapper">
			<Header title="Frequently Asked Questions" phnxButton={true} />
			<Grid container className={classes.gridContainer}>
				<div className={classes.imageContainer}>
					<img
						className={classes.image}
						src={"/images/Frame-223.svg"}
					></img>
				</div>

				<AllQuestionsOnAccordianCards />
			</Grid>
		</div>
	);
};

export default FAQ;
