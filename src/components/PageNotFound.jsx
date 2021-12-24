import React from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		// background: "#fff",
		paddingTop: "10%",
		"@media (max-width:400px)":{
			paddingTop:"30%"
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
		fontFamily:'Aeonik'
	},
}));

function PageNotFound() {
	const classes = useStyles();

	return (
		<div className={classes.wrapper}>
			<Grid container className={classes.gridContainer}>
				<div className={classes.imageContainer}>
					<img
						className={classes.image}
						src={"/images/notFound.png"}
					/>
				</div>
			</Grid>
			<div className="mt-5 text-center">
				<h3 className="mt-5">Page not found 🤕</h3>
				<Link to="/allevents/1">
					<Button
						className={classes.btnGo}
						variant="contained"
						color="primary"
					>
						Go to Dashboard
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default PageNotFound;
