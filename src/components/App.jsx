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
import Analytics from "../components/Analytics";
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
import Token from "./Token";
// import Dashboard from "./Dashboard";
import Terms from "./Terms";
import Notify from "./Notify";
import NotifyEvent from "./NotifyEvent";
import NotifyApprove from "./NotifyApprove";
import NotifySuccess from "./NotifySuccess";
import NotifyEventSuccess from "./NotifyEventSuccess";
import NotifyApproveSuccess from "./NotifyApproveSuccess";
import NotifyFaucet from "./NotifyFaucet";
import NotifySuccessFaucet from "./NotifySuccessFaucet";
import NotifyError from "./NotifyError";
import NotifyNetwork from "./NotifyNetwork";
import PropTypes from "prop-types";
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";
import { INFURA_URL, GLOBAL_NETWORK_ID } from "../config/const.js";

import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Mainnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet.js";

import NetworkError from "./NetworkError";
import PageNotFound from "./PageNotFound";
import Favorites from "./Favorite.jsx";
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
		} catch (e) {}
		super(props);
		this.state = {
			sent_tx: [],
			showSidebar: true,
			account: [],
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
		};
		this.myRef = React.createRef();

		this.contracts = context.drizzle.contracts;
		this.loadBlockchainData = this.loadBlockchainData.bind(this);
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.executeScroll = this.executeScroll.bind(this);
	}

	async componentDidMount() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			web3 = new Web3(ethereum);
			const accounts = await web3.eth.getAccounts();
			console.log("accounts",accounts)
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
				console.log("accounts I am here")
				// const a = await ethereum.enable();
				const a = ethereum.enable();
				console.log("accounts I am here2")
				web3 = new Web3(ethereum);
				const accounts = await web3.eth.getAccounts();
				console.log("accounts in loadBlockchainData",accounts)
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
			this.props.web3.networkId == GLOBAL_NETWORK_ID
		) {
			this.setState({ disabledStatus: true });
			this.setState(
				{
					fee: fee,
					token: token,
					buyticket: buyticket,
					approve: approve,
				},
				() => this.buy()
			);
		} else {
			toast(<NotifyNetwork />, {
				position: "bottom-right",
				autoClose: true,
				pauseOnHover: true,
			});
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

						toast(<Notify hash={hash} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
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
								<NotifySuccess
									hash={txreceiptApproved.transactionHash}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
							this.setState({ disabledStatus: false });
						}
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						toast(
							<NotifyError
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
				});
			this.setState({ afterApprove: false });
			this.setState({ disabledStatus: false });
		}, 2000);

	allowance = async () => {
		let a = await this.contracts["PHNX"].methods
			.allowance(this.state.account, this.contracts["DaoEvents"].address)
			.call();
		return a;
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
						toast(<NotifyApprove hash={hash} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber == 1) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;
						if (txconfirmed == 0 && txreceipt.status == true) {
							toast(
								<NotifyApproveSuccess
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
							<NotifyError
								error={error}
								message={txerror.message}
							/>,
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
						toast(<Notify hash={hash} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber !== null) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;
						if (txconfirmed == 0 && txreceipt.status == true) {
							toast(
								<NotifySuccess
									hash={txreceipt.transactionHash}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
							this.setState({ disabledStatus: false });
						}
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						toast(
							<NotifyError
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
						toast(<NotifyEvent hash={hash} type={type} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber == 1) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;
						if (txconfirmed == 1 && txreceipt.status == true) {
							toast(
								<NotifyEventSuccess
									hash={txreceipt.transactionHash}
									createdEvent={
										type === "create"
											? txreceipt.events.CreatedEvent
													.returnValues
											: txreceipt.events
													.NewAndUpdatedEvent
													.returnValues
									}
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
						console.log("error", error);
						this.setState({ error: true });
						toast(
							<NotifyError
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
						toast(<NotifyFaucet hash={hash} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				})
				.on("confirmation", (confirmationNumber, receipt) => {
					if (confirmationNumber !== null) {
						txreceipt = receipt;
						txconfirmed = confirmationNumber;

						if (txconfirmed == 0 && txreceipt.status == true) {
							toast(
								<NotifySuccessFaucet
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
							<NotifyError
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
		if (!this.props.drizzleStatus.initialized) {
			body = (
				<div>
					<Switch>
						<Route
							component={(props) => (
								<Home
									{...props}
									executeScroll={this.executeScroll}
								/>
							)}
						/>
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
								<Home
									{...props}
									executeScroll={this.executeScroll}
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
								<Home
									{...props}
									executeScroll={this.executeScroll}
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
						path="/mytickets/:page"
						render={(props) => (
							<MyTickets
								{...props}
								executeScroll={this.executeScroll}
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
						path="/event-stat/:page/:id"
						render={(props) => (
							<MyEventStat
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
								toggleDisabling={this.toggleDisabling}
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
							/>
						)}
					/>
					<Route
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
						path="/topics"
						//  component={TopicsLandingPage}
						component={(props) => <TopicsLandingPage {...props} />}
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
						path="/locations"
						component={LocationsLandingPage}
					/>
					<Route
						exact
						path="/location/:page"
						component={LocationLandingPage}
					/>
					<Route
						exact
						path="/calendar"
						render={(props) => (
							<Calendars
								{...props}
								executeScroll={this.executeScroll}
							/>
						)}
					/>
					<Route
						exact
						path="/analytics"
						component={Analytics}
						account={this.state.account}
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
			);
		}

		return (
			<Router>
				<div id="wrapper" className="toggled" ref={this.myRef}>
					<Sidebar
						connection={!connecting}
						account={this.state.account}
						connect={this.loadBlockchainData}
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
		contracts: state.contracts,
	};
};

const AppContainer = drizzleConnect(App, mapStateToProps);
export default AppContainer;
