import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		// maxHeight: 54,
		// maxWidth: 230,
	},
}));

const ConnectWalletButton = () => {
	const classes = useStyles();

	return (
		<Button
			variant="contained"
			color="primary"
			size="large"
			className={classes.button}
			startIcon={<AddIcon fontSize="large" />}
		>
			Connect Wallet
		</Button>
	);
};

export default ConnectWalletButton;
