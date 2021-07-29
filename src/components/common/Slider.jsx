import React, {useState} from "react";
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
		"& p": {
			"@media (max-width: 800px)": {
				fontSize: "14px",
			},
			"@media (min-width: 1100px)": {
				marginLeft: "-220px",
			},
			textAlign: "left",
			width: "70%",
			fontFamily: '"Aeonik" ,sans-serif',
			textShadow: "none",
			fontSize: "19px",
		},
		"@media (max-width: 900px)": {
			paddingTop: "0"
		},
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		boxShadow: "inset 508px -389px 187px rgb(0 0 0 / 80%)",
		paddingTop: "210px",
		// paddingLeft: 64,
	},
	title: {
		"@media (max-width: 767px)": {
			marginBottom: "0",
			fontSize: "18px !important",
		},
		fontSize: "36px !important",
		fontWeight: "700",
	},
	text: {
		fontSize: 20,
		fontWeight: "400",
	},
}));

const Slider = () => {
	const classes = useStyles();
	const [duration, setDuration] = useState(100000)

	return (
		<div className={classes.root}>
			<Carousel
				prevIcon={<span />}
				nextIcon={<span />}
				style={{ zIndex: 0 }}
			>
				<Carousel.Item interval={duration}>
					<img className="d-block" src={slider1} alt="First slide" />
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

				<Carousel.Item interval={duration}>
					<img className="d-block" src={slider2} alt="Second slide" />
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

				<Carousel.Item interval={duration}>
					<img className="d-block" src={slider3} alt="Third slide" />
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
