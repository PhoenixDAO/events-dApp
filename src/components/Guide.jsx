import React, { useRef } from "react";
import BuyPhnxButton from "./common/BuyPhnxButton";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Header from "./common/Header";

const useStyles = makeStyles((theme) => ({
	termsHeader: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: "40px",
		alignItems: "center",
	},
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,

		background: `#FCFCFD !important`,
		opacity: `1 !important`,
		paddingBottom: "10px",
	},
	menu: {
		padding: "10px",
	},
	menuMainHeading: {
		color: "#413AE2",
		fontSize: "24px",
		fontWeight: "600",
		marginBottom: "24px",
	},
	menuHeading: {
		fontSize: "20px",
		fontWeight: "600",
		marginTop: "20px",
		marginBottom: "20px",
	},
	menuSubHeading: {
		fontSize: "17px",
		color: "#4E4E55",
	},
	hideScroll: {
		"&::-webkit-scrollbar": {
			display: "none",
		},
		overflow: "scroll",
		padding: "20px",
		background: "#fff",
		marginTop: "15px",
	},
	videoResponsive: {
		overflow: "hidden",
		paddingBottom: "56.25%",
		position: "relative",
		height: 0,
		backgroundColor: "#fff",
	},
	videoResponsiveIframe: {
		left: "32px",
		top: "32px",
		borderRadius: "8px",

		width: "88%",
		height: "88%",
		position: "absolute",
	},
	centerItems: {
		textAlign: "center",
		paddingTop: "25px",
		paddingBottom: "25px",
	},
	walkThroughHeading: {
		fontSize: "20px",
		fontWeight: "900",
		lineHeight: "30px",
	},
	alignTextWithVideo: { width: "88%", marginLeft: "30px" },
	hideScroll1: {
		"@media (min-width:1200px)": {
			maxWidth: "65.66667% !important",
			flexBasis: "65.66667% !important",
		},
	},
	hideScroll2: {
		"@media (min-width:1200px)": {
			marginLeft: "1%",
		},
	},
	gridContainer: {
		marginTop: "20px",
	},
}));
const Terms = (props) => {
	const classes = useStyles();
	const pageRefs = useRef({});

	function scrollIntoView(type) {
		pageRefs.current[type].scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}
	return (
		<div className="event-page-wrapper">
			<Header title="How it Works" phnxButton={true} />
			<Grid container className={classes.gridContainer}>
				<Grid
					className={`${classes.hideScroll} ${classes.hideScroll1}`}
					style={{ height: "88vh" }}
					lg={8}
					md={8}
					sm={6}
					xs={12}
				>
					<div className={classes.centerItems}>
						<div className={classes.videoResponsive}>
							<iframe
								className={classes.videoResponsiveIframe}
								id="video"
								width="230"
								heigh="154"
								src={
									"https://www.youtube.com/embed/" +
									"cB-ZRijjIMY"
								}
								frameBorder="0"
								allow="accelerometer, autoplay; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
						<strong className={classes.walkThroughHeading}>
							Walk through video
						</strong>
					</div>
					<div className={classes.alignTextWithVideo}>
						<h2
							ref={(el) =>
								(pageRefs.current = {
									...pageRefs.current,
									InstallationAndConfiguration: el,
								})
							}
						>
							Installation and Configuration
						</h2>
						<h3
							ref={(el) =>
								(pageRefs.current = {
									...pageRefs.current,
									Installation: el,
								})
							}
						>
							MetaMask Installation
						</h3>
						<p>
							An Ethereum Wallet in your Browser. MetaMask is a
							browser extension for storing cryptocurrencies and
							accessing Ethereum enabled distributed applications
							or "dApps" in your browser.
						</p>
						<ul>
							<li>
								Go to your browser extensions and search for
								MetaMask and then add that extension to the
								browser. Alternatively visit www.metamask.io to
								download directly from their website.
							</li>
						</ul>

						<p>[ Image to be entered ]</p>

						<h3
							ref={(el) =>
								(pageRefs.current = {
									...pageRefs.current,
									Configuration: el,
								})
							}
						>
							MetaMask Configuration
						</h3>

						<ul>
							<li>
								Initially, you will be asked to import the
								wallet or create a new one.
							</li>
							<li>
								If you have already created a wallet before then
								import it using it’s private key otherwise
								select to create a new one.
							</li>
							<li>
								MetaMask will provide you with the secret phrase
								this is required for recovering a private key.
								Download it, memorize it or write it down
								someplace safe and make sure no one else can get
								access to it. If you are to lose this and lose
								access to your funds they are lost!
							</li>
						</ul>

						<p>[ 2 IMAGES TO BE ENTERED ]</p>
						<ul>
							<li>
								On the next step it will ask you to enter the
								phras in the same order as it was originally
								presented.
							</li>
							<li>
								And then just after readin and agreeing to their
								terms and conditions Boom!, your decentralized
								walled is created on MetaMask. To access import
								PropTypes from 'prop-types' click on the
								MetaMask icon on the top right cornet of your
								browser (where you will also find you other
								extensions.)
							</li>
						</ul>
						<h2
							ref={(el) =>
								(pageRefs.current = {
									...pageRefs.current,
									Getting: el,
								})
							}
						>
							Getting into app and connecting wallet - Ethereum /
							Polygon configurations.
						</h2>
						<h3>Ethereum main-net</h3>
						<ul>
							<li>
								Open the PhoenixDAO Events Marketplace dApp.
							</li>
							<li>Select MetaMask to connect the wallet.</li>
							<li>
								Select the account you want to connect to and
								click next.
							</li>
						</ul>

						<p>[ IMAGE TO BE ENTERED ]</p>
					</div>
				</Grid>
				<Grid
					className={`${classes.hideScroll} ${classes.hideScroll2}`}
					style={{ height: "89%" }}
					lg={4}
					md={4}
					sm={6}
					xs={12}
				>
					<div className={classes.menu}>
						<h5 className={classes.menuMainHeading}>Menu</h5>
						<Divider light />

						<h5
							className={classes.menuHeading}
							onClick={() =>
								scrollIntoView("InstallationAndConfiguration")
							}
						>
							Installation and Configuration
						</h5>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Installation")}
						>
							Metamask Installation
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Configuration")}
						>
							Metamask Configuration
						</h6>
						<h5
							className={classes.menuHeading}
							onClick={() => scrollIntoView("Getting")}
						>
							Getting into app and connecting wallet - Ethereum /
							Polygon configurations.
						</h5>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Ethereum")}
						>
							Ethereum main-net
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Import1")}
						>
							Import token in MetaMask
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Matic")}
						>
							Matic Mainnet
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Import2")}
						>
							Import Token in Metamask
						</h6>

						<h5
							className={classes.menuHeading}
							onClick={() => scrollIntoView("Features")}
						>
							Features of the App
						</h5>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Dashboard")}
						>
							Dashboard
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Creating")}
						>
							Creating an event
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Upcoming")}
						>
							Upcoming Screens
						</h6>
						<h6
							className={classes.menuSubHeading}
							onClick={() => scrollIntoView("Past")}
						>
							Past Events
						</h6>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default Terms;
