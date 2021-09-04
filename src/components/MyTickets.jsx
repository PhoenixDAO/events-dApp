import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import { withStyles } from "@material-ui/core/styles";
import Ticket from "./Ticket";
import Header from "./common/Header";
import EmptyState from "./EmptyState";
import GetGraphApi from "../config/getGraphApi";
import axios from "axios";


const useStyles = (theme) => ({	
lgScreenFooterBanner:{
	position: 'absolute',
	marginLeft: '-100px',
	marginRight: '0%',
	marginTop:"8%",
	"@media (max-width: 800px)":{
		marginLeft:"-90px",
		"& img":{
			// transform:"scale(1.4)"
		}
	},
	"@media (min-width: 1540px)":{
		marginLeft:"-150px",
		width: "100%",
	},
	"@media (min-width: 1590px)":{
		marginLeft:"-330px",
	}
	// "@media (max-width: 1540px)":{
	// 	marginLeft:"13%"
	// }
}})
class MyTickets extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			myTicket: [],
			blockChainTicketsLoaded: true,
			prevPath: -1,
			reload: false,
			blockChainTickets: [],
			blockChainTicketsCopy: [],
			value: "",
		};
		// this.contracts = context.drizzle.contracts;
		// this.tickets = this.contracts['DaoEvents'].methods.ticketsOf.cacheCall(this.props.accounts[0]);
		// console.log("checking",this.props.contracts['DaoEvents'].ticketsOf[this.tickets])
		this.perPage = 6;
		this.myRef = React.createRef();
		this.loadTicketsFromBlockchain =
			this.loadTicketsFromBlockchain.bind(this);
		this.reloadData = this.reloadData.bind(this);
	}

	readMoreClick(location) {
		this.props.history.push(location);
	}
	reloadData = () => {
		this.setState({ reload: !this.state.reload });
	};
	async loadTicketsFromBlockchain() {
		// const web3 = new Web3(
		// 	new Web3.providers.WebsocketProvider(
		// 		INFURA_WEB_URL
		// 	)
		// );
		// const openEvents = new web3.eth.Contract(
		// 	Open_events_ABI,
		// 	Open_events_Address
		// );
		const graphURL = await GetGraphApi();
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
				{
					tickets(where: {buyer:"${this.props.accounts}"}){
					  id
					  eventId
					  eventName
					}
				  }
				`,
			},
		}).then((graphEvents) => {
			console.log("GraphQL query response", Date.now(), graphEvents);

			if (
				graphEvents.data ||
				graphEvents.data.data !== "undefined" ||
				graphEvents.data.data.tickets.length > 0
			) {
				console.log("Data is here from graph");
				this.setState({
					blockChainTickets: graphEvents.data.data.tickets,
					blockChainTicketsCopy: graphEvents.data.data.tickets,
					blockChainTicketsLoaded: false,
				});
			}
		});
		// const blockChainTickets = await this.props.eventsContract.methods
		// 	.ticketsOf(this.props.accounts[0])
		// 	.call();
		// const newsort = blockChainTickets.concat().sort((a, b) => b - a);
		// console.log("BLockchain ticket data", newsort);
		// this.setState({
		// 	blockChainTickets: newsort,
		// 	blockChainTicketsLoaded: false,
		// });
		// this.setState({reload:false})
		// this.updateIPFS();
		// console.log("temp Event web3",newsort)
	}

	executeScroll = () => this.myRef.current.scrollIntoView();

	//Search Active Events By Name
	updateSearch = (value) => {
		let filteredTickets = this.state.blockChainTicketsCopy;
		console.log(this.state.blockChainTickets);
		try {
			if (value !== "") {
				filteredTickets = filteredTickets.filter((ticket) => {
					return ticket.eventName.toLowerCase().search(value) !== -1;
				});
			} else {
				filteredTickets = this.state.blockChainTicketsCopy;
			}
		} catch (e) {
			console.log(e);
		}
		console.log("FIltered Tickets", filteredTickets);
		this.setState({
			blockChainTickets: filteredTickets,
			// active_length: filteredEvents.length,
		});
	};

	render() {
		// let body = <PhoenixDAOLoader />;
		const { classes } = this.props;
		let body;

		// if (
		// 	this.state.myTicket
		// ) {
		// if (this.state.blockChainTicketsLoaded) {
		// 	body =
		// 		<div>
		// 			<PhoenixDAOLoader />
		// 			<hr />
		// 		</div>
		// }
		//this was else if before
		if (this.state.blockChainTicketsLoaded) {
			body = <PhoenixDAOLoader />;
		} else if (
			this.state.blockChainTickets.length === 0 &&
			!this.state.blockChainTicketsLoaded
		) {
			body = (
				<EmptyState
					text="You have no Tickets 😔"
					btnText="Find an event"
					url="/upcomingevents/1"
				/>
			);
		}
		// else condition removed from here
		// console.log('MyTickets blockChainTickets',this.state.blockChainTickets)
		let count = this.state.blockChainTickets.length;

		let currentPage = Number(this.props.match.params.page);

		if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

		let end = currentPage * this.perPage;
		let start = end - this.perPage;
		if (end > count) end = count;
		let pages = Math.ceil(count / this.perPage);

		let tickets = [];

		for (let i = start; i < end; i++) {
			// console.log("ticketData this.state.blockChainTickets[i]",this.state.blockChainTickets[i])
			let ticket = parseInt(this.state.blockChainTickets[i].id, 10);
			console.log("tickets", ticket);
			tickets.push(
				<Ticket
					key={ticket}
					id={ticket}
					reloadData={this.reloadData}
					ticketData={Number(this.state.blockChainTickets[i].id)}
					eventsContract={this.props.eventsContract}
				/>
			);
		}
		let pagination;
		if (pages > 1) {
			let links = [];

			if (pages > 5 && currentPage >= 3) {
				for (
					let i = currentPage - 2;
					i <= currentPage + 2 && i <= pages;
					i++
				) {
					let active = i === currentPage ? "active" : "";
					links.push(
						<li className={"page-item " + active} key={i}>
							<Link
								to={"/mytickets/" + i}
								onClick={() =>
									this.setState({
										prevPath: currentPage,
									})
								}
								className="page-link"
							>
								{i}
							</Link>
						</li>
					);
					if (this.state.prevPath !== -1) {
						this.executeScroll({
							behavior: "smooth",
							block: "start",
						});
					}
				}
			} else if (pages > 5 && currentPage < 3) {
				for (let i = 1; i <= 5 && i <= pages; i++) {
					let active = i === currentPage ? "active" : "";
					links.push(
						<li className={"page-item " + active} key={i}>
							<Link
								to={"/mytickets/" + i}
								onClick={() =>
									this.setState({
										prevPath: currentPage,
									})
								}
								className="page-link"
							>
								{i}
							</Link>
						</li>
					);
					if (this.state.prevPath !== -1) {
						this.executeScroll({
							behavior: "smooth",
							block: "start",
						});
					}
				}
			} else {
				for (let i = 1; i <= pages; i++) {
					let active = i === currentPage ? "active" : "";
					links.push(
						<li className={"page-item " + active} key={i}>
							<Link
								to={"/mytickets/" + i}
								onClick={() =>
									this.setState({
										prevPath: currentPage,
									})
								}
								className="page-link"
							>
								{i}
							</Link>
						</li>
					);
					if (this.state.prevPath !== -1) {
						this.executeScroll({
							behavior: "smooth",
							block: "start",
						});
					}
				}
			}

			pagination = (
				<nav>
					<ul className="pagination justify-content-center">
						{links}
					</ul>
				</nav>
			);
		}

		if (tickets.length === 0 && !this.state.loading) {
			body = (
				<EmptyState
					text="You have no Tickets 😔"
					btnText="Find an event"
					url="/upcomingevents/1"
				/>
			);
		} else {
			body = (
				<div>
					<div className="row user-list mt-4">{tickets}</div>
					{pagination}
				</div>
			);
		}

		return (
			<div ref={this.myRef}>
				<div className="my-tickets-page">
					<Header
						title="My Tickets"
						searchBar={true}
						handleSearch={this.updateSearch}
					/>
					{body}
				</div>
				{/* <div className="sticky-nav-travel">
					<img src={"/images/travel.svg"} />
				</div> */}
				{(tickets.length !== 0 && !this.state.loading)&&
					<a href="https://www.travala.com/?ref=phoenixdao" target="_blank">
					<div className={classes.lgScreenFooterBanner}>
						<img src={"/images/footer.jpg"} className="img-fluid w-100"/>
					</div>
					</a>
				}
			</div>
		);
	}
	componentDidMount() {
		this.loadTicketsFromBlockchain();

		if (this.state.prevPath === -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		this._isMounted = true;
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.reload !== this.state.reload) {
			this.loadTicketsFromBlockchain();
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
}

MyTickets.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts[0],
	};
};

const AppContainer = drizzleConnect(MyTickets, mapStateToProps);
export default withStyles(useStyles)(AppContainer);
