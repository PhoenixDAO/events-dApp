import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		"& .MuiAccordionSummary-expandIcon": {
			transform: "unset",
			transition: "unset",
		},
		boxShadow: "none",
		paddingTop: "30px",
		paddingBottom: "30px",
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
}));

export default function (props) {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Accordion className={classes.root}>
				<AccordionSummary
					expandIcon={<AddIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography className={classes.heading}>
						{props.heading}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography className={classes.description}>
						{props.description}
					</Typography>
				</AccordionDetails>
			</Accordion>
			<hr />
		</React.Fragment>
	);
}
