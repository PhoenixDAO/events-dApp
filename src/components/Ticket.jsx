import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import makeBlockie from "ethereum-blockies-base64";
import "../styles/Ticket.css";
import ipfs from "../utils/ipfs";
import Notify from "./Notify";
import { API_URL, REPORT_EVENT } from "../config/const";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventCard from "./common/EventCard.jsx";
import GetGraphApi, { getNetworkId } from "../config/getGraphApi";
import Loading from "./Loading";
import SkeletonLayout from "./common/SkeletonLayout";
import { urlFormatter } from "../utils/urlFormatter";
import { getUserDetails } from "../config/serverAPIs";

var QRCode = require("qrcode.react");

class Ticket extends Component {
	constructor(props, context) {
		super(props);
		this.event = null;
		this.address = null;
		this.account = this.props.accounts[0];
		this.state = {
			blockChainEvent: null,
			loading: false,
			loaded: false,
			description: null,
			image: null,
			location: null,
			ipfs_problem: false,
			card_tab: 1,
			wrong_address: false,
			disabledStatus: false,
			hideEvent: [],
			eventId: "",
			blockie: "/images/PhoenixDAO.png",
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
			// tokenPrices: {
			// 	phnx: "",
			// 	eth: "",
			// 	matic: "",
			// 	usdt: "",
			// 	weth: "",
			// 	usdc: "",
			// },
			userDetails: null,
		};
		this.isCancelled = false;
		this.sendTicket = this.sendTicket.bind(this);
	}

	// GetPrices = async () => {
	// 	console.log("resEthPrice.data.thereum.usd1");
	// 	try {
	// 		let resEthPrice = await GetEthPrice();
	// 		if (resEthPrice) {
	// 			// console.log('resEthPrice.data.thereum.usd', resEthPrice.data.ethereum.usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					eth: resEthPrice.data.ethereum.usd,
	// 				},
	// 			});
	// 		}
	// 		let resPhnxPrice = await GetPhnxPrice();
	// 		if (resPhnxPrice) {
	// 			// console.log('resPhnxPrice.data.phoenixdao.usd', resPhnxPrice.data.phoenixdao.usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					phnx: resPhnxPrice.data.phoenixdao.usd,
	// 				},
	// 			});
	// 		}
	// 		let resMaticPrice = await GetMaticPrice();
	// 		if (resMaticPrice) {
	// 			// console.log('resMaticPrice.data[`matic-network`].usd', resMaticPrice.data[`matic-network`].usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					matic: resMaticPrice.data[`matic-network`].usd,
	// 				},
	// 			});
	// 		}
	// 		let resUsdtPrice = await GetUsdtPrice();
	// 		if (resUsdtPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					usdt: resUsdtPrice.data.tether.usd,
	// 				},
	// 			});
	// 		}

	// 		let resWethPrice = await GetWethPrice();
	// 		if (resWethPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					weth: resWethPrice.data.weth.usd,
	// 				},
	// 			});
	// 		}
	// 		let resUsdcPrice = await GetUsdcPrice();
	// 		if (resUsdcPrice) {
	// 			// console.log('resUsdtPrice.data.tether.usd', resUsdtPrice.data.tether.usd)
	// 			this.setState({
	// 				tokenPrices: {
	// 					...this.state.tokenPrices,
	// 					usdc: resUsdcPrice.data[`usd-coin`].usd,
	// 				},
	// 			});
	// 		}
	// 	} catch (e) {
	// 		console.error("Err at GetPrices =>>", e);
	// 	}
	// };

	handleGetUserDetails = async () => {
		// console.log(
		// 	"this.props.networkId =>>>",
		// 	this.props.networkId,
		// 	"this.props.accounts =>>>",
		// 	this.props.accounts[0]
		// );
		if (this.props.networkId && this.props.accounts) {
			const response = await getUserDetails({
				address: this.props.accounts[0],
				networkId: this.props.networkId,
			});
			console.log("Resp of handleGetUserDetails ==>>>> ", response);
			if (!response.error) {
				this.setState({
					userDetails: response,
				});
			}
		}
	};

	async componentWillMount() {
		let ticket = await this.props.eventsContract.methods
			.getTicket(this.props.id)
			.call();
		this.setState({ eventId: ticket.eventId });
	}
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
		} catch (error) {}
	};
	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			this.state.blockChainEvent !== null &&
			this.state.blockChainEvent
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(this.state.blockChainEvent.ipfsHash)
						.then((file) => {
							let data = JSON.parse(file[0].content.toString());
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									description: data.text,
									image: data.image,
									location: data.location,
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
						.catch((e) => {
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
				<p className="text-center mb-0 event-description">
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load description
				</p>
			);
		if (this.state.description !== null) {
			let text =
				this.state.description.length > 100
					? this.state.description.slice(0, 100) + "..."
					: this.state.description;
			description = <p className="card-text event-description">{text}</p>;
		}
		return description;
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
		if (this.state.location !== null) {
			let place = this.state.location;
			locations = place;
		}
		return locations;
	};

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			card_tab: tab,
		});
	};

	sendTicket = (address, eventId) => {
		this.setState({ disabledStatus: true });
		if (!address || !this.context.drizzle.web3.utils.isAddress(address)) {
			this.setState({ wrong_address: true });
			this.setState({ disabledStatus: false });
		} else {
			let txreceiptApproved = "";
			let txconfirmedApproved = "";
			let txerror = "";
			this.setState({ wrong_address: false });
			this.props.eventsContract.methods
				.safeTransferFrom(
					this.props.accounts[0],
					address,
					this.props.id
				)
				.send({ from: this.props.accounts[0] })
				.on("transactionHash", (transactionHash) => {
					if (transactionHash !== null) {
						toast(
							<Notify
								networkId={this.props.networkId}
								hash={transactionHash}
								icon="fas fa-check-circle fa-3x"
								color="#413AE2"
								text={
									"Transaction sent!\nSending your ticket... 🚀"
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
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber !== null) {
						txreceiptApproved = receipt;
						txconfirmedApproved = confirmationNumber;
						if (
							txconfirmedApproved == 0 &&
							txreceiptApproved.status == true
						) {
							toast(
								<Notify
									networkId={this.props.networkId}
									hash={txreceiptApproved.transactionHash}
									icon="fas fa-check-circle fa-3x"
									color="#413AE2"
									text="Ticket Sent 🎁"
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
						}
					}
					this.props.reloadData();
					this.setState({ disabledStatus: false });
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
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
					}

					this.setState({ disabledStatus: false });
				});
		}
	};

	updateEvent = async () => {
		if (
			// typeof this.props.eventsContract.getTicket[this.ticket] !=
			// "undefined" && typeof this.props.eventsContract.getTicket[this.ticket].value !=
			// "undefined" &&
			this.state.blockChainEvent === null &&
			this.state.eventId != ""
		) {
			let graphURL = await GetGraphApi();
			await axios({
				url: graphURL,
				method: "post",
				data: {
					query: `
					  {
						events(where : {eventId: "${this.state.eventId}"}) {
							id
							eventId
							owner
							name
							topic
							isPHNX
							location
							city
							ipfsHash
							tktLimited
							tktTotalQuantity
							tktTotalQuantitySold
							oneTimeBuy
							token
							time
							onsite
							catTktQuantity
							catTktQuantitySold	
							categories
							prices
							eventRevenueInDollar
							eventRevenueInPhnx
						}
					  }
					  `,
				},
			})
				.then((graphEvents) => {
					this.setState({
						blockChainEvent: graphEvents.data.data.events[0],
						blockChainEventLoaded: true,
					});
					console.log("hello ticket: ", graphEvents.data.data.events[0])
				})
				.catch((err) => {
					this.setState({
						blockChainEvent: {},
						blockChainEventLoaded: true,
					});
				});
			// 	const blockChainEvent = await this.props.eventsContract.methods.events(this.state.eventId).call()
			// this.setState({ blockChainEvent: blockChainEvent, blockChainEventLoaded: true })
		}
		if (this.event !== null) {
			this.updateIPFS();
		}
	};

	downloadQR = () => {
		let ticket_data =
			this.props.eventsContract.getTicket[this.ticket].value;
		let event_data = this.state.blockChainEvent;
		const canvas = document.getElementById(
			event_data[0] + "-" + ticket_data[1]
		);
		const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
		let downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = "Event-Ticket.png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};

	render() {
		let body = (
			<div className="card">
				<div className="card-body">
					<SkeletonLayout />
				</div>
			</div>
		);
		if (this.state.blockChainEvent !== null && this.state.eventId != "" && this.state.blockChainEvent) {
			let event_data = this.state.blockChainEvent;

			console.log("hello ticket: ", this.state.blockChainEvent)
			let reported = false;
			for (let j = 0; j < this.state.hideEvent.length; j++) {
				if (this.state.eventId == this.state.hideEvent[j].id) {
					reported = true;
				}
			}

			let rawTitle = event_data.name;
			var titleRemovedSpaces = rawTitle;
			titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

			var pagetitle = titleRemovedSpaces
				.toLowerCase()
				.split(" ")
				.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
				.join(" ");
			let titleURL = `/event/${urlFormatter(event_data.name)}/${
				this.state.eventId
			}`;
			// let myEventStatURL = "/event-stat/" + pagetitle + "/" + ticket_data[0];
			let myEvent = false;
			if (event_data.owner.toLowerCase() == this.account.toLowerCase()) {
				myEvent = true;
			}
			let shareUrl = window.location.origin + titleURL;
			// let locations = this.getLocation();
			let date = new Date(parseInt(event_data.time, 10) * 1000);
			let max_seats = event_data.tktLimited[0]
				? event_data.catTktQuantity[0]
				: "∞";
			let image = this.getImage();

			body = (
				<EventCard
					event_data={event_data}
					date={date}
					image={image}
					ticket={true}
					checkExpiry={true}
					// myEventStatURL={myEventStatURL}
					titleURL={titleURL}
					max_seats={max_seats}
					revenue={this.state.revenue}
					sendTicket2={this.sendTicket}
					eventId={this.props.id}
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
					// tokenPrices={this.state.tokenPrices}
					userDetails={this.props.userDetails}
					tokensListContract={this.props.tokensListContract}
				/>
			);
		}

		return (
			<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 pb-4 justify-content-center align-items-stretch">
				{body}
			</div>
		);
	}

	componentDidUpdate() {
		this.updateEvent();
		this.updateIPFS();
	}

	componentDidMount() {
		console.log(
			"tokensListContract at Ticket.jsx",
			this.props.tokensListContract
		);
		this.updateIPFS();
		this.updateEvent();
		this.filterHideEvent();
		this.handleGetUserDetails();
	}

	componentWillUnmount() {
		this.isCancelled = true;
	}
}

Ticket.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(Ticket, mapStateToProps);
export default AppContainer;
