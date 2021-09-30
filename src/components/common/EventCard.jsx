import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { pricingFormatter } from "../../utils/pricingSuffix";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
	API_URL,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
} from "../../config/const";
import { toast } from "react-toastify";

import Notify from "../Notify";
import axios from "axios";
import Web3 from "web3";

import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Button,
	Divider,
	Grid,
	Typography,
	Link,
} from "@material-ui/core";
import {
	DateRange,
	AccessTime,
	LocationOnOutlined,
	ConfirmationNumberOutlined,
	FavoriteBorder,
	Favorite,
	LaunchSharp,
	Send,
} from "@material-ui/icons";

import ShareModal from "../common/ShareModal";
import SendTicket from "../common/SendTicket";
var moment = require("moment");

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
		"& .MuiCardContent-root": {
			padding: "16px 16px 0px",
		},
	},
	avatar: {
		backgroundColor: "red",
	},

	row: {
		display: "flex",
		borderTop: "1px solid #E4E4E7",
		marginLeft: "-16px",
		marginRight: "-16px",
		padding: "0px 16px",
	},
	text: {
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		"@media (max-width:900px)": {
			fontSize: 13,
		},
		"@media (min-width:900px) and (max-width:1450px)": {
			fontSize: 15,
		},
		"@media (min-width:600px)": {
			display: "-webkit-box",
			WebkitBoxOrient: "vertical",
			WebkitLineClamp: "1",
			overflow: "hidden",
			textOverflow: "ellipsis",
		},
	},
	shareButton: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		"&:focus": {
			outline: "none",
		},
	},
	sendTicket: {
		"&:hover": {
			backgroundColor: "transparent",
		},
		textTransform: "Capitalize",
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		width: "100%",
		color: "#4E4E55",
		fontSize: 17,
		fontWeight: 500,
		"&:focus": {
			outline: "none",
		},
		borderLeft: "1px solid #E4E4E7",
		borderRadius: "0px",
		fontFamily: "'Aeonik', sans-serif",
	},
	FavoriteIcon: {
		textAlign: "center",
		border: "none",
		backgroundColor: "#fff",
		fontSize: 15,
		fontWeight: 500,
		borderRadius: "50%",
		width: "32px",
		height: "32px",
		"&:focus": {
			outline: "none",
		},
	},
	eventinfo: {
		fontSize: "22px",
		fontWeight: "700",
		fontFamily: "'Aeonik', sans-serif",
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		textAlign: "end",
		fontFamily: "'Aeonik', sans-serif",
	},
	starting: {
		color: "#73727D",
		fontSize: "14px",
		marginBottom: "0px",
		fontWeight: "400",
		fontFamily: "'Aeonik', sans-serif",
	},
	price: {
		color: "#413AE2",
		fontWeight: "700",
		maxWidth: "35.33%",
		width: "100%",
		fontSize: "16px",
		fontFamily: "'Aeonik', sans-serif !important",
		"& p": {
			marginBottom: "0px",
		},
		minHeight: "71px",
		textAlign: "end",
	},
	favouriteGrid: {
		display: "flex",
		padding: 10,
		backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))`,
	},
	quantitySold: {
		display: "flex",
		alignItems: "center",
		color: "#fff",
		fontSize: 17,
		fontWeight: 500,
	},
	priceAlignment: {
		textAlign: "end",
	},
	dateWidthMobile: {
		"@media (max-width:450px)": {
			maxWidth: "80%",
		},
	},
	eventTitle: {
		color: "#1E1E22",
		minWidth: "65.66%",
		width: "100%",
		fontSize: 16,
		maxHeight: "52px",
		fontWeight: 700,
		fontFamily: "'Aeonik', sans-serif",
		wordBreak: "break-word",
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: "2",
		overflow: "hidden",
		textOverflow: "ellipsis",
		// "@media (min-width: 990px) and (max-width: 1024px)": {
		// /* For landscape layouts only */
		// WebkitLineClamp: "3",
		// 	}
	},
	cardMainDetails: {
		display: "flex",
		justifyContent: "space-between",
		height: "100%",
		"@media (min-width:765px) and (max-width: 1100px)": {
			height: "110px",
		},
		"@media (min-width:1100px) and (max-width: 1400px)": {
			height: "90px",
		},
	},
}));

const EventCard = (props, context) => {
	const {
		event_data,
		date,
		image,
		locations,
		myEvent,
		titleURL,
		max_seats,
		revenue,
		dollarRevenue,
		ticket,
		sendTicket2,
		eventId,
		myFavorites,
		favoriteEvent,
		//
		eventOrganizer,
		eventDate,
		eventStartDate,
		eventEndDate,
		eventStartTime,
		eventEndTime,
		eventTime,
		eventType,
		eventDescription,
		eventLocation,
	} = props;

	useEffect(() => {
		setIcon(favoriteEvent);
		getPhoenixDAOMarketValue();
	}, [favoriteEvent]);

	const classes = useStyles();
	const [Icon, setIcon] = useState(false);
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [PhoenixDAO_market, setPhoenixDAO_market] = useState("");
	// changeIcon(favoriteEvent);
	const handleClickOpen = (e) => {
		setOpen(true);
		e.preventDefault();
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleClickOpen2 = (e) => {
		setOpen2(true);
		e.preventDefault();
	};
	const handleClose2 = () => {
		setOpen2(false);
	};

	const addTofavorite = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("AUTH_TOKEN");
		try {
			let payload = {
				address: props.accounts,
				networkId: props.networkId,
				eventId: eventId,
			};

			//for add to favourite
			if (!Icon) {
				const result = await axios.post(
					`${API_URL}${ADD_TO_FAVOURITES}`,
					payload,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (result.status === 200 || result.status === 400) {
					setIcon(!Icon);
				}
			}
			//for remove from favourites
			else {
				const result = await axios.post(
					`${API_URL}${REMOVE_FROM_FAVOURITES}`,
					payload,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (result.status === 200 || result.status === 400) {
					setIcon(!Icon);
				}
				props.reloadData();
			}
		} catch (error) {
			if (error.response && error.response.data) {
			}
		}
	};
	//get market cap & dollar value of PhoenixDAO
	const getPhoenixDAOMarketValue = async () => {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				setPhoenixDAO_market(data.phoenixdao);
			})
			.catch(console.log);
	};

	let phnx_price = event_data.prices.map((price) => {
		// return ((price / 1000000) / PhoenixDAO_market.usd).toFixed(6);
		return (
			Web3.utils.fromWei(price.toString()) / PhoenixDAO_market.usd
		).toFixed(3);
	});
	// let dollar_price = event_data.prices[0] / 1000000;
	let dollar_price = Web3.utils.fromWei(event_data.prices[0].toString());

	const checkExpiry = () => {
		if (props.checkExpiry || props.selectedTab) {
			if (
				Number(event_data.time) < new Date().getTime() / 1000 ||
				props.selectedTab == 1
			) {
				return true;
			}
		}
		return false;
	};

	return (
		<div style={{ height: "100%" }}>
			<ShareModal
				open={open}
				handleClose={handleClose}
				titleURL={titleURL}
			/>
			<SendTicket
				sendTicket2={sendTicket2}
				eventId={eventId}
				open={open2}
				handleClose={handleClose2}
				eventTitle={event_data.name}
			/>

			<Card className={`${classes.root}`}>
				<Link
					underline="none"
					component={RouterLink}
					to={titleURL}
					style={{ textDecoration: "none" }}
				>
					<CardActionArea
						className={classes.actionArea}
						style={{
							backgroundColor: "transparent !important",
							fontFamily: "'Aeonik', sans-serif",
							height: "100%",
						}}
					>
						<div style={{ position: "relative" }}>
							{checkExpiry() ? (
								<div
									style={{
										padding: "3px 5px",
										backgroundColor: "#ffffff",
										color: "red",
										borderRadius: "4px",
										fontSize: "0.8rem",
										position: "absolute",
										right: "5%",
										top: "5%",
										width: "fit-content",
									}}
								>
									{" "}
									Event ended{" "}
								</div>
							) : null}
							<CardMedia
								component="img"
								alt={event_data.name}
								height="200"
								image={image}
								title={event_data.name}
							/>
							<div
								style={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
								}}
							>
								<div
									className={classes.favouriteGrid}
									style={
										event_data.tktTotalQuantity != 0
											? {
													justifyContent:
														"space-between",
											  }
											: { justifyContent: "flex-end" }
									}
								>
									{event_data.tktTotalQuantity != 0 ? (
										<Typography
											className={classes.quantitySold}
										>
											<ConfirmationNumberOutlined fontSize="small" />
											<span>&nbsp;</span>
											{event_data.tktTotalQuantitySold}/
											{event_data.tktTotalQuantity}
										</Typography>
									) : null}
									{!myEvent && !ticket ? (
										<Typography
											className={classes.FavoriteIcon}
											component="span"
											onClick={addTofavorite}
										>
											{Icon ? (
												<Favorite
													fontSize="small"
													style={{
														color: "#413AE2",
														marginTop: "6px",
													}}
												/>
											) : (
												<FavoriteBorder
													fontSize="small"
													style={{
														color: "#000000",
														marginTop: "6px",
													}}
												/>
											)}
											{Icon}
										</Typography>
									) : null}
								</div>
							</div>
						</div>

						<CardContent>
							<div className={classes.cardMainDetails}>
								<Typography
									variant="h6"
									component="h2"
									className={`${classes.eventTitle} h-100`}
									title={event_data.name}
								>
									{event_data.tktTotalQuantitySold >= 5 ? (
										<img
											src="/images/fire.png"
											className="event_badge-hot"
											alt="Hot Icon"
										/>
									) : (
										""
									)}
									{event_data.name}
								</Typography>
								<Typography
									className={classes.price}
									variant="body1"
									component="h2"
								>
									{!event_data.token ? (
										"Free"
									) : phnx_price.length === 1 ? (
										<div className={classes.priceAlignment}>
											<p
												title={phnx_price[0] + " PHNX"}
												style={{
													fontFamily:
														'"Aeonik", sans-serif',
												}}
											>
												{pricingFormatter(
													phnx_price[0],
													"PHNX"
												)}
											</p>
											<p
												className={classes.starting}
												title={"$" + dollar_price}
											>
												{" "}
												{pricingFormatter(
													dollar_price,
													"$"
												)}
											</p>
										</div>
									) : (
										<div className={classes.priceAlignment}>
											<p
												className={classes.starting}
												title={phnx_price[0]}
											>
												Starting from
											</p>
											<p
												title={phnx_price[0] + " PHNX"}
												style={{
													fontFamily:
														'"Aeonik", sans-serif',
												}}
											>
												{/* {phnx_price[0]} */}
												{pricingFormatter(
													phnx_price[0],
													"PHNX"
												)}
											</p>
											<p
												className={classes.starting}
												title={"$" + dollar_price}
											>
												{" "}
												{pricingFormatter(
													dollar_price,
													"$"
												)}
											</p>
										</div>
									)}
									{/* {console.log("price",event_data.name, dollar_price, typeof(dollar_price))} */}
								</Typography>
								{/* ? `Starting from ${prices[0]} PHNX` : prices[0]} */}

								{/* <div className={classes.eventinfo}>
									<span className={classes.PhnxPrice} >{event_data[3]
										? numeral(price).format("0.000") + "PHNX"
										: "FREE"}
									</span>
									<div style={{ color: "#56555D", fontSize: "14px" }}>
										{event_data[3]
											? "$" + numeral(
												price *
												this.state
													.PhoenixDAO_market
													.usd
											).format("0.000")
											: ""}
									</div>
								</div> */}
							</div>
							<div>
								<Typography
									variant="body2"
									color="textSecondary"
									component="p"
									gutterBottom
									className={`${classes.text} ${classes.dateWidthMobile}`}
									title={`${
										eventTime === "onedayevent"
											? `${moment(eventDate).format(
													"Do MMM, YYYY"
											  )}`
											: `${moment(eventStartDate).format(
													"Do MMM"
											  )} - ${moment(
													eventEndDate
											  ).format("Do MMM, YYYY")}`
									}`}
								>
									<DateRange fontSize="small" />{" "}
									<span>&nbsp;</span>
									{/* {date.toLocaleDateString()} */}
									{!eventTime
										? `Date`
										: eventTime === "onedayevent"
										? moment(eventDate).format(
												"Do MMM, YYYY"
										  )
										: `
							${moment(eventStartDate).format("Do MMM")}
							-
							${moment(eventEndDate).format("Do MMM, YYYY")}
							`}
								</Typography>

								<Typography
									variant="body2"
									color="textSecondary"
									component="p"
									gutterBottom
									className={classes.text}
									title={
										!eventEndTime
											? moment(eventStartTime)
													.utcOffset(0)
													.format("hh:mma z")
											: `${moment(eventStartTime)
													.utcOffset(0)
													.format(
														"hh:mma"
													)} - ${moment(eventEndTime)
													.utcOffset(0)
													.format("hh:mma z")}`
									}
								>
									<AccessTime fontSize="small" />{" "}
									<span>&nbsp;</span>
									{/* {date.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})} */}
									{!eventStartTime
										? `Time`
										: !eventEndTime
										? moment(eventStartTime)
												.utcOffset(0)
												.format("hh:mma z")
										: `${moment(eventStartTime)
												.utcOffset(0)
												.format("hh:mma")} - ${moment(
												eventEndTime
										  )
												.utcOffset(0)
												.format("hh:mma z")}`}
								</Typography>

								<Typography
									variant="body2"
									color="textSecondary"
									component="div"
									gutterBottom
									noWrap
									style={{ paddingBottom: "16px" }}
									className={classes.text}
								>
									<LocationOnOutlined fontSize="small" />{" "}
									<span>&nbsp;</span>
									{/* {event_data.location} */}
									{!eventType
										? `Location`
										: eventType === "physical"}
								</Typography>

								<Typography
									variant="body2"
									color="textSecondary"
									component="div"
									gutterBottom
									noWrap
									style={{ paddingBottom: "16px" }}
									className={classes.text}
									title={
										eventType === "physical"
											? eventLocation
											: `Online`
									}
								>
									<LocationOnOutlined fontSize="small" />{" "}
									<span>&nbsp;</span>
									{/* {event_data.location} */}
									{!eventType
										? `Location`
										: eventType === "physical"
										? eventLocation
										: `Online`}
								</Typography>
							</div>
							{/* For my events page */}
							{myEvent ? (
								<Grid item>
									<Divider style={{ marginBottom: "20px" }} />
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										{"Ticket Sold: "}
										<span>&nbsp;</span>
										{event_data.tktTotalQuantitySold}/
										{event_data.tktTotalQuantity == 0
											? "∞"
											: event_data.tktTotalQuantity}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										PHNX Revenue:{" "}
										{pricingFormatter(
											Web3.utils.fromWei(
												event_data.eventRevenueInPhnx
											),
											"PHNX"
										)}{" "}
										{/* PHNX */}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
										style={{ marginBottom: "20px" }}
									>
										Dollar Revenue:{" "}
										{pricingFormatter(
											Web3.utils.fromWei(
												event_data.eventRevenueInDollar.toString()
											),
											"$"
										)}
									</Typography>
									<Divider />
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
										disabled={checkExpiry()}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
								</Grid>
							) : // For my ticket page
							ticket ? (
								<Grid item className={classes.row}>
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
										disabled={checkExpiry()}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
									<Button
										className={classes.sendTicket}
										onClick={handleClickOpen2}
										disabled={checkExpiry()}
									>
										<Send
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Send Ticket
									</Button>
								</Grid>
							) : // For my Favorite page
							myFavorites ? (
								<Grid item className={classes.row}>
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
										disabled={checkExpiry()}
									>
										<LaunchSharp
											style={{
												marginRight: "7px",
												fontSize: "19px",
											}}
										/>{" "}
										Share Event
									</Button>
								</Grid>
							) : null}
						</CardContent>
					</CardActionArea>
				</Link>
			</Card>
		</div>
	);
};
EventCard.contextTypes = {
	drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts[0],

		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(EventCard, mapStateToProps);
export default AppContainer;
