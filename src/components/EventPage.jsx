import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import SocialMedia from "./common/SocialMedia";
import { pricingFormatter } from "../utils/pricingSuffix";
import {
	Button,
	Grid,
	Avatar,
	FormControl,
	Select,
	IconButton,
	MenuItem,
	Typography,
} from "@material-ui/core";
import {
	ShoppingCartOutlined,
	ModeCommentOutlined,
	ContactlessOutlined,
	Web,
	Favorite,
	FavoriteBorder,
} from "@material-ui/icons";
import PhnxLogo from "./Images/phnxPriceLogo.svg";
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
import {
	API_URL,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
	GET_USER_DETAIL,
	etherscanMainnetAddress,
	etherscanRinkbyAddress,
	graphURLV1,
	graphURLV2,
	// RinkbeyNetworkArray,
} from "../config/const";
import { toast } from "react-toastify";
// import ApprovalModal from "./approvalModal";
import ApprovalModal from "./BuyTicket2";

import { withStyles } from "@material-ui/core/styles";
import { GLOBAL_NETWORK_ID, GLOBAL_NETWORK_ID_2 } from "../config/const.js";
import Loading from "./Loading";
import EventNotFound from "./EventNotFound";
import Clock from "./Clock";
import JwPagination from "jw-react-pagination";
import { Link } from "react-router-dom";
import { explorerWithAddress } from "../config/const.js";
import {
	CheckTokenAllowance,
	GetTokenPrices2,
	GetWhiteListedToken,
	GiveAllowance,
	initTokenContract,
} from "../services/Services";
import CheckUser from "./CheckUser";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import BuyTicket from "./common/BuyTicket";
import {
	updateEventViews,
	getUserDetails,
	getUser,
} from "../config/serverAPIs";
import Header from "./common/Header";
import { generateBuyerArr } from "../utils/graphApis";
import RichTextEditor from "react-rte";
import SkeletonEvent from "./common/SkeletonEvent";
import GetGraphApi, { getNetworkId } from "../config/getGraphApi";
import Snackbar from "@material-ui/core/Snackbar";
import EmptyState from "./EmptyState";
import { urlFormatter } from "../utils/urlFormatter";
import PriceSelectBox from "./common/PriceSelectBox";
import { Open_events_Address_2 } from "../config/OpenEvents";
import {
	PhoenixDAO_Mainnet_Token_Address,
	PhoenixDAO_Testnet_Token_Address_2,
} from "../config/phoenixDAOcontract_testnet";

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
	FavoriteIcon: {
		textAlign: "center",
		border: "none",
		backgroundColor: "#fff",
		fontSize: 15,
		fontWeight: 500,
		marginLeft: "auto",
		marginRight: "5px",
		display: "block",
		borderRadius: "50%",
		cursor: "pointer",
		width: "32px",
		height: "32px",
		position: "absolute",
		right: "4px",
		bottom: "7px",
		"&:focus": {
			outline: "none",
		},
		"&:hover": {
			backgroundColor: "rgb(227, 226, 245)",
		},
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
		borderRadius: "8px",
		marginTop: "35px",
		height: "100%",
		padding: "30px",
	},
	eventinfo: {
		fontSize: "22px",
		borderRadius: "8px",
		fontWeight: "700",
		wordBreak: "break-word",
	},
	PhnxPrice: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#413AE2",
		display: "flex",
		wordBreak: "break-word",
		// textTransform:"uppercase"
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
		width: "100%",
		marginTop: "10px",
		marginBottom: "25px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
			paddingRight: "25px",
		},
		[theme.breakpoints.down("xs")]: {
			"&. MuiOutlinedInput-root": {
				minWidth: "116px",
				width: "100%",
			},
			width: "100%",
			minWidth: "141px",
		},
	},
	organizerEventLink: {
		color: "black",
		textDecoration: "none !important",
		"&:hover": {
			color: "black",
		},
	},
	buy: {
		// marginLeft: "13px",
		fontWeight: 700,
		width: "100%",
		height: "45px",
		backgroundColor: "#413AE2",
		"&.MuiButton-root": {
			lineHeight: "18px",
		},
		[theme.breakpoints.down("xs")]: {
			"&.MuiButton-root": {
				padding: "0px 10px",
			},
		},
		// [theme.breakpoints.down("xs")]: {
		// 	// marginLeft: "0px",
		// 	// marginTop: "20px",
		// 	width: "160px",
		// },
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
	selectInput: {
		width: "100%",
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
			paddingRight: "25px !important",
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
		},
	},
	organizerDetails: {
		justifyContent: "center",
		textAlign: "center",
		overflow: "hidden",
		wordBreak: "break-word",
	},
	organizerDescription: {
		justifyContent: "center",
		textAlign: "center",
		display: "flex",
		margin: "10px auto",
		width: "80%",
		marginBottom: "80px",
	},
	heading: {
		borderBottom: "1px solid #E4E4E7",
		fontWeight: "700",
		color: "black",
		paddingBottom: "10px",
		marginBottom: "20px",
	},
	row: {
		marginTop: "40px",
		paddingBottom: "60px",
	},
	eventDescriptionFont: {
		"& .RichTextEditor__root___2QXK-": {
			fontFamily: "sans-serif",
		},
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
		"@media (max-width: 900px)": {
			width: "auto",
			alignSelf: "flex-start",
		},
	},
	selectWidth: {
		maxWidth: "350px",
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
	},
	eventTimePara: {
		marginBottom: "0px",
	},
	localTime: {
		float: "right",
		fontSize: "12px",
		fontWeight: "bolder",
		color: "#6b6b6b",
	},
	transactionPagination: {
		width: "100%",
	},
	TransactionImage: {
		height: "40px",
		width: "40px",
		objectFit: "cover",
		borderRadius: "50%",
		"@media (max-width):500px": {
			height: "30px",
			width: "30px",
		},
	},
	TicketPurchasesExportDiv: {
		display: "flex",
	},
	exportButtonDiv: {
		marginLeft: "auto",
	},
});
class EventPage extends Component {
	constructor(props, context) {
		super(props);
		// this.contracts = context.drizzle.contracts;
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
			shareUrl: "",
			oneTimeBuy: false,
			open3: false,
			open3Message: "",
			avatarCustom: "",
			networkId: null,
			avatarId: 1,
			avatar: 0,
			blockChainEvent: {},
			shareUrl: window.location,
			allowBuySnackbar: false,
			errorMessage: "",
			SnackbarMessage: "",
			locationEvent: "",
			disableBuyTicketBtn: false,
			selectCurrency:false,
			// phnx_price: "",
			token_price: "",
			eventExistInContract: false,
			Icon: false,
			UserFavoriteEvents: [],
			allow: null,
			loadingApprove: false,
			loadingPurchase: false,
			boughtTicket: 0,
			alternateEventPresent: null,
			alternateEventLoading: false,
			// tokenPrices: { phnx: "", eth: "", matic: "", usdt: "" },
			tokenPrices: null,
			// selectedToken: {
			// 	tokenName: RinkbeyNetworkArray[0].networks[0].tokenName,
			// 	chainId: 4,
			// 	image: RinkbeyNetworkArray[0].networks[0].image,
			// 	tokenAddress: RinkbeyNetworkArray[0].networks[0].tokenAddress,
			// },
			selectedToken: !this.props.isPHNX?{
				displayName: "PhoenixDAO",
				image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147",
				tokenAddress:
					this.props.networkId == GLOBAL_NETWORK_ID
						? PhoenixDAO_Mainnet_Token_Address
						: PhoenixDAO_Testnet_Token_Address_2,
				tokenName: "phoenixdao",
				firstTime:true
			}:{
				displayName: "PhoenixDAO",
				image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147",
				tokenAddress:
					this.props.networkId == GLOBAL_NETWORK_ID
						? PhoenixDAO_Mainnet_Token_Address
						: PhoenixDAO_Testnet_Token_Address_2,
				tokenName: "phoenixdao",
			},
			tokensListContract: this.props.tokensListContract
				? this.props.tokensListContract
				: {
						displayName: "PhoenixDAO",
						image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147",
						tokenAddress:
							this.props.networkId == GLOBAL_NETWORK_ID
								? PhoenixDAO_Mainnet_Token_Address
								: PhoenixDAO_Testnet_Token_Address_2,
						tokenName: "phoenixdao",
				  },
		};
		this.isCancelled = false;
		this.onChangePage = this.onChangePage.bind(this);
		this.giveApproval = this.giveApproval.bind(this);
		this.inquire = this.inquire.bind(this);
		this.loadEventFromBlockchain = this.loadEventFromBlockchain.bind(this);
		this.goBack = this.goBack.bind(this); // i think you are missing this
		this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
		this.getUserFavoritesEvent = this.getUserFavoritesEvent.bind(this);
		this.addTofavorite = this.addTofavorite.bind(this);
		this.EventsOnDifferentNetworkExist =
			this.EventsOnDifferentNetworkExist.bind(this);
		this.handleExportCSV = this.handleExportCSV.bind(this);
	}
	goBack() {
		this.props.history.goBack();
	}

	addTofavorite = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("AUTH_TOKEN");
		try {
			let payload = {
				address: this.props.accounts[0],
				networkId: this.props.networkId,
				eventId: this.props.match.params.id,
			};

			//for add to favourite
			if (!this.state.Icon) {
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
					this.setState({ Icon: !this.state.Icon });
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
					this.setState({ Icon: !this.state.Icon });
				}
				this.props.reloadData();
			}
		} catch (error) {
			if (error.response && error.response.data) {
			}
		}
	};

	getUserFavoritesEvent = async () => {
		try {
			const token = localStorage.getItem("AUTH_TOKEN");
			const get = await axios.post(
				`${API_URL}${GET_USER_DETAIL}`,
				{
					address: this.props.accounts[0],
					networkId: this.props.networkId,
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
			if (
				get.data.result.userHldr.favourites.includes(
					this.props.match.params.id
				)
			) {
				this.setState({
					Icon: true,
				});
			} else {
				this.setState({
					Icon: false,
				});
			}
			return;
		} catch (error) {
			// console.log("check error", error);
		}
	};
	handleCloseAllowBuySnackbar = () => {
		this.setState({
			allowBuySnackbar: false,
		});
	};

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
	// 	this.setState({
	// 		blockChainEvent: blockChainEvent,
	// 		blockChainEventLoaded: true,
	// 	});
	// 	this.updateIPFS();
	// }

	userExists(buyers, account) {
		return buyers.some(function (el) {
			return el.address.toLowerCase() == account.toLowerCase();
		});
	}

	async checkBlockchainEvent() {
		if (this.props.eventsContract._address) {
			this.props.eventsContract.methods
				.events(this.props.match.params.id)
				.call()
				.then((data) => {
					// console.log("hello: event exist name", data.name)
					if (data.name) {
						if (
							this.props.match.params.title ==
							urlFormatter(data.name)
						) {
							this.setState({
								eventExistInContract: true,
							});
						} else {
							this.setState({
								eventExistInContract: false,
							});
						}
					} else {
						this.setState({
							eventExistInContract: false,
						});
					}
				})
				.catch((err) => {
					// console.log("Err in checkblockchain", err)
				});
		}
	}

	async EventsOnDifferentNetworkExist() {
		this.setState({ alternateEventLoading: true });
		let web3 = window.web3;
		let ethereum = window.ethereum;
		let graphURL = "";
		const alternateNetworkId = [1, 137];
		alternateNetworkId.map(async (netId) => {
			// console.log("hello: condition",netId,this.state.networkId,netId == this.state.networkId)
			try {
				// let networkId = await getNetworkId();
				if (netId === GLOBAL_NETWORK_ID) {
					graphURL = graphURLV1;
				} else if (netId === GLOBAL_NETWORK_ID_2) {
					graphURL = graphURLV2;
				} else {
					graphURL = graphURLV2;
				}
			} catch (err) {
				// console.log("alternate event error: ",err)
			}
			// console.log("hello: graph URL: ", graphURL);
			if (netId == this.state.networkId) {
				// console.log("hello event exist on 1",false.toString());
				return false;
			} else {
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
						isPHNX
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
						if (graphEvents.data.data.events.length > 0) {
							this.setState({ alternateEventPresent: netId });
							this.setState({
								blockChainEvent: {},
								blockChainEventLoaded: true,
							});
							// console.log("hello: alternate state: ",this.state.alternateEventPresent);
						} else {
							this.setState({ alternateEventPresent: null });
							this.setState({
								blockChainEvent: {},
								blockChainEventLoaded: true,
							});
							// console.log("hello: alternate state: ",this.state.alternateEventPresent);
						}
					})
					.catch((err) => {
						this.setState({
							blockChainEvent: {},
							blockChainEventLoaded: true,
						});
					});
				// return console.log("event exist on 2",netId,await this.EventsOnDifferentNetworkExist(netId).toString(), this.state.alternateEventPresent);
			}
		});
		this.setState({ alternateEventLoading: false });
	}
	async loadEventFromBlockchain() {
		const networkId = await getNetworkId();
		this.setState({ networkId: networkId });
		// const web3 = new Web3(
		// 	new Web3.providers.WebsocketProvider(INFURA_WEB_URL)
		// );
		// const openEvents = new web3.eth.Contract(
		// 	Open_events_ABI,
		// 	Open_events_Address
		// );

		// const blockChainEvent = await this.props.eventsContract.methods
		// 	.getTkt("2")
		// 	.call();
		// 	console.log("events")

		// 	console.log("blockChain Events in eventPage",blockChainEvent)
		const graphURL = await GetGraphApi();
		// this.setState({
		// 	blockChainEvent: {},
		// 	blockChainEventLoaded: true,
		// });
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
					isPHNX
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
				if (graphEvents.data.data.events.length > 0) {
					// console.log(
					// 	"hello: event exists ",
					// 	graphEvents.data.data.events
					// );
					// console.log("hello: event url is title",this.props.match.params.title )
					// console.log("hello: event url is title",urlFormatter(graphEvents.data.data.events[0].name) )
					if (
						this.props.match.params.title ==
						urlFormatter(graphEvents.data.data.events[0].name)
					) {
						this.setState({
							blockChainEvent: graphEvents.data.data.events[0],
							blockChainEventLoaded: true,
							load: false,
							oneTimeBuy:
								graphEvents.data.data.events[0].oneTimeBuy,
						});
						this.updateIPFS();

						this.priceCalculation(0);
						if (networkId) {
							await updateEventViews({
								eventId:
									graphEvents.data.data.events[0].eventId,
								address: graphEvents.data.data.events[0].owner,
								networkId: networkId,
							});

							const userDetails = await getUser({
								address: graphEvents.data.data.events[0].owner,
								networkId: networkId,
							});
							if (!userDetails.error) {
								this.setState({
									organizerDetails:
										userDetails.result.result.userHldr
											.organizerDetails,
								});
								this.provideImage(
									userDetails.result.result.userHldr
								);
							}
						}
					} else {
						this.setState({
							blockChainEvent: {},
							blockChainEventLoaded: true,
						});
						await this.EventsOnDifferentNetworkExist();
					}
				} else {
					await this.EventsOnDifferentNetworkExist();
					// console.log("hello: the result are",this.state.alternateEventPresent)
					// throw "event not found";
				}
				this.setState({ alternateEventLoading: false });
				// console.log("graphEventsgraphEvents", graphEvents);
			})
			.catch((err) => {
				this.setState({
					blockChainEvent: {},
					blockChainEventLoaded: true,
					alternateEventLoading: false,
				});
			});
	}
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
				this.setState({ PhoenixDAO_market: data.phoenixdao });
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

	priceCalculation = async (categoryIndex) => {
		let event_data = this.state.blockChainEvent;
		if (event_data.prices) {
			if (event_data.isPHNX) {
				this.setState({ isPHNX: event_data.isPHNX });
				// console.log("event details:", event_data);
				let dollar_price = event_data.prices.map((price) => {
					return (
						Web3.utils.fromWei(price.toString()) *
						this.state.PhoenixDAO_market.usd
					);
				});
				let token_price = Web3.utils.fromWei(
					event_data.prices[categoryIndex].toString()
				);
				// console.log("dollar_price: ", dollar_price, token_price);
				let priceInPhnx = event_data.token
					? token_price + "PHNX"
					: "FREE";
				let priceInDollar = event_data.token
					? "$" + dollar_price[categoryIndex]
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
							// 	token_price = event_data.prices.map((price) => {
							// 		if (
							// 			Web3.utils.fromWei(price.toString()) /
							// 				v.usdPrice >
							// 			0.1
							// 		) {
							// 			return (
							// 				Web3.utils.fromWei(
							// 					price.toString()
							// 				) / v.usdPrice
							// 			).toFixed(3);
							// 		} else if (
							// 			Web3.utils.fromWei(price.toString()) /
							// 				v.usdPrice <
							// 			0.0001
							// 		) {
							// 			return (
							// 				Web3.utils.fromWei(
							// 					price.toString()
							// 				) / v.usdPrice
							// 			).toFixed(6);
							// 		} else {
							// 			return (
							// 				Web3.utils.fromWei(
							// 					price.toString()
							// 				) / v.usdPrice
							// 			);
							// 		}
							// 	});
							// } else {
								token_price = event_data.prices.map((price) => {
									return (
										Web3.utils.fromWei(price.toString()) /
										v.usdPrice
									);
								});
							// }
						}
					});
				}
				dollar_price = Web3.utils.fromWei(
					event_data.prices[categoryIndex].toString()
				);
				// Dynamic function for price calculation Ends
				// console.log(
				// 	"dollar_price: ",
				// 	event_data.token,
				// 	token_price[categoryIndex]
				// );
				let priceInPhnx = event_data.token
					? token_price[categoryIndex] + "PHNX"
					: "FREE";
				let priceInDollar = event_data.token ? "$" + dollar_price : "";
				// console.log("event page price:", priceInDollar, priceInPhnx);
				this.setState({
					dollar_price: priceInDollar,
					token_price: priceInPhnx,
				});
			}
		}
	};
	getImage = () => {
		let image = "/images/loading_image_ipfs.png";
		if (this.state.ipfs_problem) image = "/images/problem_ipfs.png";
		// below this image will be image1 which will be taken as cover image always
		if (this.state.image1 !== null) image = this.state.image1;
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

	initApproveMethod = async () => {
		try {
			// let balance = await this.props.phnxContract.methods
			// 	.totalSupply()
			// 	.call();
			let tokenContract = await initTokenContract(
				this.state.selectedToken.tokenAddress
			);
			let balance = await tokenContract.methods.totalSupply().call();
			this.setState({
				// approve: this.props.phnxContract.methods.approve(
				// 	this.props.eventsAddress,
				// 	balance
				// ),
				approve: await GiveAllowance(
					this.props.accounts[0],
					this.state.selectedToken.tokenAddress,
					this.props.networkId
				),
			});
		} catch (err) {
			// console.log("err", err);
		}
	};
	handleExportCSV = () => {
		let data = ["buyers"];
		this.state.soldTicket.map((transaction) => {
			data.push(transaction.address);
		});

		var csvContent = "";
		data.forEach(function (infoArray, index) {
			csvContent += index < data.length ? infoArray + "\n" : infoArray;
		});
		let link = document.createElement("a");
		link.setAttribute(
			"href",
			"data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
		);
		link.setAttribute(
			"download",
			`${urlFormatter(this.state.blockChainEvent.name)}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	handleClickOpen = async () => {
		console.log("hello selected: ", this.state.selectedToken,  this.props.token, this.state.isPHNX);
		if (
			this.props.networkId != GLOBAL_NETWORK_ID &&
			this.props.networkId != GLOBAL_NETWORK_ID_2
		) {
			this.setState({
				open3: true,
				open3Message: "Please connect to Ethereum or Matic Mainnet",
			});
		} else {
			if(this.state.selectedToken.firstTime && (!this.state.isPHNX && this.state.token_price != "FREE") ){
				this.setState({
					selectCurrency: true,
				});
			}
			else{
			// this.setState({ open2: true });
			if (this.state.oneTimeBuy) {
				let buyers = this.state.soldTicket;
				const account = this.props.accounts[0];
				if (
					await this.props.eventsContract.methods
						.getTicketOwner(account, this.props.match.params.id)
						.call()
				) {
					// alert("One time buy");
					this.setState({
						open3: true,
						open3Message:
							"This event is restricted to one wallet address, you can't buy it again.",
					});
				} else {
					if (
						(await CheckTokenAllowance(
							this.props.accounts[0],
							this.state.selectedToken.tokenAddress,
							this.props.networkId
						)) == 0 ||
						!this.state.selectedToken.tokenName == "ethereum" ||!this.state.selectedToken.tokenName == "matic-network"
					) {
						let tokenContract = await initTokenContract(
							this.state.isPHNX
								? this.props.networkId == GLOBAL_NETWORK_ID
									? PhoenixDAO_Mainnet_Token_Address
									: PhoenixDAO_Testnet_Token_Address_2
								: this.state.selectedToken.tokenAddress
						);
						let balance = await tokenContract.methods
							.totalSupply()
							.call();
						// let balance = await this.props.phnxContract.methods
						// 	.totalSupply()
						// 	.call();
						this.setState({
							// approve: this.props.phnxContract.methods.approve(
							// 	this.props.eventsAddress,
							// 	balance
							// ),
							approve: await GiveAllowance(
								this.props.accounts[0],
								this.state.isPHNX
									? this.props.networkId == GLOBAL_NETWORK_ID
										? PhoenixDAO_Mainnet_Token_Address
										: PhoenixDAO_Testnet_Token_Address_2
									: this.state.selectedToken.tokenAddress,
								this.props.networkId
							),
						});
						this.handleClickOpen2();
					} else {
						const result = await this.checkUserBalance();
						this.setState({
							disableBuyTicketBtn: result,
						});
						if (!result) {
							this.setState({ open: true });
						}
					}
				}
			} else {
				if (
					(await this.allowance()) == 0 ||
					!this.state.selectedToken.tokenName == "ethereum" ||!this.state.selectedToken.tokenName == "matic-network"
				) {
					// if (
					// 	(await CheckTokenAllowance(
					// 		this.props.accounts[0],
					// 		this.state.selectedToken.tokenAddress
					// 	)) == 0
					// ) {
					// console.log("Coming here ifffff");
					let approval = await GiveAllowance(
						this.props.accounts[0],
						this.state.isPHNX
							? this.props.networkId == GLOBAL_NETWORK_ID
								? PhoenixDAO_Mainnet_Token_Address
								: PhoenixDAO_Testnet_Token_Address_2
							: this.state.selectedToken.tokenAddress,
						this.props.networkId
					);
					// console.log("Coming here ifffff approval", approval);
					// let balance = await this.props.phnxContract.methods
					// 	.totalSupply()
					// 	.call();
					// console.log(
					// 	"phnxContract.methods.approve =>> ",
					// 	this.props.phnxContract.methods.approve(
					// 		this.props.eventsAddress,
					// 		balance
					// 	)
					// );
					// this.setState({
					// 	approve: this.props.phnxContract.methods.approve(
					// 		this.props.eventsAddress,
					// 		balance
					// 	),
					// });
					this.setState({
						approve: approval,
					});
					this.handleClickOpen2();
				} else {
					const result = await this.checkUserBalance();
					this.setState({
						disableBuyTicketBtn: result,
					});
					if (!result) {
						this.setState({ open: true });
					}
				}
			}
		}
		}
	};
	handleCloseSnackbar() {
		this.setState({ open3: false, open3Message: "" });
	}
	handleClickOpen2 = () => {
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

	// allowance = async () => {
	// 	let a = await this.props.phnxContract.methods
	// 		.allowance(this.props.accounts[0], this.props.eventsAddress)
	// 		.call();
	// 	this.setState({
	// 		allow: a,
	// 	});
	// 	return a;
	// };
	allowance = async () => {
		if (this.state.selectedToken) {
			// console.log(
			// 	"this.props.eventsAddress +>",
			// 	this.props.eventsAddress
			// );
			if (this.state.selectedToken.tokenName === "ethereum" || this.state.selectedToken.tokenName == "matic-network") {
				this.setState({
					allow: true,
				});
				return true;
			} else {
				let a = await CheckTokenAllowance(
					this.props.accounts[0],
					this.state.isPHNX
						? this.props.networkId == GLOBAL_NETWORK_ID
							? PhoenixDAO_Mainnet_Token_Address
							: PhoenixDAO_Testnet_Token_Address_2
						: this.state.selectedToken.tokenAddress,
					this.props.networkId
				);
				// console.log("allowance at this.allowance", a);
				this.setState({
					allow: a,
				});
				return a;
			}
		}
	};

	giveApproval = async () => {
		this.setState({ disabledBuying: true, loadingApprove: true });
		// this.handleClose();
		let txreceipt = "";
		let txconfirmed = "";
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
			.on("confirmation", async (confirmationNumber, receipt) => {
				this.onConfirmation(confirmationNumber, receipt);
				await this.allowance();
				// await CheckTokenAllowance(
				// 	this.props.accounts[0],
				// 	this.state.selectedToken.tokenAddress
				// );
				this.setState({
					loadingApprove: false,
				});
			})
			.on("error", (error) => {
				if (error !== null) {
					this.setState({ disabledBuying: false });
					txerror = error;
					toast(
						<Notify
							error={error}
							networkId={this.props.networkId}
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
				this.setState({
					loadingApprove: false,
				});
			});
	};

	onConfirmation(confirmationNumber, receipt) {
		if (confirmationNumber == 0 && receipt.status == true) {
			this.setState({ disabledBuying: false });
			toast(
				<Notify
					networkId={this.props.networkId}
					hash={receipt.transactionHash}
					icon="fas fa-check-circle fa-3x"
					color="#413AE2"
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
	checkUserBalance = async () => {
		const weiObject = {
			0: "noether",
			1: "wei",
			3: "kwei",
			3: "Kwei",
			3: "babbage",
			3: "femtoether",
			6: "mwei",
			6: "Mwei",
			6: "lovelace",
			6: "picoether",
			9: "gwei",
			9: "Gwei",
			9: "shannon",
			9: "nanoether",
			9: "nano",
			12: "szabo",
			12: "microether",
			12: "micro",
			15: "finney",
			15: "milliether",
			15: "milli",
			18: "ether",
			21: "kether",
			21: "grand",
			24: "mether",
			27: "gether",
			30: "tether",
		};
		if (this.props.tokensListContract && this.state.selectedToken) {
			const networkId = await getNetworkId();
			if (
				networkId === GLOBAL_NETWORK_ID ||
				networkId === GLOBAL_NETWORK_ID_2
			) {
				let balance = 0;
				if (this.state.selectedToken.tokenName == "ethereum" || this.state.selectedToken.tokenName == "matic-network") {
					const web3 = new Web3(window.ethereum);
					balance = await web3.eth.getBalance(this.props.accounts[0]);
					balance = Web3.utils.fromWei(balance.toString());
				} else {
					let tokenContract = await initTokenContract(
						this.state.isPHNX
							? networkId == GLOBAL_NETWORK_ID
								? PhoenixDAO_Mainnet_Token_Address
								: PhoenixDAO_Testnet_Token_Address_2
							: this.state.selectedToken.tokenAddress
					);
					balance = await tokenContract.methods
						.balanceOf(this.props.accounts[0])
						.call();
					let decimal = await tokenContract.methods.decimals().call();
					// console.log(
					// 	"checkuser",
					// 	weiObject[`${decimal}`],
					// 	decimal,
					// 	typeof decimal
					// );
					balance = await Web3.utils.fromWei(
						balance.toString(),
						await weiObject[decimal]
					);
				}
				// console.log(
				// 	`checkUserBalance of ${this.state.selectedToken.tokenName}`,
				// 	balance
				// );
				if (
					this.state.isPHNX ||
					this.state.selectedToken.tokenName == "phoenixdao"
				) {
					if (
						Number(balance) <
						Number(this.state.token_price.split("PHNX")[0]) * 1.02
					) {
						return true;
					} else {
						this.setState({
							disableBuyTicketBtn: false,
						});
						return false;
					}
				} else {
					if (
						Number(balance) <
						Number(this.state.token_price.split("PHNX")[0])
					) {
						return true;
					} else {
						this.setState({
							disableBuyTicketBtn: false,
						});
						return false;
					}
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

	inquire = async () => {
		try {
			const result = await this.checkUserBalance();
			if (result) {
				this.setState({
					disableBuyTicketBtn: true,
				});
			} else {
				this.setState({
					loadingPurchase: true,
				});

				let event_data = this.state.blockChainEvent;
				let date2 = new Date(parseInt(event_data.time, 10) * 1000);

				// let balance = await this.props.phnxContract.methods
				// 	.totalSupply()
				// 	.call();
				// let balance = 0;
				// if (this.state.selectedToken.tokenName == "ethereum") {
				// 	const web3 = new Web3(window.ethereum);
				// 	balance = await web3.eth.getBalance(this.props.accounts[0]);
				// } else {
				// 	let tokenContract = await initTokenContract(
				// 		this.state.isPHNX
				// 			? PhoenixDAO_Mainnet_Token_Address
				// 			: this.state.selectedToken.tokenAddress
				// 	);
				// 	balance = await tokenContract.methods
				// 		.balanceOf(this.props.accounts[0])
				// 		.call();
				// }
				// console.log("balance:", balance);
				let date = new Date(
					parseInt(this.state.blockChainEvent.time, 10) * 1000
				);

				let time = date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				});
				const geoFindUser = await this.geoFindMe();
				// console.log("createEventDataa =>", [
				// 	this.props.match.params.id,
				// 	this.state.selectedCategoryIndex,
				// 	geoFindUser,
				// ]);
				// console.log(
				// 	"event page price:",
				// 	this.props.match.params.id,
				// 	this.state.selectedCategoryIndex,
				// 	this.state.selectedToken.tokenAddress,
				// 	this.props.networkId,
				// 	this.props.networkId == GLOBAL_NETWORK_ID
				// 		? PhoenixDAO_Mainnet_Token_Address
				// 		: PhoenixDAO_Testnet_Token_Address_2
				// );
				this.setState(
					{
						fee: this.state.blockChainEvent[2],
						token: this.state.blockChainEvent[3],
						openEvents_address:
							this.props.networkId == GLOBAL_NETWORK_ID
								? Open_events_Address
								: Open_events_Address_2,
						buyticket: this.props.eventsContract.methods.buyTicket(
							[
								this.props.match.params.id,
								this.state.selectedCategoryIndex,
								geoFindUser,
								//"Sydney",
								//below is weth address hard coded
							],
							this.state.isPHNX
								? this.props.networkId == GLOBAL_NETWORK_ID
									? PhoenixDAO_Mainnet_Token_Address
									: PhoenixDAO_Testnet_Token_Address_2
								: this.state.selectedToken.tokenAddress
							// "0xc778417E063141139Fce010982780140Aa0cD5Ab" // this is token address in which we buy, it should be dynamic
						),
						// approve: this.props.phnxContract.methods.approve(
						// 	this.props.eventsAddress,
						// 	balance
						// ),
						// approve: await CheckTokenAllowance(
						// 	this.props.accounts[0],
						// 	this.state.selectedToken.tokenAddress
						// ),
						approve:
							this.state.selectedToken.tokenName == "ethereum" || this.state.selectedToken.tokenName == "matic-network"
								? true
								: await GiveAllowance(
										this.props.accounts[0],
										this.state.isPHNX
											? this.props.networkId ==
											  GLOBAL_NETWORK_ID
												? PhoenixDAO_Mainnet_Token_Address
												: PhoenixDAO_Testnet_Token_Address_2
											: this.state.selectedToken
													.tokenAddress,
										this.props.networkId
								  ),
					},
					async () => {
						// let temp = await this.allowance();
						if ((await this.allowance()) == 0) {
							// if (
							// 	(await CheckTokenAllowance(
							// 		this.props.accounts[0],
							// 		this.state.selectedToken.tokenAddress
							// 	)) == 0
							// ) {
							this.setState({
								boughtTicket: this.state.boughtTicket + 1,
							});
							this.handleClickOpen();
						} else {
							// if (this.state.selectedToken.tokenName != "ether") {
                                // console.log("this.state.selectedToken.tokenName", this.state.selectedToken.tokenName)
							await this.props.inquire(
								this.props.id,
								this.state.fee,
								this.state.token,
								this.state.openEvents_address,
								this.state.buyticket,
								this.state.approve,
								this.state.eventTime,
								date2, // this.state.eventDate,
								this.state.eventEndDate,
								this.state.image,
								this.state.blockChainEvent.name,
								this.state.token_price,
								this.state.dollar_price,
								time,
								date2,
								(this.state.selectedToken.tokenName == "ethereum" || this.state.selectedToken.tokenName == "matic-network")
									? true
									: false,
								this.state.isPHNX
									? this.props.networkId == GLOBAL_NETWORK_ID
										? PhoenixDAO_Mainnet_Token_Address
										: PhoenixDAO_Testnet_Token_Address_2
									: this.state.selectedToken.tokenAddress
							);
							// }
							this.setState({
								loadingPurchase: false,
							});
							this.handleClose();
						}
					}
				);
			}
		} catch (err) {
			// console.log("err while buying", err);
		}
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

	onChangePage = async (pageTransactions) => {
		const networkId = await getNetworkId();
		if (networkId) {
			pageTransactions.map(async (user, Index) => {
				try {
					let result = await getUser({
						address: user.address,
						networkId: networkId,
					});
					if (result) {
						user.ImageDetails = result.result.result.userHldr;
						// user.avatarCustom = result.result.result.userHldr.avatarCustom;
						// user.avatarNumber = result.result.result.userHldr.avatarNumber;
						// user.avatarIPFSHash = result
						if (result.result.result.userHldr.avatarCustom) {
							await ipfs
								.get(result.result.result.userHldr.avatar)
								.then((file) => {
									let data = JSON.parse(
										file[0].content.toString()
									);
									user.avatarImage = data.image0;
								});
							this.setState({ pageTransactions });
						} else {
							user.avartarImage = "";
							this.setState({ pageTransactions });
						}
					}
				} catch (err) {
					this.setState({ pageTransactions });
				}
			});
		}
	};

	handleCloseSnackbar() {
		this.setState({ open3: false, open3Message: "" });
	}

	handleCloseSnackbar4 = () => {
		this.setState({
			disableBuyTicketBtn: false,
			selectCurrency:false,
		});
	};

	imageData = (index) => {
		let myArray = [
			{ img: "/images/avatars/bennu.svg", name: "Bennu", onclick: false },
			{
				img: "/images/avatars/milcham.svg",
				name: "Milcham",
				onclick: false,
			},
			{
				img: "/images/avatars/thunderbird.svg",
				name: "Thunderbird",
				onclick: false,
			},
			{
				img: "/images/avatars/garuda.svg",
				name: "Garuda",
				onclick: false,
			},
			{
				img: "/images/avatars/firebird.svg",
				name: "Firebird",
				onclick: false,
			},
			{
				img: "/images/avatars/metamask.svg",
				name: "Custom",
				onclick: true,
			},
		];
		return myArray[index].img;
	};

	provideImage = (userDetails) => {
		if (Object.keys(userDetails).length > 0) {
			const avatarCustom = userDetails.avatarCustom;
			const avatarId = userDetails.avatarNumber;
			const avatar = userDetails.avatar;
			this.setState({
				avatarCustom: avatarCustom,
				avatarId: avatarId,
			});
			if (avatarCustom) {
				ipfs.get(avatar).then((file) => {
					let data = JSON.parse(file[0].content.toString());
					this.setState({
						avatar: data.image0,
					});
				});
			}
		}
	};

	renderImage = () => {
		if (this.state.avatarCustom) {
			return (
				<img
					src={this.state.avatar}
					className="bird"
					style={{
						width: "60px",
						borderRadius: "50%",
						height: "60px",
						objectFit: "cover",
					}}
				/>
			);
		} else {
			return (
				<img
					src={this.imageData(this.state.avatarId)}
					className="bird"
					style={{
						width: "60px",
						borderRadius: "50%",
						height: "60px",
					}}
				/>
			);
		}
	};

	allowBuy = () => {
		if (Object.keys(this.state.blockChainEvent).length > 0) {
			let index = this.state.selectedCategoryIndex;
			if (
				Number(this.state.blockChainEvent.time) <
				new Date().getTime() / 1000
			) {
				this.setState({
					allowBuySnackbar: true,
					SnackbarMessage: "This event is already ended",
				});
				return false;
			} else if (
				this.state.blockChainEvent.catTktQuantity[index] != 0 &&
				parseInt(
					this.state.blockChainEvent.catTktQuantitySold[index]
				) >= parseInt(this.state.blockChainEvent.catTktQuantity[index])
			) {
				this.setState({
					allowBuySnackbar: true,
					SnackbarMessage:
						"All tickets have been sold for this category",
				});
			} else {
				return true;
			}
		}
	};
	handleSelectedTokenState = async (result) => {
		// console.log("handleSelectedTokenState EventPage", result);
		this.setState({ selectedToken: result }, () => {
			this.priceCalculation(this.state.selectedCategoryIndex);
		});
	};
	checkUserTicketLocation = async () => {
		const eventId = this.props.match.params.id;
		const users = await generateBuyerArr(eventId);
		let event_data = this.state.blockChainEvent;
		for (let i = 0; i < users.length; i++) {
			if (this.props.accounts[0]) {
				if (users[i].address === this.props.accounts[0].toLowerCase()) {
					this.setState({
						locationEvent: event_data.location,
					});
					break;
				}
			}
		}
	};

	render() {
		const { classes } = this.props;
		// console.log("hello: Event NAme",this.state.blockChainEvent)

		let body = <SkeletonEvent />;
		if (this.state.blockChainEventLoaded) {
			if (
				this.state.eventExistInContract &&
				(this.state.blockChainEvent === undefined ||
					Object.keys(this.state.blockChainEvent).length === 0)
			) {
				body = (
					<EmptyState
						text="The event is being processed and will be available with in 10-15 minutes"
						btnText="Go to Dashboard"
						url="/allevents/1"
					/>
				);
			} else if (
				this.state.blockChainEvent === undefined ||
				Object.keys(this.state.blockChainEvent).length === 0
			) {
				{
					// console.log(
					// 	"this.state.blockChainEventttt",
					// 	this.state.blockChainEvent
					// );
				}
				if (this.state.alternateEventPresent == null) {
					body = (
						<EmptyState
							text={`Event doesn't exist... 😔`}
							btnText="Go to Dashboard"
							url="/allevents/1"
						/>
					);
				} else {
					body = (
						// <div className="text-center mt-5">
						// 	<span role="img" aria-label="uncorn">
						// 		🦄
						// 	</span>{" "}
						// 	PhoenixDAO Event not found
						// </div>
						<EmptyState
							text={`We cannot find your event, please check your
							MetaMask wallet to ensure you’re on the ${
								this.state.alternateEventPresent == 1
									? "Ethereum"
									: ""
							} ${
								this.state.alternateEventPresent == 137
									? "Matic"
									: ""
							} Network.
							Both Matic and Ethereum events are currently supported. Also check if you are signed with metamask`}
							btnText="Go to Dashboard"
							url="/allevents/1"
						/>
					);
				}
			} else {
				if (
					urlFormatter(this.props.match.params.title) ==
					urlFormatter(this.state.blockChainEvent.name)
				) {
					let event_data = this.state.blockChainEvent;
					// to be changed
					let image = this.getImage();
					let description = this.getDescription();
					let locations = event_data.onsite
						? event_data.location
						: this.state.locationEvent;
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
						event_data.tktLimited[
							this.state.selectedCategoryIndex
						] &&
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
						// disabled = true;
						// disabledStatus = (
						// 	<span>
						// 		<span role="img" aria-label="alert">
						// 			⚠️
						// 		</span>{" "}
						// 		No more tickets
						// 	</span>
						// );
						// buttonText = " Sold Out";
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
					// event_data.categories
					let ticketPrices =
						event_data.token && event_data.categories.length > 1;
					if (this.props.match.params.id == event_data.eventId) {
						body = (
							<Grid>
								{/* <BuyTicket
									open={this.state.open2}
									handleClose={this.handleClose2}
									image={image}
									eventTitle={event_data.name}
									date={event_date}
									time={time}
									date2={date}
									buy={this.inquire}
									buttonText={buttonText}
									eventTime={this.state.eventTime}
									eventDate={this.state.eventDate}
									eventEndDate={this.state.eventEndDate}
									phnx_price={this.state.token_price}
									dollar_price={this.state.dollar_price}
									tokensListContract={
										this.props.tokensListContract
									}
									selectedToken={this.state.selectedToken}
								/> */}
								<ApprovalModal
									open={this.state.open}
									buttonText={buttonText}
									handleClose={this.handleClose}
									giveApproval={this.giveApproval}
									image={image}
									eventTitle={event_data.name}
									date={event_date}
									eventStartDate={this.state.eventStartDate}
									eventTime={this.state.eventTime}
									eventStartTime={this.state.eventStartTime}
									eventDate={this.state.eventDate}
									eventEndDate={this.state.eventEndDate}
									phnx_price={pricingFormatter(
										this.state.token_price &&
											this.state.token_price,
										"PHNX",
										this.state.isPHNX ||
											(this.state.selectedToken &&
												this.state.selectedToken
													.tokenName == "phoenixdao")
									)}
									eventEndTime={this.state.eventEndTime}
									dollar_price={pricingFormatter(
										this.state.dollar_price,
										"$",
										this.state.isPHNX ||
											(this.state.selectedToken &&
												this.state.selectedToken
													.tokenName == "phoenixdao")
									)}
									allowance={this.allowance}
									allow={this.state.allow}
									inquire={this.inquire}
									loadingApprove={this.state.loadingApprove}
									loadingPurchase={this.state.loadingPurchase}
									tokensListContract={
										this.props.tokensListContract
									}
									isPHNX={this.state.isPHNX}
									selectedToken={this.state.selectedToken}
								/>
								<Snackbar
									anchorOrigin={{
										vertical: "top",
										horizontal: "center",
									}}
									open={this.state.open3}
									onClose={this.handleCloseSnackbar}
									message={this.state.open3Message}
									autoHideDuration={3000}
									key={"top" + "center"}
									className="snackbar"
								/>
								{this.state.selectedToken && (
									<Snackbar
										anchorOrigin={{
											vertical: "top",
											horizontal: "center",
										}}
										open={this.state.disableBuyTicketBtn}
										onClose={this.handleCloseSnackbar4}
										message={`You do not have enough ${this.state.selectedToken.displayName} token to buy the ticket`}
										autoHideDuration={3000}
										key={"top" + "center"}
										className="snackbar"
									/>
								)}
									{this.state.selectedToken && (
									<Snackbar
									anchorOrigin={{
										vertical: "top",
										horizontal: "center",
									}}
									open={this.state.selectCurrency}
									onClose={this.handleCloseSnackbar4}
									message={`Please select a currency to buy a ticket`}
									autoHideDuration={3000}
									key={"top" + "center"}
									className="snackbar"
								/>
								)}
									
								<Header
									disabled={
										disabled ||
										this.props.disabledStatus ||
										this.state.disabledBuying
										// || (this.props.accounts[0]&&this.state.pageTransactions.filter(e =>{ return  e.address==this.props.accounts[0].toLowerCase() }) && this.state.oneTimeBuy)
									}
									title={event_data.name}
									buttonText={buttonText}
									goBack={this.goBack}
									page="event"
									buyTicket={true}
									handleClickOpen={this.handleClickOpen}
									allowBuy={this.allowBuy}
									tokensListContract={
										this.props.tokensListContract
									}
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
									<Grid
										lg={12}
										style={{
											backgroundImage: `url("${image}")`,
										}}
										className={classes.imageDiv}
									>
										{/* <img
										className="card-img-top event-image"
										src={image}
										alt="Event"
									/> */}
										<Typography
											className={classes.FavoriteIcon}
											component="span"
											onClick={this.addTofavorite}
										>
											{this.state.Icon ? (
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
										</Typography>
										<div></div>
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
												{/* <img
												src={"/images/phoenixdao.svg"}
												className="event_price-image"
												alt="Event Price"
											/> */}
												TICKET PRICE
											</p>
											{ticketPrices && (
												<FormControl
													variant="outlined"
													className={
														classes.ticketSelect
													}
												>
													<Select
														value={
															this.state
																.selectedCategoryIndex
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
																vertical:
																	"bottom",
																horizontal:
																	"left",
															},
														}}
														className={
															classes.selectInput
														}
													>
														{event_data.categories
															.length > 1
															? event_data.categories.map(
																	(
																		category,
																		i
																	) => (
																		<MenuItem
																			value={
																				i
																			}
																			style={{
																				fontFamily:
																					"'Aeonik', sans-serif",
																			}}
																		>
																			<span
																				className={
																					classes.selectWidth
																				}
																			>
																				{
																					category
																				}
																			</span>
																		</MenuItem>
																	)
															  )
															: ""}
													</Select>
												</FormControl>
											)}
											<div className={classes.eventinfo}>
												<span
													className={
														classes.PhnxPrice
													}
													title={
														this.state.token_price
													}
												>
													{this.state.isPHNX &&
														this.state
															.dollar_price && (
															<div
																className={
																	classes.PhnxPriceEventPage
																}
															>
																<img
																	src={
																		PhnxLogo
																	}
																	style={{
																		height: "25px",
																		marginRight:
																			"4px",
																	}}
																/>

																{`${pricingFormatter(
																	this.state
																		.token_price,
																	"PHNX",
																	this.state
																		.isPHNX ||
																		this
																			.state
																			.selectedToken
																			.tokenName ==
																			"phoenixdao"
																)}`}
															</div>
														)}

													{this.state.dollar_price &&
													this.state.dollar_price.slice(
														1
													) > 0
														? !this.state
																.isPHNX && (
																<PriceSelectBox
																	tokensListContract={
																		this
																			.props
																			.tokensListContract
																	}
																	selectedToken={
																		this
																			.state
																			.selectedToken &&
																		this
																			.state
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
																	isEventPage={
																		true
																	}
																/>
														  )
														: ""}
													{`${pricingFormatter(
														this.state.token_price,
														"PHNX",
														this.state.isPHNX ||
															this.state
																.selectedToken
																.tokenName ==
																"phoenixdao"
													)}` == "Free" &&
														!this.state
															.dollar_price &&
														"Free"}
												</span>
												<div
													style={{
														color: "#56555D",
														fontSize: "14px",
													}}
													title={
														this.state.isPHNX ||
														(this.state
															.selectedToken &&
															this.state
																.selectedToken
																.tokenName ==
																"phoenixdao")
															? this.state
																	.dollar_price
															: Number(
																	this.state
																		.dollar_price
															  ) * 1.02
													}
												>
													{/* {console.log(
														"dollar price ggg:",
														this.state
															.dollar_price &&
															this.state.dollar_price.slice(
																1
															)
													)} */}
													{this.state.dollar_price &&
														pricingFormatter(
															this.state
																.dollar_price,
															"$",
															this.state.isPHNX ||
																(this.state
																	.selectedToken &&
																	this.state
																		.selectedToken
																		.tokenName ==
																		"phoenixdao")
														)}
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
											<span
												style={{
													display:
														"table-header-group",
												}}
											>
												<p
													className={`${classes.eventinfo} ${classes.eventTimePara}`}
												>
													{" "}
													{!this.state.eventStartTime
														? `Time`
														: !this.state
																.eventEndTime
														? moment(
																this.state
																	.eventStartTime
														  )
																.utcOffset(0)
																.local()
																.format("LT")
														: `${moment(
																this.state
																	.eventStartTime
														  )
																.utcOffset(0)
																.local()
																.format(
																	"LT"
																)} - ${moment(
																this.state
																	.eventEndTime
														  )
																.utcOffset(0)
																.local()
																.format(
																	"LT"
																)}`}{" "}
													Local
												</p>

												<p
													className={
														classes.localTime
													}
													style={{
														marginBottom: "0px",
													}}
												>
													(
													{!this.state.eventStartTime
														? `Time`
														: !this.state
																.eventEndTime
														? moment(
																this.state
																	.eventStartTime
														  )
																.utcOffset(0)
																.format(
																	"hh:mm A z"
																)
														: `${moment(
																this.state
																	.eventStartTime
														  )
																.utcOffset(0)
																.format(
																	"hh:mm A"
																)} - ${moment(
																this.state
																	.eventEndTime
														  )
																.utcOffset(0)
																.format(
																	"hh:mm A z"
																)}`}
													)
												</p>
											</span>
											{this.state.blockChainEvent
												.onsite ? (
												<span>
													<p
														className={
															classes.eventHeading
														}
													>
														<LocationOnOutlined />{" "}
														Location
													</p>
													<p
														className={
															classes.eventinfo
														}
													>
														<a
															href={`https://www.google.com/maps/search/${locations}`}
															target="_blank"
															style={{
																textDecoration:
																	"none",
																color: "#212529",
															}}
														>
															{locations}
														</a>
													</p>
												</span>
											) : (
												<span>
													<p
														className={
															classes.eventHeading
														}
													>
														<LocationOnOutlined />{" "}
														Online
													</p>
													{locations ? (
														<p
															className={
																classes.eventinfo
															}
														>
															{locations}
														</p>
													) : (
														<p
															className={
																classes.eventinfo
															}
														>
															Please Buy the
															Ticket to get the
															Link.
														</p>
													)}
												</span>
											)}
											<p className={classes.eventHeading}>
												<PersonOutlined />
												Organizer
											</p>
											<p className={classes.eventinfo}>
												{this.state.loaded ? (
													<Link
														className={
															classes.organizerEventLink
														}
														to={`/allevents/organizer/${
															this.state
																.organizer &&
															urlFormatter(
																this.state
																	.organizer
															)
														}/${event_data.owner.substr(
															event_data.owner
																.length - 4
														)}`}
													>
														{this.state.organizer}
													</Link>
												) : (
													<span>
														{this.state.organizer}
													</span>
												)}
											</p>
											<p className={classes.eventHeading}>
												<ConfirmationNumberOutlined />
												Tickets Bought
											</p>
											<p className={classes.eventinfo}>
												{
													(
														parseInt(
															event_data.tktTotalQuantitySold
														) +
														this.state.boughtTicket
													).toString()
													// event_data.tktTotalQuantitySold
													// event_data.tktTotalQuantitySold
												}
												/{max_seats}
											</p>
											<div style={{ paddingTop: "20px" }}>
												<Button
													variant="contained"
													color="primary"
													style={{
														marginBottom: "10px",
													}}
													className={classes.buy}
													onClick={() =>
														this.allowBuy()
															? this.handleClickOpen()
															: null
													}
													disabled={
														disabled ||
														this.props
															.disabledStatus ||
														this.state
															.disabledBuying
														// || (this.props.accounts[0]&&this.state.pageTransactions.filter(e =>{ return  e.address==this.props.accounts[0].toLowerCase() }) && this.state.oneTimeBuy)
													}
												>
													<ShoppingCartOutlined
														style={{
															marginRight: "10px",
														}}
													/>
													{buttonText}
												</Button>
											</div>
										</Grid>
									</Grid>
									<Grid
										container
										className={`${classes.heading} ${classes.row} `}
									>
										<div className="new-transaction-wrapper">
											<div
												className={
													classes.TicketPurchasesExportDiv
												}
											>
												<div>
													<h2
														className={
															classes.heading
														}
													>
														Ticket Purchases
													</h2>
												</div>
												{/* <div className={classes.exportButtonDiv}>
											{this.state.soldTicket.length == 0?"":<Button variant="contained"
												color="primary"
												style={{ marginBottom: "10px" }}
												className={classes.buy}
												id="download"
												onClick={this.handleExportCSV}
												>Export CSV</Button>}
										</div> */}
											</div>
											{this.state.load && <Loading />}
											<Grid container lg={12}>
												{this.state.pageTransactions.map(
													(sold, index) => (
														<Grid
															xl={6}
															lg={6}
															md={6}
															sm={12}
															xs={12}
														>
															<div
																style={{
																	display:
																		"flex",
																}}
															>
																{sold.ImageDetails && (
																	<div
																		style={{
																			paddingTop:
																				"12px",
																		}}
																	>
																		<img
																			src={
																				sold
																					.ImageDetails
																					.avatarCustom
																					? sold.avatarImage
																					: this.imageData(
																							sold
																								.ImageDetails
																								.avatarNumber
																					  )
																			}
																			className={
																				classes.TransactionImage
																			}
																		/>
																	</div>
																)}
																<div>
																	<p
																		className="sold_text col-md-12"
																		key={
																			index
																		}
																	>
																		<a
																			rel="noopener noreferrer"
																			href={
																				this
																					.state
																					.networkId ==
																				137
																					? explorerWithAddress +
																					  sold.address
																					: this
																							.state
																							.networkId ==
																					  1
																					? etherscanMainnetAddress
																					: etherscanRinkbyAddress +
																					  sold.address
																			}
																			target="_blank"
																		>
																			{sold.address.slice(
																				0,
																				10
																			) +
																				"... "}
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
																		{" " +
																			sold.count}{" "}
																		{sold.count >
																		1
																			? "tickets"
																			: "ticket"}{" "}
																		for this
																		event.{" "}
																		{/* <strong>
														{event_data[0]}
													</strong> */}
																	</p>
																</div>
															</div>
														</Grid>
													)
												)}
											</Grid>
											{this.state.soldTicket.length ==
												0 && (
												<p className="sold_text col-md-12 no-tickets">
													There are currently no
													purchases of this Event.
												</p>
											)}
										</div>
										<div
											className={`pagination ${classes.transactionPagination}`}
										>
											<JwPagination
												items={this.state.soldTicket}
												onChangePage={this.onChangePage}
												maxPages={20}
												pageSize={6}
												styles={customStyles}
											/>
										</div>
									</Grid>

									<Grid
										container
										className={classes.socialDiv}
									>
										<Grid
											lg={3}
											md={4}
											sm={3}
											xs={7}
											className={classes.categoryGrid}
										>
											<ModeCommentOutlined /> Topic
											<div className={classes.eventinfo}>
												{topic}
											</div>
										</Grid>
										<Grid lg={9} md={8} sm={9} xs={11}>
											<SocialMedia
												shareUrl={this.state.shareUrl}
												disabled={false}
												eventTitle={event_data.name}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									alignItems="center"
									className={classes.organizerDetails}
								>
									{/* <Avatar
									src="/images/icons/user.svg"
									style={{
										display: "inline-block",
										marginBottom: "10px",
									}}
								/> */}
									{this.state.loaded ? (
										<Link
											className={
												classes.organizerEventLink
											}
											to={`/allevents/organizer/${
												this.state.organizer &&
												urlFormatter(
													this.state.organizer
												)
											}/${event_data.owner.substr(
												event_data.owner.length - 4
											)}`}
										>
											{this.renderImage()}
											<h3 style={{ fontWeight: "bold" }}>
												{this.state.organizer}
											</h3>
											<Grid
												className={
													classes.organizerDescription
												}
											>
												{this.state.organizerDetails}
											</Grid>
											{/* <CheckUser
									blockChainEvent={this.state.blockChainEvent}
									disabledStatus={disabled}
									event_id={this.props.match.params.id}
									history={this.props.history}
								/> */}
										</Link>
									) : (
										<span>
											{this.renderImage()}
											<h3 style={{ fontWeight: "bold" }}>
												{this.state.organizer}
											</h3>
											<Grid
												className={
													classes.organizerDescription
												}
											>
												{this.state.organizerDetails}
											</Grid>
										</span>
									)}
								</Grid>

								<Snackbar
									anchorOrigin={{
										vertical: "top",
										horizontal: "center",
									}}
									open={this.state.allowBuySnackbar}
									onClose={this.handleCloseAllowBuySnackbar}
									message={this.state.SnackbarMessage}
									autoHideDuration={3000}
									key={"top" + "center"}
									className="snackbar"
								/>
							</Grid>
						);
					} else {
						body = <EventNotFound />;
					}
				} else {
					body = (
						// <div className="text-center mt-5">
						// 	<span role="img" aria-label="uncorn">
						// 		🦄
						// 	</span>{" "}
						// 	PhoenixDAO Event not found
						// </div>
						<EmptyState
							text={
								this.state.alternateEventLoading
									? this.state.alternateEventPresent
										? `Event doesn't exist on this Network... 😔\n This Event Exists on ${
												this.state
													.alternateEventPresent ==
													1 && "Ethereum"
										  } ${
												this.state
													.alternateEventPresent ==
													137 && "Matic"
										  } ${
												this.state
													.alternateEventPresent ==
													4 && "Rinkby"
										  }`
										: `Event doesn't exist... 😔\n Loading Events on other networks`
									: `Event doesn't exist... 😔`
							}
							btnText="Go to Dashboard"
							url="/allevents/1"
						/>
					);
				}
			}
		}
		// else {
		// 	body = (
		// 		<EmptyState
		// 			text="This Event doesn't exist!"
		// 			btnText="Go to Dashboard"
		// 			url="/allevents/1"
		// 		/>
		// 	);
		// }
		return (
			<div className="event-page-wrapper">
				<span className={classes.eventDescriptionFont}>{body}</span>
			</div>
		);
	}

	handleSetSelectedToken = async () => {
		if (this.props.tokensListContract) {
			if (this.props.userDetails && !this.state.isPHNX) {
				let defaultCurr =
					this.props.userDetails.result &&
					this.props.userDetails.result.result.userHldr
						.alternateCurrency;
				// console.log(
				// 	"defaultCurrny at EventPage",
				// 	this.props.tokensListContract
				// );
				if (typeof defaultCurr == "string") {
					if (defaultCurr === "Dollar" || defaultCurr === "usd") {
						this.props.tokensListContract.map((v, i) => {
							if (v.tokenName == "usd-coin") {
								this.setState({
									selectedToken:
										this.props.tokensListContract[i],
								});
							}
						});
					}
					if (defaultCurr === "") {
						this.props.tokensListContract.map((v, i) => {
							if (v.tokenName == "phoenixdao") {
								this.setState({
									selectedToken:
										this.props.tokensListContract[i],
								});
							}
						});
					}
				} else if (typeof defaultCurr == "object") {
					this.props.tokensListContract.map((v, i) => {
						if (v.tokenName == defaultCurr.tokenName) {
							// console.log("Heyyyyyyyyyyyyyyyyyyyyyyy1");
							this.setState({
								selectedToken: this.props.tokensListContract[i],
							});
						}
					});
				}
			} else {
				// console.log("Heyyyyyyyyyyyyyyyyyyyyyyy");
				this.props.tokensListContract.map((v, i) => {
					if (v.tokenName == "phoenixdao") {
						this.setState({
							selectedToken: this.props.tokensListContract[i],
						});
					}
				});
			}
		} else {
			this.setState({
				selectedToken: {
					displayName: "PhoenixDAO",
					image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147",
					tokenAddress:
						this.props.networkId == GLOBAL_NETWORK_ID
							? PhoenixDAO_Mainnet_Token_Address
							: PhoenixDAO_Testnet_Token_Address_2,
					tokenName: "phoenixdao",
				},
			});
		}
	};

	async componentDidMount() {
		// console.log(
		// 	"parseInt(this.props.match.params.id)",
		// 	parseInt(this.props.match.params.id)
		// );
		await this.loadEventFromBlockchain();
		// console.log(
		// 	"this.props.tokensListContract =??",
		// 	this.props.tokensListContract,
		// 	"this.props.userDetails tokensListContract =??",
		// 	this.props.userDetails
		// );

		await this.props.handleGetUserDetails();
		// await this.props.handleSetTokenListContract();
		// await this.handleSetSelectedToken();

		// console.log(
		// 	"this.props.tokensListContract =??",
		// 	this.props.tokensListContract,
		// 	"this.props.userDetails tokensListContract =??",
		// 	this.props.userDetails
		// );

		if (parseInt(this.props.match.params.id)) {
			this.getUserFavoritesEvent();
			// console.log("component start 1, Event page");
			let buyers = await generateBuyerArr(this.props.match.params.id);
			// console.log("component start 2, Event page", buyers);
			this.setState({ soldTicket: buyers });
			// await this.GetPrices();
			await this.getPhoenixDAOMarketValue();
			await this.checkBlockchainEvent();
			await this.loadEventFromBlockchain();
			await this.initApproveMethod();
			await this.checkUserTicketLocation();
			if (
				this.props.accounts[0] &&
				this.props.eventsAddress &&
				this.state.selectedToken.tokenAddress
			) {
				await this.allowance();
				// await CheckTokenAllowance(
				// 	this.props.accounts[0],
				// 	this.state.selectedToken.tokenAddress
				// );
				await this.checkUserBalance();
			}
			window.scroll({
				top: 0,
				behavior: "smooth",
			});
			this._isMounted = true;
			// this.updateIPFS();
			// this.loadblockhain();
		} else {
			this.setState({
				blockChainEvent: {},
				blockChainEventLoaded: true,
			});
		}
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

		// await this.checkUserTicketLocation();
		// let buyers = await generateBuyerArr(this.props.match.params.id);
		// this.setState({ soldTicket: buyers });
	}
	async componentDidUpdate(prevProps) {
		if (this.props.purchased !== prevProps.purchased) {
			await this.loadEventFromBlockchain();
			await this.checkUserTicketLocation();
			let buyers = await generateBuyerArr(this.props.match.params.id);
			this.setState({ soldTicket: buyers });
		}
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
