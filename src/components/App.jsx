import React, { Component, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { drizzleConnect } from "drizzle-react";
import { ToastContainer, toast } from "react-toastify";
import Web3 from "web3";

import "bootstrap/dist/css/bootstrap.min.css";
import "startbootstrap-simple-sidebar/css/simple-sidebar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/main.css";
import AnalyticsWrapper from "../components/AnalyticsWrapper";
import Sidebar from "./Sidebar";
import Guide from "./Guide";
import FAQ from "./FAQ";
import FindEvents from "./FindEvents";
import MyTickets from "./MyTickets";
import CreateEvent from "./CreateEvent/";
import EditEvent from "./EditEvent";
import MyEvents from "./MyEvents";
import EventPage from "./EventPage";
import TopicLandingPage from "./TopicLandingPage";
import Calendars from "./Calendars";
import WrapperTopicsLandingPage from "./WrapperTopicsLandingPage";
import ConfirmPurchase from "./ConfirmPurchase";
import Token from "./Token";
// import Dashboard from "./Dashboard";
import Terms from "./Terms";
import Notify from "./Notify";
import PropTypes from "prop-types";
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";
import {
	INFURA_URL,
	INFURA_WEB_URL,
	INFURA_URL_2,
	INFURA_WEB_URL_2,
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
} from "../config/const.js";

import {
	Open_events_ABI,
	Open_events_Address,
	Open_events_Address_2,
} from "../config/OpenEvents";

import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Mainnet_Token_Address,
	PhoenixDAO_Testnet_Token_Address_2,
} from "../config/phoenixDAOcontract_testnet.js";

import NetworkError from "./NetworkError";
import PageNotFound from "./PageNotFound";
import EmptyState from "./EmptyState";
import Favorites from "./Favorite.jsx";
import {
	getUserDetails,
	updateUserDetails,
	getMessage,
	loginWithMetaMask,
} from "../config/serverAPIs";
import AccountDetail from "./account/index";
import BuyTicket from "./common/BuyTicket";
import SkeletonEvent from "./common/SkeletonEvent";
import IdentityForm from "./common/AvatarSelector/identityform";
import DialogueBox from "./common/DialogueBox";

let ethereum = window.ethereum;
let web3 = window.web3;
const items = ["slide1.png", "slide2.png", "slide3.png", "slide4.png"];
const randomBG = items[Math.floor(Math.random() * items.length)];

class App extends Component {
	constructor(props, context) {
		super(props);
		console.log("context", context);
		this.contractAddressProviders().then((data) => {
			console.log(
				"eventAddress, phoenixAddress constructor",
				context,
				data.eventAddress,
				data.phoenixAddress
			);
			var contractConfig = {
				contractName: "PHNX",
				web3Contract:
					new context.drizzle.options.web3.customProvider.eth.Contract(
						PhoenixDAO_Testnet_Token_ABI,
						data.phoenixAddress
					),
			};
			context.drizzle.addContract(contractConfig);
		});

		this.state = {
			sent_tx: [],
			showSidebar: true,
			account: "",
			id: "",
			fee: "",
			token: "",
			openEvents_Address: "",
			buyticket: "",
			approve: "",
			createEvent: "",
			upload: false,
			done: false,
			error: false,
			afterApprove: false,
			getPhoenixDAO: "",
			openSnackbarForNoMetaMask: false,
			openSnackbarForPendingRequest: false,
			disabledStatus: false,
			eventsContract: {},
			userDetails: {},
			purchased: false,
			open: false,
			avatar: "",
			nextForm: false,
			name: "Bennu",
			avatarNumber: 0,
			avatarCustom: false,
			open2: false,
			eventsAddress:""
		};
		this.myRef = React.createRef();

		// this.contracts = context.drizzle.contracts;
		this.loadBlockchainData = this.loadBlockchainData.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.executeScroll = this.executeScroll.bind(this);
		this.initializeContract = this.initializeContract.bind(this);
	}

	async contractAddressProviders() {
		let eventAddress = "";
		let phoenixAddress = "";
		const networkId = await this.getNetworkId();
		console.log("This called networkId", networkId);
		if (networkId === GLOBAL_NETWORK_ID) {
			eventAddress = Open_events_Address;
			phoenixAddress = PhoenixDAO_Mainnet_Token_Address;
		} else if (networkId === GLOBAL_NETWORK_ID_2) {
			eventAddress = Open_events_Address_2;
			phoenixAddress = PhoenixDAO_Testnet_Token_Address_2;
		} else {
			console.log("Wrong network address | not supported");
		}
		console.log(
			"eventAddress, phoenixAddress",
			eventAddress,
			phoenixAddress
		);
		return { eventAddress, phoenixAddress };
	}

	async getNetworkId() {
		try {
			if (window.ethereum && window.ethereum.isMetaMask) {
				web3 = new Web3(ethereum);
			} else if (typeof web3 !== "undefined") {
				web3 = new Web3(web3.currentProvider);
			} else {
				const network = await web3.eth.net.getId();
				let infura;
				if (network === GLOBAL_NETWORK_ID) {
					infura = INFURA_URL;
				} else if (network === GLOBAL_NETWORK_ID_2) {
					infura = INFURA_URL_2;
				}
				web3 = new Web3(new Web3.providers.HttpProvider(infura));
			}
			const networkId = await web3.eth.net.getId();
			console.log("This called getNetworkId", networkId);
			if (networkId === GLOBAL_NETWORK_ID) {
				return networkId;
			} else if (networkId === GLOBAL_NETWORK_ID_2) {
				return networkId;
			} else {
				console.log("network id not suported");
			}
			return null;
		} catch (err) {
			console.log("err", err);
		}
	}
	async initializeContract() {
		try {
			const web3 = new Web3(
				// new Web3.providers.WebsocketProvider(INFURA_WEB_URL)
				window.ethereum
			);
			const { eventAddress, phoenixAddress } =
				await this.contractAddressProviders();
			console.log(
				"eventAddress, phoenixAddress, initializeContract",
				eventAddress,
				phoenixAddress
			);

			const openEvents = await new web3.eth.Contract(
				Open_events_ABI,
				eventAddress
			);
			const PHNX = await new web3.eth.Contract(
				PhoenixDAO_Testnet_Token_ABI,
				phoenixAddress
			);
			this.setState({ eventsContract: openEvents, phnxContract: PHNX, eventsAddress:eventAddress });
		} catch (err) {
			console.log("error initializing the contract", err);
		}
	}

	async componentWillMount() {
		await this.initializeContract();
	}
	async componentDidMount() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			web3 = new Web3(ethereum);
			const accounts = await web3.eth.getAccounts();
			if (accounts.length == 0) {
				localStorage.removeItem("account");
			}
		}
		await this.loadBlockchainData();
	}

	componentWillUpdate() {
		let sent_tx = this.state.sent_tx;
		for (let i = 0; i < this.props.transactionStack.length; i++) {
			if (sent_tx.indexOf(this.props.transactionStack[i]) === -1) {
				sent_tx.push(this.props.transactionStack[i]);
			}
		}

		if (sent_tx.length !== this.state.sent_tx.length) {
			this.setState({
				sent_tx: sent_tx,
			});
		}
	}

	// getUserInfo = async (account, networkId) => {
	// 	const userDetails = await getUserDetails({
	// 		address: account,
	// 		networkId: networkId,
	// 	});

	// 	if (!userDetails.error) {
	// 		this.setState({
	// 			userDetails: userDetails,
	// 		});
	// 	} else {
	// 	}
	// };

	handleClose2 = () => {
		this.setState({ open2: false, purchased: false });
	};

	//Get Account
	async loadBlockchainData() {
		try {
			if (!window.ethereum || !window.ethereum.isMetaMask) {
				this.setState({
					errorMessage:
						"MetaMask is not installed. Please install MetaMask to continue !",
					openSnackbarForNoMetaMask: true,
					openSnackbarForPendingRequest: false,
				});
			} else {
				if (typeof ethereum !== "undefined") {
					// const a = await ethereum.enable();
					const a = ethereum.enable();
					web3 = new Web3(ethereum);
					const accounts = await web3.eth.getAccounts();
					const check = localStorage.getItem("account");
					if (!check) {
						// window.location.reload();
						localStorage.setItem("account", true);
					}
				} else if (typeof web3 !== "undefined") {
					window.web3 = new Web3(web3.currentProvider);
				} else {
					const network = this.getNetworkId();
					let infura;
					if (network === GLOBAL_NETWORK_ID) {
						infura = INFURA_URL;
					} else if (network === GLOBAL_NETWORK_ID_2) {
						infura = INFURA_URL_2;
					}

					window.web3 = new Web3(
						new Web3.providers.HttpProvider(infura)
					);
				}
				window.ethereum.on("connect", function (accounts) {});
				window.ethereum.on("accountsChanged", function (accounts) {
					localStorage.removeItem("account");
					window.location.reload();
				});

				window.ethereum.on("networkChanged", function (netId) {
					window.location.reload();
				});
				const accounts = await web3.eth.getAccounts();

				this.setState({ account: accounts[0] });
				const networkId = await this.getNetworkId();
				if (accounts[0] && networkId) {
					const token = localStorage.getItem("AUTH_TOKEN");
					if (token) {
						const userChecker = await getUserDetails({
							address: accounts[0],
							networkId: networkId,
						});
						console.log("userChecker", userChecker);
						if (!userChecker.error) {
							this.setState({
								userDetails: userChecker,
								open: userChecker.result.result.userHldr
									.firstTime,
							});
							return;
						}
					}
					const userDetails = await this.authMetaMask();
					if (!userDetails.error) {
						console.log("userDetails", userDetails);
						this.setState({
							userDetails: userDetails,
							open: userDetails.result.result.userHldr.firstTime,
						});
						localStorage.setItem(
							"AUTH_TOKEN",
							userDetails.result.result.token
						);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
	async connectToMetaMask() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);
			try {
				const a = await window.ethereum.enable();
			} catch (e) {
				if ((e.code = -32002)) {
					this.setState({
						errorMessage:
							"Connection request already pending. Please check MetaMask !",
						openSnackbarForNoMetaMask: false,
						openSnackbarForPendingRequest: true,
					});
				}
			}
		} else {
			this.setState({
				errorMessage:
					"MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbarForNoMetaMask: true,
				openSnackbarForPendingRequest: false,
			});
		}
	}
	handleSnackbarClose = (number) => {
		if (number == 1) {
			this.setState({ openSnackbarForNoMetaMask: false });
		} else {
			this.setState({ openSnackbarForPendingRequest: false });
		}
	};

	//get value from buyer/from child components
	inquireBuy = async (
		id,
		fee,
		token,
		openEvents_address,
		buyticket,
		approve,
		eventTime,
		eventDate,
		eventEndDate,
		image,
		name,
		phnx_price,
		dollar_price
	) => {
		let chainId = await this.getNetworkId();
		if (
			this.state.account.length !== 0 &&
			this.props.web3.networkId === (await this.getNetworkId())
		) {
			this.setState({ disabledStatus: true });
			this.setState(
				{
					// fee: fee,
					// token: token,
					buyticket: buyticket,
					approve: approve,
					eventTime,
					eventDate,
					eventEndDate,
					image,
					name,
					phnx_price,
					dollar_price,
				},
				() => this.buy()
			);
		} else {
			toast(
				<Notify text="😓 Wrong Network, Please Connect to Rinkeby Network." />,
				{
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				}
			);
		}
	};

	//TransferFrom when buying with PhoenixDAO
	//After Approval
	afterApprove = () =>
		setTimeout(() => {
			let txreceiptApproved = "";
			let txconfirmedApproved = "";
			let txerror = "";
			this.state.buyticket
				.send({ from: this.state.account })
				.on("transactionHash", (hash) => {
					if (hash !== null) {
						this.setState({ disabledStatus: true });

						toast(
							<Notify
								hash={hash}
								text="Preparing your ticket...🚀"
								icon="fa fa-ticket-alt"
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
							// toast(
							// 	<Notify
							// 		hash={txreceiptApproved.transactionHash}
							// 		text="Ticket purchase successful!"
							// 		icon="fa-ticket-alt"
							// 		link="Check out your TICKET here"
							// 	/>,
							// 	{
							// 		position: "bottom-right",
							// 		autoClose: true,
							// 		pauseOnHover: true,
							// 	}
							// );
							this.setState({
								disabledStatus: false,
								purchased: true,
							});
						}
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						toast(
							<Notify error={error} message={txerror.message} />,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
					}
				});
			this.setState({ afterApprove: false });
			this.setState({ disabledStatus: false });
		}, 2000);

	allowance = async () => {
		if (this.state.account) {
			const { eventAddress, phoenixAddress } =
				await this.contractAddressProviders();
			let a = await this.state.phnxContract.methods
				.allowance(this.state.account, eventAddress)
				.call();

				console.log("allowance",a);
			return a;
		}
	};

	//Buy Function, Notify listen for transaction status.
	buy = async () => {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		if ((await this.allowance()) == 0) {
			this.state.approve
				.send({ from: this.state.account })
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
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber == 1) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;
						if (txconfirmed == 0 && txreceipt.status == true) {
							toast(
								<Notify
									text={
										"Transaction successfull!\nYou can buy a ticket now."
									}
									icon="fas fa-check-circle fa-3x"
									color="#413AE2"
									hash={txreceipt.transactionHash}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
							this.afterApprove();
							console.log("purchased", this.state.purchased);

							this.setState({
								disabledStatus: false,
								purchased: true,
							});
						}
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						toast(
							<Notify error={error} message={txerror.message} />,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
						this.setState({ disabledStatus: false });
					}
				});
		} else {
			this.state.buyticket
				.send({ from: this.state.account })
				.on("transactionHash", (hash) => {
					if (hash !== null) {
						toast(
							<Notify
								hash={hash}
								text="Preparing your ticket...🚀"
								icon="fa fa-ticket-alt fa-3x"
								color="#413AE2"
							/>,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
					}
					let intervalVar = setInterval(async () => {
						let receipt = await web3.eth.getTransactionReceipt(
							hash
						);
						if (receipt) {
							this.setState({
								disabledStatus: false,
								purchased: true,
							});
							console.log("purchased", this.state.purchased);

							clearInterval(intervalVar);
						}
					}, 5000);
				})
				// .on("confirmation", (confirmationNumber, receipt) => {
				// 	if (confirmationNumber == 1) {
				// 		txreceipt = receipt;
				// 		txconfirmed = confirmationNumber;
				// 		if (txconfirmed == 0 && txreceipt.status == true) {
				// 			toast(
				// 				<Notify
				// 					hash={txreceipt.transactionHash}
				// 					text="Ticket purchase successfull!"
				// 					icon="fa fa-ticket-alt fa-3x"
				// 					link="Check out your TICKET here"
				// 					url="/mytickets/1"
				// 					color="#413AE2"
				// 				/>,
				// 				{
				// 					position: "bottom-right",
				// 					autoClose: true,
				// 					pauseOnHover: true,
				// 				}
				// 			);
				// 			this.setState({ disabledStatus: false });
				// 		}
				// 	}
				// })
				.on("error", (error) => {
					console.log("error", error);
					if (error !== null) {
						txerror = error;
						toast(
							<Notify error={error} message={txerror.message} />,
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

	//Get Value form Event Creator from child component
	//Notify,listen for transaction status.
	passtransaction = (transaction, type) => {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		this.setState({ disabledStatus: true });
		this.setState({ upload: true, createEvent: transaction }, () =>
			this.state.createEvent
				.send({ from: this.state.account })
				.on("transactionHash", (hash) => {
					if (hash !== null) {
						this.setState({
							upload: false,
							done: true,
						});
						toast(
							<Notify
								icon="fas fa-edit"
								hash={hash}
								text={
									(type === "create"
										? "Creating"
										: "Updating") + "your Event..."
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
					if (confirmationNumber == 1) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;
						if (txconfirmed == 1 && txreceipt.status == true) {
							toast(
								<Notify
									hash={txreceipt.transactionHash}
									createdEvent={
										type === "create"
											? txreceipt.events.CreatedEvent
													.returnValues
											: txreceipt.events
													.NewAndUpdatedEvent
													.returnValues
									}
									color="#413AE2"
									icon="fas fa-check-circle fa-3x"
									link="checkout your event here"
									text="Transaction success!"
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
						}
						this.setState({ disabledStatus: false });
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						this.setState({ error: true });
						toast(
							<Notify error={error} message={txerror.message} />,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
					}
					this.setState({ disabledStatus: false });
				})
		);
	};
	toggleDisabling = () => {
		this.setState({ disabledStatus: !this.state.disabledStatus });
	};
	togglePurchase = () => {
		this.setState({ purchased: false });
	};
	getPhoenixDAO = (getPhoenixDAO) => {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";

		this.setState({ getPhoenixDAO: getPhoenixDAO }, () =>
			this.state.getPhoenixDAO
				.send({ from: this.state.account })

				.on("transactionHash", (hash) => {
					if (hash !== null) {
						this.setState({
							upload: false,
							done: true,
						});
						toast(
							<Notify
								hash={hash}
								text={
									"Request for 10,000 PHNX\nYour token request has been sent"
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
						txreceipt = receipt;
						txconfirmed = confirmationNumber;

						if (txconfirmed == 0 && txreceipt.status == true) {
							toast(
								<Notify
									text="10,000 PHNX recieved! Check your balance here."
									hash={txreceipt.transactionHash}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
						}
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						this.setState({ error: true });
						toast(
							<Notify error={error} message={txerror.message} />,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
					}
				})
		);
	};
	createNewEvent = () => {
		this.setState(
			{
				error: false,
				done: false,
				upload: false,
			},
			() => console.log()
		);
	};
	// handleSnackbarClose = () => {
	// 	this.setState({ openSnackbar: false });
	// };
	executeScroll = () => {
		if (this.myRef.current) this.myRef.current.scrollIntoView();
	};

	handleName = (value) => {
		this.setState({ name: value });
	};

	handleAvatar = (value) => {
		this.setState({ avatar: value });
	};

	handleCustomAvatar = (value) => {
		this.setState({ avatarCustom: value });
	};

	handleClose = () => {
		this.setState({
			nextForm: false,
			open: false,
		});
	};

	handleAvatarNumber = (value) => {
		this.setState({ avatarNumber: value });
	};

	handleNextForm = (value) => {
		this.setState({ nextForm: value });
	};

	updateUserInfo = async (e) => {
		console.log("Working");
		const detail = await updateUserDetails({
			address: this.props.accounts["0"],
			networkId: this.props.web3.networkId,
			name: this.state.name, //we need to change this when the design is finalised
			avatarCustom: this.state.avatarCustom, //we need to change this when the design is finalised
			avatarNumber: this.state.avatarNumber, //we need to change this when the design is finalised
			avatar: this.state.avatar,
		});
		if (detail.error) {
			console.log("error occured");
		} else {
			window.location.reload();
		}
	};

	authMetaMask = async () => {
		try {
			const publicAddress = await web3.eth.getAccounts();
			const networkId = await this.getNetworkId();
			console.log("Public address", publicAddress);
			console.log("networkId", networkId);
			const message = await getMessage();
			const sign = await this.handleSignMessage(
				publicAddress[0],
				message.result.result
			);
			const userData = await loginWithMetaMask({
				publicAddress: publicAddress[0],
				networkId: networkId,
				signature: sign,
				message: message.result.result,
			});
			return userData;
		} catch (err) {
			console.log(err);
		}
	};

	handleSignMessage = async (publicAddress, message) => {
		try {
			console.log("message", message);
			const sign = await web3.eth.sign(
				web3.utils.sha3(message),
				publicAddress
			);
			console.log("sign", sign);
			return sign;
		} catch (err) {
			console.log(err);
		}
	};

	setUserDetails = (userDetails) => {
		console.log("userDetails", userDetails);
		this.setState({
			userDetails: userDetails,
		});
	};
	render() {
		let body;
		let connecting = false;

		// uncomment this for test

		// if( !this.props.drizzleStatus.initialized || this.props.web3.status === "failed" ||
		// 	(this.props.web3.status === "initialized" && Object.keys(this.props.accounts).length === 0) ||
		// 	this.props.web3.networkId != GLOBAL_NETWORK_ID) {

		//condition when drizzle is not initialized
		console.log("Im in !this.props.drizzleStatus.initialized ",(this.props.web3.networkId != GLOBAL_NETWORK_ID && this.props.web3.networkId != GLOBAL_NETWORK_ID_2))

		if (!this.props.drizzleStatus.initialized || (this.props.web3.networkId != GLOBAL_NETWORK_ID && this.props.web3.networkId != GLOBAL_NETWORK_ID_2)) {
			body = (
				<div>
					<Switch>
						<Route
							exact
							path="/"
							component={(props) => (
								<FindEvents
									{...props}
									executeScroll={this.executeScroll}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
						<Route
							path="/confirm-purchase"
							exact
							component={ConfirmPurchase}
						/>
						<Route
							exact
							path="/upcomingevents/:page"
							render={(props) => (
								<FindEvents
									{...props}
									executeScroll={this.executeScroll}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
						<Route
							exact
							path="/event/:id"
							render={(props) => (
								<EventPage
									{...props}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
									phnxContract={this.state.phnxContract}
									purchased={this.state.purchased}
									togglePurchase={this.togglePurchase}
									eventsAddress={this.state.eventsAddress}
								/>
							)}
						/>
						<Route
							exact
							path="/topics"
							//  component={TopicsLandingPage}
							component={(props) => (
								<WrapperTopicsLandingPage
									{...props}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
						<Route
							exact
							path="/topic/:page/:id"
							render={(props) => (
								<TopicLandingPage
									{...props}
									disabledStatus={this.state.disabledStatus}
									inquire={this.inquireBuy}
								/>
							)}
						/>
						<Route
							exact
							path="/guide"
							component={(props) => (
								<Guide
									{...props}
									executeScroll={this.executeScroll}
								/>
							)}
						/>
						<Route
							exact
							path="/faq"
							component={(props) => (
								<FAQ
									{...props}
									executeScroll={this.executeScroll}
								/>
							)}
						/>
						<Route
							exact
							path="/terms-and-conditions"
							render={(props) => (
								<Terms executeScroll={this.executeScroll} />
							)}
						/>
						<Route path="*" exact component={PageNotFound} />
					</Switch>
				</div>
			);
			connecting = true;
		} else if (this.props.web3.status === "failed") {
			body = (
				<div>
					<Switch>
						<Route
							exact
							path="/"
							component={(props) => (
								<FindEvents
									{...props}
									executeScroll={this.executeScroll}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
						<Route component={NetworkError} />
					</Switch>
				</div>
			);
			connecting = true;
		} else if (
			(this.props.web3.status === "initialized" &&
				Object.keys(this.props.accounts).length === 0) ||
			(this.props.web3.networkId != GLOBAL_NETWORK_ID &&
				this.props.web3.networkId != GLOBAL_NETWORK_ID_2)
		) {
			console.log("third else if", this.props.web3.networkId);
			body = (
				<div>
					<Switch>
						<Route
							path="/"
							component={(props) => (
								<FindEvents
									{...props}
									executeScroll={this.executeScroll}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
						<Route
							exact
							path="/topics"
							//  component={TopicsLandingPage}
							component={(props) => (
								<WrapperTopicsLandingPage
									{...props}
									eventsContract={this.state.eventsContract}
								/>
							)}
						/>
					</Switch>
				</div>
			);
		}

		// uncomment this for test

		// 	body = (
		// 		<div>
		// 			<Switch>
		// 			<Route
		// 				exact
		// 				path="/"
		// 				render={(props) => (
		// 					<FindEvents
		// 						{...props}
		// 						executeScroll={this.executeScroll}
		// 						inquire={this.inquireBuy}
		// 						disabledStatus={this.state.disabledStatus}
		// 						toggleDisabling={this.toggleDisabling}
		// 					/>
		// 				)}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/upcomingevents/:page"
		// 				render={(props) => (
		// 					<FindEvents
		// 						{...props}
		// 						executeScroll={this.executeScroll}
		// 						inquire={this.inquireBuy}
		// 						disabledStatus={this.state.disabledStatus}
		// 						toggleDisabling={this.toggleDisabling}
		// 					/>
		// 				)}
		// 			/>

		// 			<Route
		// 				exact
		// 				path="/event/:page/:id"
		// 				render={(props) => (
		// 					<EventPage
		// 						{...props}
		// 						inquire={this.inquireBuy}
		// 						disabledStatus={this.state.disabledStatus}
		// 						toggleDisabling={this.toggleDisabling}
		// 					/>
		// 				)}
		// 			/>

		// 			<Route
		// 				exact
		// 				path="/topics"
		// 				//  component={TopicsLandingPage}
		// 				component={(props) => <TopicsLandingPage {...props} />}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/topic/:page/:id"
		// 				render={(props) => (
		// 					<TopicLandingPage
		// 						{...props}
		// 						disabledStatus={this.state.disabledStatus}
		// 						inquire={this.inquireBuy}
		// 					/>
		// 				)}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/locations"
		// 				component={LocationsLandingPage}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/location/:page"
		// 				component={LocationLandingPage}
		// 			/>

		// 			<Route
		// 				exact
		// 				path="/guide"
		// 				component={(props) => (
		// 					<Guide
		// 						{...props}
		// 						executeScroll={this.executeScroll}
		// 					/>
		// 				)}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/faq"
		// 				component={(props) => (
		// 					<FAQ
		// 						{...props}
		// 						executeScroll={this.executeScroll}
		// 					/>
		// 				)}
		// 			/>
		// 			<Route
		// 				exact
		// 				path="/terms-and-conditions"
		// 				render={(props) => (
		// 					<Terms executeScroll={this.executeScroll} />
		// 				)}
		// 			/>
		// 			<Route path="*" exact component={PageNotFound} />
		// 		</Switch>

		// 		</div>
		// 	);
		// 	connecting = true;
		// }
		else {
			body = (
				<Switch>
					<Route
						exact
						path="/"
						render={(props) => (
							<FindEvents
								{...props}
								executeScroll={this.executeScroll}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/upcomingevents/:page"
						render={(props) => (
							<FindEvents
								{...props}
								executeScroll={this.executeScroll}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/favorite/:page"
						render={(props) => (
							<Favorites
								{...props}
								executeScroll={this.executeScroll}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
							/>
						)}
					/>
					<Route
						exact
						path="/mytickets/:page"
						render={(props) => (
							<MyTickets
								{...props}
								executeScroll={this.executeScroll}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/createevent"
						render={(props) => (
							<CreateEvent
								{...props}
								executeScroll={this.executeScroll}
								passtransaction={this.passtransaction}
								createNewEvent={this.createNewEvent}
								upload={this.state.upload}
								disabledStatus={this.state.disabledStatus}
								done={this.state.done}
								error={this.state.error}
								account={this.state.account}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>

					<Route
						exact
						path="/accountdetails"
						render={(props) => (
							<AccountDetail
								{...props}
								account={this.state.account}
								executeScroll={this.executeScroll}
								eventsContract={this.state.eventsContract}
								userDetails={this.state.userDetails}
								setUserDetails={this.setUserDetails}
							/>
						)}
					/>
					<Route
						exact
						path="/myevents/:page"
						render={(props) => (
							<MyEvents
								{...props}
								executeScroll={this.executeScroll}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
							/>
						)}
					/>
					<Route
						exact
						path="/event/:id"
						render={(props) => (
							<EventPage
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
								eventsContract={this.state.eventsContract}
								phnxContract={this.state.phnxContract}
								purchased={this.state.purchased}
								togglePurchase={this.togglePurchase}
								eventsAddress={this.state.eventsAddress}

							/>
						)}
					/>
					<Route
						exact
						path="/calendar"
						render={(props) => (
							<Calendars
								{...props}
								executeScroll={this.executeScroll}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/analytics"
						render={(props) => (
							<AnalyticsWrapper
								{...props}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/topic/:page/:id"
						render={(props) => (
							<TopicLandingPage
								{...props}
								disabledStatus={this.state.disabledStatus}
								inquire={this.inquireBuy}
							/>
						)}
					/>
					<Route
						exact
						path="/topics"
						//  component={TopicsLandingPage}
						component={(props) => (
							<WrapperTopicsLandingPage
								{...props}
								eventsContract={this.state.eventsContract}
							/>
						)}
					/>
					<Route
						exact
						path="/favorites"
						component={Favorites}
						executeScroll={this.executeScroll}
						inquire={this.inquireBuy}
						disabledStatus={this.state.disabledStatus}
						toggleDisabling={this.toggleDisabling}
					/>
					{/* <Route
						exact
						path="/token"
						render={(props) => (
							<Token
								{...props}
								getPhoenixDAO={this.getPhoenixDAO}
							/>
						)}
					/>
					
				
					<Route
						exact
						path="/locations"
						component={LocationsLandingPage}
					/>
					<Route
						exact
						path="/location/:page"
						component={LocationLandingPage}
					/>
					*/}

					<Route
						exact
						path="/guide"
						component={(props) => (
							<Guide
								{...props}
								executeScroll={this.executeScroll}
							/>
						)}
					/>
					<Route
						exact
						path="/faq"
						component={(props) => (
							<FAQ
								{...props}
								executeScroll={this.executeScroll}
							/>
						)}
					/>
					<Route
						exact
						path="/terms-and-conditions"
						render={(props) => (
							<Terms executeScroll={this.executeScroll} />
						)}
					/>
					{/* <Route path="*" exact component={EmptyState} /> */}
					<Route
						path="/confirm-purchase"
						exact
						component={ConfirmPurchase}
					/>
					<Route path="/skull" exact component={SkeletonEvent} />
					<Route path="*" exact component={PageNotFound} />
				</Switch>
			);
		}

		return (
			<Router>
				<div id="wrapper" className="toggled" ref={this.myRef}>
					<BuyTicket
						open={this.state.purchased}
						handleClose={this.handleClose2}
						image={this.state.image}
						eventTitle={this.state.name}
						price={this.state.priceGrid}
						purchased={this.state.purchased}
						eventTime={this.state.eventTime}
						eventDate={this.state.eventDate}
						eventEndDate={this.state.eventEndDate}
						phnx_price={this.state.phnx_price}
						dollar_price={this.state.dollar_price}
					/>
					<Sidebar
						connection={!connecting}
						account={this.state.account}
						connect={this.loadBlockchainData}
						userDetails={this.state.userDetails}
						status={this.props.drizzleStatus.initialized}
					/>
					<div id="page-content-wrapper" className="sidebar-open">
						{/* <div
							id="bgImage"
							ref="bgImage"
							style={{
								backgroundImage:
									"url(/images/slides/" + randomBG + ")",
							}}
						/>
						<div className="branding">
							<img
								src="/images/PhoenixDAO.png"
								className="branding-logo"
								alt="PhoenixDAO logo"
							/>
							<h1>PhoenixDAO Events Marketplace</h1>
							<p>What are you going to do?</p>
						</div> */}
						<div className="page-wrapper-inner">
							<div className="container">
								<div className="retract-page-inner-wrapper">
									{body}
									{console.log(
										"Account",
										this.props.accounts
									)}
								</div>
								{/* <Snackbar
									open={this.state.openSnackbar}
									message={
										"MetaMask is not installed. Please install MetaMask to continue !"
									}
									handleClose={this.handleSnackbarClose}
								/> */}
								<Snackbar
									open={this.state.openSnackbarForNoMetaMask}
									message={this.state.errorMessage}
									handleClose={() =>
										this.handleSnackbarClose(1)
									}
								/>
								<Snackbar2
									style={{ zIndex: "9999999 !important" }}
									open={
										this.state.openSnackbarForPendingRequest
									}
									message={this.state.errorMessage}
									handleClose={() =>
										this.handleSnackbarClose(2)
									}
								/>
								{console.log(
									"this.state.open",
									this.state.open
								)}
								<DialogueBox
									open={this.state.open}
									handleClose={this.handleClose}
									maxWidth="sm"
								>
									<IdentityForm
										setNextForm={this.handleNextForm}
										// goBack={props.goBack}
										nextForm={this.state.nextForm}
										name={this.state.name}
										avatarNumber={this.state.avatarNumber}
										avatarCustom={this.state.avatarCustom}
										handleName={this.handleName}
										handleAvatar={this.handleAvatar}
										handleCustomAvatar={
											this.handleCustomAvatar
										}
										handleClose={this.handleClose}
										handleAvatarNumber={
											this.handleAvatarNumber
										}
										updateUserInfo={this.updateUserInfo}
										origin={"App"}
									/>
								</DialogueBox>
							</div>
						</div>
					</div>
					<ToastContainer />
				</div>
			</Router>
		);
	}
}
App.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		drizzleStatus: state.drizzleStatus,
		web3: state.web3,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		transactions: state.transactions,
		// contracts: state.contracts,
	};
};

const AppContainer = drizzleConnect(App, mapStateToProps);
export default AppContainer;
