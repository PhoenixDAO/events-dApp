import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		background: "#413AE2",
		color: "white",
		// maxHeight: 54,
		// maxWidth: 230,
		"&:focus": {
			outline: "none",
		},
	},
}));

const ConnectWalletButton = (props) => {
	const classes = useStyles();

	return (
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
	);
};

export default ConnectWalletButton;
