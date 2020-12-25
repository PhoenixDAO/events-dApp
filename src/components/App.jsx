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

import Sidebar from "./Sidebar";
import Event from "./Event";
import Home from "./Home";
import FindEvents from "./FindEvents";
import PastEvents from "./PastEvents";
import MyTickets from "./MyTickets";
import CreateEvent from "./CreateEvent/";
import MyEvents from "./MyEvents";
import MyEventStat from "./MyEventStat";
import EventPage from "./EventPage";
import TopicLandingPage from "./TopicLandingPage";
import TopicsLandingPage from "./TopicsLandingPage";
import LocationLandingPage from "./LocationLandingPage";
import LocationsLandingPage from "./LocationsLandingPage";
import Calendars from "./Calendars";
import Token from "./Token";
import Dashboard from "./Dashboard";

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
import Popup from 'react-popup';

import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Testnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet.js";

import NetworkError from "./NetworkError";
import LoadingApp from "./LoadingApp";
import PageNotFound from "./PageNotFound";
import { X_OK } from "constants";
let ethereum = window.ethereum;
let web3 = window.web3;
let interval;

class App extends Component {
	constructor(props, context) {
		try {
			var contractConfig = {
				contractName: "PHNX",
				web3Contract: new context.drizzle.web3.eth.Contract(
					PhoenixDAO_Testnet_Token_ABI,
					PhoenixDAO_Testnet_Token_Address
				),
			};
			context.drizzle.addContract(contractConfig);
			//Importing PhoenixDAO contracts
			// **** ENDS UP HERE, SO THIS WORKS
			/*console.log(
			  "SUCCESS",
			  PhoenixDAO_Testnet_Token_Address,
			  context.drizzle.contracts
			);*/
		} catch (e) {
			//console.log("ERROR", PhoenixDAO_Testnet_Token_Address, e);
		}
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
		};
		this.contracts = context.drizzle.contracts;
		this.loadBlockchainData = this.loadBlockchainData.bind(this);
	}

	async componentDidMount() {
		this.loadBlockchainData();
	}

	componentWillUpdate() {
		let sent_tx = this.state.sent_tx;
		for (let i = 0; i < this.props.transactionStack.length; i++) {
			if (sent_tx.indexOf(this.props.transactionStack[i]) === -1) {
				sent_tx.push(this.props.transactionStack[i]);

				toast(<Notify hash={this.props.transactionStack[i]} />, {
					position: "bottom-right",
					autoClose: false,
					pauseOnHover: true,
				});
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
		console.log("window.ethereum", window.ethereum);
		if (!window.ethereum || !window.ethereum.isMetaMask) {
			let a = <a href="https://www.w3schools.com/">Visit W3Schools.com!</a>
			alert(`MetaMask is not installed. Please install MetaMask to continue. ${a}`, );
		} else {
			if (typeof ethereum !== "undefined") {
				const a = await ethereum.enable();
				web3 = new Web3(ethereum);
				const accounts = await web3.eth.getAccounts();
				const check = localStorage.getItem("account");
				if (!check) {
					window.location.reload();
					localStorage.setItem("account", true);
				}
			} else if (typeof web3 !== "undefined") {
				console.log("Web3 Detected!");
				alert("alert 123 123!");
				window.web3 = new Web3(web3.currentProvider);
			} else {
				console.log("No Web3 Detected");
				alert("alert 123 123!");
				window.web3 = new Web3(
					new Web3.providers.HttpProvider(
						"https://rinkeby.infura.io/v3/72e114745bbf4822b987489c119f858b"
					)
				);
			}
			window.ethereum.on("connect", function (accounts) {
				console.log("on connect");
			});
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

	//get value from buyer/from child components
	inquireBuy = (id, fee, token, openEvents_address, buyticket, approve) => {
		if (this.state.account.length !== 0 && this.props.web3.networkId == 4) {
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
			//if(this.state.afterApprove)
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
						toast(<NotifyError message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				});
			this.setState({ afterApprove: false });
			this.setState({ disabledStatus: false });
		}, 2000);

	allowance = async () => {
		let a = await this.contracts["PHNX"].methods
			.allowance(this.state.account, this.contracts["OpenEvents"].address)
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
					if (confirmationNumber !== null) {
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
						toast(<NotifyError message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
						// this.afterApprove()
						this.setState({ disabledStatus: false });
					}
				});
		} else {
			console.log("this.state.account ===>", this.state.buyticket);

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
						toast(<NotifyError message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
					this.setState({ disabledStatus: false });
				});
		}

		// console.log(this.contracts)

		// if (this.state.token) {

		// 	this.state.approve.send({ from: this.state.account })
		// 	.on('transactionHash', (hash) => {
		// 			if (hash !== null) {
		// 				toast(<NotifyApprove hash={hash} />, {
		// 					position: "bottom-right",
		// 					autoClose: true,
		// 					pauseOnHover: true

		// 				})
		// 			}
		// 		})
		// 	.on('confirmation', (confirmationNumber, receipt) => {
		// 			if (confirmationNumber !== null) {
		// 				txreceipt = receipt
		// 				txconfirmed = confirmationNumber
		// 				if (txconfirmed == 0 && txreceipt.status == true) {

		// 					toast(<NotifyApproveSuccess hash={txreceipt.transactionHash} />,
		// 						{
		// 							position: "bottom-right",
		// 							autoClose: true,
		// 							pauseOnHover: true
		// 						})
		// 					this.afterApprove()
		// 					this.setState({ disabledStatus: false })
		// 				}

		// 			}
		// 		})
		// 	.on('error', (error) => {
		// 		if (error !== null) {
		// 			txerror = error
		// 			toast(<NotifyError message={txerror.message} />,
		// 				{
		// 					position: "bottom-right",
		// 					autoClose: true,
		// 					pauseOnHover: true
		// 				})
		// 			// this.afterApprove()
		// 			this.setState({ disabledStatus: false })
		// 		}
		// 	})

		// }
		// else {

		// 	this.state.buyticket.send({ value: this.state.fee, from: this.state.account })

		// 		.on('transactionHash', (hash) => {
		// 			if (hash !== null) {
		// 				toast(<Notify hash={hash} />, {
		// 					position: "bottom-right",
		// 					autoClose: true,
		// 					pauseOnHover: true

		// 				})
		// 			}
		// 		})
		// 		.on('confirmation', (confirmationNumber, receipt) => {
		// 			if (confirmationNumber !== null) {
		// 				txreceipt = receipt
		// 				txconfirmed = confirmationNumber
		// 				if (txconfirmed == 0 && txreceipt.status == true) {
		// 					toast(<NotifySuccess hash={txreceipt.transactionHash} />,
		// 						{
		// 							position: "bottom-right",
		// 							autoClose: true,
		// 							pauseOnHover: true
		// 						})
		// 					this.setState({ disabledStatus: false })
		// 				}

		// 			}
		// 		})
		// 		.on('error', (error) => {
		// 			if (error !== null) {
		// 				txerror = error
		// 				toast(<NotifyError message={txerror.message} />,
		// 					{
		// 						position: "bottom-right",
		// 						autoClose: true,
		// 						pauseOnHover: true
		// 					})
		// 			}
		// 			this.setState({ disabledStatus: false })
		// 		})
		// }
	};

	//Get Value form Event Creator from child component
	//Notify,listen for transaction status.
	passtransaction = (transaction) => {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";

		this.setState({ upload: true, createEvent: transaction }, () =>
			this.state.createEvent
				.send({ from: this.state.account })

				.on("transactionHash", (hash) => {
					if (hash !== null) {
						this.setState({
							upload: false,
							done: true,
						});
						toast(<NotifyEvent hash={hash} />, {
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
								<NotifyEventSuccess
									hash={txreceipt.transactionHash}
									createdEvent={
										txreceipt.events.CreatedEvent
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
					}
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						this.setState({ error: true });
						toast(<NotifyError message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}
				})
		);
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
						toast(<NotifyError message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
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

	render() {
		let body;
		let connecting = false;

		var items = ["slide1.png", "slide2.png", "slide3.png", "slide4.png"];
		var randomBG = items[Math.floor(Math.random() * items.length)];
		if (!this.props.drizzleStatus.initialized) {
			body = (
				<div>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route component={LoadingApp} />
					</Switch>
				</div>
			);
			connecting = true;
		} else if (this.props.web3.status === "failed") {
			body = (
				<div>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route component={NetworkError} />
					</Switch>
				</div>
			);
			connecting = true;
		} else if (
			(this.props.web3.status === "initialized" &&
				Object.keys(this.props.accounts).length === 0) ||
			(process.env.NODE_ENV === "production" &&
				this.props.web3.networkId !== 4)
		) {
			console.log("web3", process.env.NODE_ENV);

			body = (
				<Switch>
					<Route
						exact
						path="/findevents/:page"
						render={(props) => (
							<FindEvents
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
							/>
						)}
					/>
					<Route
						exact
						path="/pastevents/:page"
						component={PastEvents}
					/>

					<Route
						exact
						path="/createevent"
						render={(props) => (
							<CreateEvent
								{...props}
								passtransaction={this.passtransaction}
								upload={this.state.upload}
								disabledStatus={this.state.disabledStatus}
								done={this.state.done}
								disabledStatus={this.state.disabledStatus}
								error={this.state.error}
								account={this.state.account}
							/>
						)}
					/>

					<Route
						exact
						path="/event/:page/:id"
						render={(props) => (
							<EventPage {...props} inquire={this.inquireBuy} />
						)}
					/>
					<Route exact path="/topics" component={TopicsLandingPage} />
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
					<Route exact path="/Calendar" component={Calendars} />
					<Route exact path="/how-it-works" component={Home} />
				</Switch>
			);
		} else {
			body = (
				<Switch>
					<Route
						exact
						path="/"
						render={(props) => (
							<FindEvents
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
							/>
						)}
					/>
					<Route
						exact
						path="/findevents/:page"
						render={(props) => (
							<FindEvents
								{...props}
								inquire={this.inquireBuy}
								disabledStatus={this.state.disabledStatus}
							/>
						)}
					/>
					<Route
						exact
						path="/pastevents/:page"
						component={PastEvents}
					/>
					<Route
						exact
						path="/mytickets/:page"
						component={MyTickets}
					/>

					<Route
						exact
						path="/createevent"
						render={(props) => (
							<CreateEvent
								{...props}
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
						path="/myevents/:page"
						render={(props) => (
							<MyEvents
								{...props}
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
								inquire={this.inquireBuyTest}
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
					<Route exact path="/topics" component={TopicsLandingPage} />
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
					<Route exact path="/calendar" component={Calendars} />
					<Route
						exact
						path="/dashboard"
						component={Dashboard}
						account={this.state.account}
					/>
					<Route exact path="/how-it-works" component={Home} />
					<Route path="*" exact component={PageNotFound} />
				</Switch>
			);
		}

		return (
			<Router>
				<div id="wrapper" className="toggled">
					<Sidebar
						connection={!connecting}
						account={this.state.account}
						connect={this.loadBlockchainData}
					/>
					<div id="page-content-wrapper" className="sidebar-open">
						<div
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
						</div>
						<div className="container-fluid">
							<div className="page-wrapper-inner">
								<div>{body}</div>
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
