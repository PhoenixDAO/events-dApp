import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
		textTransform: "initial",
		fontWeight: "600",
		background: "#413AE2",
		padding: "8px 35px",
		// maxHeight: 54,
		// maxWidth: 230,
	},
	phoenix: {
		height: "21px"
	}
}));

const BuyPhnxButton = () => {
	const classes = useStyles();

	return (
		<Button
			variant="contained"
			color="primary"
			size="large"
			className={classes.button}
			startIcon={<img
				src={"/images/phoenixdao.svg"}
				className={classes.phoenix}
				alt="Event Price"
			/>}
		>
			Buy PHNX
		</Button>
	);
};

export default BuyPhnxButton;
