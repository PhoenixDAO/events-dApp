import React from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		background: "#fff",
		marginTop: "40px",
	},
	imageContainer: {
		textAlign: "center",
		padding: "100px",
		margin: "0 auto",
		"@media (max-width: 900px)": {
			padding: "20px",
		},
	},
	image: {
		borderRadius: "12px",
		width: "100%",
		// height: "364px",
	},
	btnGo: {
		textTransform: "Capitalize",
		background: "#413AE2",
		color: "#fff",
		padding: "10px 40px",
		marginTop: "20px",
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
				<Link to="/upcomingevents/1">
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
