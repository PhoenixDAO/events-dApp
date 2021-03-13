import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import "../styles/Ticket.css";
import ipfs from "../utils/ipfs";
import NotifySending from "./NotifySending";
import NotifySuccessSending from "./NotifySuccessSending";
import NotifyError from "./NotifyError";
import { API_URL, REPORT_EVENT } from "../utils/const";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Loading from "./Loading";
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	RedditShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";

import {
	EmailIcon,
	FacebookIcon,
	LinkedinIcon,
	RedditIcon,
	TelegramIcon,
	TwitterIcon,
	WhatsappIcon,
} from "react-share";

var QRCode = require("qrcode.react");

class Ticket extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.ticket = this.contracts["DaoEvents"].methods.getTicket.cacheCall(
			this.props.id
		);
		this.event = null;
		this.address = null;
		this.state = {
			loading: false,
			loaded: false,
			description: null,
			image: null,
			location: null,
			ipfs_problem: false,
			card_tab: 1,
			wrong_address: false,
			disabledStatus: false,
			hideEvent:[],
			blockie: "/images/PhoenixDAO.png",
		};
		this.isCancelled = false;
	}
	filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
			console.log("check error", error);
		}
	};
	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			typeof this.props.contracts["DaoEvents"].events[this.event] !==
				"undefined"
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(
						this.props.contracts["DaoEvents"].events[this.event]
							.value[7]
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
			locations = <strong>Location: {place}</strong>;
		}
		return locations;
	};

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			card_tab: tab,
		});
	};

	sendTicket = () => {
		this.setState({ disabledStatus: true });
		if (
			!this.address.value ||
			!this.context.drizzle.web3.utils.isAddress(this.address.value)
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
					this.address.value,
					this.props.id
				)
				.send({ from: this.props.accounts[0] })
				.on("transactionHash", (transactionHash) => {
					if (transactionHash !== null) {
						toast(<NotifySending hash={transactionHash} />, {
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
								<NotifySuccessSending
									hash={txreceiptApproved.transactionHash}
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
						toast(<NotifyError error={error} message={txerror.message} />, {
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						});
					}

					this.setState({ disabledStatus: false });
				});
		}
	};

	updateEvent = () => {
		if (
			typeof this.props.contracts["DaoEvents"].getTicket[this.ticket] !==
				"undefined" &&
			this.event === null
		) {
			this.event = this.contracts[
				"DaoEvents"
			].methods.events.cacheCall(
				this.props.contracts["DaoEvents"].getTicket[this.ticket]
					.value[0]
			);
		}

		if (this.event !== null) {
			this.updateIPFS();
		}
		//<img src="/images/qr.jpg" width="150" alt="qr code" />
	};

	downloadQR = () => {
		let ticket_data = this.props.contracts["DaoEvents"].getTicket[
			this.ticket
		].value;
		let event_data = this.props.contracts["DaoEvents"].events[this.event]
			.value;
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
			this.event !== null &&
			typeof this.props.contracts["DaoEvents"].events[this.event] !==
				"undefined"
		) {
			let ticket_data = this.props.contracts["DaoEvents"].getTicket[
				this.ticket
			].value;
			let event_data = this.props.contracts["DaoEvents"].events[
				this.event
			].value;
			let reported=false;
				for (let j = 0; j < this.state.hideEvent.length; j++) {
					if (
						ticket_data[0]== this.state.hideEvent[j].id
					) {
						 reported= true;
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
			let shareUrl = window.location.origin + titleURL;

			let card_body;

			if (this.state.card_tab === 1) {
				let image = this.getImage();
				let description = this.getDescription();

				let date = new Date(parseInt(event_data[1], 10) * 1000);

				let timeStatus, timeClass;

				if (date.getTime() < new Date().getTime()) {
					timeStatus = (
						<p className="text-center small">
							<span role="img" aria-label="alert">
								⚠️
							</span>{" "}
							Ticket Expired
						</p>
					);
					timeClass = "text-danger";
				}

				card_body = (
					<div>
						<div className="card-body">
							<h5
								className={
									"mydate-time text-center " + timeClass
								}
							>
								<div>
									<i className="far fa-calendar-alt"></i>
									<span className=" pl-2">
										{date.toLocaleDateString()} at{" "}
										{date.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							</h5>
							<div style={{ height: "22px" }}>{timeStatus}</div>
							<h5 className="text-center">
								Your seat: {ticket_data[1]}
							</h5>
						</div>
						<img
							className="card-img event-image"
							src={image}
							alt={event_data[0]}
						/>
						<div className="card-body">
							<h5 className="card-title event-title">
								{!reported? 
									<Link to={titleURL}>{event_data[0]}</Link>
									:
									event_data[0]
								}
								{/* {event_data[0]} */}
							</h5>
							<div className="ticketDescription">
								{description}
							</div>
							<h6 className="text-center mb-0">
								Tell friends you're going!{" "}
							</h6>

							<div className="text-center social-share-btns-div">
								<EmailShareButton
									url={shareUrl}
									subject={"Attending " + rawTitle}
									body={"I am going to " + rawTitle}
									resetButtonStyle={false}
								>
									<EmailIcon size={32} round />
								</EmailShareButton>

								<FacebookShareButton
									url={shareUrl}
									quote={rawTitle}
									hashtag="event"
									resetButtonStyle={false}
								>
									<FacebookIcon size={32} round />
								</FacebookShareButton>

								<LinkedinShareButton
									url={shareUrl}
									title={rawTitle}
									summary={"I am going to " + rawTitle}
									source={shareUrl}
									resetButtonStyle={false}
								>
									<LinkedinIcon size={32} round />
								</LinkedinShareButton>

								<RedditShareButton
									url={shareUrl}
									title={rawTitle}
									resetButtonStyle={false}
								>
									<RedditIcon size={32} round />
								</RedditShareButton>

								<TelegramShareButton
									url={shareUrl}
									title={rawTitle}
									resetButtonStyle={false}
								>
									<TelegramIcon size={32} round />
								</TelegramShareButton>

								<TwitterShareButton
									url={shareUrl}
									title={"I am going to " + rawTitle}
									hashtag="event"
									resetButtonStyle={false}
								>
									<TwitterIcon size={32} round />
								</TwitterShareButton>

								<WhatsappShareButton
									url={shareUrl}
									title={rawTitle}
									resetButtonStyle={false}
								>
									<WhatsappIcon size={32} round />
								</WhatsappShareButton>
							</div>
						</div>
						<div className="card-footer text-muted event-header">
							<img
								className="float-left"
								src={this.state.blockie}
								alt={event_data[9]}
							/>
							<p className="small text-truncate mb-2">
								Creator:{" "}
								<a
									href={
										"https://etherscan.io/address/" +
										event_data[9]
									}
									target="_blank"
								>
									{event_data[9]}
								</a>
							</p>
						</div>
					</div>
				);
			} else {
				let image = this.getImage();
				let ticket_data = this.props.contracts["DaoEvents"].getTicket[
					this.ticket
				].value;
				let event_data = this.props.contracts["DaoEvents"].events[
					this.event
				].value;
				let warning = this.state.wrong_address ? "is-invalid" : "";
				let date = new Date(parseInt(event_data[1], 10) * 1000);

				card_body = (
					<div>
						<div className="card-body">
							{/* <h5 className="text-center">
								Download Digital Ticket:
							</h5>
							<p className="text-center">
								<a onClick={this.downloadQR}>
									<img
										src="/images/add-to-apple-wallet-logo.png"
										width="140px"
										height="40px"
										alt="apple wallet logo"
									/>
								</a>
							</p>
							<div className="form-group">
								<p className="myTicketQR text-center">
									<QRCode
										id={
											event_data[0] + "-" + ticket_data[1]
										}
										value={
											"Event Name: " +
											event_data[0] +
											", " +
											"Event Date: " +
											date.toLocaleDateString() +
											", " +
											"Event Time: " +
											date.toLocaleTimeString() +
											", " +
											"Event Location: " +
											this.state.location +
											", " +
											"Ticket Number: " +
											ticket_data[1]
										}
										size={180}
										level={"H"}
										bgColor="transparent"
										fgColor="black"
										imageSettings={{
											src: "/images/PhoenixDAO.png",
											height: 34,
											width: 34,
											x: null,
											y: 75,
											excavate: false,
										}}
									/>
								</p>
							</div> */}

							<h5 className="text-center">
								<b>Send or Transfer Ticket:</b>
							</h5>
							<div className="form-group">
								<label htmlFor="address">
									Ethereum Address:
								</label>
								<input
									type="text"
									className={"form-control " + warning}
									id="address"
									ref={(input) => (this.address = input)}
								/>
							</div>
							<button
								className="btn btn-dark"
								onClick={this.sendTicket}
								disabled={this.state.disabledStatus}
							>
								<i className="fas fa-share-square"></i> Send
								Ticket
							</button>
						</div>
					</div>
				);
			}

			body = (
				<div className="card w-100">
					<div className="card-header">
						<ul className="nav nav-tabs card-header-tabs">
							<li className="nav-item">
								<a
									href=""
									className={
										"nav-link " +
										(this.state.card_tab === 1
											? "active"
											: "")
									}
									onClick={(e) => this.changeTab(1, e)}
								>
									About Event
								</a>
							</li>
							<li className="nav-item">
								<a
									href=""
									className={
										"nav-link " +
										(this.state.card_tab === 2
											? "active"
											: "")
									}
									onClick={(e) => this.changeTab(2, e)}
								>
									Manage Ticket
								</a>
							</li>
						</ul>
					</div>
					{card_body}
				</div>
			);
		}

		return (
			<div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 pb-4 d-flex align-items-stretch">
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
