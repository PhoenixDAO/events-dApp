import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import SocialMedia from "./common/SocialMedia";
import {pricingFormatter} from "../utils/pricingSuffix"
import { makeStyles } from "@material-ui/core/styles";
import {
	Button,
	Grid,
	Avatar,
	FormControl,
	Select,
	IconButton,
} from "@material-ui/core";
import {
	ShoppingCartOutlined,
	ModeCommentOutlined,
	ContactlessOutlined,
} from "@material-ui/icons";
import ipfs from "../utils/ipfs";
import Web3 from "web3";
import axios from "axios";
import "../styles/eventPage.css";
import Notify from "./Notify";
import {
	CalendarTodayOutlined,
	ScheduleOutlined,
	LocationOnOutlined,
	PersonOutlined,
	ConfirmationNumberOutlined,
} from "@material-ui/icons";
import { toast } from "react-toastify";
import ApprovalModal from "./approvalModal";
import { withStyles } from "@material-ui/core/styles";
import {
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
} from "../config/const.js";
import Loading from "./Loading";
import EventNotFound from "./EventNotFound";
import Clock from "./Clock";
import JwPagination from "jw-react-pagination";
import { Link } from "react-router-dom";
import {
	INFURA_WEB_URL,
	explorerWithTX,
	explorerWithAddress,
} from "../config/const.js";
import CheckUser from "./CheckUser";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import BuyTicket from "./common/BuyTicket";
import { updateEventViews, getUserDetails } from "../config/serverAPIs";
import Header from "./common/Header";
import { generateBuyerArr } from "../utils/graphApis";
import RichTextEditor from "react-rte";
import BodyTextEditor from "./common/BodyTextEditor";
import SkeletonEvent from "./common/SkeletonEvent";
import GetGraphApi from "../config/getGraphApi";
import Snackbar from "@material-ui/core/Snackbar";

let numeral = require("numeral");
var moment = require("moment");

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

const styles = (theme) => ({
	share: {
		height: "45px",
		width: "180px",
		fontWeight: 700,
		color: "#413AE2",
		BorderColor: "#413AE2",
	},

	description: {
		marginTop: "35px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "end",
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
	},
	eventinfo: {
		fontSize: "22px",
		fontWeight: "700",
		wordBreak: "break-word",
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
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

	ticketSelect: {
		// width: "219px",
		width:"100%",
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
	clockTime: {
		"@media (min-width: 700px)": {
			width: "55%	!important",
		},
	},
});
class EventPage extends Component {
	constructor(props, context) {
		// try {
		// 	var contractConfig = {
		// 		contractName: "PHNX",
		// 		web3Contract: new context.drizzle.web3.eth.Contract(
		// 			PhoenixDAO_Testnet_Token_ABI,
		// 			PhoenixDAO_Mainnet_Token_Address
		// 		),
		// 	};
		// 	context.drizzle.addContract(contractConfig);
		// } catch (e) { }
		super(props);
		// this.contracts = context.drizzle.contracts;
		console.log(
			"contracts in eventsPage",
			props.eventsContract,
			props.phnxContract
		);
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
			approvalGranted: false,
			selectedCategoryIndex: 0,
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
			organizerDetails: "",
			open3: false

		};
		this.isCancelled = false;
		this.onChangePage = this.onChangePage.bind(this);
		this.giveApproval = this.giveApproval.bind(this);
		this.inquire = this.inquire.bind(this);
		this.loadEventFromBlockchain = this.loadEventFromBlockchain.bind(this);
		this.goBack = this.goBack.bind(this); // i think you are missing this
	}

	goBack() {
		this.props.history.goBack();
	}

	// async loadEventFromBlockchain() {
	// 	const web3 = new Web3(
	// 		new Web3.providers.WebsocketProvider(INFURA_WEB_URL)
	// 	);
	// 	const openEvents = new web3.eth.Contract(
	// 		Open_events_ABI,
	// 		Open_events_Address
	// 	);
	// 	const blockChainEvent = await openEvents.methods
	// 		.events(this.props.match.params.id)
	// 		.call();
	// 		console.log("blockChain Events in eventPage",blockChainEvent)
	// 	this.setState({
	// 		blockChainEvent: blockChainEvent,
	// 		blockChainEventLoaded: true,
	// 	});
	// 	this.updateIPFS();
	// 	// console.log("temp Event web3",blockChainEvent)
	// }
	async loadEventFromBlockchain() {
		const graphURL = await GetGraphApi();
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
			  {
				events(where : {eventId: "${this.props.match.params.id}"}) {
					id
					eventId
					owner
					name
					topic
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
			.then(async (graphEvents) => {
				console.log(
					"GraphQL query response of events in eventPage",
					graphEvents.data.data.events[0]
				);
				this.setState({
					blockChainEvent: graphEvents.data.data.events[0],
					blockChainEventLoaded: true,
					load: false,
				});
				this.updateIPFS();
				if (this.props.networkId) {
					console.log(
						"graphData",
						graphEvents.data.data.events[0].owner
					);
					updateEventViews({
						eventId: graphEvents.data.data.events[0].eventId,
						address: graphEvents.data.data.events[0].owner,
						networkId: this.props.networkId,
					});

					const userDetails = await getUserDetails({
						address: graphEvents.data.data.events[0].owner,
						networkId: this.props.networkId,
					});
					console.log("networkID", userDetails);
					if (!userDetails.error) {
						this.setState({
							organizerDetails:
								userDetails.result.result.organizerDetails,
						});
					}
				}
				this.priceCalculation(0);
			})
			.catch((err) => {
				console.log("Error", err);
				this.setState({
					blockChainEvent: {},
					blockChainEventLoaded: true,
				});
			});
	}

	//Get SoldTicket Data
	// async loadblockhain() {
	// 	const web3 = new Web3(
	// 		new Web3.providers.WebsocketProvider(INFURA_WEB_URL)
	// 	);
	// 	const openEvents = new web3.eth.Contract(
	// 		Open_events_ABI,
	// 		Open_events_Address
	// 	);

	// 	if (this._isMounted) {
	// 		this.setState({ openEvents });
	// 		this.setState({ phoenixDAOTransfer: [] });
	// 	}
	// 	const blockNumber = await web3.eth.getBlockNumber();
	// 	if (this._isMounted) {
	// 		this.setState({
	// 			blocks: blockNumber - 50000,
	// 			latestblocks: blockNumber - 1,
	// 			soldTicket: [],
	// 		});
	// 	}

	// 	// openEvents
	// 	// 	.getPastEvents("SoldTicket", {
	// 	// 		filter: { eventId: this.props.match.params.id },
	// 	// 		fromBlock: 5000000,
	// 	// 		toBlock: 'latest',
	// 	// 	})
	// 	// 	.then((events) => {
	// 	await axios({
	// 		url: graphURL,
	// 		method: "post",
	// 		data: {
	// 			// query: `
	// 			//   {
	// 			// 	events {
	// 			// 	  eventId
	// 			// 	  price
	// 			// 	  token
	// 			// 	  sold
	// 			// 	  buyers
	// 			// 	}
	// 			//   }
	// 			//   `,
	// 			query: `{
	// 				tickets(where: { eventId:${this.props.match.params.id}}){
	// 					id
	// 					eventId
	// 					buyer
	// 					boughtTimeStamp
	// 					boughtLocation
	// 					eventLocation
	// 					soldCategory
	// 					categoryIndex
	// 					priceInPhnx
	// 					priceInDollar
	// 				  }
	// 			}`,
	// 		},
	// 	})
	// 		.then((graphEvents) => {
	// 			console.log("GraphQL query for event buyers in eventPage", graphEvents.data.data.tickets)
	// 			let buyersOfTheEvent = graphEvents.data.data.tickets.map((ticket) => {
	// 				return ticket.buyer;
	// 			});
	// 			console.log("GraphQL result in eventPage", buyersOfTheEvent)
	// 			if (this._isMounted) {
	// 				this.setState({
	// 					load: false,
	// 					soldTicket: buyersOfTheEvent,
	// 					active_length: buyersOfTheEvent.length,
	// 					check: buyersOfTheEvent,
	// 				});
	// 			}

	// 			// let tickets = graphEvents.data.data.events.find(
	// 			// 	(event) => event.eventId == this.props.match.params.id
	// 			// );

	// 			// this.setState({ load: true });
	// 			// var newsort = tickets.buyers
	// 			// 	.concat()
	// 			// 	.sort((a, b) => b.blockNumber - a.blockNumber);
	// 			// if (this._isMounted) {
	// 			// 	this.setState({
	// 			// 		load: false,
	// 			// 		soldTicket: newsort,
	// 			// 		active_length: newsort.length,
	// 			// 		check: newsort,
	// 			// 	});
	// 			// }
	// 		})
	// 		.catch((err) => console.log("Error in GraphQL query for event buyers in eventPage", err));

	// 	// openEvents
	// 	// 	.getPastEvents("SoldTicket", {
	// 	// 		fromBlock: 5000000,
	// 	// 		toBlock: 'latest',
	// 	// 	})
	// 	// 	.then((events) => {console.log("mere soldTickets without Id",events)})
	// 	// 	.catch((err) => console.error(err));

	// 	//Listen for Incoming Sold Tickets
	// 	// openEvents.events
	// 	// 	.SoldTicket({
	// 	// 		filter: { eventId: this.props.match.params.id },
	// 	// 		fromBlock: blockNumber,
	// 	// 		toBlock: "latest",
	// 	// 	})
	// 	// 	.on("data", (log) => {
	// 	// 		console.log('mere soldTickets listner', log)
	// 	// 		setTimeout(() => {
	// 	// 			this.setState({ load: true });

	// 	// 			this.setState({
	// 	// 				soldTicket: [...this.state.soldTicket, log],
	// 	// 			});
	// 	// 			var newest = this.state.soldTicket;
	// 	// 			var newsort = newest
	// 	// 				.concat()
	// 	// 				.sort((a, b) => b.blockNumber - a.blockNumber);
	// 	// 			if (this._isMounted) {
	// 	// 				this.setState({ soldTicket: newsort });
	// 	// 				this.setState({
	// 	// 					active_length: this.state.soldTicket.length,
	// 	// 				});
	// 	// 			}
	// 	// 			this.setState({ load: false });
	// 	// 		}),
	// 	// 			15000;
	// 	// 	});
	// }

	//get market cap & dollar value of PhoenixDAO
	componentDidUpdate() {
		this.updateIPFS();
	}

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
			console.log("Iam in update");
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
									// description: data.text,
									description: "",
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
	priceCalculation = (categoryIndex) => {
		let event_data = this.state.blockChainEvent;
		let phnx_price = event_data.prices.map((price) => {
			return (
				Web3.utils.fromWei(price) / this.state.PhoenixDAO_market.usd
			).toFixed(2);
		});

		let dollar_price = Web3.utils.fromWei(event_data.prices[categoryIndex]);
		let priceInPhnx = event_data.token
			? phnx_price[categoryIndex] + "PHNX"
			: "FREE";
		let priceInDollar = event_data.token ? "$" + dollar_price : "";
		this.setState({ dollar_price: priceInDollar, phnx_price: priceInPhnx });
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
			// console.log("desc", this.state.eventDescription);
			description = (
				<RichTextEditor
					readOnly
					value={RichTextEditor.createValueFromString(
						this.state.eventDescription,
						"html"
					)}
					// onChange={handleChange}
					required
					id="body-text"
					name="bodyText"
					type="string"
					multiline
					variant="filled"
					className="editor"
				/>
			);
		return description;
	};
	handleClickOpen2 = () => {
		if (this.props.networkId != GLOBAL_NETWORK_ID && this.props.networkId != GLOBAL_NETWORK_ID_2) {
			this.setState({ open3: true });
		}
		else {
			this.setState({ open2: true });

		}
	};
	handleCloseSnackbar = () => {
		this.setState({ open3: false });
	};
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};
	handleClose2 = () => {
		this.setState({ open2: false });
	};
	handleCategoryChange = (event) => {
		this.setState({ selectedCategoryIndex: event.target.value });
		this.priceCalculation(event.target.value);
	};

	allowance = async () => {
		let a = await this.props.phnxContract.methods
			.allowance(this.account, Open_events_Address)
			.call();
		return a;
	};

	giveApproval = async () => {
		this.setState({ disabledBuying: true });
		this.handleClose();
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		this.state.approve
			.send({ from: this.account })
			.on("transactionHash", (hash) => {
				if (hash !== null) {
					toast(
						<Notify
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
				this.onConfirmation(confirmationNumber, receipt)
			)
			.on("error", (error) => {
				console.log("asd error in giveApproval function", error);
				if (error !== null) {
					this.setState({ disabledBuying: false });
					txerror = error;
					toast(<Notify error={error} message={txerror.message} />, {
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
		console.log(
			"asd in onConfirmation confirmationNumber",
			confirmationNumber
		);

		if (confirmationNumber == 0 && receipt.status == true) {
			this.setState({ disabledBuying: false });
			toast(
				<Notify
					hash={receipt.transactionHash}
					icon="fas fa-check-circle fa-3x"
					text={"Transaction successful!\nYou can buy a ticket now."}
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
		let balance = await this.props.phnxContract.methods
			.totalSupply()
			.call();

		const geoFindUser = await this.geoFindMe();

		this.setState(
			{
				fee: this.state.blockChainEvent[2],
				token: this.state.blockChainEvent[3],
				openEvents_address: Open_events_Address,
				buyticket: this.props.eventsContract.methods.buyTicket([
					this.props.match.params.id,
					this.state.selectedCategoryIndex,
					geoFindUser, //"Sydney",
				]),
				approve: this.props.phnxContract.methods.approve(
					Open_events_Address,
					balance
				),
			},
			async () => {
				// let temp = await this.allowance();
				if ((await this.allowance()) == 0) {
					this.handleClickOpen();
				} else {
					this.props.inquire(
						this.props.id,
						this.state.fee,
						this.state.token,
						this.state.openEvents_address,
						this.state.buyticket,
						this.state.approve,
						this.state.eventTime,
						this.state.eventDate,
						this.state.eventEndDate,
						this.state.image,
						this.state.blockChainEvent.name,
						this.state.phnx_price,
						this.state.dollar_price
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

		let body = <SkeletonEvent />;
		if (this.state.blockChainEventLoaded) {
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
				let event_data = this.state.blockChainEvent;
				// to be changed
				let image = this.getImage();
				let description = this.getDescription();
				let locations = event_data.location;
				let buttonText = event_data.token
					? " Buy Ticket"
					: " Get Ticket";
				let symbol = event_data.token
					? "PhoenixDAO.svg"
					: "PhoenixDAO.svg";
				// let price = this.context.drizzle.web3.utils.fromWei(
				// 	event_data.prices[this.state.selectedCategoryIndex]
				// );
				let date = new Date(parseInt(event_data.time, 10) * 1000);
				console.log("phnx prices", event_data);

				let max_seats = event_data.tktLimited[
					this.state.selectedCategoryIndex
				]
					? event_data.catTktQuantity[
					this.state.selectedCategoryIndex
					]
					: "∞";

				let disabled = false;
				let disabledStatus;
				// let sold = true;

				if (
					event_data.tktLimited[this.state.selectedCategoryIndex] &&
					Number(
						event_data.catTktQuantitySold[
						this.state.selectedCategoryIndex
						]
					) >=
					Number(
						event_data.catTktQuantity[
						this.state.selectedCategoryIndex
						]
					)
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

				// if (date.getTime() < new Date().getTime()) {
				// 	disabled = true;
				// 	disabledStatus = (
				// 		<span>
				// 			<span role="img" aria-label="alert">
				// 				⚠️
				// 			</span>{" "}
				// 			This event has already ended.s
				// 		</span>
				// 	);
				// }

				// if (this.state.active_length <= 0) {
				// 	sold = false;
				// }

				let myEvent = false;
				if (event_data.owner === this.account) {
					myEvent = true;
				}

				let rawTopic = event_data.topic;

				var topicRemovedDashes = rawTopic;
				topicRemovedDashes = topicRemovedDashes.replace(/-/g, " ");

				var topic = topicRemovedDashes
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");
				//Friendly URL Title
				console.log("event_data in eventPage", event_data);
				let rawTitle = event_data.name;
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
				let ticketPrices =
					event_data.token && event_data.categories.length > 1;

				console.log("event_data.categories", event_data.categories);

				if (this.props.match.params.id == event_data.eventId) {
					body = (
						<Grid>
							<BuyTicket
								open={this.state.open2}
								handleClose={this.handleClose2}
								image={image}
								eventTitle={event_data.name}
								date={event_date}
								time={time}
								buy={this.inquire}
								buttonText={buttonText}
								eventTime={this.state.eventTime}
								eventDate={this.state.eventDate}
								eventEndDate={this.state.eventEndDate}
								phnx_price={this.state.phnx_price}
								dollar_price={this.state.dollar_price}
							/>
							<Snackbar
								anchorOrigin={{ vertical: "top", horizontal: "center" }}
								open={this.state.open3}
								onClose={this.handleCloseSnackbar}
								message={"Please connect to ethereum or matic main-net"}
								autoHideDuration={3000}
								key={"top" + "center"}
								className="snackbar"
							/>
							<Header
								disabled={
									disabled ||
									this.props.disabledStatus ||
									this.state.disabledBuying
								}
								title={event_data.name}
								buttonText={buttonText}
								goBack={this.goBack}
								page="event"
								buyTicket={true}
								handleClickOpen2={this.handleClickOpen2}
							/>
							<Grid
								style={{
									marginBottom: "40px",
									marginTop: "25px",
								}}
							>
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
									></Link>
								)}
								<Grid lg={12}>
									<img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/>
								</Grid>
								<Grid container>
									<Grid
										lg={9}
										md={7}
										sm={12}
										xs={12}
										className={classes.description}
									>
										<Grid container>{description}</Grid>
										<Grid
											container
											className={classes.clockTime}
										>
											<Clock
												deadline={date}
												event_unix={event_data.time}
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
											<img
												src={"/images/phoenixdao.svg"}
												className="event_price-image"
												alt="Event Price"
											/>
											TICKET PRICE
										</p>
										{ticketPrices && (
											<FormControl
												variant="outlined"
												className={classes.ticketSelect}
											>
												<Select
													native
													// value={state.age}
													onChange={
														this
															.handleCategoryChange
													}
													inputProps={{
														name: "age",
														id: "outlined-age-native-simple",
													}}
												>
													{event_data.categories
														.length > 1
														? event_data.categories.map(
															(
																category,
																i
															) => (
																<option
																	value={
																		i
																	}
																>
																	{
																		category
																	}
																</option>
															)
														)
														: ""}
													{/* <option
													aria-label="None"
													value=""
												/>
												<option value={10}>
													Bronze Ticket
												</option>
												<option value={20}>
													Silver Ticket
												</option>
												<option value={30}>
													Golden Ticket
												</option> */}
												</Select>
											</FormControl>
										)}
										<div className={classes.eventinfo}>
											<span className={classes.PhnxPrice} title={this.state.phnx_price}>
											{pricingFormatter(this.state.phnx_price, "PHNX")}
											{/* {this.state.phnx_price} */}
											</span>
											<div style={{ color: "#56555D", fontSize: "14px" }} title={this.state.dollar_price}>
												{pricingFormatter(this.state.dollar_price, "$")}
												{console.log(this.state.dollar_price)}
											</div>
										</div>

										<p className={classes.eventHeading}>
											{" "}
											<CalendarTodayOutlined /> Date
										</p>
										<p className={classes.eventinfo}>
											{" "}
											{/* {event_date} */}
											{!this.state.eventTime
												? `Date`
												: this.state.eventTime ===
													"onedayevent"
													? moment(
														this.state.eventDate
													).format("Do MMM, YYYY")
													: `
							${moment(this.state.eventStartDate).format("Do MMM")}
							-
							${moment(this.state.eventEndDate).format("Do MMM, YYYY")}
							`}
										</p>
										<p className={classes.eventHeading}>
											<ScheduleOutlined /> Time
										</p>
										<p className={classes.eventinfo}>
											{" "}
											{!this.state.eventStartTime
												? `Time`
												: !this.state.eventEndTime
													? moment(this.state.eventStartTime)
														.utcOffset(0)
														.format("hh:mma z")
													: `${moment(this.state.eventStartTime)
														.utcOffset(0)
														.format(
															"hh:mma"
														)} - ${moment(
															this.state.eventEndTime
														)
															.utcOffset(0)
															.format("hh:mma z")}`}
										</p>
										<p className={classes.eventHeading}>
											<LocationOnOutlined /> Location
										</p>
										<p className={classes.eventinfo}>
											{locations}
										</p>
										<p className={classes.eventHeading}>
											<PersonOutlined />
											Organizer
										</p>
										<p className={classes.eventinfo}>
											{this.state.organizer}
										</p>
										<p className={classes.eventHeading}>
											<ConfirmationNumberOutlined />
											Tickets Bought
										</p>
										<p className={classes.eventinfo}>
											{
												// event_data.catTktQuantitySold[
												// this.state
												// 	.selectedCategoryIndex
												// ]
												event_data.tktTotalQuantitySold
											}
											/{max_seats}
										</p>
									</Grid>
								</Grid>
								<Grid container className={classes.row}>
									<div className="new-transaction-wrapper">
										<h2 className={classes.heading}>
											Ticket Purchases
										</h2>
										{this.state.load && <Loading />}
										<Grid container lg={12}>
											{console.log(
												"sold ticket",
												this.state.soldTicket
											)}
											{this.state.pageTransactions.map(
												(sold, index) => (
													<p
														className="sold_text col-md-12"
														key={index}
													>
														<a
															href={
																explorerWithAddress +
																sold.address
															}
															target="blank"
														>
															{sold.address.slice(
																0,
																10
															) + "... "}
														</a>{" "}
														has{" "}
														<a
														// href={
														// 	explorerWithTX +
														// 	sold.transactionHash
														// }
														// target="blank"
														>
															bought
														</a>{" "}
														{" " + sold.count}{" "}
														ticket for this event{" "}
														{/* <strong>
														{event_data[0]}
													</strong> */}
														.
													</p>
												)
											)}
										</Grid>
										{this.state.soldTicket.length == 0 && (
											<p className="sold_text col-md-12 no-tickets">
												There are currently no purchases
												of this Event.
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
								</Grid>

								<Grid container className={classes.socialDiv}>
									<Grid
										lg={2}
										md={3}
										sm={2}
										xs={6}
										className={classes.categoryGrid}
									>
										<ModeCommentOutlined />
										Topic
										<div className={classes.eventinfo}>
											{topic}
										</div>
									</Grid>
									<Grid lg={10} md={9} sm={10} xs={12}>
										<SocialMedia />
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
									{this.state.organizer}
								</h3>
								<Grid className={classes.organizerDescription}>
									{this.state.organizerDetails}
								</Grid>
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
											{event_data.name}
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
											{event_data.token
												? numeral(price).format("0.000")
												: "Free"}
											{event_data.token ? " or " : ""}
											{event_data.token ? (
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
											{event_data.token
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
										event_unix={event_data.time}
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
												<strong>{event_data.name}</strong>
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
							{/* <CheckUser
								blockChainEvent={this.state.blockChainEvent}
								disabledStatus={disabled}
								event_id={this.props.match.params.id}
								history={this.props.history}
							/> */}
						</Grid>
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

	async componentDidMount() {
		const buyers = await generateBuyerArr(this.props.match.params.id);
		this.setState({ soldTicket: buyers });
		this.loadEventFromBlockchain();
		console.log("count", this.props.accounts[0]);
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
		this._isMounted = true;
		// this.updateIPFS();
		// this.loadblockhain();
		this.getPhoenixDAOMarketValue();
	}

	geoFindMe = async () => {
		//http://ip-api.com/json
		//https://ipinfo.io/
		//https://geoip-db.com/
		try {
			const get = await axios.get(`http://ip-api.com/json`);
			if (!get.data) {
				return "Unknown";
			}
			return get.data.city;
		} catch (error) {
			return "Unknown";
		}
	};

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
		// contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(EventPage, mapStateToProps);
// export default AppContainer;
export default withStyles(styles, { withTheme: true })(AppContainer);
