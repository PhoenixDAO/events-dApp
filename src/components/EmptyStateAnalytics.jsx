import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	imageContainer: {
		// "& img": {
		// 	width: "30%",
		// },
		textAlign: "center",
		padding: "40px",
		width: "100%",
		"@media (max-width: 900px)": {
			padding: "20px",
		},
	},
	btnGo: {
		textTransform: "Capitalize",
		background: "#413AE2",
		color: "#fff",
		padding: "10px 40px",
		margin: "20px 13px",
		fontFamily: "'Aeonik', sans-serif",
		fontWeight: "600",
	},
	title: {
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const EmptyStateAnalytics = (props) => {
	const classes = useStyles();
	return (
		<div className={classes.wrapper}>
			<Grid container className={classes.gridContainer}>
				<div className={classes.imageContainer}>
					<img className={classes.image} src={"/images/empty.svg"} />
				</div>
			</Grid>
			<div className="mt-5 text-center">
				<h3 className={`mt-5 ${classes.title}`}>
					No analytics to see 😔
				</h3>
				<Link to="/upcomingevents/1">
					<Button
						className={classes.btnGo}
						variant="contained"
						color="primary"
					>
						Buy a ticket
					</Button>
				</Link>
				<Link to="/createevent">
					<Button
						className={classes.btnGo}
						variant="contained"
						color="primary"
					>
						Create an Event
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default EmptyStateAnalytics;
