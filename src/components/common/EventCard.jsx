import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { pricingFormatter } from "../../utils/pricingSuffix";
import PropTypes from "prop-types";
import PhnxLogo from "../Images/phnxPriceLogo.svg";
import { drizzleConnect } from "drizzle-react";
import {
	API_URL,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
} from "../../config/const";
import axios from "axios";
import Web3 from "web3";
import { base64ToBlob } from "../../services/Services";

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
	Select,
	MenuItem,
	FormControl,
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
import PriceSelectBox from "./PriceSelectBox";
// import { RinkbeyNetworkArray } from "../../config/const";

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
		"@media (min-width:765px) and (max-width:900px)": {
			fontSize: "13px",
		},
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		"&:focus": {
			outline: "none",
		},
	},
	cardActionIcon: {
		marginRight: "7px",
		fontSize: "19px",
		"@media (min-width:765px) and (max-width:900px)": {
			marginRight: "3px",
			fontSize: "15px",
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
		"@media (min-width:765px) and (max-width:900px)": {
			fontSize: "13px",
		},
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
		"@media (max-width:1000px)": {
			maxWidth: "45.33%",
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
	menuPaper: {
		maxHeight: "200px",
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
		"@media (max-width:1000px)": {
			maxWidth: "55.33%",
		},
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
		tokenPrices,
	} = props;

	useEffect(() => {
		console.log(
			"This.props.tokenListContract at EventCard",
			props.tokensListContract
		);
		setIcon(favoriteEvent);
		getPhoenixDAOMarketValue();
		console.log("tokenPrices ==>>>>", tokenPrices);
	}, [favoriteEvent]);

	const classes = useStyles();
	const [Icon, setIcon] = useState(false);
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [sendAddress, setSendAddress] = useState("");
	const [PhoenixDAO_market, setPhoenixDAO_market] = useState("");
	const [selectedToken, setSelectedToken] = useState(null);

	var atob = require("atob");

	useEffect(() => {
		if (props.userDetails && props.userDetails.result) {
			// var atob = require("atob");
			// console.log(
			// 	"userDetailsssss => ",
			// 	props.userDetails.result.result.userHldr.alternateCurrency
			// );
			let defaultCurr =
				props.userDetails.result.result.userHldr.alternateCurrency;
			if (typeof defaultCurr == "string") {
				if (defaultCurr === "Dollar" || defaultCurr === "usd") {
					// setSelectedToken({
					// 	tokenName: "usdt",
					// 	chainId: props.networkId,
					// 	image: RinkbeyNetworkArray[0].networks[2].image,
					// });
					setSelectedToken(props.tokensListContract[2]);
				}
			}
			if (typeof defaultCurr == "object") {
				let propsTokenName =
					props.userDetails.result.result.userHldr.alternateCurrency
						.tokenName;
				// console.log("propsTokenName =>>", propsTokenName);
				props.tokensListContract &&
					props.tokensListContract.map((v, i) => {
						if (propsTokenName == v.tokenName) {
							setSelectedToken(props.tokensListContract[i]);
						}
					});
				// setSelectedToken({
				// 	...props.userDetails.result.result.userHldr
				// 		.alternateCurrency,
				// 	image: RinkbeyNetworkArray[
				// 		props.networkId == 137 ? 0 : 1
				// 	].networks.map((v, i) => {
				// 		if (propsTokenName == ("" | "Dollar" | "usd")) {
				// 			console.log(
				// 				"Condition 1 image =>> propsTokenName",
				// 				propsTokenName,
				// 				"RinkbeyImage ==>>> ",
				// 				RinkbeyNetworkArray[0].networks[0].image
				// 			);
				// 			return RinkbeyNetworkArray[0].networks[0].image;
				// 		}
				// 		if (v.tokenName == propsTokenName) {
				// 			console.log(
				// 				"Condition 2 image =>> propsTokenName",
				// 				propsTokenName,
				// 				"RinkbeyImage ==>>> ",
				// 				v.image.slice(5, 14)
				// 				// atob(v.image.slice(22))
				// 			);
				// 			return v.image;
				// 		}
				// 	}),
				// });
			}
		}
	}, [props.userDetails]);

	// console.log(
	// 	"This.props.tokensListContract EventCard",
	// 	props.tokensListContract
	// );

	// const [selectedToken, setSelectedToken] = useState({
	// 	tokenName: RinkbeyNetworkArray[0].networks[0].tokenName,
	// 	chainId: 4,
	// 	image: RinkbeyNetworkArray[0].networks[0].image,
	// }); // default value
	// changeIcon(favoriteEvent);
	const handleClickOpen = (e) => {
		setOpen(true);
		e.preventDefault();
	};
	const handleClose = () => {
		setSendAddress("");
		setOpen(false);
	};
	const handleClickOpen2 = (e) => {
		setSendAddress("");
		setOpen2(true);
		e.preventDefault();
	};
	const handleClose2 = () => {
		setSendAddress("");
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
	// console.log("phnx price coingecko: ",event_data.prices)
	let dollar_price = 0;
	let token_price = 0;

	// Dynamic function for price calculation starts
	if (event_data.isPHNX) {
		dollar_price = event_data.prices.map((price) => {
			return (
				Web3.utils.fromWei(price.toString()) * PhoenixDAO_market.usd
			).toFixed(3);
		});
		token_price = Web3.utils.fromWei(event_data.prices[0].toString());
		//  console.log("phnx price coingecko: ",phnx_price, dollar_price)
	} else if (props.tokensListContract && selectedToken) {
		let selectedTokenName = selectedToken.tokenName;
		const TOKENS_LIST = props.tokensListContract;
		TOKENS_LIST.map((v, i) => {
			if (selectedTokenName == v.tokenName) {
				if (v.tokenName == "weth" || v.tokenName == "ethereum") {
					token_price = event_data.prices.map((price) => {
						if (
							Web3.utils.fromWei(price.toString()) / v.usdPrice >
							0.1
						) {
							return (
								Web3.utils.fromWei(price.toString()) /
								v.usdPrice
							).toFixed(3);
						} else {
							return (
								Web3.utils.fromWei(price.toString()) /
								v.usdPrice
							);
						}
					});
				} else {
					token_price = event_data.prices.map((price) => {
						return (
							Web3.utils.fromWei(price.toString()) / v.usdPrice
						).toFixed(3);
					});
				}
			}
		});
		dollar_price = Web3.utils.fromWei(event_data.prices[0].toString());
		// token_price = Web3.utils.fromWei(event_data.prices[0].toString());
		// Dynamic function for price calculation Ends
	}

	// dollar_price = Web3.utils.fromWei(event_data.prices[0].toString());

	// if (event_data.isPHNX) {
	// 	dollar_price = event_data.prices.map((price) => {
	// 		return (
	// 			Web3.utils.fromWei(price.toString()) * PhoenixDAO_market.usd
	// 		).toFixed(3);
	// 	});
	// 	token_price = Web3.utils.fromWei(event_data.prices[0].toString());
	// 	//  console.log("phnx price coingecko: ",phnx_price, dollar_price)
	// } else {
	// 	console.log("selectedToken => ", selectedToken);
	// 	console.log("event_data => ", event_data, "token prices", tokenPrices);
	// 	if (selectedToken.tokenName == "usdt") {
	// 		token_price = event_data.prices.map((price) => {
	// 			// console.log('usdt_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.usdt)
	// 			return (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.usdt
	// 			).toFixed(3);
	// 		});
	// 	} else if (selectedToken.tokenName == "usdc") {
	// 		token_price = event_data.prices.map((price) => {
	// 			// console.log('usdt_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.usdt)
	// 			return (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.usdc
	// 			).toFixed(3);
	// 		});
	// 	} else if (selectedToken.tokenName == "phnx") {
	// 		// let tokenPric = Number(Web3.utils.fromWei(event_data.prices[0]).toString()) / Number(tokenPrices.phnx)
	// 		// return tokenPric;
	// 		token_price = event_data.prices.map((price) => {
	// 			return (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.phnx
	// 			).toFixed(3);
	// 		});
	// 	} else if (selectedToken.tokenName == "ether") {
	// 		token_price = event_data.prices.map((price) => {
	// 			//  console.log('ether_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.eth)
	// 			if (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.eth >
	// 				0.1
	// 			) {
	// 				return (
	// 					Web3.utils.fromWei(price.toString()) / tokenPrices.eth
	// 				).toFixed(3);
	// 			} else {
	// 				return (
	// 					Web3.utils.fromWei(price.toString()) / tokenPrices.eth
	// 				);
	// 			}
	// 		});
	// 	} else if (selectedToken.tokenName == "weth") {
	// 		token_price = event_data.prices.map((price) => {
	// 			//  console.log('ether_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.eth)
	// 			if (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.weth >
	// 				0.1
	// 			) {
	// 				return (
	// 					Web3.utils.fromWei(price.toString()) / tokenPrices.weth
	// 				).toFixed(3);
	// 			} else {
	// 				return (
	// 					Web3.utils.fromWei(price.toString()) / tokenPrices.weth
	// 				);
	// 			}
	// 		});
	// 	} else if (selectedToken.tokenName == "matic") {
	// 		token_price = event_data.prices.map((price) => {
	// 			//  console.log('matic_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.matic)
	// 			return (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.matic
	// 			).toFixed(3);
	// 		});
	// 	} else {
	// 		token_price = event_data.prices.map((price) => {
	// 			// console.log('usdt_price ??', Web3.utils.fromWei(price.toString()) / tokenPrices.usdt)
	// 			return (
	// 				Web3.utils.fromWei(price.toString()) / tokenPrices.usdt
	// 			).toFixed(3);
	// 		});
	// 	}
	// 	//  dollar_price = event_data.prices[0] / 1000000;
	// 	dollar_price = Web3.utils.fromWei(event_data.prices[0].toString());
	// 	// console.log("phnx price coingecko: ",phnx_price, dollar_price)
	// }

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
				eventTitle={event_data.name}
			/>
			<SendTicket
				sendTicket2={sendTicket2}
				eventId={eventId}
				open={open2}
				sendAddress={sendAddress}
				setSendAddress={setSendAddress}
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
									component="div"
								>
									{!event_data.token ? (
										"Free"
									) : event_data.isPHNX ? (
										dollar_price.length === 1 ? (
											<div
												className={
													classes.priceAlignment
												}
											>
												<p
													title={
														token_price + " PHNX"
													}
													style={{
														fontFamily:
															'"Aeonik", sans-serif',
													}}
												>
													<img
														src={PhnxLogo}
														style={{
															height: "25px",
															marginRight: "4px",
														}}
													/>
													{pricingFormatter(
														token_price,
														"PHNX"
													)}
												</p>
												{/* <PriceSelectBox token="phnx" value={pricingFormatter(
													token_price,
													"PHNX"
												)} setSelectedToken={setSelectedToken} selectedToken={selectedToken} /> */}
												<p
													className={classes.starting}
													title={
														"$" + dollar_price[0]
													}
												>
													{" "}
													{pricingFormatter(
														dollar_price[0],
														"$"
													)}
												</p>
											</div>
										) : (
											<div
												className={
													classes.priceAlignment
												}
											>
												<p
													className={classes.starting}
													title={token_price}
												>
													Starting from
												</p>
												<p
													title={
														token_price + " PHNX"
													}
													style={{
														fontFamily:
															'"Aeonik", sans-serif',
													}}
												>
													{pricingFormatter(
														token_price,
														"PHNX"
													)}
												</p>
												{/* <PriceSelectBox token="phnx" value={pricingFormatter(
													token_price,
													"PHNX"
												)}  setSelectedToken={setSelectedToken} selectedToken={selectedToken} /> */}
												<p
													className={classes.starting}
													title={
														"$" + dollar_price[0]
													}
												>
													{" "}
													{pricingFormatter(
														dollar_price[0],
														"$"
													)}
												</p>
											</div>
										)
									) : token_price.length === 1 ? (
										<div className={classes.priceAlignment}>
											{/* <p
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
											</p> */}
											<PriceSelectBox
												tokensListContract={
													props.tokensListContract
												}
												token="phnx"
												value={pricingFormatter(
													token_price[0],
													"PHNX"
												)}
												setSelectedToken={
													setSelectedToken
												}
												selectedToken={selectedToken}
												// defaultToken={defaultToken}
											/>
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
												title={token_price[0]}
											>
												Starting from
											</p>
											{/* <p
												title={token_price[0] + " PHNX"}
												style={{
													fontFamily:
														'"Aeonik", sans-serif',
												}}
											>
												{pricingFormatter(
													token_price[0],
													"PHNX"
												)}
											</p> */}
											<PriceSelectBox
												tokensListContract={
													props.tokensListContract
												}
												token="phnx"
												value={pricingFormatter(
													token_price[0],
													"PHNX"
												)}
												setSelectedToken={
													setSelectedToken
												}
												selectedToken={selectedToken}
											/>
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
													.local()
													.format("LT")
											: `${moment(eventStartTime)
													.utcOffset(0)
													.local()
													.format("LT")} - ${moment(
													eventEndTime
											  )
													.utcOffset(0)
													.local()
													.format("LT")}`
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
										? // moment(eventStartTime)
										  // 		.utcOffset(0)
										  // 		.format("hh:mma z")
										  moment(eventStartTime)
												.utcOffset(0)
												.local()
												.format("LT")
										: `			
										${moment(eventStartTime).utcOffset(0).local().format("LT")} - ${moment(
												eventEndTime
										  )
												.utcOffset(0)
												.local()
												.format("LT")}
												`}
									{" Local"}
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
										{Web3.utils.fromWei(
											event_data.eventRevenueInPhnx
										) == "0"
											? "0 PHNX"
											: pricingFormatter(
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
										{Web3.utils.fromWei(
											event_data.eventRevenueInDollar.toString()
										) == "0"
											? "$0"
											: pricingFormatter(
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
											className={classes.cardActionIcon}
										/>{" "}
										Share Event
									</Button>
									<Button
										className={classes.sendTicket}
										onClick={handleClickOpen2}
										disabled={checkExpiry()}
									>
										<Send
											className={classes.cardActionIcon}
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
