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
		boxShadow: "none",
		padding: "30px",
		"@media (min-width: 992px)": {
			width: "70%",
			left: "15%",
			paddingTop: "30px",
			paddingBottom: "30px",
		},
		"& .MuiAccordionSummary-expandIcon": {
			transform: "unset",
			transition: "unset",
		},
		"& .MuiAccordionSummary-root": {
			padding: "0",
		},
	},
	heading: {
		fontWeight: "400",
		fontSize: "24px",
		lineHeight: "116.6%",
		letterSpacing: "-0.03em",
		color: "#1E1E22",
		fontFamily: "'Aeonik', sans-serif",
	},
	description: {
		color: "#4E4E55",
		fontWeight: "200",
		fontSize: "20px",
		lineHeight: "150%",
		fontFamily: "'AeonikReg', sans-serif",
	},
	detailsParent: {
		padding: "8px 50px 16px 0",
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
				<AccordionDetails className={classes.detailsParent}>
					<Typography className={classes.description}>
						{props.description}
					</Typography>
				</AccordionDetails>
			</Accordion>
			<hr />
		</React.Fragment>
	);
}
