import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import SocialMedia from "./common/SocialMedia";
import { Button, Grid, Avatar, FormControl, Select } from '@material-ui/core';
import { ShoppingCartOutlined, ModeCommentOutlined } from "@material-ui/icons";
import ipfs from "../utils/ipfs";
import Web3 from "web3";
import axios from "axios";
import "../styles/eventPage.css";
// import Notify from "./Notify";
// import NotifyEvent from "./NotifyEvent";
import NotifyApprove from "./NotifyApprove";
// import NotifySuccess from "./NotifySuccess";
// import NotifyEventSuccess from "./NotifyEventSuccess";
import NotifyApproveSuccess from "./NotifyApproveSuccess";
// import NotifyFaucet from "./NotifyFaucet";	
// import NotifySuccessFaucet from "./NotifySuccessFaucet";
import NotifyError from "./NotifyError";
// import NotifyNetwork from "./NotifyNetwork";
import { CalendarTodayOutlined, ScheduleOutlined, LocationOnOutlined, PersonOutlined, ConfirmationNumberOutlined } from "@material-ui/icons";
import { toast } from "react-toastify";
import ApprovalModal from "./approvalModal";
import { withStyles } from "@material-ui/core/styles";


import Loading from "./Loading";
import EventNotFound from "./EventNotFound";
import Clock from "./Clock";
import JwPagination from "jw-react-pagination";
import { Link } from "react-router-dom";
import { INFURA_WEB_URL, graphURL } from "../config/const.js";

import CheckUser from "./CheckUser";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Mainnet_Token_Address
} from "../config/phoenixDAOcontract_testnet";
import BuyTicket from "./common/BuyTicket";

let numeral = require("numeral");

const customStyles = {
	ul: {
		border: "rgb(10, 53, 88)",
	},
	li: {
		border: "rgb(10, 53, 88)",
	},
	a: {
		color: "#007bff",
	},
};

const styles = theme => ({
	share: {
		height: "45px",
		width: "180px",
		fontWeight: 700,
		color: '#413AE2',
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

		}

	},
	description: {
		marginTop: "35px",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: "100%"
	},
	eventHeading: {
		marginBottom: "0px",
		marginTop: "22px",
		color: "#56555D",
		fontSize: "14px",
		"& .MuiSvgIcon-root": {
			fontSize: "16px",
			verticalAlign: "sub"
		}
	},
	ticketPrice: {
		fontSize: "18px",
		marginBottom: "0px",
		color: "#56555D"
	},
	eventDetails: {
		backgroundColor: "white",
		borderRadius: "5px",
		marginTop: "35px",
		padding: "30px"
	},
	eventinfo: {
		fontSize: "22px",
		fontWeight: "700"
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2"
	},
	categoryGrid: {
		backgroundColor: "white",
		borderRadius: "8px",
		padding: "10px",
		paddingRight: "26px"

	},
	socialDiv: {
		display: "flex",
		justifyContent: "space-between",
		marginTop: "40px",
		[theme.breakpoints.down("xs")]: {
			display: "grid"
		}
	},

	ticketSelect: {
		width: "219px",
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
			minWidth: "141px",
		}
	},
	organizerDetails: {
		justifyContent: "center",
		textAlign: "center"
	},
	organizerDescription: {
		justifyContent: "center",
		textAlign: "center",
		display: "flex",
		margin: "10px auto",
		width: "80%",
		marginBottom: "80px"
	},

});
class EventPage extends Component {
	constructor(props, context) {
		try {
			var contractConfig = {
				contractName: "PHNX",
				web3Contract: new context.drizzle.web3.eth.Contract(
					PhoenixDAO_Testnet_Token_ABI,
					PhoenixDAO_Mainnet_Token_Address
				),
			};
			context.drizzle.addContract(contractConfig);
		} catch (e) {
		}
		super(props);
		this.contracts = context.drizzle.contracts;
		this.revenue = this.contracts["DaoEvents"].methods.eventRevenue.cacheCall(11)
		this.account = this.props.accounts[0];
		this.state = {
			blockChainEventLoaded: false,
			load: true,
			loading: false,
			loaded: false,
			description: null,
			image: null,
			ipfs_problem: false,
			blockie: "/images/PhoenixDAO.png",
			soldTicket: [],
			latestblocks: 5000000,
			PhoenixDAO_market: [],
			disabledBuying: false,
			fee: "",
			token: "",
			openEvents_address: "",
			buyticket: "",
			approve: "",
			pageTransactions: [],
			approvalGranted: false
		};
		this.isCancelled = false;
		this.onChangePage = this.onChangePage.bind(this);
		this.giveApproval = this.giveApproval.bind(this);
		this.loadEventFromBlockchain = this.loadEventFromBlockchain.bind(this)

	}

	async loadEventFromBlockchain() {
		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
				INFURA_WEB_URL
			)
		);
		const openEvents = new web3.eth.Contract(
			Open_events_ABI,
			Open_events_Address
		);
		const blockChainEvent = await openEvents.methods.events(this.props.match.params.id).call()
		this.setState({ blockChainEvent: blockChainEvent, blockChainEventLoaded: true })
		this.updateIPFS();
		// console.log("temp Event web3",blockChainEvent)
	}

	//Get SoldTicket Data
	async loadblockhain() {


		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
				INFURA_WEB_URL
			)
		);
		const openEvents = new web3.eth.Contract(
			Open_events_ABI,
			Open_events_Address
		);

		if (this._isMounted) {
			this.setState({ openEvents });
			this.setState({ phoenixDAOTransfer: [] });
		}
		const blockNumber = await web3.eth.getBlockNumber();
		if (this._isMounted) {
			this.setState({
				blocks: blockNumber - 50000,
				latestblocks: blockNumber - 1,
				soldTicket: [],
			});
		}

		// openEvents
		// 	.getPastEvents("SoldTicket", {
		// 		filter: { eventId: this.props.match.params.id },
		// 		fromBlock: 5000000,
		// 		toBlock: 'latest',
		// 	})
		// 	.then((events) => {
		await axios({
			url: graphURL,
			method: 'post',
			data: {
				query: `
				  {
					events {
					  eventId
					  price
					  token
					  sold
					  buyers
					}
				  }
				  `
			}
		}).then((graphEvents) => {
			// console.log("mere soldTickets by Id",graphEvents.data.data.events)
			let tickets = graphEvents.data.data.events.find((event) => event.eventId == this.props.match.params.id)


			this.setState({ load: true });
			var newsort = tickets.buyers
				.concat()
				.sort((a, b) => b.blockNumber - a.blockNumber);
			if (this._isMounted) {
				this.setState({ load: false, soldTicket: newsort, active_length: newsort.length, check: newsort });

			}
		})
			.catch((err) => console.error("mere here", err));

		// openEvents
		// 	.getPastEvents("SoldTicket", {
		// 		fromBlock: 5000000,
		// 		toBlock: 'latest',
		// 	})
		// 	.then((events) => {console.log("mere soldTickets without Id",events)})
		// 	.catch((err) => console.error(err));

		//Listen for Incoming Sold Tickets
		// openEvents.events
		// 	.SoldTicket({
		// 		filter: { eventId: this.props.match.params.id },
		// 		fromBlock: blockNumber,
		// 		toBlock: "latest",
		// 	})
		// 	.on("data", (log) => {
		// 		console.log('mere soldTickets listner', log)
		// 		setTimeout(() => {
		// 			this.setState({ load: true });

		// 			this.setState({
		// 				soldTicket: [...this.state.soldTicket, log],
		// 			});
		// 			var newest = this.state.soldTicket;
		// 			var newsort = newest
		// 				.concat()
		// 				.sort((a, b) => b.blockNumber - a.blockNumber);
		// 			if (this._isMounted) {
		// 				this.setState({ soldTicket: newsort });
		// 				this.setState({
		// 					active_length: this.state.soldTicket.length,
		// 				});
		// 			}
		// 			this.setState({ load: false });
		// 		}),
		// 			15000;
		// 	});
	}

	//get market cap & dollar value of PhoenixDAO
	async getPhoenixDAOMarketValue() {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				if (this._isMounted) {
					this.setState({ PhoenixDAO_market: data.phoenixdao });
				}
			})
			.catch(console.log);
	}

	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			this.state.blockChainEvent
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(
						this.state.blockChainEvent[7]
					)
						.then((file) => {
							let data = JSON.parse(file[0].content.toString());
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									description: data.text,
									image: data.image,
									locations: data.location,
									organizer: data.organizer
								});
							}
						})
						.catch(() => {
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									ipfs_problem: true,
								});
							}
						});
				}
			);
		}
	};

	getImage = () => {
		let image = "/images/loading_image_ipfs.png";
		if (this.state.ipfs_problem) image = "/images/problem_ipfs.png";
		if (this.state.image !== null) image = this.state.image;
		return image;
	};

	getDescription = () => {
		let description = <Loading />;
		if (this.state.ipfs_problem)
			description = (
				<p>
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load description
				</p>
			);
		if (this.state.description !== null)
			description = (
				<p style={{ whiteSpace: "pre-line" }}>
					{this.state.description}
				</p>
			);
		return description;
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	allowance = async () => {
		let a = await this.contracts["PHNX"].methods
			.allowance(this.account, this.contracts["DaoEvents"].address)
			.call();
		return a;
	};

	giveApproval = async () => {
		this.setState({ disabledBuying: true })
		this.handleClose();
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		this.state.approve
			.send({ from: this.account })
			.on("transactionHash", (hash) => {
				if (hash !== null) {
					toast(<NotifyApprove hash={hash} />, {
						position: "bottom-right",
						autoClose: true,
						pauseOnHover: true,
					});
				}
			})
			.on("confirmation", (confirmationNumber, receipt) => this.onConfirmation(confirmationNumber, receipt))
			.on("error", (error) => {
				if (error !== null) {
					this.setState({ disabledBuying: false })
					txerror = error;
					toast(<NotifyError error={error} message={txerror.message} />, {
						position: "bottom-right",
						autoClose: true,
						pauseOnHover: true,
					});
					// this.afterApprove()
					this.setState({ disabledStatus: false });
				}
			});
	};
	onConfirmation(confirmationNumber, receipt) {
		if (confirmationNumber == 0 && receipt.status == true) {
			this.setState({ disabledBuying: false })
			toast(
				<NotifyApproveSuccess
					hash={receipt.transactionHash}
				/>,
				{
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				}
			);
			// this.afterApprove();
			this.setState({ disabledStatus: false });
		}
	}

	inquire = async () => {
		let balance = await this.contracts["PHNX"].methods.totalSupply().call();
		let temp = this.allowance();
		this.setState(
			{
				fee: this.state.blockChainEvent[2],
				token: this.state.blockChainEvent[3],
				openEvents_address: this.contracts["DaoEvents"].address,
				buyticket: this.contracts["DaoEvents"].methods.buyTicket(
					this.props.match.params.id
				),
				approve: this.contracts["PHNX"].methods.approve(
					this.contracts["DaoEvents"].address,
					balance
				),
			},
			async () => {
				let temp = await this.allowance();
				if ((await this.allowance()) == 0) {
					this.handleClickOpen();
				} else {
					this.props.inquire(
						this.props.id,
						this.state.fee,
						this.state.token,
						this.state.openEvents_address,
						this.state.buyticket,
						this.state.approve
					);
				}
			}
		);
	};

	getLocation = () => {
		let locations = [];
		if (this.state.ipfs_problem)
			locations = (
				<p className="text-center mb-0 event-description">
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load location
				</p>
			);
		if (this.state.locations !== null) {
			let place = this.state.locations;
			locations = <span>{place}</span>;
		}
		return locations;
	};

	onChangePage(pageTransactions) {
		this.setState({ pageTransactions });
	}

	render() {
		const { classes } = this.props;

		let body = <Loading />;

		if (
			this.state.blockChainEventLoaded
		) {
			if (!this.state.blockChainEvent) {
				body = (
					<div className="text-center mt-5">
						<span role="img" aria-label="unicorn">
							🦄
						</span>{" "}
						PhoenixDAO Event not found
					</div>
				);
			} else {
				let event_data = this.state.blockChainEvent
				let image = this.getImage();
				let description = this.getDescription();
				let locations = this.getLocation();
				let buttonText = event_data[3] ? " Buy Ticket" : " Get Ticket";
				let symbol = event_data[3]
					? "PhoenixDAO.svg"
					: "PhoenixDAO.svg";
				let price = this.context.drizzle.web3.utils.fromWei(
					event_data[2]
				);
				let date = new Date(parseInt(event_data[1], 10) * 1000);

				let max_seats = event_data[4] ? event_data[5] : "∞";

				let disabled = false;
				let disabledStatus;
				let sold = true;

				if (
					event_data[4] &&
					Number(event_data[6]) >= Number(event_data[5])
				) {
					disabled = true;
					disabledStatus = (
						<span>
							<span role="img" aria-label="alert">
								⚠️
							</span>{" "}
							No more tickets
						</span>
					);
					buttonText = " Sold Out";
				}

				if (date.getTime() < new Date().getTime()) {
					disabled = true;
					disabledStatus = (
						<span>
							<span role="img" aria-label="alert">
								⚠️
							</span>{" "}
							This event has already ended.
						</span>
					);
				}

				if (this.state.active_length <= 0) {
					sold = false;
				}

				let myEvent = false;
				if (event_data[9] === this.account) {
					myEvent = true;
				}

				let rawCategory = event_data[8];

				var categoryRemovedDashes = rawCategory;
				categoryRemovedDashes = categoryRemovedDashes.replace(
					/-/g,
					" "
				);

				var category = categoryRemovedDashes
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");
				//Friendly URL Title
				let rawTitle = event_data[0];
				var titleRemovedSpaces = rawTitle;
				titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

				var pagetitle = titleRemovedSpaces
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");
				let event_date = date.toLocaleDateString();
				let time = date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				});
				let priceGrid=<div className={classes.eventinfo}>
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
										</div>;
				if (this.props.match.params.page === pagetitle) {
					body = (
						<Grid>
							<BuyTicket
								open={this.state.open}
								handleClose={this.handleClose}
								image={image}
								eventTitle={event_data[0]}
								date={event_date}
								time={time}
								price={priceGrid} 
								buy={this.inquire}/>
							<Grid className="header3">
								<h2>
									{event_data[0]}
								</h2>
								<div>

									<Button
										variant="contained"
										color="primary"
										style={{ marginRight: "10px" }}
										className={classes.buy}
										onClick={this.handleClickOpen}
										disabled={
											disabled || this.props.disabledStatus || this.state.disabledBuying
										}
									>
										<ShoppingCartOutlined style={{ marginRight: "10px" }} />
										{buttonText}
									</Button>

								</div>
							</Grid>

							<Grid style={{ marginBottom: "40px", marginTop: "40px" }}>
								<label className="pl-2 small">
									{disabledStatus}
								</label>

								<br />
								{myEvent === true && (
									<Link
										to={
											"/event-stat/" +
											pagetitle +
											"/" +
											this.props.match.params.id
										}
									>
									</Link>
								)}
								<Grid lg={12}>
									<img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/>
								</Grid>
								<Grid container style={{
									borderBottom: "1px solid #E4E4E7", paddingBottom: "50px"
								}}>

									<Grid lg={9} md={7} sm={12} xs={12} className={classes.description}>
										{description}

									</Grid>
									<Grid lg={3} md={5} sm={12} xs={12} className={classes.eventDetails}>
										<p className={classes.ticketPrice}>
											<img
												src={"/images/phoenixdao.svg"}
												className="event_price-image"
												alt="Event Price"
											/>TICKET PRICE
										</p>
										<FormControl variant="outlined" className={classes.ticketSelect}>
											<Select
												native
												// value={state.age}
												// onChange={handleChange}
												inputProps={{
													name: 'age',
													id: 'outlined-age-native-simple',
												}}
											>
												<option aria-label="None" value="" />
												<option value={10}>Bronze Ticket</option>
												<option value={20}>Silver Ticket</option>
												<option value={30}>Golden Ticket</option>
											</Select>
										</FormControl>
										{priceGrid}
										<p className={classes.eventHeading}> <CalendarTodayOutlined /> Date
										</p>
										<p className={classes.eventinfo}>	{event_date}
										</p>
										<p className={classes.eventHeading}><ScheduleOutlined /> Time</p>
										<p className={classes.eventinfo}>		{time}</p>
										<p className={classes.eventHeading}><LocationOnOutlined /> Location</p>
										<p className={classes.eventinfo}>{locations}</p>
										<p className={classes.eventHeading}><PersonOutlined />Organizer</p>
										<p className={classes.eventinfo}>{this.state.organizer}</p>
										<p className={classes.eventHeading}><ConfirmationNumberOutlined />Tickets Bought</p>
										<p className={classes.eventinfo}>{event_data[6]}/{max_seats}</p>
									</Grid>


								</Grid>
								<Grid container className={classes.socialDiv}>
									<Grid lg={2} md={3} sm={2} xs={6} className={classes.categoryGrid}>
										<ModeCommentOutlined />
													Topic
										<div className={classes.eventinfo}>{category}</div>
									</Grid>
									<Grid lg={10} md={9} sm={10} xs={12}>

										<SocialMedia />
									</Grid>
								</Grid>
							</Grid>
							<Grid alignItems="center"

								className={classes.organizerDetails}>
								<Avatar src="/images/icons/user.svg" style={{ display: "inline-block", marginBottom: "10px" }} />
								<h3 style={{ fontWeight: "bold" }}>{this.state.organizer}</h3>
								<Grid className={classes.organizerDescription}>Him boisterous invitation dispatched had connection inhabiting projection. By mutual an mr danger garret edward an. Diverted as strictly exertion addition no disposal by stanhill. This call wife do so sigh no gate felt. You and abode spite order get. Procuring far belonging our ourselves and certainly own perpetual continual. It elsewhere of </Grid>
							</Grid>

							{/* <div className="event-social-share-btns-div">
									<EmailShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<EmailIcon size={32} round />
									</EmailShareButton>

									<FacebookShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<FacebookIcon size={32} round />
									</FacebookShareButton>

									<LinkedinShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<LinkedinIcon size={32} round />
									</LinkedinShareButton>

									<RedditShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<RedditIcon size={32} round />
									</RedditShareButton>

									<TelegramShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<TelegramIcon size={32} round />
									</TelegramShareButton>

									<TwitterShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<TwitterIcon size={32} round />
									</TwitterShareButton>

									<WhatsappShareButton
										url={shareUrl}
										title={title}
										resetButtonStyle={false}
									>
										<WhatsappIcon size={32} round />
									</WhatsappShareButton>
								</div>
								<br />
								<br /> 
							<div className="card event-hero-sidebar">
									<img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/><img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/>
									<div className="card-header event-header">
										<img
											className="float-left"
											src={this.state.blockie}
											alt="User Identicon"
										/>
									</div>

									<div className="card-body">
										<h5 className="card-title event-title">
											{event_data[0]}
										</h5>
										{description}
									</div>

									<ul className="list-group list-group-flush">
										<li className="list-group-item ">
											{locations}
										</li>
										<li className="list-group-item">
											Category: {category}
										</li>
										<li className="list-group-item">
											Organizer: {this.state.organizer}
										</li>
										<li className="list-group-item">
											Price:{" "}
											<img
												src={"/images/" + symbol}
												className="event_price-image"
												alt="Event Price"
											/>{" "}
											{event_data[3]
												? numeral(price).format("0.000")
												: "Free"}
											{event_data[3] ? " or " : ""}
											{event_data[3] ? (
												<img
													src={
														"/images/dollarsign.png"
													}
													className="event_price-image"
													alt="Event Price"
												/>
											) : (
												""
											)}
											{event_data[3]
												? numeral(
													price *
													this.state
														.PhoenixDAO_market
														.usd
												).format("0.000")
												: ""}
										</li>
										<li className="list-group-item">
											{date.toLocaleDateString()} at{" "}
											{date.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</li>
										<li className="list-group-item">
											Tickets: {event_data[6]}/{max_seats}
										</li>

									</ul>
								</div> 
								{/* {this._isMounted && (
									<Clock
										deadline={date}
										event_unix={event_data[1]}
									/>
								)}
								<div className="new-transaction-wrapper">
									<h4 className="transactions">
										Ticket Purchases
									</h4>
									{this.state.load && <Loading />}
									{this.state.pageTransactions.map(
										(sold, index) => (
											<p
												className="sold_text col-md-12"
												key={index}
											>
												<img
													className="float-left blockie"
													src={makeBlockie(
														sold
													)}
												/>{" "}
												Someone bought 1 ticket for{" "}
												<strong>{event_data[0]}</strong>
												.
											</p>
										)
									)}
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
							 </div> 
							 
							<div className="col-12">
								<div className="mt-5"></div>
								<CheckUser
									blockChainEvent={this.state.blockChainEvent}
									disabledStatus={disabled}
									event_id={this.props.match.params.id}
									history={this.props.history}
								/>
							</div>
								*/}
						</Grid >
					);
				} else {
					body = <EventNotFound />;
				}
			}
		}

		return (
			<div className="event-page-wrapper">
				<ApprovalModal
					open={this.state.open}
					handleClose={this.handleClose}
					giveApproval={this.giveApproval}
				/>

				{body}
			</div>
		);
	}

	componentDidMount() {
		this.loadEventFromBlockchain()
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
		this._isMounted = true;
		this.updateIPFS();
		this.loadblockhain();
		this.getPhoenixDAOMarketValue();
	}

	componentDidUpdate() {
		this.updateIPFS();
	}

	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

EventPage.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
	};
};

const AppContainer = drizzleConnect(EventPage, mapStateToProps);
// export default AppContainer;
export default withStyles(styles, { withTheme: true })(AppContainer);
