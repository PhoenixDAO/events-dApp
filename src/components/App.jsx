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
import Home from "./Home";
import Guide from "./Guide";
import FAQ from "./FAQ";
import FindEvents from "./FindEvents";
import PastEvents from "./PastEvents";
import MyTickets from "./MyTickets";
import CreateEvent from "./CreateEvent/";
import EditEvent from "./EditEvent";
import MyEvents from "./MyEvents";
import MyEventStat from "./MyEventStat";
import EventPage from "./EventPage";
import TopicLandingPage from "./TopicLandingPage";
import TopicsLandingPage from "./TopicsLandingPage";
import LocationLandingPage from "./LocationLandingPage";
import LocationsLandingPage from "./LocationsLandingPage";
import Calendars from "./Calendars";
import WrapperTopicsLandingPage from './WrapperTopicsLandingPage'
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
	GLOBAL_NETWORK_ID,
} from "../config/const.js";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";

import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Mainnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet.js";

import NetworkError from "./NetworkError";
import PageNotFound from "./PageNotFound";
import EmptyState from "./EmptyState";
import Favorites from "./Favorite.jsx";
import { getUserDetails } from "../config/serverAPIs";
import AccountDetail from "./account/index";

let ethereum = window.ethereum;
let web3 = window.web3;
const items = ["slide1.png", "slide2.png", "slide3.png", "slide4.png"];
const randomBG = items[Math.floor(Math.random() * items.length)];

class App extends Component {
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
		} catch (e) { }
		super(props);
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
			userDetails: {}
		};
		this.myRef = React.createRef();

		// this.contracts = context.drizzle.contracts;
		this.loadBlockchainData = this.loadBlockchainData.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.executeScroll = this.executeScroll.bind(this);
		this.initializeContract = this.initializeContract.bind(this);
	}
	async initializeContract() {
		try {
			const web3 = new Web3(
				new Web3.providers.WebsocketProvider(INFURA_WEB_URL)
				// window.ethereum
			);
			const openEvents = await new web3.eth.Contract(
				Open_events_ABI,
				Open_events_Address
			);
			const PHNX = await new web3.eth.Contract(
				PhoenixDAO_Testnet_Token_ABI,
				PhoenixDAO_Mainnet_Token_Address
			);
			console.log("contract initialized", openEvents, PHNX);
			this.setState({ eventsContract: openEvents, phnxContract: PHNX });
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
			console.log("accounts", accounts);
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

	getUserInfo = async (account, networkId) => {
		const userDetails = await getUserDetails({
			address: account,
			networkId: networkId,
		});
		console.log("user", userDetails);
		console.log("user details", userDetails);
		if (!userDetails.error) {
			console.log("user details", userDetails);
			this.setState({
				userDetails: userDetails,
			});
		} else {
		}
	};

	//Get Account
	async loadBlockchainData() {
		if (!window.ethereum || !window.ethereum.isMetaMask) {
			this.setState({
				errorMessage:
					"MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbarForNoMetaMask: true,
				openSnackbarForPendingRequest: false,
			});
		} else {
			if (typeof ethereum !== "undefined") {
				console.log("accounts I am here");
				// const a = await ethereum.enable();
				const a = ethereum.enable();
				console.log("accounts I am here2");
				web3 = new Web3(ethereum);
				const accounts = await web3.eth.getAccounts();
				console.log("accounts in loadBlockchainData", accounts);
				const check = localStorage.getItem("account");
				if (!check) {
					// window.location.reload();
					localStorage.setItem("account", true);
				}
			} else if (typeof web3 !== "undefined") {
				window.web3 = new Web3(web3.currentProvider);
			} else {
				window.web3 = new Web3(
					new Web3.providers.HttpProvider(INFURA_URL)
				);
			}
			window.ethereum.on("connect", function (accounts) { });
			window.ethereum.on("accountsChanged", function (accounts) {
				localStorage.removeItem("account");
				window.location.reload();
			});

			window.ethereum.on("networkChanged", function (netId) {
				window.location.reload();
			});
			const accounts = await web3.eth.getAccounts();


			this.setState({ account: accounts[0] });
			// console.log("getUserDetail account[0]",accounts[0],"getUserDetail networkId",GLOBAL_NETWORK_ID)

			if (accounts[0] && GLOBAL_NETWORK_ID) {
				const userDetails = await getUserDetails({
					address: accounts[0],
					networkId: GLOBAL_NETWORK_ID,
				});
				if (!userDetails.error) {
					console.log("user details", userDetails);
					this.setState({
						userDetails: userDetails,
					});
				} else {
				}
			}
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
	inquireBuy = (id, fee, token, openEvents_address, buyticket, approve) => {
		if (
			this.state.account.length !== 0 &&
			this.props.web3.networkId === GLOBAL_NETWORK_ID
		) {
			this.setState({ disabledStatus: true });
			this.setState(
				{
					// fee: fee,
					// token: token,
					buyticket: buyticket,
					approve: approve,
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
							toast(
								<Notify
									hash={txreceiptApproved.transactionHash}
									text="Ticket purchase successfull!"
									icon="fa-ticket-alt"
									link="Check out your TICKET here"
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
			let a = await this.state.phnxContract.methods
				.allowance(this.state.account,Open_events_Address )
				.call();
			return a;
		}
	};

	//Buy Function, Notify listen for transaction status.
	buy = async () => {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		if ((await this.allowance()) == 0) {
			console.log("in buy function giving allowance");
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
							this.setState({ disabledStatus: false });
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
							toast(
								<Notify
									hash={txreceipt.transactionHash}
									text="Ticket purchase successfull!"
									icon="fa fa-ticket-alt fa-3x"
									link="Check out your TICKET here"
									url="/mytickets/1"
									color="#413AE2"
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
							this.setState({ disabledStatus: false });
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

	render() {
		let body;
		let connecting = false;

		// uncomment this for test

		// if( !this.props.drizzleStatus.initialized || this.props.web3.status === "failed" ||
		// 	(this.props.web3.status === "initialized" && Object.keys(this.props.accounts).length === 0) ||
		// 	this.props.web3.networkId != GLOBAL_NETWORK_ID) {

		//condition when drizzle is not initialized
		if (!this.props.drizzleStatus.initialized) {
			console.log("I am in this condition")

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
							path="/event/:page/:id"
							render={(props) => (
								<EventPage
									{...props}
									inquire={this.inquireBuy}
									disabledStatus={this.state.disabledStatus}
									toggleDisabling={this.toggleDisabling}
									eventsContract={this.state.eventsContract}
									phnxContract={this.state.phnxContract}
								/>
							)}
						/>
						<Route
							exact
							path="/topics"
							//  component={TopicsLandingPage}
							component={(props) => (
								<TopicsLandingPage
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
			this.props.web3.networkId != GLOBAL_NETWORK_ID
		) {
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
								<TopicsLandingPage
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
							/>
						)}
					/>

					{/* 
					<Route
						exact
						path="/pastevents/:page"
						render={(props) => (
							<PastEvents
								{...props}
								executeScroll={this.executeScroll}
							/>
						)}
					/>
				

					
					<Route
						exact
						path="/editevent"
						render={(props) => (
							<EditEvent
								{...props}
								executeScroll={this.executeScroll}
								passtransaction={this.passtransaction}
								createNewEvent={this.createNewEvent}
								upload={this.state.upload}
								disabledStatus={this.state.disabledStatus}
								done={this.state.done}
								toggleDisabling={this.toggleDisabling}
								error={this.state.error}
								account={this.state.account}
							/>
						)}
					/>

					
					<Route
						exact
						path="/event-stat/:page/:id"
						render={(props) => (
							<MyEventStat
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
							/>
						)}
					/> */}
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
						path="/event/:page/:id"
						render={(props) => (
							<EventPage
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
								eventsContract={this.state.eventsContract}
								phnxContract={this.state.phnxContract}
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
					<Route path="/confirm-purchase" exact component={ConfirmPurchase} />
					<Route path="*" exact component={PageNotFound} />
				</Switch>
			);
		}

		return (
			<Router>
				<div id="wrapper" className="toggled" ref={this.myRef}>
					<Sidebar
						connection={!connecting}
						account={this.state.account}
						connect={this.loadBlockchainData}
						userDetails={this.state.userDetails}
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
