import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		// maxHeight: 54,
		// maxWidth: 230,
	},
}));

const BuyPhnxButton = () => {
	const classes = useStyles();

	return (
		<Button
			variant="contained"
			color="primary"
			size="large"
			className={classes.button}
			// startIcon={<p>PHNX LOGO</p>}
		>
			Buy PHNX
		</Button>
	);
};

export default BuyPhnxButton;
