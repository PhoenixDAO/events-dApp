import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Testnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet.js";

import ipfs from "../utils/ipfs";

import Loading from "./Loading";
import eventTopics from "../config/topics.json";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

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
import ApprovalModal from "./approvalModal";

import { ToastContainer, toast } from "react-toastify";

let numeral = require("numeral");

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class Event extends Component {
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
		this.contracts = context.drizzle.contracts;
		this.event = this.contracts["OpenEvents"].methods.getEvent.cacheCall(
			this.props.id
		);
		this.account = this.props.accounts[0];
		this.state = {
			loading: false,
			loaded: false,
			description: null,
			image: null,
			ipfs_problem: false,
			locations: null,
			PhoenixDAO_market: [],
			fee: "",
			token: "",
			openEvents_address: "",
			buyticket: "",
			approve: "",
			buy: "",
			open: false,
		};
		this.isCancelled = false;
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	//get market cap & dollar value of PHNX
	async getPhoenixDAOMarketValue() {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				if (this._isMounted) {
					this.setState({ PhoenixDAO_market: data.phoenixdao });
				}
			})
			.catch(console.log);
	}

	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			typeof this.props.contracts["OpenEvents"].getEvent[this.event] !==
				"undefined"
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(this.props.ipfs)
						.then((file) => {
							let data = JSON.parse(file[0].content.toString());
							if (!this.isCancelled) {
								this.setState({
									loading: false,
									loaded: true,
									description: data.text,
									image: data.image,
									locations: data.location,
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
				this.state.description.length > 30
					? this.state.description.slice(0, 60) + "..."
					: this.state.description;
			description = <p className="card-text event-description">{text}</p>;
		}
		return description;
	};
	//get the location of Events on IPFS
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
		if (this.state.locations !== null) {
			let place = this.state.locations;
			locations = <strong>Location: {place}</strong>;
		}
		return locations;
	};

	allowance = async () => {
		let a = await this.contracts["PHNX"].methods
			.allowance(this.account, this.contracts["OpenEvents"].address)
			.call();
		console.log("allowance ==> ", a);
		return a;
	};

	giveApproval = async () => {
		this.handleClose()
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		this.state.approve
			.send({ from: this.account })
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
	};

	inquire = async () => {
		let balance = await this.contracts["PHNX"].methods.totalSupply().call();
		// let temp = this.allowance();
		// console.log("approve",balance)
		console.log(
			"buy",
			this.props.contracts["OpenEvents"].getEvent[this.event].value[2]
		);
		console.log("temp is ss",
		this.props.id
	)
		this.setState(
			{
				fee: this.props.contracts["OpenEvents"].getEvent[this.event]
					.value[2],
				token: this.props.contracts["OpenEvents"].getEvent[this.event]
					.value[3],
				openEvents_address: this.contracts["OpenEvents"].address,
				buyticket: this.contracts["OpenEvents"].methods.buyTicket(
					this.props.id
				),
				approve: this.contracts["PHNX"].methods.approve(
					this.contracts["OpenEvents"].address,
					balance
				),
			},
			async () => {
				let temp=await this.allowance()
				console.log("temp is ",temp)
				if (await this.allowance() == 0) {
					this.handleClickOpen();
				} else {
					this.props.inquire(
						this.props.id,
						this.state.fee,
						this.state.token,
						this.state.openEvents_address,
						this.state.buyticket,
						this.state.approve
					);
				}
			}
		);
	};

	// getPrettyCategory(rawCategory) {
	//   let prettyCategory = "";
	//
	//   {eventTopics.map((Topic, index) => (
	//     if(Topic.slug == rawCategory) {
	//       prettyCategory = Topic.slug;
	//     }
	//
	//   ))}
	//
	//   return prettyCategory;
	// }

	render() {
		let body = (
			<div className="card">
				<div className="card-body">
					<Loading />
				</div>
			</div>
		);

		if (
			typeof this.props.contracts["OpenEvents"].getEvent[this.event] !==
				"undefined" &&
			this.props.contracts["OpenEvents"].getEvent[this.event].value
		) {
			let event_data = this.props.contracts["OpenEvents"].getEvent[
				this.event
			].value;

			let image = this.getImage();
			let description = this.getDescription();
			let locations = this.getLocation();

			let buttonText = event_data[3] ? "Buy Ticket" : "Get Ticket";
			let freeEvent = "";
			if (!event_data[3]) {
				freeEvent = <p className="free_event">Free Event</p>;
			}

			if (event_data[3] !== "undefined") {
				let symbol = "PhoenixDAO.png";
				let price = event_data[3]
					? this.context.drizzle.web3.utils.fromWei(event_data[2])
					: "Free Event";
				let date = new Date(parseInt(event_data[1], 10) * 1000);
				let max_seats = event_data[4] ? event_data[5] : "∞";
				let disabled = false;
				let soldOut = " ";
				let sold = false;
				if (
					event_data[4] &&
					Number(event_data[6]) >= Number(event_data[5])
				) {
					sold = true;
					disabled = true;
					buttonText = (
						<span>
							<span role="img" aria-label="alert">
								{" "}
							</span>{" "}
							Sold Out
						</span>
					);
					soldOut = <p className="sold_out">Sold Out</p>;
				}
				if (date.getTime() < new Date().getTime()) {
					disabled = true;
					buttonText = "Event has ended";
				}
				let badge = "";

				if (event_data[6] >= 2) {
					badge = (
						<img
							src="/images/fire.png"
							className="event_badge-hot"
							alt="Hot Icon"
						/>
					);
				}

				let rawCategory = event_data[8];

				var categoryRemovedDashes = rawCategory;
				categoryRemovedDashes = categoryRemovedDashes.replace(
					/-/g,
					" "
				);

				var category = categoryRemovedDashes
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");

				let topicURL = "/topic/" + event_data[8] + "/1";

				//console.log(event_data);
				//Friendly URL Title
				let rawTitle = event_data[0];
				var titleRemovedSpaces = rawTitle;
				titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

				var pagetitle = titleRemovedSpaces
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");

				let titleURL = "/event/" + pagetitle + "/" + this.props.id;
				let myEventStatURL =
					"/event-stat/" + pagetitle + "/" + this.props.id;

				body = (
					<div className="card">
						<div className="image_wrapper">
							<Link to={titleURL}>
								<img
									className="card-img-top event-image"
									src={image}
									alt={event_data[0]}
								/>
							</Link>
							{soldOut}
							{!sold && freeEvent}
						</div>

						<div className="card-header text-muted event-header ">
							<img
								className="float-left"
								src={makeBlockie(event_data[9])}
								alt={event_data[9]}
							/>
							{this.props.myEvents ? (
								<Link to={myEventStatURL}>
									<p className="myEventStat small text-truncate mb-0">
										View Event Stats
									</p>
								</Link>
							) : (
								""
							)}
						</div>

						<div className="card-body">
							<h5
								className="card-title event-title"
								title={event_data[0]}
							>
								<Link to={titleURL}>
									{badge}
									{event_data[0]}
								</Link>
							</h5>
							{description}
						</div>

						<ul className="list-group list-group-flush">
							<li className="list-group-item ">{locations}</li>
							<li className="list-group-item category">
								<strong style={{ paddingRight: "3px" }}>
									Category:{" "}
								</strong>{" "}
								<a href={topicURL}>{category}</a>
							</li>
							<li className="list-group-item">
								<strong>Price:</strong>{" "}
								<img
									src={"/images/" + symbol}
									className="event_price-image"
									alt="Event Price Icon"
								/>{" "}
								{event_data[3]
									? "" + numeral(price).format("0,0")
									: "" + price}
								{event_data[3] ? " or " : ""}
								{event_data[3] ? (
									<img
										src={"/images/dollarsign.png"}
										className="event_price-image"
										alt="Event Price"
									/>
								) : (
									""
								)}
								{event_data[3]
									? numeral(
											price *
												this.state.PhoenixDAO_market.usd
									  ).format("0,0.00")
									: ""}
							</li>
							<li className="list-group-item date">
								<strong>Date:</strong>{" "}
								{date.toLocaleDateString()} at{" "}
								{date.toLocaleTimeString()}
							</li>
							<li className="list-group-item">
								<strong>Tickets Sold:</strong> {event_data[6]}/
								{max_seats}
							</li>
						</ul>

						<div className="card-footer text-muted text-center">
							<button
								className="btn btn-dark"
								onClick={this.inquire}
								disabled={disabled || this.props.disabledStatus}
							>
								<i className="fas fa-ticket-alt"></i>{" "}
								{buttonText}
							</button>
						</div>
					</div>
				);
			}
		}

		return (
			<div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 pb-4">
					<ApprovalModal open={this.state.open} handleClose={this.handleClose} giveApproval={this.giveApproval}/>
				{body}
			</div>
		);
	}

	componentDidMount() {
		this._isMounted = true;
		this.updateIPFS();
		this.getPhoenixDAOMarketValue();
	}

	componentDidUpdate() {
		this.updateIPFS();
		//this.afterApprove();
	}

	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

Event.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
	};
};

const AppContainer = drizzleConnect(Event, mapStateToProps);
export default AppContainer;
