import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PhoenixDAOLoader from './PhoenixDAOLoader';
import Ticket from './Ticket';
import Web3 from "web3";
import { INFURA_WEB_URL } from "../config/const.js";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import { Grid } from "@material-ui/core";
import SearchBar from './common/SearchBar';

class MyTickets extends Component {
	constructor(props, context) {

		super(props);
		this.state = {
			myTicket: [],
			blockChainTicketsLoaded: true,
			prevPath: -1,
		}
		this.contracts = context.drizzle.contracts;
		this.tickets = this.contracts['DaoEvents'].methods.ticketsOf.cacheCall(this.props.accounts[0]);
		// console.log("checking",this.props.contracts['DaoEvents'].ticketsOf[this.tickets])
		this.perPage = 6;
		this.myRef = React.createRef()
		this.loadTicketsFromBlockchain = this.loadTicketsFromBlockchain.bind(this)
	}

	readMoreClick(location) {
		this.props.history.push(location);
	}
	async loadTicketsFromBlockchain() {
		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
				INFURA_WEB_URL
			)
		);
		const openEvents = new web3.eth.Contract(
			Open_events_ABI,
			Open_events_Address
		);
		const blockChainTickets = await openEvents.methods.ticketsOf(this.props.accounts[0]).call()
		const newsort = blockChainTickets.concat().sort((a, b) => b - a);
		this.setState({ blockChainTickets: newsort, blockChainTicketsLoaded: false })
		// this.updateIPFS();
		// console.log("temp Event web3",newsort)
	}

	executeScroll = () => this.myRef.current.scrollIntoView()

	render() {
		let body = <PhoenixDAOLoader />;

		if (
			this.state.myTicket
		) {
			if (this.state.blockChainTicketsLoaded) {
				body =
					<div>
						<PhoenixDAOLoader />
						<hr />
					</div>
			}
			else if (this.state.blockChainTickets.length === 0) {
				body =
					<div className="no-tickets text-center mt-5">
						<h3>You have not purchased any tickets yet.</h3>
						<button className="btn btn-drk read-more" onClick={() => { this.readMoreClick("/upcomingevents/1") }}>Find an Event</button>.
					</div>
					;
			} else {
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
					let ticket = parseInt(this.state.blockChainTickets[i], 10);
					tickets.push(<Ticket key={ticket} id={ticket} ticketData={this.state.blockChainTickets[i]} />);
				}
				let pagination;
				if (pages > 1) {
					let links = [];

					if (pages > 5 && currentPage >= 3) {
						for (let i = currentPage - 2; i <= currentPage + 2 && i <= pages; i++) {
							let active = i === currentPage ? 'active' : '';
							links.push(
								<li className={"page-item " + active} key={i}>
									<Link to={"/mytickets/" + i} onClick={() => this.setState({ prevPath: currentPage })} className="page-link">{i}</Link>
								</li>
							);
							if (this.state.prevPath != -1) {
								this.executeScroll({ behavior: "smooth", block: "start" });
							}
						}
					}

					else if (pages > 5 && currentPage < 3) {
						for (let i = 1; i <= 5 && i <= pages; i++) {
							let active = i === currentPage ? 'active' : '';
							links.push(
								<li className={"page-item " + active} key={i}>
									<Link to={"/mytickets/" + i} onClick={() => this.setState({ prevPath: currentPage })} className="page-link">{i}</Link>
								</li>
							);
							if (this.state.prevPath != -1) {
								this.executeScroll({ behavior: "smooth", block: "start" });
							}
						}
					}
					else {
						for (let i = 1; i <= pages; i++) {
							let active = i === currentPage ? 'active' : '';
							links.push(
								<li className={"page-item " + active} key={i}>
									<Link to={"/mytickets/" + i} onClick={() => this.setState({ prevPath: currentPage })} className="page-link">{i}</Link>
								</li>
							);
							if (this.state.prevPath != -1) {
								this.executeScroll({ behavior: "smooth", block: "start" });
							}
						}
					}

					pagination =
						<nav>
							<ul className="pagination justify-content-center">
								{links}
							</ul>
						</nav>
						;
				}

				body =
					<div>
						<div className="row user-list mt-4">
							{tickets}
						</div>
						{pagination}
					</div>
					;
			}
		}

		return (
			<div ref={this.myRef}>
				<div className="my-tickets-page">
					<Grid className="header3">
						<h2>
							My Tickets
								</h2>
						<SearchBar />
					</Grid>


					{body}
				</div>
			</div>
		);
	}
	componentDidMount() {
		this.loadTicketsFromBlockchain()
		if (this.state.prevPath == -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		this._isMounted = true;

	}

	componentWillUnmount() {
		this._isMounted = false;
	}
}


MyTickets.contextTypes = {
	drizzle: PropTypes.object
}

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		accounts: state.accounts
	};
};

const AppContainer = drizzleConnect(MyTickets, mapStateToProps);
export default AppContainer;
