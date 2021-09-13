import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import slider1 from "../Images/slider1.svg";
import slider2 from "../Images/slider2.svg";
import slider3 from "../Images/slider3.svg";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		"& .slider-image": {
			"@media (min-width: 1200px)": {
				width: "100%",
			},
		},
		"& div ol li":{
			backgroundColor:"#aeaeae"
		}
		},
	carouselCaption: {
		"& p": {
			"@media (max-width: 800px)": {
				fontSize: "14px",
			},
			"@media (max-width: 1000px)": {
				width: "70%",

			},
			"@media (max-width: 580px)":{
				width: "88%",
			},
			
			width: "57%",
			textShadow: "none",
			fontSize: "18px",
		},
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		boxShadow: "none",
		background: "rgba(0,0,0,0.7)",
	},
	title: {
		textAlign: "left",
		"@media (max-width: 805px)": {
			marginBottom: "15px",
			fontSize: "24px !important",
		},
		fontSize: "36px !important",
		fontFamily: '"Aeonik" ,sans-serif',
	},
	text: {
		textAlign:"justify",
		fontSize: 20,
		fontWeight: "400",
	},
}));

const Slider = () => {
	const classes = useStyles();
	const [duration, setDuration] = useState(3000);

	return (
		<div className={classes.root}>
			<Carousel
				prevIcon={<span />}
				nextIcon={<span />}
				style={{ zIndex: 0 }}
			>
				<Carousel.Item interval={duration}>
					<img
						className="d-block slider-image shadow-none"
						src={slider1}
						alt="First slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>
							Be more with Phoenix Events
						</p>
						<p className={classes.text}>
							PhoenixDAO events marketplace come NFT ticketing dApp allows events attendee's to secure tickets with crypto and verify authenticity of peer to peer ticket transfer leveraging the power of blockchain (i.e a combination of both in-house and third-party protocols)
						</p>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item interval={duration}>
					<img
						className="d-block slider-image shadow-none"
						src={slider2}
						alt="Second slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>Privacy Assured</p>
						<p className={classes.text}>
							PhoenixDAO events marketplace come NFT ticketing dApp allows events attendee's to secure tickets with crypto and verify authenticity of peer to peer ticket transfer leveraging the power of blockchain (i.e a combination of both in-house and third-party protocols)
						</p>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item interval={duration}>
					<img
						className="d-block slider-image shadow-none"
						src={slider3}
						alt="Third slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>Privacy Assured</p>
						<p className={classes.text}>
							PhoenixDAO events marketplace come NFT ticketing dApp allows events attendee's to secure tickets with crypto and verify authenticity of peer to peer ticket transfer leveraging the power of blockchain (i.e a combination of both in-house and third-party protocols)
						</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default Slider;
