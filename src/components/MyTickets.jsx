import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import Ticket from './Ticket';

class MyTickets extends Component {
  constructor(props, context) {
    super(props);
		this.contracts = context.drizzle.contracts;
		this.tickets = this.contracts['OpenEvents'].methods.ticketsOf.cacheCall(this.props.accounts[0]);
		this.perPage = 6;
	}

  readMoreClick(location)
  {
    this.props.history.push(location);
    window.scrollTo(0, 0);
  }

	render() {
		let body = <Loading />;

		if (typeof this.props.contracts['OpenEvents'].ticketsOf[this.tickets] !== 'undefined') {
			let allTickets = this.props.contracts['OpenEvents'].ticketsOf[this.tickets].value;

			if (allTickets.length === 0) {
				body =
					<div className="no-tickets text-center mt-5">
						<h3>You have not purchased any tickets yet.</h3>
            <button  className="btn btn-drk read-more" onClick={() => {this.readMoreClick("/findevents/1")}}>Find an Event</button>.
					</div>
				;
			} else {
				let count = allTickets.length;

				let currentPage = Number(this.props.match.params.page);

				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);

				let tickets = [];

				for (let i = start; i < end; i++) {
					let ticket = parseInt(allTickets[i], 10);
					tickets.push(<Ticket key={tickets} id={ticket} />);
				}
				tickets.reverse();

				let pagination;
				if (pages > 1) {
					let links = [];

					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? 'active' : '';
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link to={"/mytickets/" + i} className="page-link">{i}</Link>
							</li>
						);
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
			<div className="my-tickets-page">
				<h2><i className="fa fa-ticket-alt"></i> My Tickets</h2>
				<hr />
				{body}
			</div>
		);
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
