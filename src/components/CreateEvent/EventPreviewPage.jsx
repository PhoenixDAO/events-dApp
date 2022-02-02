import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Clock from "../Clock";
import SocialMedia from "../common/SocialMedia";
import Web3 from "web3";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import {
	CalendarTodayOutlined,
	ScheduleOutlined,
	LocationOnOutlined,
	PersonOutlined,
	ConfirmationNumberOutlined,
	ShoppingCartOutlined,
	ModeCommentOutlined,
	Close as CloseIcon,
	ThreeSixtyTwoTone,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import eventpreviewplaceholder from "../Images/eventpreviewplaceholder.png";
import {
	Button,
	Grid,
	Avatar,
	FormControl,
	Select,
	IconButton,
	MenuItem,
} from "@material-ui/core";
import { getUserDetails } from "../../config/serverAPIs";
import { GLOBAL_NETWORK_ID, GLOBAL_NETWORK_ID_2 } from "../../config/const.js";
import {
	PhoenixDAO_Mainnet_Token_Address,
	PhoenixDAO_Testnet_Token_Address_2,
} from "../../config/phoenixDAOcontract_testnet";
import RichTextEditor from "react-rte";
import { pricingFormatter } from "../../utils/pricingSuffix";
import PriceSelectBox from "../common/PriceSelectBox";

var moment = require("moment");

const styles = (theme) => ({
	root: {
		"& .MuiDialog-paperWidthSm": {
			maxWidth: "60%",
		},
		"@media (max-width: 500px)": {
			"& .MuiDialog-paperWidthSm": {
				maxWidth: "90%",
			},
		},
	},
	share: {
		height: "45px",
		width: "180px",
		fontWeight: 700,
		color: "#413AE2",
		BorderColor: "#413AE2",
	},
	buy: {
		marginLeft: "13px",
		fontWeight: 700,
		width: "180px",
		height: "45px",
		backgroundColor: "#413AE2",
		[theme.breakpoints.down("xs")]: {
			marginLeft: "0px",
			marginTop: "20px",
			width: "160px",
		},
	},
	description: {
		marginTop: "35px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "end",
		paddingRight: "20px",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
		height: "100%",
	},
	eventHeading: {
		marginBottom: "0px",
		marginTop: "22px",
		color: "#56555D",
		fontSize: "14px",
		"& .MuiSvgIcon-root": {
			fontSize: "16px",
			verticalAlign: "sub",
		},
	},
	ticketPrice: {
		fontSize: "18px",
		marginBottom: "0px",
		color: "#56555D",
	},
	eventDetails: {
		backgroundColor: "white",
		borderRadius: "5px",
		marginTop: "35px",
		padding: "30px",
		// border: "1.23218px solid #E4E4E7",
	},
	eventinfo: {
		fontSize: "22px",
		fontWeight: "700",
		// wordBreak: "break-word",
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		display: "flex",
		width: 200,
	},
	categoryGrid: {
		backgroundColor: "white",
		borderRadius: "8px",
		padding: "10px",
		paddingRight: "26px",
	},
	socialDiv: {
		display: "flex",
		justifyContent: "space-between",
		marginTop: "40px",
		[theme.breakpoints.down("xs")]: {
			display: "grid",
		},
	},
	header3: {
		display: "flex",
		justifyContent: "space-between",
		// borderBottom: "1px solid #E4E4E7",
		// paddingBottom: "19px",
		// paddinTop: "25px",
	},
	ticketSelect: {
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
			minWidth: "141px",
		},
		"& .MuiSelect-select": {
			paddingRight: "32px !important",
		},
	},
	organizerDetails: {
		justifyContent: "center",
		textAlign: "center",
	},
	organizerDescription: {
		justifyContent: "center",
		textAlign: "center",
		display: "flex",
		margin: "10px auto",
		width: "80%",
		marginBottom: "80px",
	},
	row: {
		marginTop: "40px",
	},
	heading: {
		borderBottom: "1px solid #E4E4E7",
		fontWeight: "700",
		color: "black",
		paddingBottom: "10px",
		marginBottom: "20px",
	},
	avatar: {
		display: "inline-block",
		marginBottom: "10px",
		border: "1.4619px solid #D8D8D8",
		padding: "6px",
		background: "white",
		marginRight: "7px",
		marginTop: "-4px",
	},
	eventDetailsNoBorder: {
		// wordBreak: "break-word",
		border: "0px solid !important",
	},
	previewPadding: {
		paddingRight: "50px",
		paddingTop: "0px !important",
		paddingLeft: "50px",
		"@media (max-width: 500px)": {
			paddingLeft: "20px",
			paddingRight: "20px",
		},
	},
	selectWidth: {
		minWidth: "100px",
		maxWidth: "350px",
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
	},
	selectInput: {
		width: "170px",
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
			paddingRight: "25px !important",
			"@media (max-width: 600px)": {
				width: "120px",
			},
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
		},
	},
	imageDiv: {
		// height: "70vh",
		paddingBottom: "5px",
		// maxHeight: "400px",
		// minHeight:"300px",
		paddingTop: "36.037%",
		borderRadius: "8px",
		position: "relative",
		backgroundSize: "cover",
		mozBackgroundSize: "cover",
		backgroundPosition: "center",
		"@media (max-width:1200px)": {
			// height: "40vh",
			// maxHeight:"300px",
			// minHeight:"200px",
		},
		"@media (max-width:800px)": {
			// maxHeight:"250px",
			// minHeight:"100px",
		},
		"@media (max-width:400px)": {
			// maxHeight:"150px",
			// minHeight:"100px",
		},
	},
	eventBannerText:{
    position: "absolute",
    top: "0",
    // paddingLeft: "15px",
    // paddingTop: "10px",
    // color: "#d3d3d48a",
    textShadow: "0 0 8px #0d0d0dde",
	background: "grey",
    width: "100%",
    height: "100%",
    textAlign: "center",
    borderRadius: "10px",
    opacity: "0.2",
    color: "white",
    padding: "90px",
    fontSize: "23px",
	}
});
class EventPreviewPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.open,
			organizerDetails: "",
			topic: "",
			ticketIndex: 0,
			// selectedToken: null,
			selectedToken: {
				displayName: "PhoenixDAO",
				image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147",
				tokenAddress:
					this.props.networkId == GLOBAL_NETWORK_ID
						? PhoenixDAO_Mainnet_Token_Address
						: PhoenixDAO_Testnet_Token_Address_2,
				tokenName: "phoenixdao",
			},
			isPHNX: this.props.isPHNX ? this.props.isPHNX : null,
			// tokenPrices: { phnx: "", eth: "", matic: "", usdt: "" },
		};
		console.log("hello props: ", props);
		this.getOrganizerDetails = this.getOrganizerDetails.bind(this);
		this._topicRemovedDashes = this._topicRemovedDashes.bind(this);
	}
	_topicRemovedDashes() {
		let rawTopic = this.props.eventTopic;
		var topicRemovedDashes = rawTopic;
		topicRemovedDashes = topicRemovedDashes.replace(/-/g, " ");
		var topic = topicRemovedDashes
			.toLowerCase()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(" ");

		this.setState({
			topic: topic,
		});
	}

	async getOrganizerDetails() {
		if (this.props.networkId) {
			const userDetails = await getUserDetails({
				address: this.props.accounts[0],
				networkId: this.props.networkId,
			});
			if (!userDetails.error) {
				this.setState({
					organizerDetails:
						userDetails.result.result.userHldr.organizerDetails,
				});
			}
		}
	}
	priceCalculation = async (categoryIndex) => {
		// console.log("thissssssssss", this.props.token);
		// console.log("thissssssssss 11", this.props.token_price);
		let event_data = this.props.fields;
		if (this.props.isPHNX) {
			// console.log("this.props.fields.phnxPrice", this.props.fields);
			let priceInPhnx = 0;
			if (this.props.fields.phnxPrice) {
				// console.log("this.props.fields.phnxPrice 1");
				priceInPhnx = this.props.fields.phnxPrice
					? this.props.fields.phnxPrice // + "PHNX"
					: "FREE";
			} else if (typeof this.props.fields.ticketCategories) {
				// console.log("this.props.fields.phnxPrice 2");
				priceInPhnx =
					this.props.fields.ticketCategories[
						this.props.fields.ticketIndex
					].phnxPrice;
			} else {
				priceInPhnx = "Free";
				// console.log("this.props.fields.phnxPrice 3");
			}
			let priceInDollar = this.props.fields.dollarPrice
				? "$" + this.props.fields.dollarPrice
				: "";
			this.setState({
				dollar_price: priceInDollar,
				token_price: priceInPhnx,
			});
		} else {
			let token_price = 0;
			let dollar_price = 0;

			// Dynamic function for price calculation starts
			if (this.props.tokensListContract && this.state.selectedToken) {
				let selectedTokenName = this.state.selectedToken.tokenName;
				const TOKENS_LIST = this.props.tokensListContract;
				TOKENS_LIST.map((v, i) => {
					if (selectedTokenName == v.tokenName) {
						// if (
						// 	v.tokenName == "weth" ||
						// 	v.tokenName == "ethereum"
						// ) {
						// 	token_price =
						// 		this.props.fields.ticketCategories.map(
						// 			(price) => {
						// 				console.log(
						// 					"price.dollarPrice / v.usdPrice",
						// 					price.dollarPrice / v.usdPrice
						// 				);
						// 				if (
						// 					price.dollarPrice / v.usdPrice >
						// 					0.1
						// 				) {
						// 					return (
						// 						price.dollarPrice / v.usdPrice
						// 					).toFixed(3);
						// 				}
						// 				if (
						// 					price.dollarPrice / v.usdPrice <
						// 					0.0001
						// 				) {
						// 					// console.log(
						// 					// 	"price.dollarPrice / Coming here",
						// 					// 	(
						// 					// 		price.dollarPrice /
						// 					// 		v.usdPrice
						// 					// 	).toFixed(6)
						// 					// );
						// 					return (
						// 						price.dollarPrice / v.usdPrice
						// 					).toFixed(6);
						// 				} else {
						// 					return (
						// 						price.dollarPrice / v.usdPrice
						// 					);
						// 				}
						// 			}
						// 		);
						// } else {
							token_price =
								this.props.fields.ticketCategories.map(
									(price) => {
										return (
											price.dollarPrice / v.usdPrice
										);
									}
								);
						// }
					}
				});
			}
			dollar_price = this.props.fields.dollarPrice;
			// Dynamic function for price calculation Ends
			let priceInPhnx =
				// event_data.token
				// 	?
				token_price[categoryIndex];
			// console.log("price.dollarPrice / priceInPhnx", priceInPhnx);
			// : "FREE";
			let priceInDollar = event_data.token ? "$" + dollar_price : "";
			this.setState({
				dollar_price: priceInDollar,
				token_price: priceInPhnx,
			});
			return;
		}
	};
	handleCategoryChange = (event) => {
		this.setState({ ticketIndex: event.target.value });
		// console.log("Event preview: ", event.target.value);
		this.priceCalculation(event.target.value);
	};
	handleSelectedTokenState = async (result) => {
		// console.log("ether_price ??", result);
		// console.log("hello");
		this.setState({ selectedToken: result }, () => {
			this.priceCalculation(this.state.ticketIndex);
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<Dialog
				className={classes.root}
				open={this.props.open}
				keepMounted
				onClose={this.props.handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogContent className={classes.previewPadding}>
					<Grid>
						<Grid
							style={{
								marginBottom: "40px",
								marginTop: "40px",
							}}
						>
							<Grid className={classes.header3}>
								<div />
								<div>
									<Button
										variant="outlined"
										startIcon={<CloseIcon />}
										style={{
											textTransform: "none",
											outline: "none",
											border: "none",
										}}
										onClick={this.props.handleClose}
									>
										Close Preview
									</Button>
								</div>
							</Grid>
							<br />
							{/* <Grid lg={12}>
								<img
									className="card-img-top event-image"
									alt={eventpreviewplaceholder}
									height="324"
									style={{ borderRadius: 12 }}
									// image change will be here
									src={
										!this.props.image1
											? eventpreviewplaceholder
											: URL.createObjectURL(
													this.props.image1
											  )
									}
								/>
							</Grid> */}
							<Grid
								lg={12}
								style={{
									backgroundImage: `url("${
										!this.props.image1
											? eventpreviewplaceholder
											: URL.createObjectURL(
													this.props.image1
											  )
									}")`,
									position: "relative"
								}}
								className={classes.imageDiv}
							>
								<span className={classes.eventBannerText}>Event Banner</span>
								{/* <img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/> */}
							</Grid>
							<Grid container>
								<Grid
									lg={9}
									md={7}
									sm={12}
									xs={12}
									className={classes.description}
								>
									<Grid container>
										{/* <h2>About this Event</h2> */}
										{this.props.eventDescription && (
											<RichTextEditor
												readOnly
												value={RichTextEditor.createValueFromString(
													this.props.eventDescription,
													"html"
												)}
												required
												id="body-text"
												name="bodyText"
												type="string"
												multiline
												variant="filled"
												className={`editor ${classes.eventDetailsNoBorder}`}
											/>
										)}
									</Grid>

									<Grid
										container
										className={classes.clockTime}
									>
										<Clock
											deadline={
												this.props.eventTime ==
												"onedayevent"
													? this.props.eventDate
													: this.props.eventStartDate
											}
											event_unix={this.props.eventTime}
										/>
									</Grid>
								</Grid>
								<Grid
									lg={3}
									md={5}
									sm={12}
									xs={12}
									className={classes.eventDetails}
								>
									<p className={classes.ticketPrice}>
										{/* <img
											src={"/images/phoenixdao.svg"}
											className="event_price-image"
											alt="Event Price"
										/> */}
										TICKET PRICE
									</p>
									{this.state.token_price && (
										this.state.token_price != "--" &&
										this.state.isPHNX && (
											<span className={classes.PhnxPrice}>
												<img
													style={{ marginTop: 8 }}
													src={
														"/images/phoenixdao.svg"
													}
													className="event_price-image"
													alt="Event Price"
												/>
												{pricingFormatter(this.state.token_price,"PHNX", this.state.isPHNX)}
											</span>
										)
									)}
									{/* {this.state.isPHNX && (
										<p className={classes.ticketPrice}>
											<img
												src={"/images/phoenixdao.svg"}
												className="event_price-image"
												alt="Event Price"
											/>
											TICKET PRICE
										</p>
									)} */}
									{!this.state.isPHNX &&
										this.props.ticketCategories.length >
											1 && (
											<FormControl
												variant="outlined"
												className={classes.ticketSelect}
											>
												<Select
													// native
													value={
														this.state.ticketIndex
													}
													onChange={
														this
															.handleCategoryChange
													}
													inputProps={{
														name: "age",
														id: "outlined-age-native-simple",
													}}
													MenuProps={{
														classes: {
															paper: classes.menuPaper,
														},
														getContentAnchorEl:
															null,
														anchorOrigin: {
															vertical: "bottom",
															horizontal: "left",
														},
													}}
													className={
														classes.selectInput
													}
												>
													{this.props.ticketCategories
														.length > 0 &&
														this.props.ticketCategories.map(
															(category, i) => (
																<MenuItem
																	value={i}
																	style={{
																		fontFamily:
																			"'Aeonik', sans-serif",
																		maxWidth:
																			"170px",
																	}}
																>
																	<span
																		className={
																			classes.selectWidth
																		}
																	>
																		{
																			category.ticketName
																		}
																	</span>
																</MenuItem>
															)
														)}
												</Select>
											</FormControl>
										)}

									<div className={classes.eventinfo}>
										<span className={classes.PhnxPrice}>
											{/* {console.log(
												"this.state.dollar_priceeee",
												this.props.ticketCategories[
													this.state.ticketIndex
												]["dollarPrice"]
											)} */}
											{this.props.ticketCategories[
												this.state.ticketIndex
											]["dollarPrice"] > 0
												? !this.state.isPHNX &&
												  (this.props.ticketCategories
														.length > 0 ? (
														<PriceSelectBox
															tokensListContract={
																this.props
																	.tokensListContract
															}
															selectedToken={
																this.state
																	.selectedToken
															}
															setSelectedToken={
																this
																	.handleSelectedTokenState
															}
															token="phnx"
															value={
																this
																			.state
																			.token_price
																			? pricingFormatter(
																					this
																						.state
																						.token_price,
																					"PHNX",
																					this
																						.state
																						.isPHNX ||
																						(this
																							.state
																							.selectedToken &&
																							this
																								.state
																								.selectedToken
																								.tokenName ==
																								"phoenixdao")
																			  )
																			: `--`
															}
															isEventPage={true}
														/>
												  ) : (
														""
												  ))
												: "Free"}
											{/* PHNX */}
										</span>
										{/* {console.log(
											"this.state.token_price---",
											this.state.token_price
										)} */}
										<div
											style={{
												color: "#56555D",
												fontSize: "14px",
											}}
										>
											{/* $ */}
											{this.props.ticketCategories[
												this.state.ticketIndex
											]["dollarPrice"] > 0 &&
											this.props.ticketCategories.length >
												0
												? pricingFormatter(
														this.props
															.ticketCategories[
															this.state
																.ticketIndex
														]["dollarPrice"],
														"$"
												  )
												: ""}
										</div>
									</div>

									<p className={classes.eventHeading}>
										{" "}
										<CalendarTodayOutlined /> Date
									</p>
									<p className={classes.eventinfo}>
										{this.props.eventTime === "onedayevent"
											? moment(
													this.props.eventDate
											  ).format("Do MMM, YYYY")
											: `
									${moment(this.props.eventStartDate).format("Do MMM")}
									-
									${moment(this.props.eventEndDate).format("Do MMM, YYYY")}
										`}
									</p>
									<p className={classes.eventHeading}>
										<ScheduleOutlined /> Time
									</p>
									<p
										className={`${classes.eventinfo} ${classes.eventTimePara}`}
									>
										{" "}
										{!this.props.eventStartTime
											? `Time`
											: !this.props.eventEndTime
											? moment(this.props.eventStartTime)
													.utcOffset(0)
													.local()
													.format("LT")
											: `${moment(
													this.props.eventStartTime
											  )
													.utcOffset(0)
													.local()
													.format("LT")} - ${moment(
													this.props.eventEndTime
											  )
													.utcOffset(0)
													.local()
													.format("LT")}`}{" "}
										Local
									</p>
									<p
										className={classes.localTime}
										style={{ marginBottom: "0px" }}
									>
										(
										{!this.props.eventStartTime
											? `Time`
											: !this.props.eventEndTime
											? moment(this.props.eventStartTime)
													.utcOffset(0)
													.format("hh:mm A z")
											: `${moment(
													this.props.eventStartTime
											  )
													.utcOffset(0)
													.format(
														"hh:mm A"
													)} - ${moment(
													this.props.eventEndTime
											  )
													.utcOffset(0)
													.format("hh:mm A z")}`}
										)
									</p>
									<p className={classes.eventHeading}>
										<LocationOnOutlined /> Location
									</p>
									<p className={classes.eventinfo}>
										{this.props.location} {` `}
										{this.props.city}
										{`, `} {this.props.country}
									</p>
									<p className={classes.eventHeading}>
										<PersonOutlined />
										Organizer
									</p>
									<p className={classes.eventinfo}>
										{this.props.eventOrganizer}
									</p>
									<p className={classes.eventHeading}>
										<ConfirmationNumberOutlined />
										Tickets Bought
									</p>
									<p className={classes.eventinfo}>
										0/
										{this.props.ticketCategories.length > 0
											? this.props.ticketCategories[
													this.state.ticketIndex
											  ]["noOfTickets"] == 0
												? `∞`
												: this.props.ticketCategories[
														this.state.ticketIndex
												  ]["noOfTickets"]
											: ""}
									</p>
								</Grid>
							</Grid>
							{/* <Grid container className={classes.row}>
                                <div className="new-transaction-wrapper">
                                    <h2 className={classes.heading}>
                                        Ticket Purchases
                                    </h2>
                                    {this.state.load && <Loading />}
                                    <Grid container lg={12}>
                                        {this.state.pageTransactions.map(
                                            (sold, index) => (

                                                <p
                                                    className="sold_text col-sm-12 col-md-12 col-lg-6 col-xl-6"
                                                    key={index}
                                                >
                                                   
                                                    <Avatar
                                                        src="/images/metamask.svg"
                                                        className={classes.avatar}
                                                    />
                                                    Someone bought 1 ticket for{" "}
                                                    {this.props.title}
                                                    .
                                                </p>
                                            )
                                        )}
                                    </Grid>
                                    {!sold && (
                                        <p className="sold_text col-md-12 no-tickets">
                                            There are currently no purchases for
                                            this ticket.
                                        </p>
                                    )}
                                </div>
                                <div className="pagination">
                                    <JwPagination
                                        items={this.state.soldTicket}
                                        onChangePage={this.onChangePage}
                                        maxPages={5}
                                        pageSize={5}
                                        styles={customStyles}
                                    />
                                </div>
                            </Grid> */}

							<Grid container className={classes.socialDiv}>
								<Grid
									lg={4}
									md={4}
									sm={12}
									xs={12}
									className={classes.categoryGrid}
								>
									<ModeCommentOutlined />
									Topic
									<div className={classes.eventinfo}>
										{this.state.topic}
									</div>
								</Grid>
								<Grid lg={8} md={8} sm={12} xs={12}>
									<SocialMedia disabled={true} shareUrl="" />
								</Grid>
							</Grid>
						</Grid>
						<Grid
							alignItems="center"
							className={classes.organizerDetails}
						>
							<Avatar
								src="/images/icons/user.svg"
								style={{
									display: "inline-block",
									marginBottom: "10px",
								}}
							/>
							<h3 style={{ fontWeight: "bold" }}>
								{this.props.eventOrganizer}
							</h3>
							<Grid className={classes.organizerDescription}>
								{this.state.organizerDetails}
							</Grid>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		);
	}

	async componentDidMount() {
		this.getOrganizerDetails();
		this._topicRemovedDashes();
		this.priceCalculation(0);
		// this.GetPrices();
	}
}

EventPreviewPage.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(EventPreviewPage, mapStateToProps);
// export default AppContainer;
export default withStyles(styles, { withTheme: true })(AppContainer);
