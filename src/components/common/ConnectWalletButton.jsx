import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
const useStyles = makeStyles((theme) => ({
	btnDiv: {
		"@media screen and (max-width: 1100px)": {
			display: "inline-block",
		},
		margin: "7px 0px 7px 0px",
	},
	button: {
		"@media screen and (max-width: 1200px)": {
			height: "45px",
			lineHeight: "1",
		},
		fontFamily: "'Aeonik', sans-serif",
		background: "#413AE2",
		color: "white",
		textTransform: "Capitalize",
		"&:focus": {
			outline: "none",
		},
	},
}));

const ConnectWalletButton = (props) => {
	const classes = useStyles();
	return (
		<div className={classes.btnDiv}>
			<Button
				variant="contained"
				color="primary"
				size="large"
				className={classes.button}
				startIcon={<AddIcon fontSize="large" />}
				onClick={props.onClick}
			>
				Connect Wallet
			</Button>
		</div>
	);
};

export default ConnectWalletButton;
