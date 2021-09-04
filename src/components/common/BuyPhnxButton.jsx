import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
// import AddIcon from "@material-ui/icons/Add";
import roundlogo from "../Images/roundlogo.svg";

const useStyles = makeStyles((theme) => ({
	button: {
		fontFamily: "'Aeonik', sans-serif",
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(1),
		textTransform: "initial",
		fontWeight: "600",
		background: "#413AE2",
		padding: "8px 35px",
		paddingInline: "40px",
		[theme.breakpoints.down("xs")]: {
			paddingInline: "20px",
		},

		border: "1px solid #413AE2",
		// maxHeight: 54,
		// maxWidth: 230,
	},
	phoenix: {
		height: "21px",
	},
}));

const BuyPhnxButton = (props) => {
	const classes = useStyles();

	return (
		<Button
			variant="contained"
			color="primary"
			size="large"
			className={classes.button}
			startIcon={
				<img
					style={{ height: "24px" }}
					src={roundlogo}
					alt="phnx logo"
				/>
			}
			onClick={props.onClick}
		>
			Buy PHNX
		</Button>
	);
};

export default BuyPhnxButton;
