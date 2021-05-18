import React, { Component } from "react";
import Web3 from "web3";
import PropTypes from "prop-types";

import "../styles/main.css";
import { drizzleConnect } from "drizzle-react";

import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import {
	PhoenixDAO_Testnet_Token_ABI,
	// PhoenixDAO_Testnet_Token_Address,

	PhoenixDAO_Mainnet_Token_Address
} from "../config/phoenixDAOcontract_testnet";
import { API_URL, REPORT_EVENT ,GLOBAL_NETWORK_ID,graphURL} from "../config/const";
import axios from "axios";
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";
import Snackbar3 from "./Snackbar3";
import CircularProgress from "@material-ui/core/CircularProgress";

class Home extends Component {
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

		this.state = {
			errorMessage: "",
			openSnackbar1: false,
			openSnackbar2: false,
			openSnackbar3: false,
			latestblocks: 5000000,

			totalTickets: 0,
			loadingTotalTickets: true,

			activeUsers: 0,
			loadingActiveUsers: true,
			hideEvent:[],
			pastEvents: 0,
			loadingPastEvents: true,
			Deleted_Events: [],
			upcomingEvents: 0,
			loadingUpcomingEvents: true,
			shownSnackbar3:false,
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
		this.checkNetwork = this.checkNetwork.bind(this);
	}

	componentDidMount() {
		this.props.executeScroll();
		this.loadData();
		this.filterHideEvent();

	}
	componentWillReceiveProps = (nextProps) => {
		// console.log("nextProps",nextProps.web3, this.state.shownSnackbar3)
		if (!this.state.shownSnackbar3 && nextProps.web3.status == "initialized" && nextProps.web3.networkId) {
			// console.log("hererere")

		  this.setState({shownSnackbar3:true})
		  this.checkNetwork(nextProps.web3.status,nextProps.web3.networkId)
		}
	  }

	checkNetwork(web3Status,networkId) {

		// console.log("this.props.web3.networkId",web3Status,networkId)

		if (
			web3Status == "initialized" &&
			networkId != GLOBAL_NETWORK_ID
		) {
			this.setState({
				errorMessage: GLOBAL_NETWORK_ID==137 ?  "Please switch your network to Matic Mainnet!":GLOBAL_NETWORK_ID==80001 ?"Please switch your network to Matic Testnet!": "Please switch your network to Matic Mainnet!",
				openSnackbar1: false,
				openSnackbar2: false,
				openSnackbar3: true,
			});
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
						openSnackbar1: false,
						openSnackbar2: true,
						openSnackbar3: false,
					});
				}
			}
		} else {
			this.setState({
				errorMessage:
					"MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbar1: true,
				openSnackbar2: false,
				openSnackbar3: false,
			});
		}
	}
	handleSnackbarClose = (number) => {
		if (number == 1) {
			this.setState({ openSnackbar1: false });
		} else if (number == 2) {
			this.setState({ openSnackbar2: false });
		} else {
			this.setState({ openSnackbar3: false });
		}
	};
	filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
		}
	};
	async getAllEvents(){
		let Events_Blockchain=await axios({
			url: graphURL,
			method: 'post',
			data: {
			  query: `
			  {
				events {
				  id
				  eventId
				  name
				  time
				  price
				  token
				  limited
				  seats
				  sold
				  ipfs
				  category
				  owner
				  revenueOfEvent
				}
			  }
			  `
			}
		}).then((graphEvents)=>{
			// console.log("graph graphEvents",graphEvents)
			if(!graphEvents.data || graphEvents.data.data == 'undefined'){
				return []
			}else{
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
				
					let newsort = graphEvents.data.data.events
						.concat()
						.sort((a, b) => b.blockNumber - a.blockNumber)
					return newsort;
					

			}
		}).catch((err) => {console.error(err)
		return []
		})
		return Events_Blockchain
	}
	async getAllDeletedEvents(){
		let Deleted_Events=await axios({
			url: graphURL,
			method: 'post',
			data: {
			  query: `
			  {
				eventsRemoveds {
				  id
				  eventId
				}
			  }
			  `
			}
		}).then((graphDeletedEvents)=>{

			if(!graphDeletedEvents.data || !graphDeletedEvents.data.data == 'undefined'){
				return []
			}else{
				return graphDeletedEvents.data.data.eventsRemoveds 
			}
		}).catch((err)=>{
			console.error(err);
			return []
		})
		return Deleted_Events
	}
	async loadData() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);
			const openEvents = new web3.eth.Contract(
				Open_events_ABI,
				Open_events_Address
			);

			const blockNumber = await web3.eth.getBlockNumber();

			// let totalTickets = await openEvents.getPastEvents("SoldTicket", {
			// 	fromBlock: 8181618,
			// 	toBlock: 'latest',
			// });
			await axios({
				url: graphURL,
				method: 'post',
				data: {
				  query: `
				  {
					events {
					  eventId
					  sold
					  buyers
					}
				  }
				  `
				}
			}).then(async(graphEvents)=>{
				// console.log("mere soldTickets by Id",graphEvents.data.data.events)
				let totalTicketSold=0;
				graphEvents.data.data.events.map((event) =>{
					// console.log("mere event.sold in loop",event.sold) 
					totalTicketSold=totalTicketSold+Number(event.sold)
					// console.log("mere totalTicketSold in loop",totalTicketSold) 
				})
			// console.log("mere totalTickets",totalTicketSold)
			// let allTicketBuyers = totalTickets.map((tt) => {
			// 	return tt[0];
			// });

			// this
			let allTicketBuyers=[]
			graphEvents.data.data.events.map((event)=>{
				// console.log("mere event aya",event)
				allTicketBuyers=allTicketBuyers.concat(event.buyers)
				// console.log("mere event aya2",allTicketBuyers)
			})
			// allTicketBuyers.concat(graphEvents.data.data.events[i].buyer)graphEvents.data.data.events.map((event)=> event.buyers.map((buyerArray,i)=> buyerArray[i]))
			// console.log("mere allTicketBuyers",allTicketBuyers)
			// this
			
			let uniqueAllTicketBuyers = [...new Set(allTicketBuyers)];

			// console.log("mere uniqueAllTicketBuyers",uniqueAllTicketBuyers)
			this.setState({
				totalTickets: totalTicketSold,
				loadingTotalTickets: false,
			});
			
		
			
			// let Events_Blockchain =[]
			// let Deleted_Events=[]

			// Get All events
			let Events_Blockchain=await this.getAllEvents()
			
			//Get Deleted Events
			let Deleted_Events=await this.getAllDeletedEvents()

			// console.log("mere new",Events_Blockchain,Deleted_Events	)
			const dateTime = Date.now();
			const dateNow = Math.floor(dateTime / 1000);
			// console.log("consolingg",Deleted_Events,Events_Blockchain)

			// // Get All events
			// Events_Blockchain = await openEvents
			//.getPastEvents("CreatedEvent", {
			// 	fromBlock: 7000000,
			// 	toBlock: blockNumber,
			// });

			// //Get Deleted Events
			// Deleted_Events = await openEvents
			//.getPastEvents("DeletedEvent", {
			// 	fromBlock: 8181618,
			// 	toBlock: blockNumber,
			// });
			//filtered event
			let allEvents = [];
			let skip = false;
			for (let i =0; i < Events_Blockchain.length; i++) {
				for (let j = 0; j < Deleted_Events.length; j++) {
					if (
						Events_Blockchain[i]
							.eventId ==
						Deleted_Events[j].eventId
					) {
						skip = true;
					}
				}
				if(!skip){
					for (let j = 0; j < this.state.hideEvent.length; j++) {
						if (
							Events_Blockchain[i]
								.eventId ==
							this.state.hideEvent[j].id
						) {
							skip = true;
						}
					}
				}
				if (!skip) {
					allEvents.push(Events_Blockchain[i]);
				}
				skip = false;
			}

			// Get Past events
			let pastEvents = allEvents
				.concat()
				.sort((a, b) => b.blockNumber - a.blockNumber)
				.filter(
					(pastEvents) => pastEvents.time <= dateNow
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
					(activeEvents) => activeEvents.time >= dateNow
				);

			this.setState({
				upcomingEvents: upcomingEvents.length,
				loadingUpcomingEvents: false,
			});
			// console.log("Home allEvents", allEvents)
			let ownersOfAllEvents = allEvents.map((tt) => {
				return tt.owner;
			});
			// console.log("Home ownersOfAllEvents",ownersOfAllEvents)

			let uniqueOwnersOfAllEvents = [...new Set(ownersOfAllEvents)];

			let AllUsers = uniqueAllTicketBuyers.concat(
				uniqueOwnersOfAllEvents
			);

			let uniqueAllUser = [...new Set(AllUsers)];

			this.setState({
				activeUsers: uniqueAllUser.length,
				loadingActiveUsers: false,
			});
		}).catch((err)=>{
			// console.log("mere error",err)
			this.setState({
				loadingActiveUsers: false,
				loadingUpcomingEvents: false,
				loadingPastEvents: false,
				loadingTotalTickets: false,
			})
	})
		}
	}

	render() {
		return (
			<React.Fragment>
				<Snackbar
					open={this.state.openSnackbar1}
					message={this.state.errorMessage}
					handleClose={() => this.handleSnackbarClose(1)}
				/>
				<Snackbar2
					open={this.state.openSnackbar2}
					message={this.state.errorMessage}
					handleClose={() => this.handleSnackbarClose(2)}
				/>
				<Snackbar3
					open={this.state.openSnackbar3}
					message={this.state.errorMessage}
					handleClose={() => this.handleSnackbarClose(3)}
				/>
				<div className="welcomeWrapper">
					<div className="opaqueBackground">
						<h2 className="welcomeHead">
							Welcome to PhoenixDAO Events Marketplace
						</h2>
						<p>
							The PhoenixDAO Events Marketplace is a dApp that
							allows people to create events and sell tickets
							online, with the option to make an event, paid or
							free.
						</p>s
						<p>
							The tickets created on this service are ERC721
							tokens, which means that users are able to move,
							gift, or sell those tickets to other users.
						</p>
						<p>
							The PhoenixDAO Events Marketplace is a dApp powered
							by the Ethereum blockchain. In order to create
							events or purchase tickets, you are required have an
							Ethereum wallet. If you do not have one currently,
							you can use{" "}
							{typeof InstallTrigger !== "undefined" ? (
								<a
									target="_blank"
									style={{ textAlign: "center" }}
									href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
								>
									{" "}
									MetaMask
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
								<div className="welcome-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/topics/bar-crawl.jpg)",
											backgroundSize: "cover",
											borderRadius: "7px",
											paddingTop: "26px",
											opacity: 0.9,
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
							{Object.keys(this.props.accounts).length !== 0 ? (
								<div className="col-lg-4 pb-4 d-flex align-items-stretch">
									<div className="welcome-card">
										<div
											className="dashboard-caption"
											style={{
												backgroundImage:
													"url(/images/ethorange.png)",
											}}
										>
											<h3>
												<i className="fas fa-user-astronaut"></i>{" "}
												User Account
											</h3>
											<img
												className="dashboard-img"
												src={"/images/ethereum.png"}
											></img>
											<p
												className="mt-2"
												title={this.props.accounts[0]}
											>
												{this.props.accounts[0].slice(
													0,
													15
												) + "..."}
											</p>
										</div>
									</div>
								</div>
							) : (
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
												src={
													"/welcomePage/metamask-fox.svg"
												}
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
											</h4>
											<p className="dashboard-footer">
												Events
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="welcome-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage: `url("/images/slides/slide3.png")`,
											backgroundSize: "cover",
											paddingTop: "26px",
											opacity: 0.9,
										}}
									>
										<h3>
											<i className="fas fa-calendar-alt welcome-img"></i>
										</h3>

										<p
											className="mt-0 headings"
											style={{ margin: "0px" }}
										>
											{this.state
												.loadingUpcomingEvents ? (
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
								<div className="welcome-card">
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
									<a
										target="_blank"
										style={{
											textAlign: "center",
											color: "white",
										}}
										href="https://youtu.be/Pj63VX1Jdxo"
									>
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
									</a>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="welcome-card">
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
			</React.Fragment>
		);
	}
}

Home.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		web3: state.web3,
	};
};

const AppContainer = drizzleConnect(Home, mapStateToProps);
export default AppContainer;
