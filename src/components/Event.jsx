import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Mainnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet.js";
import Web3 from "web3";
import ipfs from "../utils/ipfs";
import { urlFormatter } from "../utils/urlFormatter";

import { API_URL, REPORT_EVENT, GET_USER_DETAIL } from "../config/const";
import axios from "axios";
import Loading from "./Loading";
// import eventTopics from "../config/topics.json";

// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import Notify from "./Notify";
import ApprovalModal from "./approvalModal";
import { toast } from "react-toastify";

//eventCard
import EventCard from "./common/EventCard";
import SkeletonLayout from "./common/SkeletonLayout.jsx";
import { getNetworkId } from "../config/getGraphApi.js";
import { getUserDetails } from "../config/serverAPIs.js";

var moment = require("moment");

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class Event extends Component {
	// _isMounted = false;
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
		} catch (e) {}
		super(props);
		this.contracts = this.props.eventsContract;
		this.organizerName = "qwerty";
		this.account = this.props.accounts[0];
		this.state = {
			eventData: props.eventData,
			owner: "unknown",
			loading: false,
			loaded: false,
			description: null,
			image: null,
			ipfs_problem: false,
			locations: null,
			PhoenixDAO_market: [],
			fee: "",
			token: "",
			openEvents_address: "",
			buyticket: "",
			approve: "",
			buy: "",
			open: false,
			hideEvent: [],
			blockie: "/images/PhoenixDAO.png",
			approvalGranted: false,
			myFavorites: this.props.myFavorites,
			UserFavoriteEvents: [],
			//new ipfs data
			image0: null,
			image1: null,
			image2: null,
			eventOrganizer: null,
			eventDate: null,
			eventStartDate: null,
			eventEndDate: null,
			eventStartTime: null,
			eventEndTime: null,
			eventTime: null,
			eventType: null,
			eventDescription: null,
			eventLocation: null,
			tokenPrices: null,
			selectedToken: this.props.tokensListContract
				? this.props.tokensListContract[2]
				: null,
			userDetail: null,
		};
		this.getUserFavoritesEvent = this.getUserFavoritesEvent.bind(this);
		this.isCancelled = false;
		this.giveApproval = this.giveApproval.bind(this);
		// this.GetPrices = this.GetPrices.bind(this);
	}
	// GetPrices = async () => {
	// 	console.log("resEthPrice.data.thereum.usd1");
	// 	try {
	// 		let resEthPrice = await GetEthPrice();
	// 		if (resEthPrice) {
	// 			// console.log('resEthPrice.data.thereum.usd', resEthPrice.data.ethereum.usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					eth: resEthPrice.data.ethereum.usd,
	// 				},
	// 			});
	// 		}
	// 		let resPhnxPrice = await GetPhnxPrice();
	// 		if (resPhnxPrice) {
	// 			// console.log('resPhnxPrice.data.phoenixdao.usd', resPhnxPrice.data.phoenixdao.usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					phnx: resPhnxPrice.data.phoenixdao.usd,
	// 				},
	// 			});
	// 		}
	// 		let resMaticPrice = await GetMaticPrice();
	// 		if (resMaticPrice) {
	// 			// console.log('resMaticPrice.data[`matic-network`].usd', resMaticPrice.data[`matic-network`].usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					matic: resMaticPrice.data[`matic-network`].usd,
	// 				},
	// 			});
	// 		}
	// 		let resUsdtPrice = await GetUsdtPrice();
	// 		if (resUsdtPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					usdt: resUsdtPrice.data.tether.usd,
	// 				},
	// 			});
	// 		}
	// 		let resWethPrice = await GetWethPrice();
	// 		if (resWethPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					weth: resWethPrice.data.weth.usd,
	// 				},
	// 			});
	// 		}
	// 		let resUsdcPrice = await GetUsdcPrice();
	// 		if (resUsdcPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			await this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					usdc: resUsdcPrice.data[`usd-coin`].usd,
	// 				},
	// 			});
	// 		}
	// 	} catch (e) {
	// 		console.error("Err at GetPrices =>>", e);
	// 	}
	// 	console.log(
	// 		"this.props.networkId =>>>",
	// 		this.props.networkId,
	// 		"this.props.accounts =>>>",
	// 		this.props.accounts[0]
	// 	);
	// 	let res = await getUserDetails({
	// 		address: this.props.accounts[0],
	// 		networkId: this.props.networkId,
	// 	});
	// 	console.log("res of getUserDetails =>>>>>", res);
	// 	this.setState({ userDetail: res });
	// };

	handleGetPrices = async () => {
		let categoryIndex = 0;
		let token_price = 0;
		let dollar_price = 0;

		// Dynamic function for price calculation starts
		if (this.props.tokensListContract && this.state.selectedToken) {
			let selectedTokenName = this.state.selectedToken.tokenName;
			const TOKENS_LIST = this.props.tokensListContract;
			TOKENS_LIST.map((v, i) => {
				if (selectedTokenName == v.tokenName) {
					if (v.tokenName == "weth" || v.tokenName == "ethereum") {
						token_price = this.state.eventData.prices.map(
							(price) => {
								if (
									Web3.utils.fromWei(price.toString()) /
										v.usdPrice >
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
							}
						);
					} else {
						token_price = this.state.eventData.prices.map(
							(price) => {
								return (
									Web3.utils.fromWei(price.toString()) /
									v.usdPrice
								).toFixed(3);
							}
						);
					}
				}
			});
		}
		dollar_price = Web3.utils.fromWei(
			this.state.eventData.prices[categoryIndex].toString()
		);
		// Dynamic function for price calculation Ends
		let priceInPhnx = this.state.eventData.token
			? token_price[categoryIndex] + "PHNX"
			: "FREE";
		let priceInDollar = this.state.eventData.token
			? "$" + dollar_price
			: "";
		this.setState({
			dollar_price: priceInDollar,
			token_price: priceInPhnx,
		});
	};
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			this.state.eventData
			// typeof this.props.contracts["DaoEvents"].events[this.event] !==
			// 	"undefined"
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(this.props.ipfs)
						.then((file) => {
							let data = JSON.parse(file[0].content.toString());
							// console.log("data here", data);

							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									//old
									description: data.text,
									image: data.image,
									locations: data.location,
									organizer: data.organizer,
									//new
									image0: data.image0,
									image1: data.image1,
									image2: data.image2,
									eventOrganizer: data.eventOrganizer,
									eventDate: data.eventDate,
									eventStartDate: data.eventStartDate,
									eventEndDate: data.eventEndDate,
									eventStartTime: data.eventStartTime,
									eventEndTime: data.eventEndTime,
									eventTime: data.eventTime,
									eventType: data.eventType,
									eventDescription: data.eventDescription,
									eventLocation: data.location,
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

	isBase64 = (str) => {
		if (str === "" || str.trim() === "") {
			return false;
		}
		try {
			return btoa(atob(str)) == str;
		} catch (err) {
			return false;
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
				<p className="text-center mb-0 event-description">
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load description
				</p>
			);
		if (this.state.description !== null) {
			let text =
				this.state.description.length > 30
					? this.state.description.slice(0, 60) + "..."
					: this.state.description;
			description = (
				<p
					className="card-text event-description"
					style={{ whiteSpace: "pre-line" }}
				>
					{text}
				</p>
			);
		}
		return description;
	};
	//get the location of Events on IPFS
	getLocation = () => {
		let locations = [];
		if (this.state.ipfs_problem)
			locations = (
				<div className="text-center mb-0 event-description">
					<div role="img" aria-label="monkey">
						<span> 🙊 </span>
					</div>
					<div>We can not load location</div>
				</div>
			);
		if (this.state.locations !== null) {
			// let place = this.state.locations;
			// locations = <strong>Location: {place}</strong>;

			let place =
				!this.state.eventType === "physical"
					? `Online`
					: this.state.eventLocation;

			locations = place;
		}
		return locations;
	};

	getTime = () => {
		let time;
		if (this.state.ipfs_problem)
			time = (
				<div className="text-center mb-0 event-description">
					<div role="img" aria-label="monkey">
						{/* <span> 🙊 </span> */}
					</div>
					<div>We can not load time</div>
				</div>
			);
		if (this.state.eventStartTime !== null) {
			time = moment(this.state.eventStartTime).format("LT");
		}
		return time;
	};

	getDate = () => {
		//
	};

	// allowance = async () => {
	// 	let a = await this.contracts["PHNX"].methods
	// 		.allowance(this.account, this.contracts["DaoEvents"].address)
	// 		.call();
	// 	return a;
	// };

	giveApproval = async () => {
		this.props.toggleBuying();
		this.handleClose();
		// let txreceipt = "";
		// let txconfirmed = "";
		let txerror = "";
		this.state.approve
			.send({ from: this.account })

			.on("transactionHash", (hash) => {
				if (hash !== null) {
					toast(
						<Notify
							networkId={this.props.networkId}
							hash={hash}
							text={
								"Transaction sent!\nOnce Your approval is confirmed, you will be able to buy a ticket."
							}
						/>,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
				}
			})
			.on("confirmation", (confirmationNumber, receipt) =>
				this.temp(confirmationNumber, receipt)
			)

			// .on("confirmation", (confirmationNumber, receipt) => {
			// 	if (confirmationNumber == 0) {
			// 		txreceipt = receipt;
			// 		txconfirmed = confirmationNumber;
			// 		console.log("confirmationNumberrrr",confirmationNumber,this.state.approvalGranted)
			// 		if (txconfirmed == 0 && txreceipt.status == true && !this.state.approvalGranted) {
			// 			this.props.toggleBuying();
			// 			toast(
			// 				<NotifyApproveSuccess
			// 					hash={txreceipt.transactionHash}
			// 				/>,
			// 				{
			// 					position: "bottom-right",
			// 					autoClose: true,
			// 					pauseOnHover: true,
			// 				}
			// 			);
			// 			this.afterApprove();
			// 			this.setState({ disabledStatus: false , approvalGranted:true});
			// 		}
			// 	}
			// })
			.on("error", (error) => {
				if (error !== null) {
					txerror = error;
					this.props.toggleBuying();
					toast(
						<Notify
							networkId={this.props.networkId}
							error={error}
							message={txerror.message}
						/>,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
					// this.afterApprove()
					this.setState({ disabledStatus: false });
				}
			});
	};
	temp(confirmationNumber, receipt) {
		// tx confirmed
		//    txreceipt = receipt;
		// 	txconfirmed = confirmationNumber;
		// 	console.log("confirmationNumberrrr",confirmationNumber)
		// if (confirmationNumber == 0 && receipt.status == true ) {
		if (confirmationNumber === 0 && receipt.status) {
			this.props.toggleBuying();
			toast(
				<Notify
					networkId={this.props.networkId}
					hash={receipt.transactionHash}
					icon="fas fa-check-circle fa-3x"
					text="Transaction successful! You can buy a ticket now."
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

	// inquire = async () => {
	// 	let balance = await this.contracts["PHNX"].methods.totalSupply().call();
	// 	this.setState(
	// 		{
	// 			fee: this.state.eventData.price,
	// 			// this.props.contracts["DaoEvents"].events[this.event]
	// 			// 	.value[2],
	// 			token: this.state.eventData.token,
	// 			// this.props.contracts["DaoEvents"].events[this.event]
	// 			// 	.value[3],
	// 			openEvents_address: this.contracts["DaoEvents"].address,
	// 			buyticket: this.contracts["DaoEvents"].methods.buyTicket(
	// 				this.props.id
	// 			),
	// 			approve: this.contracts["PHNX"].methods.approve(
	// 				this.contracts["DaoEvents"].address,
	// 				balance
	// 			),
	// 		},
	// 		async () => {
	// 			if ((await this.allowance()) === 0) {
	// 				this.handleClickOpen();
	// 			} else {
	// 				this.props.inquire(
	// 					this.props.id,
	// 					this.state.fee,
	// 					this.state.token,
	// 					this.state.openEvents_address,
	// 					this.state.buyticket,
	// 					this.state.approve
	// 				);
	// 			}
	// 		}
	// 	);
	// };

	// getPrettyCategory(rawCategory) {
	//   let prettyCategory = "";
	//
	//   {eventTopics.map((Topic, index) => (
	//     if(Topic.slug == rawCategory) {
	//       prettyCategory = Topic.slug;
	//     }
	//
	//   ))}
	//
	//   return prettyCategory;
	// }
	filterHideEvent = async () => {
		try {
			const networkId = await getNetworkId();
			const get = await axios.get(
				`${API_URL}${REPORT_EVENT}/${networkId}`
			);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			// console.log("check error", error);
		}
	};
	getUserFavoritesEvent = async () => {
		try {
			const token = localStorage.getItem("AUTH_TOKEN");
			const get = await axios.post(
				`${API_URL}${GET_USER_DETAIL}`,
				{
					address: this.props.accounts[0],
					networkId: this.props.web3.networkId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			this.setState({
				UserFavoriteEvents: get.data.result.userHldr.favourites,
			});

			return;
		} catch (error) {
			// console.log("check error", error);
		}
	};

	render() {
		let body = (
			<div className="card">
				<div className="card-body">
					<Loading />
				</div>
			</div>
		);
		// console.log("this.state.eventData in Event.js",this.state)
		if (
			this.state.eventData
			// typeof this.props.contracts["DaoEvents"].events[this.event] !==
			// 	"undefined" &&
			// this.props.contracts["DaoEvents"].events[this.event].value
		) {
			// let event_data = this.state.eventData;
			// let event_data = this.props.contracts["DaoEvents"].events[
			// 	this.event
			// ].value;
			let image = this.getImage();
			let description = this.getDescription();
			let locations = this.getLocation();
			let buttonText = this.state.eventData.token
				? "Buy Ticket"
				: "Get Ticket";
			let time = this.getTime();
			// let freeEvent = "";
			// if (!event_data.token) {
			// 	freeEvent = <p className="free_event">Free Event</p>;
			// }
			// if (event_data.token !== undefined) {
			let symbol = "PhoenixDAO.png";
			let date = new Date(parseInt(this.state.eventData.time, 10) * 1000);
			// console.log("this.props.eventData",parseInt(event_data.time, 10))

			// to be changed at the moment kept to first category
			// let max_seats = event_data.limited ? event_data.seats : "∞"; // limited to tktLimited(array) and seats to tktTotalQuantity
			let max_seats = this.state.eventData.tktLimited[0]
				? this.state.eventData.catTktQuantity[0]
				: "∞";

			let disabled = false;
			let reportedOut = " ";
			let reported = false;
			let soldOut = " ";
			for (let j = 0; j < this.state.hideEvent.length; j++) {
				if (this.props.id == this.state.hideEvent[j].id) {
					reported = true;
					disabled = true;
					buttonText = (
						<span>
							<span role="img" aria-label="alert">
								{" "}
							</span>{" "}
							Reported
						</span>
					);
					reportedOut = <p className="reported">Reported</p>;
				}
			}
			let sold = false;
			if (
				!reported &&
				// to be changed at the moment kept because not being on event cards
				// event_data.limited &&
				Number(this.state.eventData.tktTotalQuantitySold) >=
					Number(this.state.eventData.tktTotalQuantity)
			) {
				sold = true;
				disabled = true;
				buttonText = (
					<span>
						<span role="img" aria-label="alert">
							{" "}
						</span>{" "}
						Sold Out
					</span>
				);
				soldOut = <p className="sold_out">Sold Out</p>;
			}
			if (date.getTime() < new Date().getTime()) {
				disabled = true;
				buttonText = "Event has ended";
			}
			let badge = "";

			if (this.state.eventData.tktTotalQuantitySold >= 2) {
				badge = (
					<img
						src="/images/fire.png"
						className="event_badge-hot"
						alt="Hot Icon"
					/>
				);
			}

			let rawTopic = this.state.eventData.topic;

			var topicRemovedDashes = rawTopic;
			topicRemovedDashes = topicRemovedDashes.replace(/-/g, " ");

			var topic = topicRemovedDashes
				.toLowerCase()
				.split(" ")
				.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
				.join(" ");

			let topicURL = "/topic/" + this.state.eventData.topic + "/1";
			let rawTitle = this.state.eventData.name;
			var titleRemovedSpaces = rawTitle;
			titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

			var pagetitle = titleRemovedSpaces
				.toLowerCase()
				.split(" ")
				.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
				.join(" ");

			let titleURL = `/event/${urlFormatter(this.state.eventData.name)}/${
				this.props.id
			}`;
			let myEventStatURL =
				"/event-stat/" + pagetitle + "/" + this.props.id;
			let myEvent = false;
			if (
				this.account !== undefined &&
				this.state.eventData.owner.toLowerCase() ==
					this.account.toLowerCase()
			) {
				myEvent = true;
			}
			// let dollarRevenue =
			// 	this.state.phoenixDAO_market.usd * this.state.revenue;
			let favouriteEvent =
				this.state.UserFavoriteEvents.indexOf(this.props.id) != -1;
			body = (
				<div style={{ height: "100%" }}>
					{this.props.loading ? (
						<SkeletonLayout />
					) : (
						<EventCard
							event_data={this.state.eventData}
							date={date}
							image={image}
							myEvent={this.props.myEvents}
							checkExpiry={this.props.checkExpiry}
							myEventStatURL={myEventStatURL}
							titleURL={titleURL}
							max_seats={max_seats}
							myFavorites={this.props.myFavorites}
							favoriteEvent={favouriteEvent}
							eventId={this.props.id}
							reloadData={this.props.reloadData}
							reload={this.props.reload}
							eventOrganizer={this.state.eventOrganizer}
							eventDate={this.state.eventDate}
							eventStartDate={this.state.eventStartDate}
							eventEndDate={this.state.eventEndDate}
							eventStartTime={this.state.eventStartTime}
							eventEndTime={this.state.eventEndTime}
							eventTime={this.state.eventTime}
							eventType={this.state.eventType}
							eventDescription={this.state.eventDescription}
							eventLocation={this.state.eventLocation}
							selectedTab={this.props.selectedTab}
							tokenPrices={this.state.tokenPrices}
							userDetails={this.state.userDetail}
							tokensListContract={this.props.tokensListContract}
						/>
					)}
					{/* new card */}
				</div>
			);
		}

		return (
			<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 pb-4">
				<ApprovalModal
					open={this.state.open}
					handleClose={this.handleClose}
					giveApproval={this.giveApproval}
				/>
				{body}
			</div>
		);
	}

	async componentDidMount() {
		console.log(
			"tokenListContract at Event.jsx",
			this.props.tokensListContract
		);
		// this._isMounted = true;
		// await this.GetPrices();
		await this.handleGetPrices();
		await this.filterHideEvent();
		await this.updateIPFS();
		await this.getUserFavoritesEvent();
	}

	componentDidUpdate() {
		this.updateIPFS();
		//this.afterApprove();
	}

	componentWillUnmount() {
		this.isCancelled = true;
		// this._isMounted = false;

		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}
}

Event.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		web3: state.web3,
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(Event, mapStateToProps);
export default AppContainer;
