import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import slider1 from "../Images/slider1.svg";
import slider2 from "../Images/slider2.svg";
import slider3 from "../Images/slider3.svg";
import slider11 from "../Images/slider11.svg";
import slider22 from "../Images/slider22.svg";
import slider33 from "../Images/slider33.svg";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		"& .slider-image": {
			"@media (min-width: 1200px)": {
				width: "70%",
			},
		},
		"& div ol li": {
			backgroundColor: "#aeaeae",
		},
	},
	imageResponsive:{
		height:"376px",	
	},
	blueTitle:{
		color:"#413AE2"
	},
	greyText:{
		color:"#6b6b6b"
	},
	carouselCaption: {
		textAlign:"Left",
		color: "#ffffff",
		// paddingLeft:"10%",
		"& p": {
			"@media (max-width: 800px)": {
				fontSize: "16px",
			},
			"@media (max-width: 1000px)": {
				width: "76%",
			},
			"@media (max-width: 580px)": {
				width: "88%",
			},

			width: "66%",
			// textShadow: "none",
			fontSize: "22px",
		},
		display: "flex",
		flexDirection: "column",
		// justifyContent: "center",
		// paddingTop:"12%",
		"@media (max-width: 500px)": {
			// paddingTop:"30%",
		},
		// alignItems: "center",
		boxShadow: "none",
		// background: "rgba(0,0,0,0.7)",
	},
	title: {
		textAlign: "left",
		"@media (max-width: 805px)": {
			marginBottom: "15px",
			fontSize: "2.6rem !important",
		},
		"@media (max-width: 1200px)": {
			marginBottom: "15px",
			fontSize: "3rem !important",
		},
		fontSize: "3.5rem !important",
		fontFamily: '"Aeonik" ,sans-serif',
		lineHeight:1.2,
		// textShadow: "0px 1px, 1px 0px, 1px 1px !important",
	},
	text: {
		// textAlign: "justify",
		fontSize: 20,
		fontWeight: "400",
	},
	carouselDiv:{
		height:"376px", backgroundSize: "cover", mozBackgroundSize: "cover", backgroundPosition: "center",
		paddingLeft:"10%",
		paddingTop:"10%"
	}
}));

const Slider = (props) => {
	const classes = useStyles();
	const [duration, setDuration] = useState(323432000);

	return (
		<div className={classes.root}>
		
			<Carousel
				prevIcon={<span />}
				nextIcon={<span />}
				style={{ zIndex: 0 }}
			>
					
				<Carousel.Item interval={duration} style={{backgroundImage:`url(/images/slider01.jpg)`,}} className={classes.carouselDiv}>
				<Link to={`${(props.account)?'/createevent':"#"}`}  style={{textDecoration:"none"}}>
					{/* <img
						className={`d-block slider-image shadow-none ${classes.imageResponsive} img-fluid w-100`}
						style={{
							width: "100%",
							height: "auto",
							float: "left",
						}}
						src={"/images/slider01.jpg"}
						alt="First slide"
					/> */}
					<div className={classes.carouselCaption}>
						<p className={`${classes.title} ${classes.text}`}><strong>
							Get Valuable <span style={{color:"#77ffe5"}}>NFTs</span>
							</strong>
						</p>
						<p className={`${classes.text}`}>
						And save your attended events on the blockchain with PhoenixDAO Events dApp.
						</p>
					</div>
						</Link>
				</Carousel.Item>

				<Carousel.Item interval={duration}  style={{backgroundImage:`url(/images/slider02.jpg)`}} className={classes.carouselDiv}>
				<Link to={`${(props.account)?'/createevent':"#"}`}  style={{textDecoration:"none"}}>
					{/* <img
						className={`d-block slider-image shadow-none ${classes.imageResponsive} img-fluid w-100`}
						style={{
							width: "100%",
							height: "auto",
							float: "left",
						}}
						src={"/images/slider02.jpg"}
						alt="Second slide"
					/> */}
					<div className={classes.carouselCaption}>
						<p className={`${classes.title} ${classes.blueTitle} ${classes.text}`}><strong>Event Management Shouldn't Be Hard</strong></p>
						<p className={` ${classes.greyText} ${classes.text}`}>
						<strong>	Manage your events on the go from anywhere
							</strong>
						</p>
					</div>
						</Link>
				</Carousel.Item>

				<Carousel.Item interval={duration}  style={{backgroundImage:`url(/images/slider03.jpg)`}} className={classes.carouselDiv}>
				<Link to={`${(props.account)?'/createevent':"#"}`}  style={{textDecoration:"none"}}>
					{/* <img
						className={`d-block slider-image shadow-none ${classes.imageResponsive} img-fluid w-100`}
						style={{
							width: "100%",
							height: "auto",
							float: "left",
						}}
						src={"/images/slider03.jpg"}
						alt="Third slide"
					/> */}
					<div className={classes.carouselCaption}>
						<p className={`${classes.title} ${classes.blueTitle} ${classes.text}`}><strong>Have A Preferred Network?</strong></p>
						<p className={` ${classes.greyText} ${classes.text}`}>
							<strong>
						Now you can decide between Ethereum or Polygon
						</strong>
						</p>
					</div>
						</Link>
				</Carousel.Item>
			
			</Carousel>
			
		</div>
	);
};

export default Slider;
