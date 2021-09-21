import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		// background: "#fff",
		paddingTop: "10%",
		paddingBottom: "10%",
		"@media (max-width:400px)":{
			paddingTop:"30%",
			paddingBottom:"30%"
		}
	},
	imageContainer: {
		textAlign: "center",
		// padding: "50px",
		margin: "0 auto",
		"@media (max-width: 900px)": {
			padding: "20px",
		},
	},
	image: {
		borderRadius: "12px",
		width: "80%",
		// height: "364px",
	},
	btnGo: {
		textTransform: "Capitalize",
		background: "#413AE2",
		color: "#fff",
		padding: "10px 40px",
		marginTop: "20px",
		marginInline: "10px",
		width: "185px"
	},
	title: {
		fontFamily: "'Aeonik', sans-serif",
	},
	row: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
		marginBottom: "25px",
		[theme.breakpoints.down("xs")]: {
			display: "grid",
		},
	},	heading: {
		display: "flex",
		alignItems: "center",
		color: "#413AE2",
		fontSize: "28px",
		fontWeight: "600",
		alignItems: "center",
	},
	earningBox:{
		background: "#F6F6FE",
		border: "1px solid #413AE2",
		borderRadius:"20px",
		padding:"25px",
		textAlign:"center",
		width:"100%",
	},
	earningMessage:{
		fontSize: "25px"
	}
}));

const EmptyStateAnalytics = (props) => {
	const classes = useStyles();
	return (
		// <div className={classes.wrapper}>
		// 	<Grid container className={classes.gridContainer}>
		// 		<div className={classes.imageContainer}>
		// 			<img className={classes.image} src={"/images/empty.svg"} />
		// 		</div>
		// 	</Grid>
		// 	<div className="mt-5 text-center">
		// 		<h3 className={`mt-5 ${classes.title}`}>
		// 			No analytics to see 😔
		// 		</h3>
		// 		<Link to="/upcomingevents/1">
		// 			<Button
		// 				className={classes.btnGo}
		// 				variant="contained"
		// 				color="primary"
		// 			>
		// 				Buy a ticket
		// 			</Button>
		// 		</Link>
		// 		<Link to="/createevent">
		// 			<Button
		// 				className={classes.btnGo}
		// 				variant="contained"
		// 				color="primary"
		// 			>
		// 				Create an Event
		// 			</Button>
		// 		</Link>
		// 	</div>
		// </div>
		
		// <div className={classes.wrapper}>
		// 	<Grid container className={classes.gridContainer}>
		// 		<div className={classes.imageContainer}>
		// 			<img
		// 				className={classes.image}
		// 				src={"/images/empty.svg"}
		// 			/>
		// 		</div>
		// 	</Grid>
		// 	<div className="mt-5 text-center">
		// 		<h3 className={`mt-5 ${classes.title}`}>No analytics to see 😔</h3>
		// 		<Link to="/upcomingevents/1">
		// 			<Button
		// 				className={classes.btnGo}
		// 				variant="contained"
		// 				color="primary"
		// 			>
		// 				Buy a ticket
		// 			</Button>
		// 		</Link>
		// 		<Link to="/createevent">
		// 			<Button
		// 				className={classes.btnGo}
		// 				variant="contained"
		// 				color="primary"
		// 			>
		// 				Create an Event
		// 			</Button>
		// 		</Link>
		// 	</div>
		// </div>

		<Grid container>
				<Grid className={classes.row}>
						<h3 className={classes.heading}>Earnings</h3>
				</Grid>
				<Grid className={classes.earningBox}>
			<Grid>
				<p className={classes.earningMessage}>You need to sell a ticket first to see earnings 😔</p>
			</Grid>
			<Grid>
			<Link to="/createevent">
		 			<Button
						className={classes.btnGo}
						variant="contained"
						color="primary"
					>
						Create an Event
					</Button>
			</Link>
			</Grid>
			</Grid>
		</Grid>
	);
};

export default EmptyStateAnalytics;
