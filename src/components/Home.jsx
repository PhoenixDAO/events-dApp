import React, { Component } from "react";
import Web3 from "web3";
import PropTypes from "prop-types";

import "../styles/main.css";
import { drizzleConnect } from "drizzle-react";

import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Testnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet";

import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Snackbar from './Snackbar';

import CircularProgress from "@material-ui/core/CircularProgress";
import { Row } from "react-bootstrap";

class Home extends Component {
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
		} catch (e) {
			//console.log("ERROR", PhoenixDAO_Testnet_Token_Address, e);
		}
		super(props);
		this.contracts = context.drizzle.contracts;

		this.state = {
			errorMessage: "",
			openSnackbar: false,
			type:"",
			latestblocks: 5000000,

			totalTickets: 0,
			loadingTotalTickets: true,

			activeUsers: 0,
			loadingActiveUsers: true,

			pastEvents: 0,
			loadingPastEvents: true,

			upcomingEvents: 0,
			loadingUpcomingEvents: true,
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
	}

	componentDidMount() {
		this.props.executeScroll();
		this.loadData();
	}

	async connectToMetaMask() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);
			try {
				const a = await window.ethereum.enable();
			} catch (e) {
				if (e.code = -32002){
					console.log("eeee",e,e.message,e.code)
					this.setState({
						errorMessage: "Connection request already pending. Please check MetaMask !",
						openSnackbar: true,
						type:"home"
					});

			}
			}
		}else{
			this.setState({
				errorMessage: "MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbar: true,
			});
		}
	}
	handleSnackbarClose = () => {
		this.setState({ openSnackbar: false ,type:""});
	};

	async loadData() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);
			const openEvents = new web3.eth.Contract(
				Open_events_ABI,
				Open_events_Address
			);
			console.log("OPEN EEEE======", openEvents);

			const blockNumber = await web3.eth.getBlockNumber();

			let totalTickets = await openEvents.getPastEvents("SoldTicket", {
				fromBlock: 7654042,
				toBlock: blockNumber,
			});
			let allTicketBuyers = totalTickets.map((tt) => {
				return tt.returnValues[0];
			});

			this.setState({
				totalTickets: allTicketBuyers.length,
				loadingTotalTickets: false,
			});

			let uniqueAllTicketBuyers = [...new Set(allTicketBuyers)];
			console.log(
				"Unique ticket holders addresses",
				uniqueAllTicketBuyers
			);

			const dateTime = Date.now();
			const dateNow = Math.floor(dateTime / 1000);

			// Get All events
			let allEvents = await openEvents.getPastEvents("CreatedEvent", {
				fromBlock: 7000000,
				toBlock: blockNumber,
			});

			// Get Past events
			let pastEvents = allEvents
				.concat()
				.sort((a, b) => b.blockNumber - a.blockNumber)
				.filter(
					(pastEvents) => pastEvents.returnValues.time <= dateNow
				);

			this.setState({
				pastEvents: pastEvents.length,
				loadingPastEvents: false,
			});

			// Get upcoming events
			let upcomingEvents = allEvents
				.concat()
				.sort((a, b) => b.blockNumber - a.blockNumber)
				.filter(
					(activeEvents) => activeEvents.returnValues.time >= dateNow
				);

			this.setState({
				upcomingEvents: upcomingEvents.length,
				loadingUpcomingEvents: false,
			});

			let ownersOfAllEvents = allEvents.map((tt) => {
				return tt.returnValues[0];
			});

			let uniqueOwnersOfAllEvents = [...new Set(ownersOfAllEvents)];

			let AllUsers = uniqueAllTicketBuyers.concat(
				uniqueOwnersOfAllEvents
			);

			let uniqueAllUser = [...new Set(AllUsers)];

			this.setState({
				activeUsers: uniqueAllUser.length,
				loadingActiveUsers: false,
			});
			console.log("Unique users", uniqueAllUser);
			console.log("this.state", this.state);
		}
	}

	render() {
		return (
			<div className="welcomeWrapper">
				<Snackbar
					open={this.state.openSnackbar}
					message={
						this.state.errorMessage
					}
					handleClose={this.handleSnackbarClose}
					type={this.state.type}
				/>
				<div className="opaqueBackground">
					<h2 className="welcomeHead">
						WELCOME TO PHOENIX EVENT DAPP
					</h2>
					<p>
						The PhoenixDAO Events Marketplace is a dApp that allows
						people to create events and sell tickets online, with
						the option to make an event, paid or free.
					</p>
					<p>
						The tickets created on this service are ERC721 tokens,
						which means that users are able to move, gift, or sell
						those tickets to other users.
					</p>
					<p>
						The PhoenixDAO Events Marketplace is a dApp powered by
						the Ethereum blockchain. In order to create events or
						purchase tickets, you are required have an Ethereum
						wallet. If you do not have one currently, you can use{" "}
						{typeof InstallTrigger !== "undefined" ? (
							<a
								target="_blank"
								style={{ textAlign: "center" }}
								href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
							>
								{" "}
								[LINK]
							</a>
						) : (
							<a
								target="_blank"
								style={{ textAlign: "center" }}
								href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
							>
								{" "}
								MetaMask
							</a>
						)}
						.
					</p>
					<div className="row user-list mt-4 pb-5">
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage:
											"url(/images/topics/bar-crawl.jpg)",
										backgroundSize: "cover",
										borderRadius: "7px",
										paddingTop: "26px",
									}}
								>
									<h3>
										<img
											className="welcome-img"
											src={
												"/welcomePage/Icon material-event-available.svg"
											}
										></img>
									</h3>
									<p
										className="mt-0 headings"
										style={{ margin: "0px" }}
									>
										{this.state.loadingPastEvents ? (
											<CircularProgress
												size={20}
												type={"home"}
												color={"white"}
											/>
										) : (
											this.state.pastEvents
										)}
									</p>
									<p
										className="mt-0 headings"
										style={{ marginTop: "0px" }}
									>
										Past Events
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div
								className="dashboard-card"
								onClick={this.connectToMetaMask}
							>
								<div
									className="dashboard-caption metamaskDiv"
									style={{ paddingTop: "26px" }}
								>
									<img
										src={"/welcomePage/metamask-fox.svg"}
										height="85px "
										width="85px"
									></img>
									<h3
										style={{
											color: "#FFA200",
											fontWeight: "bold",
											opacity: 1,
											zIndex: 1,
										}}
									>
										Connect to MetaMask
									</h3>
									<h4 className="dashboard-data">
										{/* {eventCount.length} */}
									</h4>
									<p className="dashboard-footer">Events</p>
								</div>
							</div>
						</div>

						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/slides/slide3.png")`,
										backgroundSize: "cover",
										paddingTop: "26px",
									}}
								>
									<h3>
										<i className="fas fa-calendar-alt welcome-img"></i>
									</h3>

									<p
										className="mt-0 headings"
										style={{ margin: "0px" }}
									>
										{this.state.loadingUpcomingEvents ? (
											<CircularProgress
												size={20}
												type={"home"}
												color={"white"}
											/>
										) : (
											this.state.upcomingEvents
										)}
									</p>
									<p
										className="mt-0 headings"
										style={{ marginTop: "0px" }}
									>
										Upcoming Events
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/topics/charity-and-causes.jpg")`,
										backgroundSize: "cover",
										opacity: 0.9,
										paddingTop: "26px",
									}}
								>
									<h3>
										<img
											src={
												"/welcomePage/Icon feather-user.svg"
											}
											className="welcome-img"
										></img>
									</h3>
									{/* style={{justifyContent: "center",display: "flex",flexDirection: "row"}} */}
									<p
										className="mt-0 headings"
										style={{ margin: "0px" }}
									>
										{this.state.loadingActiveUsers ? (
											<CircularProgress
												size={20}
												type={"home"}
												color={"white"}
											/>
										) : (
											this.state.activeUsers
										)}
									</p>
									<p
										className="mt-0 headings"
										style={{ marginTop: "0px" }}
									>
										Active Users
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption metamaskDiv"
									style={{ paddingTop: "26px" }}
								>
									<img
										src={
											"/welcomePage/Icon ionic-logo-youtube.svg"
										}
										style={{ width: "50px" }}
										className="welcome-img"
									></img>
									<h3 className="mt-2 headings">
										Walk Through Video{" "}
									</h3>
								</div>
							</div>
						</div>

						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/slides/slide1.png")`,
										backgroundSize: "cover",
										opacity: 0.9,
										paddingTop: "26px",
									}}
								>
									<h3>
										<img
											src={
												"/welcomePage/Icon awesome-ticket-alt.svg"
											}
											className="welcome-img"
										></img>
									</h3>
									<p
										className="mt-0 headings"
										style={{ margin: "0px" }}
									>
										{this.state.loadingTotalTickets ? (
											<CircularProgress
												size={20}
												type={"home"}
												color={"white"}
											/>
										) : (
											this.state.totalTickets
										)}
									</p>
									<p
										className="mt-0 headings"
										style={{ marginTop: "0px" }}
									>
										Tickets Sold
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// componentDidMount() {
	// 	this.props.executeScroll();
	// }
}

Home.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
	};
};

const AppContainer = drizzleConnect(Home, mapStateToProps);
export default AppContainer;
