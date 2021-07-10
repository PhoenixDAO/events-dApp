import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import makeBlockie from "ethereum-blockies-base64";
import "../styles/Ticket.css";
import ipfs from "../utils/ipfs";
import Notify from "./Notify";
import { API_URL, REPORT_EVENT } from "../config/const";
import axios from "axios";
import Web3 from "web3";
import { INFURA_WEB_URL } from "../config/const.js";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { explorerWithAddress } from "../config/const";
import EventCard from "./common/EventCard.jsx";


import Loading from "./Loading";

var QRCode = require("qrcode.react");

class Ticket extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.ticket = this.contracts["DaoEvents"].methods.getTicket.cacheCall(
			this.props.id
		);
		this.web3=new Web3(
			new Web3.providers.WebsocketProvider(
				INFURA_WEB_URL
			)
		);
		this.event = null;
		this.address = null;
		this.account = this.props.accounts[0];
		this.state = {
			blockChainEvent: null,
			loading: false,
			loaded: false,
			description: null,
			image: null,
			location: null,
			ipfs_problem: false,
			card_tab: 1,
			wrong_address: false,
			disabledStatus: false,
			hideEvent: [],
			blockie: "/images/PhoenixDAO.png",
		};
		this.isCancelled = false;
		this.sendTicket = this.sendTicket.bind(this)
	}
	filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			// console.log("check error", error);
		}
	};
	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			this.state.blockChainEvent !== null
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(
						this.state.blockChainEvent[7]
					)
						.then((file) => {
							let data = JSON.parse(file[0].content.toString());
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									description: data.text,
									image: data.image,
									location: data.location,
								});
							}
						})
						.catch(() => {
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									ipfs_problem: true,
								});
							}
						});
				}
			);
		}
	};

	getImage = () => {
		let image = "/images/loading_image_ipfs.png";
		if (this.state.ipfs_problem) image = "/images/problem_ipfs.png";
		if (this.state.image !== null) image = this.state.image;
		return image;
	};

	getDescription = () => {
		let description = <Loading />;
		if (this.state.ipfs_problem)
			description = (
				<p className="text-center mb-0 event-description">
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load description
				</p>
			);
		if (this.state.description !== null) {
			let text =
				this.state.description.length > 100
					? this.state.description.slice(0, 100) + "..."
					: this.state.description;
			description = <p className="card-text event-description">{text}</p>;
		}
		return description;
	};

	getLocation = () => {
		let locations = [];
		if (this.state.ipfs_problem)
			locations = (
				<p className="text-center mb-0 event-description">
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load location
				</p>
			);
		if (this.state.location !== null) {
			let place = this.state.location;
			locations = place;
		}
		return locations;
	};

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			card_tab: tab,
		});
	};

	sendTicket = (address,eventId) => {
		console.log("addres123",address,!this.context.drizzle.web3.utils.isAddress(address))
		this.setState({ disabledStatus: true });
		if (
			!address ||
			!this.context.drizzle.web3.utils.isAddress(address)
		) {
			this.setState({ wrong_address: true });
			this.setState({ disabledStatus: false });

		} else {
			let txreceiptApproved = "";
			let txconfirmedApproved = "";
			let txerror = "";

			this.setState({ wrong_address: false });
			this.contracts["DaoEvents"].methods
				.safeTransferFrom(
					this.props.accounts[0],
					address,
					this.props.id
				)
				.send({ from: this.props.accounts[0] })
				.on("transactionHash", (transactionHash) => {
					if (transactionHash !== null) {
						toast(<Notify hash={transactionHash} icon="fas fa-check-circle fa-3x"
						color="#413AE2" text={"Transaction sent!\nSending your ticket... 🚀"}/>, {
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
								<Notify
									hash={txreceiptApproved.transactionHash}
									icon="fas fa-check-circle fa-3x"
									color="#413AE2"
									text="Ticket Sent 🎁"
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
						}
					}

					this.setState({ disabledStatus: false });
				})
				.on("error", (error) => {
					if (error !== null) {
						txerror = error;
						toast(<Notify error={error} message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}

					this.setState({ disabledStatus: false });
				});
		}
	};

	updateEvent = async () => {
		if (
			typeof this.props.contracts["DaoEvents"].getTicket[this.ticket] !==
			"undefined" &&
			this.state.blockChainEvent === null
		) {
			this.event = await this.contracts[
				"DaoEvents"
			].methods.events.cacheCall(
				this.props.contracts["DaoEvents"].getTicket[this.ticket]
					.value[0]
			);
			const openEvents = new this.web3.eth.Contract(
				Open_events_ABI,
				Open_events_Address
			);
			const blockChainEvent = await openEvents.methods.events(this.props.contracts["DaoEvents"].getTicket[this.ticket]
				.value[0]).call()
			this.setState({ blockChainEvent: blockChainEvent, blockChainEventLoaded: true })


		}
		if (this.event !== null) {
			this.updateIPFS();
		}
	};
	

	downloadQR = () => {
		let ticket_data = this.props.contracts["DaoEvents"].getTicket[
			this.ticket
		].value;

		let event_data = this.state.blockChainEvent
		const canvas = document.getElementById(
			event_data[0] + "-" + ticket_data[1]
		);
		const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
		let downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = "Event-Ticket.png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};

	render() {
		let body = (
			<div className="card">
				<div className="card-body">
					<Loading />
				</div>
			</div>
		);
		if (
			this.state.blockChainEvent !== null &&
			typeof this.props.contracts["DaoEvents"].events[this.event] !==
			"undefined"
		) 
		{
			let ticket_data = this.props.contracts["DaoEvents"].getTicket[
				this.ticket
			].value;
			let event_data = this.state.blockChainEvent
			
			let reported = false;
			for (let j = 0; j < this.state.hideEvent.length; j++) {
				if (
					ticket_data[0] == this.state.hideEvent[j].id
				) {
					reported = true;
				}
			}

			let rawTitle = event_data[0];
			var titleRemovedSpaces = rawTitle;
			titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

			var pagetitle = titleRemovedSpaces
				.toLowerCase()
				.split(" ")
				.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
				.join(" ");
			let titleURL = "/event/" + pagetitle + "/" + ticket_data[0];
			let myEventStatURL = "/event-stat/" + pagetitle + "/" + ticket_data[0];
			let myEvent = false;
			if (event_data.owner.toLowerCase() == this.account.toLowerCase()) {
				myEvent = true;
			}
			let shareUrl = window.location.origin + titleURL;
			let locations = this.getLocation();
			let date = new Date(parseInt(event_data[1], 10) * 1000);
			let max_seats = event_data.limited ? event_data.seats : "∞";
			let image = this.getImage();

			// if (this.state.card_tab === 1) {
			// 	let image = this.getImage();
			// 	let description = this.getDescription();

			// 	let date = new Date(parseInt(event_data[1], 10) * 1000);

			// 	let timeStatus, timeClass;

			// 	if (date.getTime() < new Date().getTime()) {
			// 		timeStatus = (
			// 			<p className="text-center small">
			// 				<span role="img" aria-label="alert">
			// 					⚠️
			// 				</span>{" "}
			// 				Ticket Expired
			// 			</p>
			// 		);
			// 		timeClass = "text-danger";
			// 	}


			// } else {
			// 	let image = this.getImage();
			// 	let ticket_data = this.props.contracts["DaoEvents"].getTicket[
			// 		this.ticket
			// 	].value;
			// 	let event_data = this.props.contracts["DaoEvents"].events[
			// 		this.event
			// 	].value;
			// 	let warning = this.state.wrong_address ? "is-invalid" : "";
			// 	let date = new Date(parseInt(event_data[1], 10) * 1000);
			// 	let max_seats = event_data.limited ? event_data.seats : "∞";

			// 	// card_body = (
			// 	// 	<div>
			// 	// 		<div className="card-body">
			// 	// 			<h5 className="text-center">
			// 	// 				<b>Send or Transfer Ticket:</b>
			// 	// 			</h5>
			// 	// 			<div className="form-group">
			// 	// 				<label htmlFor="address">
			// 	// 					Ethereum Address:
			// 	// 				</label>
			// 	// 				<input
			// 	// 					type="text"
			// 	// 					className={"form-control " + warning}
			// 	// 					id="address"
			// 	// 					ref={(input) => (this.address = input)}
			// 	// 				/>
			// 	// 			</div>
			// 	// 			<button
			// 	// 				className="btn btn-dark"
			// 	// 				onClick={this.sendTicket}
			// 	// 				disabled={this.state.disabledStatus}
			// 	// 			>
			// 	// 				<i className="fas fa-share-square"></i> Send
			// 	// 				Ticket
			// 	// 			</button>
			// 	// 		</div>
			// 	// 	</div>
			// 	// );

			// }
			body = (
		<EventCard
					event_data={event_data}
					date={date}
					image={image}
					locations={locations}
					ticket={true}
					myEventStatURL={myEventStatURL}
					titleURL={titleURL}
					max_seats={max_seats}
					revenue={this.state.revenue}
					sendTicket2={this.sendTicket}
					eventId= {this.props.id}
				/>
				// <div className="card w-100">
				// 	<div className="card-header">
				// 		<ul className="nav nav-tabs card-header-tabs">
				// 			<li className="nav-item">
				// 				<a
				// 					href=""
				// 					className={
				// 						"nav-link " +
				// 						(this.state.card_tab === 1
				// 							? "active"
				// 							: "")
				// 					}
				// 					onClick={(e) => this.changeTab(1, e)}
				// 				>
				// 					About Event
				// 				</a>
				// 			</li>
				// 			<li className="nav-item">
				// 				<a
				// 					href=""
				// 					className={
				// 						"nav-link " +
				// 						(this.state.card_tab === 2
				// 							? "active"
				// 							: "")
				// 					}
				// 					onClick={(e) => this.changeTab(2, e)}
				// 				>
				// 					Manage Ticket
				// 				</a>
				// 			</li>
				// 		</ul>
				// 	</div>
				// 	{card_body}
				// </div>
			);
		}


		return (
			<div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 pb-4 d-flex justify-content-center align-items-stretch">
				{body}
			</div>
		);
	}

	componentDidUpdate() {
		this.updateEvent();
	}

	componentDidMount() {
		this.updateEvent();
		this.filterHideEvent();

	}

	componentWillUnmount() {
		this.isCancelled = true;
	}
}

Ticket.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(Ticket, mapStateToProps);
export default AppContainer;