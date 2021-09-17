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
		heading: "What is PhoenixDAO Events dApp?",
		description:
			"The PhoenixDAO Events Marketplace is a dApp that allows people to create events and sell tickets online, with the option to make an event, paid or free. The tickets created on this service are ERC721 tokens (Meaning they are NFT’s).",
	},
	{
		heading: "Can I create multiple types of tickets?",
		description:
			"Yes you can create multiple types of tickets. By way of example you can create free/paid tickets on the dApp. For paid events, you can also make the tickets in categories with different prices which helps you distinguish the different types of attendees you’ll be expecting to participate.",
	},
	{
		heading: "Do I compulsorily need to use Meta Mask?",
		description:
			"For now, yes. You need MetaMask (MM) if you want to be able to see and interact with all events that are live on the dApp. Tickets fees are charged from your MM wallet. We are working to support other web wallets which will give users options based on preferences.",
	},
	{
		heading: "My event failed to create, what do I do?",
		description:
			"First, in the situation that your event failed to create, you may need to do some basic checks like making sure your Metamask wallet is connected, you have balance that can cover the gas cost of creating your event/interacting with the blockchain and also you have properly filled all required fields while creating the events. If all these are ticked and it still doesn’t work, then it could be a network problem. You’re advised to give some time and try again. There’s also a feedback form at the bottom of the platform to get back to the team if it persist.",
	},
	{
		heading: "Help, I can't connect to meta mask",
		description:
			"Here’s a video guide on “How to connect to Meta mask”, “How to change Network”, and “How to be Safe on Meta Mask”. Don’t forget to check our “How it works page” on the dApp menu.",
	},
	{
		heading: "What is Matic Mainnet?",
		description:
			"Matic Network is a Layer 2 scaling solution that achieves scale by utilizing sidechains for off-chain computation while ensuring asset security using the Plasma framework and a decentralized network of Proof-of-Stake (PoS) validators. PhoenixDAO Events dApp is hosted on both Matic Network and the Ethereum Layer1 Network. Users can switch between both networks to create and manage their events based on preference.\nNB: Fees are much cheaper on Matic Network than Ethereum. Most times about a fraction of a dollar.",
	},
	{
		heading: "Can I schedule an event for later?",
		description:
			"Yes you can schedule an event for later by adding to your favourite. This way it becomes easier for you to check the event details.\nNB: When you schedule an event for later, it doesn’t change the date set by the creator for the event to hold. Also, you can only add and view favourite after/when you connect your wallet",
	},
	{
		heading: "What could be the possible reason for event creation failing?",
		description:
			"Some of the reasons include but not limited to Network congestion/failure to send either on the Ethereum/Matic Network, low/insufficient balance to cover gas fee in your MetaMask wallet, missing required details while filling events details, and probably when using a wallet that has been flagged for fraudulent/suspicious activities.",
	},
	{
		heading:
			"What if I'm no longer interested in a ticket/an event, can I get a refund?",
		description:
			"These and more features are already on the development backlog to be integrated. The best bet now if you find yourself in such a situation is to resell your ticket.\nNB: There are features planned to be integrated in future versions/iterations of the dApp.",
	},
	{
		heading:
			"Is there a limit to the number of tickets I can buy?",
		description:
			"If ticket category is limited you can buy tickets to that limit or if it is unlimited no of seats you can buy infinite no of tickets.\nIf the event is restricted to one wallet address then you can only buy it once with one wallet address.",
	},
	{
		heading: "Can I preview events before hosting?",
		description:
			"Yes you can preview events before hosting/submitting them to the public.",
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
