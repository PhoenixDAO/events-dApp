import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { API_URL, REPORT_EVENT } from "../config/const";
import axios from "axios";
import Web3 from "web3";
import Loading from "./Loading";
import { Bar, Doughnut } from "react-chartjs-2";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import UniswapModal from "./UniswapModal";
import topicsJson from "../config/topics.json";
import {INFURA_WEB_URL} from "../config/const.js";
let numeral = require("numeral");

class Dashboard extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			openEvents: "",
			blocks: 5000000,
			latestblocks: 6000000,
			loading: true,
			MyEvents: [],
			active_length: "",
			isOldestFirst: false,
			isActive: true,
			top5Events: [],
			account: [],
			sortedArrayLength: "",
			dateNow: "",
			prevPath: -1,
			Deleted_Events: [],
			PhoenixDAO_market: [],
			openModal: false,
			deletedArray: [],
			hideEvent: [],
			deletedArray2: [],
			revenue: 0,
		};

		this.contracts = context.drizzle.contracts;
		this.events = this.contracts["DaoEvents"].methods.eventsOf.cacheCall(
			this.props.accounts[0]
		);
		this.account = this.props.accounts[0];
		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.GetEventsRevenue = this.GetEventsRevenue.bind(this);
	}
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};
	topicClick(slug) {
		this.props.history.push("/topic/" + slug + "/" + 1);
		window.scrollTo(0, 180);
	}

	caruselClick(location) {
		this.props.history.push(location);
		window.scrollTo(0, 80);
	}

	goTo = (id, name) => {
		let rawTitle = name;
		var titleRemovedSpaces = rawTitle;
		titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");

		var pagetitle = titleRemovedSpaces
			.toLowerCase()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(" ");

		let myEventStatURL = "/event-stat/" + pagetitle + "/" + id;
		this.props.history.push(myEventStatURL);
	};

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

	async loadActiveEvents() {
		if (this._isMounted) {
			this.setState({ MyEvents: [], active_length: 0, loading: true });
		}

		this.state.openEvents
			.getPastEvents("NewAndUpdatedEvent", {
				filter: { owner: this.account },
				fromBlock: 8181618,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				var newest = events.filter(
					(activeEvents) =>
						activeEvents.returnValues.time >= this.state.dateNow
				);
				var newsort = newest
					.concat()
					.sort((a, b) => b.blockNumber - a.blockNumber);

				if (this._isMounted) {
					this.setState({ MyEvents: newsort, check: newsort });
					this.setState({
						active_length: this.state.MyEvents.length,
					});
					setTimeout(() => this.setState({ loading: false }), 1000);
				}
			})
			.catch((err) => console.error(err));
	}
	filterHideEvent = async () => {
		try {
			const get = await axios.get(`${API_URL}${REPORT_EVENT}`);
			if (get.data.result.length != 0) {
				this.setState({
					hideEvent: get.data.result,
				});
			}

			return;
		} catch (error) {
			console.log("check error", error);
		}
	};
	async loadBockchain() {
		// let MyEvents = this.state;
		const web3 = new Web3(
			new Web3.providers.WebsocketProvider(
			INFURA_WEB_URL
			)
		);
		const openEvents = new web3.eth.Contract(
			Open_events_ABI,
			Open_events_Address
		);
		if (this._isMounted) {
			this.setState({ openEvents: openEvents });
			this.setState({ MyEvents: [] });

			const blockNumber = await web3.eth.getBlockNumber();
			this.setState({ blocks: blockNumber - 50000 });
			this.setState({ latestblocks: blockNumber - 1 });
			this.loadActiveEvents();

			//Listen For My Newly Created Events

			await openEvents
				.getPastEvents("NewAndUpdatedEvent", {
					filter: { owner: this.account },
					fromBlock: 8181618,
					toBlock: this.state.latestblocks,
				})
				.then(async (events) => {
					if (this.state.isActive) {
						this.setState({
							MyEvents: events,
						});
						var newest = this.state.MyEvents;
						var newsort = newest
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber);
						const result = Object.values(
							newsort.reduce((a, c) => {
								a[c.returnValues.eventId] ||
									(a[c.returnValues.eventId] = Object.assign(
										c
									));
								return a;
							}, {})
						);
						this.setState({
							MyEvents: result,
							active_length: this.state.MyEvents.length,
						});
					}
				})
				.catch((err) => console.error(err));

			// this.state.openEvents.events
			// 	.NewAndUpdatedEvent({
			// 		filter: { owner: this.account },
			// 		fromBlock: blockNumber,
			// 		toBlock: "latest",
			// 	})
			// 	.on("data", (log) =>
			// 		setTimeout(() => {
			// 			console.log("check props123", log);
			// 			if (this.state.isActive) {
			// 				this.setState({
			// 					MyEvents: [...this.state.MyEvents, log],
			// 				});
			// 				var newest = this.state.MyEvents;
			// 				var newsort = newest
			// 					.concat()
			// 					.sort((a, b) => b.blockNumber - a.blockNumber);

			// 				this.setState({
			// 					MyEvents: newsort,
			// 					active_length: this.state.MyEvents.length,
			// 				});

			// 				console.log("myevents2", this.state.MyEvents);
			// 			}
			// 		}, 10000)
			// 	);
		}

		await openEvents
			.getPastEvents("DeletedEvent", {
				fromBlock: 8181618,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				this.setState({ Deleted_Events: events });
				return events;
			})
			.catch((err) => {
				this.setState({ Deleted_Events: [] });
			});
		let deletedArray = [];
		let deletedArray2 = [];
		let createdEventlen = 0;
		// var array1 = [];
		let skip = false;
		let skip2 = false;
		for (let i = 0; i < this.state.MyEvents.length; i++) {
			for (let j = 0; j < this.state.Deleted_Events.length; j++) {
				if (
					this.state.MyEvents[i].returnValues.eventId ==
					this.state.Deleted_Events[j].returnValues.eventId
				) {
					skip = true;
					skip2 = true;
				}
			}
			if (!skip) {
				for (let j = 0; j < this.state.hideEvent.length; j++) {
					if (
						this.state.MyEvents[i].returnValues.eventId ==
						this.state.hideEvent[j].id
					) {
						skip = true;
					}
				}
			}
			if (!skip2) {
				deletedArray2.push(this.state.MyEvents[i]);
			}
			if (!skip) {
				deletedArray.push(this.state.MyEvents[i]);
			}
			skip = false;
			skip2 = false;
		}
		// var array1 = this.state.MyEvents;
		// for (var key in this.state.MyEvents) {
		// 	for (var key2 in deletedArray) {
		// 		if (deletedArray[key] != this.state.MyEvents[key2]) {
		// 			array1.splice(key, 1);
		// 		}
		// 	}
		// }
		this.setState(
			{
				// top5Events: array1,
				deletedArray2: deletedArray2,
				deletedArray: deletedArray,
			},
			() => this.GetEventsRevenue(this.state.deletedArray)
		);
	}

	render() {
		let body = "";
		if (this.state.openModal) {
			return <UniswapModal />;
		}
		if (
			typeof this.props.contracts["DaoEvents"].eventsOf[this.events] !==
			"undefined"
		) {
			let eventCount = this.props.contracts["DaoEvents"].eventsOf[
				this.events
			].value;
			let eventCounts = this.props.contracts["DaoEvents"].eventsOf[
				this.events
			];
			var loading = true;
			let eventCache = [];
			let eventDetails = [];
			if (eventCount !== undefined) {
				for (var i = 0; i < eventCount.length; i++) {
					eventCache.push(
						this.contracts["DaoEvents"].methods.events.cacheCall(
							eventCount[i]
						)
					);
					if (
						typeof this.props.contracts["DaoEvents"].events[
							eventCache[i]
						] !== "undefined" &&
						this.props.contracts["DaoEvents"].events[eventCache[i]]
							.value
					) {
						eventDetails.push({
							returnValues: this.props.contracts["DaoEvents"]
								.events[eventCache[i]].value,
							id: eventCount[i],
						});
					}
				}
			}
			let CreatedEvent = this.state.deletedArray;
			var sortBySold = CreatedEvent.concat().sort(
				(a, b) => b.returnValues.sold - a.returnValues.sold
			);
			let phoenixDAORevenue = CreatedEvent.filter(
				(event_token) => event_token.returnValues.token == true
			);
			let limited = CreatedEvent.filter(
				(event_seats) => event_seats.returnValues.limited == true
			);

			let top_PhoenixDAORevenue = phoenixDAORevenue
				.concat()
				.sort(
					(a, b) =>
						parseInt(
							b.returnValues.sold *
								this.context.drizzle.web3.utils.fromWei(
									b.returnValues.price
								)
						) -
						parseInt(
							a.returnValues.sold *
								this.context.drizzle.web3.utils.fromWei(
									a.returnValues.price
								)
						)
				);
			var array1 = CreatedEvent;
			var array2 = this.state.deletedArray;
			// var sortBySold = array1.filter(function (val) {
			// 	return array2.indexOf(val.id) == -1;
			// });
			let sortSold = [];
			let sortTopRevenue = [];
			let toplist = true;
			if (sortBySold.length <= 0) {
				toplist = false;
			}

			if (sortBySold.length > 5) {
				for (var x = 0; x < 5; x++) {
					sortSold.push(sortBySold[x]);
				}
			} else {
				for (var x = 0; x < sortBySold.length; x++) {
					sortSold.push(sortBySold[x]);
				}
			}
			/*Get Top PhoenixDAO Revenue*/

			if (top_PhoenixDAORevenue.length > 5) {
				for (var x = 0; x < 5; x++) {
					sortTopRevenue.push(top_PhoenixDAORevenue[x]);
				}
			} else {
				for (var x = 0; x < top_PhoenixDAORevenue.length; x++) {
					sortTopRevenue.push(top_PhoenixDAORevenue[x]);
				}
			}

			let totalSold = sortBySold.reduce(
				(accumulator, currentValue) =>
					accumulator + parseInt(currentValue.returnValues.sold),
				0
			);
			let revenue = phoenixDAORevenue.reduce(
				(accumulator, currentValue) =>
					accumulator +
					parseInt(
						currentValue.returnValues.sold *
							this.context.drizzle.web3.utils.fromWei(
								currentValue.returnValues.price
							)
					),
				0
			);
			let soldSeats = limited.reduce(
				(accumulator, currentValue) =>
					accumulator + parseInt(currentValue.returnValues.sold),
				0
			);
			let totalSeats = limited.reduce(
				(accumulator, currentValue) =>
					accumulator + parseInt(currentValue.returnValues.seats),
				0
			);

			var array1 = eventDetails;
			var array2 = this.state.deletedArray;
			let totalEvents = array1.filter(function (val) {
				return array2.indexOf(val.id) == -1;
			});
			var array1 = sortSold;
			let topEvents = array1.filter(function (val) {
				return array2.indexOf(val.id) == -1;
			});
			let CreatedLength = this.state.deletedArray2.length;
			loading = false;

			// Doughnut Chart Data
			this.DoughnutData = (canvas) => {
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
				if (totalSeats !== 0) {
					return {
						labels: ["Sold Tickets", "Unsold Tickets"],
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
								data: [soldSeats, totalSeats - soldSeats],
							},
						],
					};
				} else {
					return {
						labels: ["Sold Tickets", "Unsold Tickets"],
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
								data: [0, -1],
							},
						],
					};
				}
			};

			this.BarData = (canvas) => {
				const ctx = canvas.getContext("2d");
				const gradient = ctx.createLinearGradient(
					800,
					200,
					500,
					800,
					200
				);
				gradient.addColorStop(1, "blue");
				gradient.addColorStop(0, "white");

				const gradient2 = ctx.createLinearGradient(
					100,
					120,
					100,
					100,
					200
				);
				gradient2.addColorStop(1, "rgb(104, 160, 206)");
				gradient2.addColorStop(0, "rgb(100, 101, 102)");
				if (topEvents.length !== 0) {
					return {
						labels: topEvents.map((event) => [
							// labels: sortTopRevenue.map((event) => [
							event.returnValues.name,
						]),
						datasets: [
							{
								label: "Ticket Sold",
								fontColor: "black",
								backgroundColor: [
									gradient,
									gradient,
									gradient,
									gradient,
									gradient,
								],
								borderColor: "white",
								borderWidth: 0.8,
								backgroundColor: [
									gradient,
									gradient,
									gradient,
									gradient,
									gradient,
								],
								hoverBorderColor: "pink",
								hoverBorderWidth: 1,
								weight: 5,
								borderAlign: "center",
								data: topEvents.map((event) =>
									parseInt(
										event.returnValues.sold
										// *this.context.drizzle.web3.utils.fromWei(
										// 		event.returnValues.price
										// 	)
									)
								),
							},
						],
					};
				} else {
					return {
						labels: ["You", "Havent", "Created", "Any", "Event"],
						datasets: [
							{
								label: "SOLD",
								fontColor: "black",
								backgroundColor: [
									gradient,
									gradient,
									gradient,
									gradient,
									gradient,
								],
								borderColor: "rgb(228, 83, 138)",
								borderWidth: 0.8,
								backgroundColor: [
									gradient,
									gradient,
									gradient,
									gradient,
									gradient,
								],
								hoverBorderColor: "pink",
								hoverBorderWidth: 1,
								weight: 5,
								borderAlign: "center",
								data: [10, 5, 10, 5, 10],
							},
						],
					};
				}
			};

			body = (
				<div className="retract-page-inner-wrapper-alternative dash">
					<div>
						<h2>
							<i className="fas fa-chalkboard-teacher"></i>{" "}
							Dashboard
						</h2>
						<hr />
						<div className="row user-list mt-4">
							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
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

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[21].image +
												")",
										}}
									>
										<h3>
											<i className="fa fa-edit"></i> Total
											Number Of Created Events
										</h3>

										<h4 className="dashboard-data">
											{CreatedLength}
										</h4>
										<p className="dashboard-footer">
											Events
										</p>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[12].image +
												")",
										}}
									>
										<h3>
											<i className="fas fa-ticket-alt"></i>{" "}
											Total Number Of Tickets Sold
										</h3>
										<h4 className="dashboard-data">
											{totalSold}
										</h4>
										<p className="dashboard-footer">
											Tickets
										</p>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-events-card">
									<div
										className="dashboard-events-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[17].image +
												")",
										}}
									>
										<h3 title="Top 5 Events Based On Ticket Sale">
											<i className="fas fa-trophy"></i>{" "}
											Your Top 5 Events
										</h3>
									</div>
									{!loading && toplist && (
										<div className="dashboard-events">
											<div className="dashboard-events-list">
												<Link to="/myevents/1">
													<h4 className="mb-2">
														Events
													</h4>
												</Link>
												{topEvents.map(
													(event, index) => {
														if (
															event.returnValues
																.name != ""
														) {
															return (
																<h4
																	className="eventTitle"
																	key={
																		index +
																		1
																	}
																	title={
																		event
																			.returnValues
																			.name
																	}
																	onClick={() =>
																		this.goTo(
																			event
																				.returnValues
																				.eventId,
																			event
																				.returnValues
																				.name
																		)
																	}
																>
																	<span>
																		{`${
																			index +
																			1
																		}. `}
																	</span>
																	{
																		event
																			.returnValues
																			.name
																	}
																</h4>
															);
														}
													}
												)}
											</div>
											<div className="dashboard-events-list-sale">
												<h4 className="mb-2">
													Tickets Sold
												</h4>
												{!loading &&
													topEvents.map(
														(event, index) => {
															if (
																event
																	.returnValues
																	.name != ""
															) {
																return (
																	<h4
																		key={
																			index
																		}
																		title={
																			event
																				.returnValues
																				.sold +
																			" Tickets Sold"
																		}
																		onClick={() =>
																			this.goTo(
																				event
																					.returnValues
																					.eventId,
																				event
																					.returnValues
																					.name
																			)
																		}
																	>
																		{
																			event
																				.returnValues
																				.sold
																		}
																	</h4>
																);
															}
														}
													)}
											</div>
										</div>
									)}

									{!toplist && (
										<div className="dashboard-events">
											<h4 className="dashboard-no-event mt-5">
												You haven't created an event yet
											</h4>
											<Link to="/createevent">
												Try to create one.
											</Link>
										</div>
									)}
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-events-card">
									<div
										className="dashboard-events-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[17].image +
												")",
										}}
									>
										<h3 title="Top 5 Events Based On PHNX Revenue">
											<i className="fas fa-award"></i>{" "}
											Your Top 5 Events
										</h3>
									</div>
									<div className="dashboard-bar">
										<Bar
											className="bars"
											options={{
												responsive: true,
												maintainAspectRatio: false,
												title: {
													display: true,
													position: "top",
													text:
														"Based On Ticket Sold",
													fontSize: 16,
													lineHeight: 1.5,
													padding: 1,
													fontColor: "white",
												},
												scales: {
													yAxes: [
														{
															ticks: {
																beginAtZero: true,
																fontSize: 10,
																fontColor:
																	"white",
																fontStyle:
																	"600",
																precision: 0,
															},
														},
													],
													xAxes: [
														{
															ticks: {
																beginAtZero: true,
																fontSize: 12,
																fontColor:
																	"white",
																fontStyle:
																	"600",
															},
															barPercentage: 1,
															display: false,
														},
													],
												},
												elements: {
													rectangle: {
														borderSkipped: "bottom",
													},
												},
											}}
											data={this.BarData}
										/>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-events-card">
									<div
										className="dashboard-events-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[12].image +
												")",
										}}
									>
										<h3 title="Overall Limited Tickets Sold">
											<i className="fas fa-ticket-alt"></i>{" "}
											Sold Tickets (Limited){" "}
										</h3>
									</div>
									<div className="dashboard-chart">
										<div className="mt-5">
											<Doughnut
												data={this.DoughnutData}
												options={{
													responsive: true,
													maintainAspectRatio: false,
													cutoutPercentage: 62,
													title: {
														display: true,
														position: "bottom",
														text:
															"Limited Tickets Sold",
														fontSize: 16,
														lineHeight: 1.5,
														padding: 1.6,
														fontColor: "white",
													},
													legend: {
														display: false,
														labels: {
															fontColor: "white",
															fontSize: 11,
														},
														tooltips: {
															enabled: true,
														},
													},
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/snowflake2.jpg)",
										}}
									>
										<h3>
											<img
												src={"/images/PhoenixDAO.png"}
												className="dashboard-PhoenixDAO"
												alt=""
											/>{" "}
											Total PHNX Revenue{" "}
										</h3>
										<h4 className="dashboard-data">
											{numeral(this.state.revenue).format(
												"0,0.00"
											)}
										</h4>
										<p className="dashboard-footer">PHNX</p>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/topics/" +
												topicsJson[20].image +
												")",
										}}
									>
										<h3>
											<i className="fas fa-hand-holding-usd"></i>{" "}
											Total Dollar Revenue{" "}
										</h3>
										<h4 className="dashboard-data">
											$
											{numeral(
												this.state.revenue *
													this.state.PhoenixDAO_market
														.usd
											).format("0,0.00")}
										</h4>
										<p className="dashboard-footer">USD</p>
									</div>
								</div>
							</div>

							<div className="col-lg-4 pb-4 d-flex align-items-stretch">
								<div className="dashboard-card">
									<div
										className="dashboard-caption"
										style={{
											backgroundImage:
												"url(/images/uniswaps.jpg)",
										}}
										onClick={this.handleClickOpen}
									>
										<p className="dashboard-uniswap">
											<i className="fas fa-sync"></i> BUY
											PHNX WITH UNISWAP
										</p>
									</div>
								</div>
							</div>
						</div>
						<hr />
					</div>
				</div>
			);
		}

		return (
			<React.Fragment>
				<UniswapModal
					open={this.state.open}
					handleClose={this.handleClose}
				/>
				{body}
			</React.Fragment>
		);
	}
	async GetEventsRevenue(deletedArray) {
		let revenue = 0;
		for (let i = 0; i < deletedArray.length; i++) {
			revenue =
				Number(
					await this.contracts["DaoEvents"].methods
						.eventRevenue(deletedArray[i].returnValues.eventId)
						.call()
				) + revenue;
		}
		revenue = revenue / 1000000000000000000;
		this.setState({ revenue });
	}

	componentDidMount() {
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
		this._isMounted = true;
		this.getPhoenixDAOMarketValue();
		this.loadBockchain();

		this.filterHideEvent();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
}

Dashboard.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(Dashboard, mapStateToProps);
export default AppContainer;
