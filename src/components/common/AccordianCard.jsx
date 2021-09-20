import React,{useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import {Remove} from "@material-ui/icons";
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
		whiteSpace: "pre-wrap",
	},
	detailsParent: {
		padding: "8px 50px 16px 0",
	},
}));

export default function (props) {
	const classes = useStyles();
	const [expanded,setExpanded] =useState("");
	
	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	  };
	
	return (
		<React.Fragment>
			<Accordion className={classes.root} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<AccordionSummary
					expandIcon={expanded === 'panel1'?<Remove color="#1E1E22" />:<AddIcon color="#1E1E22"/>}

					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography className={classes.heading}>
						{props.heading}
					</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.detailsParent}>
					<Typography className={classes.description} component='div'>
						{props.description}
					</Typography>
				</AccordionDetails>
			</Accordion>
			<hr />
		</React.Fragment>
	);
}
