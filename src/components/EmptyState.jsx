import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	imageContainer: {
		"& img": {
			width: "30%",
		},
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
		marginTop: "20px",
		fontFamily: "'Aeonik', sans-serif",
		fontWeight: "600",
	},
	title: {
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const EmptyState = props => {
    const classes = useStyles();
    // const [text, setText] = useState("This is text")
    // const [btnText, setBtnText] = useState("Go to btn")
    // const [url, setUrl] = useState("/upcomingevents/1");

	const { text, btnText, url } = props;

	return (
		<div className={classes.wrapper}>
			<Grid container className={classes.gridContainer}>
				<div className={classes.imageContainer}>
					<img
						className={classes.image}
						src={"/images/empty.svg"}
					/>
				</div>
			</Grid>
			<div className="mt-5 text-center">
				<h3 className={`mt-5 ${classes.title}`}>{text}</h3>
				<Link to={url}>
					<Button
						className={classes.btnGo}
						variant="contained"
						color="primary"
					>
						{btnText}
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default EmptyState;
