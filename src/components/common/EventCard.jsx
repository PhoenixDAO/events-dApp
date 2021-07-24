import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import { API_URL, ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from "../../config/const";
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

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
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
	},
	FavoriteIcon: {
		border: "none",
		backgroundColor: "transparent",
		fontSize: 15,
		fontWeight: 500,
		backgroundColor: "white",
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
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		textAlign: "end",
	},
	starting: {
		color: "#73727D",
		fontSize: "14px",
		marginBottom: "0px",
		fontWeight: "400"
	},
	price: {
		color: "#413AE2", fontWeight: "700", fontSize: "17px",
		"& p": {
			marginBottom: "0px",
		},
		minHeight: "71px"
	}
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
		setIcon(!Icon);
		try {
			let payload = {
				address: props.accounts,
				networkId: props.networkId,
				eventId: eventId,
			};

			//for add to favourite
			if (!Icon) {
				await axios.post(
					`${API_URL}${ADD_TO_FAVOURITES}`,
					payload
				);
			}
			//for remove from favourites
			else {
				const result= await axios.post(
					`${API_URL}${REMOVE_FROM_FAVOURITES}`,
					payload
				);
				console.log("result",result);

				props.reloadData();
			}


		}
		catch (error) {
			// console.log("Consoleee notify report response catch",error)

			if (error.response && error.response.data) {
				console.log("Consoleee notify report response error.response.data",error.response.data)
				toast(
					<Notify
						error={error}
						text={error.response.data.responseMessage + "!"}
					/>,
					{
						position: "bottom-right",
						autoClose: true,
						pauseOnHover: true,
					}
				);
			}

			// this.props.history.push("/upcomingevents/1");

			// this.setState({
			// 	loading: false,
			// });
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
	}
	let phnx_price = event_data.prices.map((price) => {
		return (Web3.utils.fromWei(price) / PhoenixDAO_market.usd).toFixed(2);
	})
	let dollar_price = Web3.utils.fromWei(event_data.prices[0]);

	return (
		<div>
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

			<Link
				underline="none"
				component={RouterLink}
				to={titleURL}
				style={{ textDecoration: "none" }}
			>
				<Card className={classes.root}>
					<CardActionArea>
						<div style={{ position: "relative" }}>
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
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: 10,
										backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)`,
									}}
								>
									<Typography
										style={{
											color: "#fff",
											fontSize: 17,
											fontWeight: 500,
										}}
									>
										<ConfirmationNumberOutlined fontSize="medium" />
										<span>&nbsp;</span>
										{event_data.tktTotalQuantitySold}/{event_data.tktTotalQuantity == 0 ? <span style={{fontSize:"21px"}}>∞</span>:event_data.tktTotalQuantity}
									</Typography>
									{!myEvent && !ticket ? (
										<Typography
											className={classes.FavoriteIcon}
											component="button"
											onClick={addTofavorite}
										>
											{Icon ? <Favorite fontSize="small" style={{ color: "#413AE2" }} /> : <FavoriteBorder fontSize="small" />}
											{Icon}
										</Typography>)
										: null}
								</div>
							</div>
						</div>

						<CardContent>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<Typography
									variant="h6"
									component="h2"
									style={{
										color: "#1E1E22",
										fontSize: 17,
										fontWeight: 700,
									}}
								>
									{event_data.tktTotalQuantitySold >= 2 ? (
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
									{!event_data.token ? "Free" : phnx_price.length == 1 ?
										(<div>
											<p>{phnx_price[0]} PHNX</p>
											<p className={classes.starting}> ${dollar_price}</p>
										</div>)
										:
										(<div>
											<p className={classes.starting}>Starting from</p>
											<p>{phnx_price[0]} PHNX</p>
											<p className={classes.starting}> ${dollar_price}</p>
										</div>
										)
									}

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
							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<DateRange fontSize="small" />{" "}
								<span>&nbsp;</span>
								{date.toLocaleDateString()}
							</Typography>

							<Typography
								variant="body2"
								color="textSecondary"
								component="p"
								gutterBottom
								className={classes.text}
							>
								<AccessTime fontSize="small" />{" "}
								<span>&nbsp;</span>
								{date.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
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
								{event_data.location}
							</Typography>
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
										{event_data.tktTotalQuantitySold}/{event_data.tktTotalQuantity}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
									>
										PHNX Revenue: {event_data.eventRevenueInPhnx} PHNX
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										component="p"
										gutterBottom
										className={classes.text}
										style={{ marginBottom: "20px" }}
									>
										Dollar Revenue: $ {event_data.eventRevenueInDollar}
									</Typography>
									<Divider />
									<Button
										className={classes.shareButton}
										onClick={handleClickOpen}
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
				</Card>
			</Link>
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
