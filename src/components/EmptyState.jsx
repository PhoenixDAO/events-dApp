import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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
		fontFamily:"'Aeonik', sans-serif",
	},
	title: {
		fontFamily: "'Aeonik', sans-serif",
		color:"#4E4E55",
		"@media (max-width:500px)":{
			width:"100%",
			fontSize:"1.3em",
		},
		width:"80%",
		marginLeft:"auto",
		marginRight:"auto"
	},
}));

const EmptyState = props => {
    const classes = useStyles();
    // const [text, setText] = useState("This is text")
    // const [btnText, setBtnText] = useState("Go to btn")
    // const [url, setUrl] = useState("/allevents/1");

	const { text, btnText, url } = props;
	// return (
	// 	<div className={classes.wrapper}>
	// 		<Grid container className={classes.gridContainer}>
	// 			<div className={classes.imageContainer}>
	// 				<img
	// 					className={classes.image}
	// 					src={"/images/empty.svg"}
	// 				/>
	// 			</div>
	// 		</Grid>
	// 		<div className="mt-5 text-center">
	// 			<h3 className={`mt-5 ${classes.title}`}>{text}</h3>
	// 			<Link to={url}>
	// 				<Button
	// 					className={classes.btnGo}
	// 					variant="contained"
	// 					color="primary"
	// 				>
	// 					{btnText}
	// 				</Button>
	// 			</Link>
	// 		</div>
	// 	</div>
	// );

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
				<Link to={props.url}>
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
