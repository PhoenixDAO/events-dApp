import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import makeBlockie from "ethereum-blockies-base64";
import { Link } from "react-router-dom";
import ipfs from "../utils/ipfs";
import Web3 from "web3";

import Loading from "./Loading";
import EventNotFound from "./EventNotFound";
import Clock from "./Clock";
import { Bar, Doughnut, Chart } from "react-chartjs-2";
import JwPagination from "jw-react-pagination";

import CheckUser from "./CheckUser";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import {
	PhoenixDAO_Testnet_Token_ABI,
	PhoenixDAO_Testnet_Token_Address,
} from "../config/phoenixDAOcontract_testnet";
import ApprovalModal from "./approvalModal";

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
import { ToastContainer, toast } from "react-toastify";
import NotifyDelete from "./NotifyDelete";
import { CircularProgress } from "@material-ui/core";

//Numerical Setting
let numeral = require("numeral");
//QR Code
let QRCode = require("qrcode.react");

//Dougnut Chart Percentage
var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
	draw: function () {
		originalDoughnutDraw.apply(this, arguments);

		var chart = this.chart;
		var width = chart.chart.width,
			height = chart.chart.height,
			ctx = chart.chart.ctx;

		var fontSize = 0.8;
		ctx.font = fontSize + "em sans-serif";
		ctx.textBaseline = "middle";

		var percentage = 0;
		var total =
			chart.config.data.datasets[0].data[0] +
			chart.config.data.datasets[0].data[1];
		percentage = numeral(
			(chart.config.data.datasets[0].data[0] * 100) / total
		).format("0.00");

		if (chart.config.data.datasets[0].data[1] == -1) {
			var text = "N/A",
				textX = Math.round((width - ctx.measureText(text).width) / 2),
				textY = height / 2.3;
		} else {
			var text = percentage + "%",
				textX = Math.round((width - ctx.measureText(text).width) / 2),
				textY = height / 2.3;
		}
		ctx.fillText(text, textX, textY);
	},
});

//Pagination Style
const customStyles = {
	ul: {
		border: "rgb(10, 53, 88)",
	},
	li: {
		border: "rgb(10, 53, 88)",
	},
	a: {
		color: "#007bff",
	},
};

class MyEventStat extends Component {
	constructor(props, context) {
		console.log(
			"props 321",
			props.location.pathname.split("/")[
				props.location.pathname.split("/").length - 1
			]
		);
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
		this.event = this.contracts["DaoEvents"].methods.getEvent.cacheCall(
			this.props.match.params.id
		);
		console.log("eventstatsprops", this.props.pastEvents);
		this.account = this.props.accounts[0];
		this.state = {
			load: true,
			loading: false,
			loaded: false,
			description: null,
			image: null,
			ipfs_problem: false,
			disabledButton: false,
			soldTicket: [],
			latestblocks: 5000000,
			phoenixDAO_market: [],
			hash: "",
			fee: "",
			token: "",
			openEvents_address: "",
			buyticket: "",
			approve: "",
			pageTransactions: [],
			open: false,
		};
		this.isCancelled = false;
		this.onChangePage = this.onChangePage.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	//Get SoldTicket Data
	async loadblockhain() {
		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
				"wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b"
			)
		);
		const openEvents = new web3.eth.Contract(
			Open_events_ABI,
			Open_events_Address
		);

		if (this._isMounted) {
			this.setState({ openEvents });
			this.setState({ phoenixDAOTransfer: [] });
		}
		const blockNumber = await web3.eth.getBlockNumber();
		if (this._isMounted) {
			this.setState({
				blocks: blockNumber - 50000,
				latestblocks: blockNumber - 1,
				soldTicket: [],
			});
		}

		openEvents
			.getPastEvents("SoldTicket", {
				filter: { eventId: this.props.match.params.id },
				fromBlock: 5000000,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				this.setState({ load: true });
				var newest = events;
				var newsort = newest
					.concat()
					.sort((a, b) => b.blockNumber - a.blockNumber);
				if (this._isMounted) {
					this.setState({ soldTicket: newsort, check: newsort });
					this.setState({ load: false });
					this.setState({
						active_length: this.state.soldTicket.length,
					});
				}
			})
			.catch((err) => console.error(err));

		openEvents
			.getPastEvents("SoldTicket", {
				fromBlock: 5000000,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				console.log("soldddd---", events);
			})
			.catch((err) => console.error(err));

		//Listen for Incoming Sold Tickets
		openEvents.events
			.SoldTicket({
				filter: { eventId: this.props.match.params.id },
				fromBlock: blockNumber,
				toBlock: "latest",
			})
			.on("data", (log) => {
				// console.log('total tickets ', log)
				setTimeout(() => {
					this.setState({ load: true });

					this.setState({
						soldTicket: [...this.state.soldTicket, log],
					});
					var newest = this.state.soldTicket;
					var newsort = newest
						.concat()
						.sort((a, b) => b.blockNumber - a.blockNumber);
					if (this._isMounted) {
						this.setState({ soldTicket: newsort });
						this.setState({
							active_length: this.state.soldTicket.length,
						});
					}
					this.setState({ load: false });
				}),
					15000;
			});
	}

	//get market cap & dollar value of PhoenixDAO
	async getPhoenixDAOMarketValue() {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				if (this._isMounted) {
					this.setState({ phoenixDAO_market: data.phoenixdao });
				}
			})
			.catch(console.log);
	}

	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			typeof this.props.contracts["DaoEvents"].getEvent[this.event] !==
				"undefined" &&
			!this.props.contracts["DaoEvents"].getEvent[this.event].error
		) {
			this.setState(
				{
					loading: true,
				},
				() => {
					ipfs.get(
						this.props.contracts["DaoEvents"].getEvent[this.event]
							.value[7]
					)
						.then((file) => {
							console.log(
								this.props.contracts["DaoEvents"].getEvent[
									this.event
								].value[8]
							);
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
				<p>
					<span role="img" aria-label="monkey">
						🙊
					</span>
					We can not load description
				</p>
			);
		if (this.state.description !== null)
			description = (
				<p style={{ whiteSpace: "pre-line" }}>
					{this.state.description}
				</p>
			);
		return description;
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	allowance = async () => {
		let a = await this.contracts["PHNX"].methods
			.allowance(this.account, this.contracts["DaoEvents"].address)
			.call();
		console.log("allowance ==> ", a);
		return a;
	};

	giveApproval = async () => {
		this.handleClose();
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
				if (confirmationNumber == 1) {
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
					}
				}
			})
			.on("error", (error) => {
				if (error !== null) {
					txerror = error;
					toast(
						<NotifyError error={error} message={txerror.message} />,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
					// this.afterApprove()
				}
			});
	};

	// inquire = async () => {
	// 	let balance = await this.contracts["PHNX"].methods.totalSupply().call();
	// 	// let temp = this.allowance();
	// 	// console.log("approve",balance)
	// 	console.log(
	// 		"buy",
	// 		this.props.contracts["DaoEvents"].getEvent[this.event].value[2]
	// 	);
	// 	this.setState(
	// 		{
	// 			fee: this.props.contracts["DaoEvents"].getEvent[this.event]
	// 				.value[2],
	// 			token: this.props.contracts["DaoEvents"].getEvent[this.event]
	// 				.value[3],
	// 			openEvents_address: this.contracts["DaoEvents"].address,
	// 			buyticket: this.contracts["DaoEvents"].methods.buyTicket(
	// 				this.props.id
	// 			),
	// 			approve: this.contracts["PHNX"].methods.approve(
	// 				this.contracts["DaoEvents"].address,
	// 				balance
	// 			),
	// 		},
	// 		async () => {
	// 			let temp = await this.allowance();
	// 			console.log("temp is ", temp);
	// 			if ((await this.allowance()) == 0) {
	// 				this.handleClickOpen();
	// 			} else {
	// 				this.props.inquire(
	// 					this.props.id,
	// 					this.state.fee,
	// 					this.state.token,
	// 					this.state.openEvents_address,
	// 					this.state.buyticket,
	// 					this.state.approve
	// 				);
	// 			}
	// 		}
	// 	);
	// };

	inquire = async () => {
		let balance = await this.contracts["PHNX"].methods.totalSupply().call();
		// let temp = this.allowance();
		// console.log("approve",balance)
		console.log(
			"buy",
			this.props.contracts["DaoEvents"].getEvent[this.event].value[2]
		);
		console.log("temp is ss", this.props.match.params.id);

		this.setState(
			{
				fee: this.props.contracts["DaoEvents"].getEvent[this.event]
					.value[2],
				token: this.props.contracts["DaoEvents"].getEvent[this.event]
					.value[3],
				openEvents_address: this.contracts["DaoEvents"].address,
				buyticket: this.contracts["DaoEvents"].methods.buyTicket(
					this.props.match.params.id
				),
				approve: this.contracts["PHNX"].methods.approve(
					this.contracts["DaoEvents"].address,
					balance
				),
			},
			async () => {
				let temp = await this.allowance();
				console.log("temp is ", temp);
				if ((await this.allowance()) == 0) {
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
			locations = <span>Location: {place}</span>;
		}
		return locations;
	};

	//Pagination Change Page
	onChangePage(pageTransactions) {
		this.setState({ pageTransactions });
	}

	// handleDelete() {
	// 	console.log("delete pressed");
	// 	let id = this.props.location.pathname.split("/")[
	// 		this.props.location.pathname.split("/").length - 1
	// 	];
	// 	let transactionId = this.contracts[
	// 		"DaoEvents"
	// 	].methods.deleteEvent.cacheSend(id);
	// 	this.setState({ hash: transactionId });
	// 	this.transactionChecker(transactionId);
	// 	// this.props.history.push("/upcomingevents/1");
	// }

	handleDelete() {
		let txreceipt = "";
		let txconfirmed = "";
		let txerror = "";
		let id = this.props.location.pathname.split("/")[
			this.props.location.pathname.split("/").length - 1
		];
		this.contracts.DaoEvents.methods
			.deleteEvent(id)
			.send({ from: this.state.account })
			.on("transactionHash", (hash) => {
				if (hash !== null) {
					toast(
						<NotifyDelete
							hash={hash}
							text="Deleting your event..."
						/>,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
				}
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				if (confirmationNumber !== null) {
					txreceipt = receipt;
					txconfirmed = confirmationNumber;
					if (txconfirmed == 0 && txreceipt.status == true) {
						toast(
							<NotifyDelete
								hash={txreceipt.transactionHash}
								text="your event has been deleted."
							/>,
							{
								position: "bottom-right",
								autoClose: true,
								pauseOnHover: true,
							}
						);
						this.setState({ deleted: true });
						this.props.history.push("/upcomingevents/1");
					}
				}
			})
			.on("error", (error) => {
				if (error !== null) {
					txerror = error;
					toast(
						<NotifyError error={error} message={txerror.message} />,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
				}
				this.setState({ deleted: false });
			});
	}

	render() {
		let body = (
			<div>
				<h2>
					<i className="fa fa-calendar-alt"></i> Event
				</h2>
				<hr />
				<Loading />
			</div>
		);
		console.log("deleted", this.props.deleted);
		// if (this.state.deleted) {
		// 	toast(<NotifyDelete />, {

		// 		position: "bottom-right",
		// 		autoClose: true,
		// 		pauseOnHover: true,
		// 	});
		// 	this.props.history.push("/upcomingevents/1");
		// }
		if (
			typeof this.props.contracts["DaoEvents"].getEvent[this.event] !==
			"undefined"
		) {
			if (this.props.contracts["DaoEvents"].getEvent[this.event].error) {
				body = (
					<div>
						<h2>
							<i className="fa fa-calendar-alt"></i> Event
						</h2>
						<hr />
						<div className="text-center mt-5">
							<span role="img" aria-label="unicorn">
								🦄
							</span>{" "}
							PhoenixDAO Event not found
						</div>
					</div>
				);
			} else {
				let event_data = this.props.contracts["DaoEvents"].getEvent[
					this.event
				].value;
				let id = this.props.location.pathname.split("/")[
					this.props.location.pathname.split("/").length - 1
				];
				let ownerDetails = this.props.contracts["DaoEvents"]
					.getOwnerDetails[this.event];
				if (ownerDetails != undefined) {
					ownerDetails = ownerDetails.value;
				}
				let image = this.getImage();
				let description = this.getDescription();
				let locations = this.getLocation();
				let buttonText = event_data[3] ? " Buy Ticket" : " Get Ticket";

				let shareUrl = window.location;
				let title = event_data[0];

				let symbol = event_data[3]
					? "PhoenixDAO.png"
					: "PhoenixDAO.png";
				let price = this.context.drizzle.web3.utils.fromWei(
					event_data[2]
				);
				let date = new Date(parseInt(event_data[1], 10) * 1000);

				let max_seats = event_data[4] ? event_data[5] : "∞";
				let disabledButton = this.state.soldTicket != 0 ? true : false;
				let disabled = false;
				let deleted;
				let sold = true;

				if (
					event_data[4] &&
					Number(event_data[6]) >= Number(event_data[5])
				) {
					disabled = true;
					deleted = (
						<span>
							<span role="img" aria-label="alert">
								⚠️
							</span>{" "}
							No more tickets
						</span>
					);
					buttonText = " Sold Out";
				}

				if (date.getTime() < new Date().getTime()) {
					disabled = true;
					deleted = (
						<span>
							<span role="img" aria-label="alert">
								⚠️
							</span>{" "}
							This event has already ended.
						</span>
					);
				}

				if (this.state.active_length <= 0) {
					sold = false;
				}

				let current_revenue = price * event_data[6];

				let unsold_revenue = numeral(
					price * (max_seats - event_data[6])
				).format("0,0.00");

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

				//Friendly URL Title
				let rawTitle = event_data[0];
				var titleRemovedSpaces = rawTitle;
				titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

				var pagetitle = titleRemovedSpaces
					.toLowerCase()
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");
				let titleURL =
					"https://rinkeby.phoenixevents.io/events/" +
					pagetitle +
					"/" +
					this.props.match.params.id;
				//let titleURL = "https://rinkeby.phoenixevents.io/event/" + this.props.match.params.id;
				console.log(titleURL);

				if (this.props.accounts[0] !== event_data[9]) {
					body = (
						<div>
							{/* <h2>
								<i className="fa fa-calendar-alt"></i> Event
							</h2>
							<hr />
							<div className="mt-5 text-center">
								<h3 className="mt-5">Access Denied!</h3>
								<p className="emoji">
									<span role="img" aria-label="sweat">
										😓
									</span>
								</p>
								<p>You do not have access to this page.</p>
								<p>
									If you are the owner of this event & wish to
									view the page, please sign in with{" "}
									<b>Metamask</b>.
								</p>
							</div>  */}
							<h2>
								<i className="fa fa-calendar-alt"></i> Event
							</h2>
							<hr />
							<div className="mt-5 text-center">
								<h3 className="mt-5">
									OOPS !!! PAGE NOT FOUND
								</h3>
								<p className="emoji">
									<span role="img" aria-label="worried face">
										{" "}
										😟
									</span>
								</p>
								<p>That page doesn't exist or is unavailable</p>
							</div>
						</div>
					);
				} else if (this.props.match.params.page === pagetitle) {
					// Doughnut Chart Data
					this.data = (canvas) => {
						const ctx = canvas.getContext("2d");
						const gradient = ctx.createLinearGradient(
							100,
							180,
							100,
							100,
							200
						);
						gradient.addColorStop(1, "white");
						gradient.addColorStop(0, "black");

						const gradient2 = ctx.createLinearGradient(
							100,
							120,
							100,
							100,
							200
						);
						gradient2.addColorStop(1, "rgb(104, 160, 206)");
						gradient2.addColorStop(0, "rgb(100, 101, 102)");

						return {
							labels: ["Current Revenue", "Unsold Tickets"],
							datasets: [
								{
									label: "PHNX",
									fontColor: "black",
									backgroundColor: [
										gradient2,
										gradient,
										gradient,
									],
									borderColor: "rgb(228, 83, 138)",
									borderWidth: 0.8,
									hoverBackgroundColor: [gradient2, gradient],
									hoverBorderColor: "pink",
									hoverBorderWidth: 1,
									weight: 5,
									borderAlign: "center",
									data: [
										price * event_data[6],
										price * (max_seats - event_data[6]),
									],
								},
							],
						};
					};

					body = (
						<div className="col-12">
							<div className="row">
								<h2 className="col-lg-6 col-md-6 col-sm-4 col-xs-4">
									<i className="fa fa-calendar-alt"></i> Event
								</h2>

								{/* <h3>{event_data[0]}</h3>
            			<br />
           				{description} */}
								{/* <button className="btn btn-dark" onClick={this.inquire} disabled={disabled}><i className="fas fa-ticket-alt"></i>{buttonText}</button> */}
								{/* <label className="pl-2 small">{deleted}</label>
            			<br/>
            			<br/>
           				<br/> */}
								{date.getTime() > new Date().getTime() ? (
									<div className=" editButtons text-muted col-lg-6 col-md-6 col-xs-12 col-sm-8 text-center">
										<Link
											// className="col-4"
											// style={{ display: "grid" }}
											to={{
												pathname: "/editevent",
												state: {
													done: false,
													event: event_data,
													price: price,
													organizer: ownerDetails,
													eventId: id,
													//  ...this.props.location.state,
													//  ...this.state,
													description: this.state
														.description,
													image: this.state.image,
													ipfs_problem: this.state
														.ipfs_problem,

													soldTicket: this.state
														.soldTicket,
													latestblocks: this.state
														.latestblocks,
													PhoenixDAO_market: this
														.state
														.phoenixDAO_market,

													fee: this.state.fee,
													token: this.state.token,
													openEvents_address: this
														.state
														.openEvents_address,
													buyticket: this.state
														.buyticket,
													approve: this.state.approve,
													pageTransactions: this.state
														.pageTransactions,
													open: this.state.open,
													locations: this.state
														.locations,
												},
											}}
										>
											<button
												className="btn btn-dark"
												disabled={
													this.state.loading ||
													this.props.disabledStatus
												}
											>
												<i className="fa fa-edit"></i>{" "}
												{this.state.loading ? (
													<CircularProgress
														color="white"
														size={10}
													/>
												) : (
													"Edit"
												)}
											</button>
										</Link>
										<button
											className="btn btn-dark"
											onClick={this.handleDelete}
											disabled={
												disabledButton ||
												this.props.disabledStatus
											}
										>
											<i className="fas fa-trash-alt"></i>{" "}
											Delete
										</button>
									</div>
								) : null}
							</div>
							<hr />
							<div className="row">
								<div className="col-12">
									{/* <h3>{event_data[0]}</h3>
           		 <br />
           		 {description} */}
									<button
										className="btn btn-dark"
										onClick={this.inquire}
										disabled={
											disabled ||
											this.props.disabledStatus
										}
									>
										<i className="fas fa-ticket-alt"></i>{" "}
										{buttonText}
									</button>
									<label className="pl-2 small">
										{this.props.disabledStatus}
									</label>

									<br />
									{/* {myEvent === true && (
									<Link
										to={
											"/event-stat/" +
											pagetitle +
											"/" +
											this.props.match.params.id
										}
									>
										<button className="btn btn-dark mt-2">
											<i className="fas fa-chart-bar"></i>{" "}
											View Event Stat
										</button>
									</Link>
								)} */}
									<div className="event-social-share-btns-div">
										<EmailShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<EmailIcon size={32} round />
										</EmailShareButton>

										<FacebookShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<FacebookIcon size={32} round />
										</FacebookShareButton>

										<LinkedinShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<LinkedinIcon size={32} round />
										</LinkedinShareButton>

										<RedditShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<RedditIcon size={32} round />
										</RedditShareButton>

										<TelegramShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<TelegramIcon size={32} round />
										</TelegramShareButton>

										<TwitterShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<TwitterIcon size={32} round />
										</TwitterShareButton>

										<WhatsappShareButton
											url={shareUrl}
											title={title}
											resetButtonStyle={false}
										>
											<WhatsappIcon size={32} round />
										</WhatsappShareButton>
									</div>

									<br />
									<br />

									{/* <button
								className="btn btn-dark"
								onClick={this.inquire}
								disabled={disabled || this.props.disabledStatus}
							>
								<i className="fas fa-ticket-alt"></i>{" "}
								{buttonText}
							</button> */}
								</div>
								<hr />
								<div className="row">
									<div className="card event-hero-sidebar">
										<img
											className="card-img-top event-image"
											src={image}
											alt="Event"
										/>

										<div className="card-header event-header">
											<img
												className="float-left"
												src={makeBlockie(event_data[9])}
												alt="User Identicon"
											/>
										</div>

										<div className="card-body">
											<h5 className="card-title event-title">
												{event_data[0]}
											</h5>
											{description}
										</div>

										<ul className="list-group list-group-flush">
											<li className="list-group-item ">
												{locations}
											</li>
											<li className="list-group-item">
												Category: {category}
											</li>
											<li className="list-group-item">
												Organizer: {ownerDetails}
											</li>
											{/* <li className="list-group-item">
											Organizer Name: {ownerDetails}
										</li> */}
											<li className="list-group-item">
												Price:{" "}
												<img
													src={"/images/" + symbol}
													className="event_price-image"
													alt="Event Price"
												/>{" "}
												{event_data[3]
													? numeral(price).format(
															"0.000"
													  )
													: "Free"}
												{event_data[3] ? " or " : ""}
												{event_data[3] ? (
													<img
														src={
															"/images/dollarsign.png"
														}
														className="event_price-image"
														alt="Event Price"
													/>
												) : (
													""
												)}
												{event_data[3]
													? numeral(
															price *
																this.state
																	.phoenixDAO_market
																	.usd
													  ).format("0.000")
													: ""}
											</li>
											<li className="list-group-item">
												{date.toLocaleDateString()} at{" "}
												{date.toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</li>
											<li className="list-group-item">
												Tickets: {event_data[6]}/
												{max_seats}
											</li>
										</ul>
									</div>

									<div className="col-12">
										{/* <div className="col-md-12 col-xs-12 col-sm-12 col-lg-7 clockDiv"> */}
										{this._isMounted && (
											<Clock
												deadline={date}
												event_unix={event_data[1]}
											/>
										)}
										{/* </div> */}
										{/* <div className="new-transaction-wrapper col-md-12 col-xs-12 col-sm-12 col-lg-5" style={{padding:"0px"}}>
										<h4 className="transactions">
											Share your event
										</h4>
										<div className="event-social-share-btns-div">
											<EmailShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<EmailIcon size={32} round />
											</EmailShareButton>

											<FacebookShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<FacebookIcon size={32} round />
											</FacebookShareButton>

											<LinkedinShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<LinkedinIcon size={32} round />
											</LinkedinShareButton>

											<RedditShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<RedditIcon size={32} round />
											</RedditShareButton>

											<TelegramShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<TelegramIcon size={32} round />
											</TelegramShareButton>

											<TwitterShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<TwitterIcon size={32} round />
											</TwitterShareButton>

											<WhatsappShareButton
												url={shareUrl}
												title={title}
												resetButtonStyle={false}
											>
												<WhatsappIcon size={32} round />
											</WhatsappShareButton>
										</div>
									  </div> */}
										<div className="new-transaction-wrapper">
											<h4 className="transactions col-md-12 ">
												Ticket Purchases
											</h4>
											{this.state.load && <Loading />}
											{this.state.pageTransactions.map(
												(sold, index) => (
													<p
														className="sold_text col-md-12"
														key={index}
													>
														<img
															className="float-left blockie"
															src={makeBlockie(
																sold
																	.returnValues
																	.buyer
															)}
														/>
														<a
															href={
																"https://rinkeby.etherscan.io/address/" +
																sold
																	.returnValues
																	.buyer
															}
															target="blank"
														>
															{sold.returnValues.buyer.slice(
																0,
																10
															) + "..."}
														</a>{" "}
														has{" "}
														<a
															href={
																"https://rinkeby.etherscan.io/tx/" +
																sold.transactionHash
															}
															target="blank"
														>
															bought
														</a>{" "}
														1 ticket for{" "}
														<strong>
															{event_data[0]}
														</strong>
														.
													</p>
												)
											)}
											{!sold && (
												<p className="sold_text col-md-12 no-tickets">
													There are currently no
													purchases for this ticket.
												</p>
											)}
										</div>
									</div>

									<div className="pagination col-12">
										<JwPagination
											items={this.state.soldTicket}
											onChangePage={this.onChangePage}
											maxPages={5}
											pageSize={5}
											styles={customStyles}
										/>
									</div>

									<div className="new-transaction-wrapper">
										<h4 className="transactions">
											<i className="fas fa-ticket-alt"></i>{" "}
											Ticket Sales Info
										</h4>
										{this.state.load && <Loading />}
										<div className="sold_text col-12">
											{/* <p className="myQR text-center col-md-3">
											<QRCode
												value={titleURL}
												size={128}
												bgColor="transparent"
												fgColor="black"
												level={"H"}
												imageSettings={{
													src:
														"/images/PhoenixDAO.png",
													height: 34,
													width: 34,
													x: null,
													y: 53,
													excavate: false,
												}}
											/>
											<p>Event QR-Code</p>
										</p> */}

											<p>
												Tickets Sold: {event_data[6]}{" "}
												Tickets
											</p>

											{event_data[4] ? (
												<p>
													Available Tickets:{" "}
													{max_seats - event_data[6]}{" "}
													Tickets
												</p>
											) : (
												<p>
													Available Tickets: Unlimited
												</p>
											)}

											{event_data[4] ? (
												<p>
													Total Tickets For Sale:{" "}
													{event_data[4]
														? max_seats
														: "Unlimited"}{" "}
													Tickets
												</p>
											) : (
												<p>
													Total Tickets For Sale:
													Unlimited
												</p>
											)}
										</div>
									</div>

									<div className="new-transaction-wrapper">
										<h4 className="transactions">
											<i className="fas fa-hand-holding-usd"></i>{" "}
											Ticket Revenue{" "}
										</h4>

										<div className="sold_text col-12">
											<div className="chart col-md-3">
												<Doughnut
													data={this.data}
													options={{
														responsive: true,
														maintainAspectRatio: false,
														cutoutPercentage: 62,

														title: {
															display: true,
															position: "bottom",
															text:
																"PHNX Revenue",
															fontSize: 16,
															lineHeight: 1.5,
															padding: 1.6,
															fontColor: "white",
														},
														legend: {
															display: false,
															labels: {
																fontColor:
																	"white",
																fontSize: 11,
															},
															tooltips: {
																enabled: true,
															},
														},
													}}
												/>
											</div>
											<p
												className="col-md-8"
												className="removepadding"
											>
												Price Per Ticket:{" "}
												<img
													src={"/images/" + symbol}
													className="event_price-image2"
													alt="Event Price"
												/>{" "}
												{event_data[3]
													? numeral(price).format(
															"0.000"
													  )
													: "Free"}
												{event_data[3] ? " or " : ""}
												{event_data[3] ? (
													<img
														src={
															"/images/dollarsign.png"
														}
														className="event_price-image2"
														alt="Event Price"
													/>
												) : (
													""
												)}
												{event_data[3]
													? numeral(
															price *
																this.state
																	.phoenixDAO_market
																	.usd
													  ).format("0.000")
													: ""}
											</p>

											<p
												className="col-md-8"
												className="removepadding"
											>
												Current Revenue For Sold
												Tickets:{" "}
												<img
													src={"/images/" + symbol}
													className="event_price-image2"
													alt="Event Price"
												/>{" "}
												{event_data[3]
													? numeral(
															price *
																event_data[6]
													  ).format("0.000")
													: price * event_data[6]}
												{event_data[3] ? " or " : ""}
												{event_data[3] ? (
													<img
														src={
															"/images/dollarsign.png"
														}
														className="event_price-image2"
														alt="Event Price"
													/>
												) : (
													""
												)}
												{event_data[3]
													? numeral(
															price *
																event_data[6] *
																this.state
																	.phoenixDAO_market
																	.usd
													  ).format("0.000")
													: ""}
											</p>

											{event_data[4] ? (
												<p
													className="col-md-8"
													className="removepadding"
												>
													Expected Revenue For
													Remaining Tickets:{" "}
													<img
														src={
															"/images/" + symbol
														}
														className="event_price-image2"
														alt="Event Price"
													/>{" "}
													{event_data[3]
														? numeral(
																price *
																	(max_seats -
																		event_data[6])
														  ).format("0.000")
														: price *
														  (max_seats -
																event_data[6])}
													{event_data[3]
														? " or "
														: ""}
													{event_data[3] ? (
														<img
															src={
																"/images/dollarsign.png"
															}
															className="event_price-image2"
															alt="Event Price"
														/>
													) : (
														""
													)}
													{event_data[3]
														? numeral(
																price *
																	(max_seats -
																		event_data[6]) *
																	this.state
																		.phoenixDAO_market
																		.usd
														  ).format("0.000")
														: ""}
												</p>
											) : (
												<p
													className="col-md-12"
													className="removepadding"
												>
													Expected Revenue For
													Remaining Tickets: Unlimited
												</p>
											)}

											{event_data[4] ? (
												<p
													className="col-md-8"
													className="removepadding"
												>
													Expected Revenue For Sold
													Out Event:{" "}
													<img
														src={
															"/images/" + symbol
														}
														className="event_price-image2"
														alt="Event Price"
													/>{" "}
													{event_data[3]
														? numeral(
																price *
																	max_seats
														  ).format("0.000")
														: price * max_seats}
													{event_data[3]
														? " or "
														: ""}
													{event_data[3] ? (
														<img
															src={
																"/images/dollarsign.png"
															}
															className="event_price-image2"
															alt="Event Price"
														/>
													) : (
														""
													)}
													{event_data[3]
														? numeral(
																price *
																	max_seats *
																	this.state
																		.phoenixDAO_market
																		.usd
														  ).format("0.000")
														: ""}
												</p>
											) : (
												<p
													className="col-md-12"
													className="removepadding"
												>
													Expected Revenue For Sold
													Out Event: Unlimited
												</p>
											)}
										</div>
									</div>
								</div>

								<div className="col-12">
									<div className="mt-5"></div>
									<CheckUser
										event_id={this.props.match.params.id}
										disabledStatus={disabled}
									/>
								</div>
								<hr />
							</div>
						</div>
					);
				} else {
					<div className="row">
						<h2>
							<i className="fa fa-calendar-alt"></i> Event
						</h2>
						<hr />
						body = <EventNotFound />
					</div>;
				}
			}
		}

		return (
			<div className="event-page-wrapper">
				<ApprovalModal
					open={this.state.open}
					handleClose={this.handleClose}
					giveApproval={this.giveApproval}
				/>
				{/* <hr /> */}
				{body}
				<hr />
			</div>
		);
	}

	componentDidMount() {
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
		console.log("myeventprops", this.props);
		this._isMounted = true;
		this.updateIPFS();
		this.loadblockhain();
		this.getPhoenixDAOMarketValue();
	}

	componentDidUpdate() {
		this.updateIPFS();
		console.log("eventstate", this.state);

		//this.afterApprove();
	}

	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

MyEventStat.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
	};
};

const AppContainer = drizzleConnect(MyEventStat, mapStateToProps);
export default AppContainer;
