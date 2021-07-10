import React from "react";
import { Carousel } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import slider1 from "../Images/slider1.svg";
import slider2 from "../Images/slider2.svg";
import slider3 from "../Images/slider3.svg";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
	},
	carouselCaption: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		// paddingLeft: 64,
	},
	title: {
		fontSize: 36,
		fontWeight: "700",
	},
	text: {
		fontSize: 20,
		fontWeight: "400",
	},
}));

const Slider = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Carousel
				prevIcon={<span />}
				nextIcon={<span />}
				style={{ zIndex: 0 }}
			>
				<Carousel.Item interval={1000}>
					<img
						className="d-block w-100"
						src={slider1}
						alt="First slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>
							Be more with Phoenix Events
						</p>
						<p className={classes.text}>
							Events Marketplace allows event attendees to secure
							tickets with crypto and verify authenticity of peer
							to peer ticket transfers via Phoenix Identity
							protocol.
						</p>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item interval={1000}>
					<img
						className="d-block w-100"
						src={slider2}
						alt="Second slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>Privacy Assured</p>
						<p className={classes.text}>
							Events Marketplace allows event attendees to secure
							tickets with crypto and verify authenticity of peer
							to peer ticket transfers via Phoenix Identity
							protocol.
						</p>
					</Carousel.Caption>
				</Carousel.Item>

				<Carousel.Item interval={1000}>
					<img
						className="d-block w-100"
						src={slider3}
						alt="Third slide"
					/>
					<Carousel.Caption className={classes.carouselCaption}>
						<p className={classes.title}>Privacy Assured</p>
						<p className={classes.text}>
							Events Marketplace allows event attendees to secure
							tickets with crypto and verify authenticity of peer
							to peer ticket transfers via Phoenix Identity
							protocol.
						</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default Slider;
