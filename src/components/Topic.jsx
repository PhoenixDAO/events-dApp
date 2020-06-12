import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';

import ipfs from '../utils/ipfs';

import Loading from './Loading';

class Topic extends Component {
    constructor(props, context) {
        super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			loading: false,
			loaded: false,
			description: null,
			image: null,
			ipfs_problem: false,
			approve_tx: null,
			waiting_approve: false
		};
		this.isCancelled = false;
	}

	render() {
		let body = <div className="card"><div className="card-body"><Loading /></div></div>;

		if (typeof this.props.contracts['OpenEvents'].getEvent[this.event] !== 'undefined') {
			let event_data = this.props.contracts['OpenEvents'].getEvent[this.event].value;

			let image = this.getImage();
			let description = this.getDescription();
      let buttonText = "Buy Ticket";

			let symbol = event_data[3] ? 'hydro.png' : 'ethereum.png';

			let price = this.context.drizzle.web3.utils.fromWei(event_data[2]);
			let date = new Date(parseInt(event_data[1], 10) * 1000);

			let max_seats = event_data[4] ? event_data[5] : '∞';

			let disabled = false;
			let disabledStatus;

			if (event_data[4] && (Number(event_data[6]) >= Number(event_data[5]))) {
				disabled = true;
				disabledStatus = <span><span role="img" aria-label="alert">⚠️</span> No tickets available.</span>;
			}

			if (date.getTime() < new Date().getTime()) {
				disabled = true;
        buttonText = "This event has ended.";
			}

      let badge = "";

      if (event_data[6] >= 2) {
        badge = <img src="/images/fire.png" className="event_badge-hot" alt="Hot Icon" />;
      }

			body =
				<div className="card">
					<Link to={"/event/" + this.props.id}>
            <img className="card-img-top event-image" src={image} alt={event_data[0]} />
          </Link>
					<div className="card-header text-muted event-header">
						<img className="float-left" src={makeBlockie(event_data[8])} alt={event_data[8]} />
						<p className="small text-truncate mb-0">
							Creator: <a href={"https://rinkeby.etherscan.io/address/" + event_data[8]} target="_blank" className="event_creator-link">
								{event_data[8]}
							</a>
						</p>
					</div>
					<div className="card-body">
						<h5 className="card-title event-title">
							<Link to={"/event/" + this.props.id}>{badge}{event_data[0]}</Link>
						</h5>
						{description}
					</div>
					<ul className="list-group list-group-flush">
						<li className="list-group-item"><strong>Price:</strong> <img src={'/images/'+symbol} className="event_price-image" alt="Event Price Icon" /> {price}</li>
						<li className="list-group-item"><strong>Date:</strong> {date.toLocaleDateString()} at {date.toLocaleTimeString()}</li>
						<li className="list-group-item"><strong>Tickets Sold:</strong> {event_data[6]}/{max_seats}</li>
					</ul>
					<div className="card-footer text-muted text-center">
						<button className="btn btn-dark" onClick={this.buyTicket} disabled={disabled}><i className="fas fa-ticket-alt"></i> {buttonText}</button>
					</div>
				</div>
			;
		}

		return (
			<div className="col-lg-4 pb-4 d-flex align-items-stretch">
				{body}
			</div>
		);
	}

	componentDidMount() {

	}

	componentDidUpdate() {

	}

	componentWillUnmount() {

	}
}

export default AppContainer;
