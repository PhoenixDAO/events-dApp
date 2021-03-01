import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Web3 from "web3";
import Loading from "./Loading";
import { Bar, Doughnut } from "react-chartjs-2";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import UniswapModal from "./UniswapModal";
import topicsJson from "../config/topics.json";

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
		};

		this.contracts = context.drizzle.contracts;
		this.events = this.contracts["DaoEvents"].methods.eventsOf.cacheCall(
			this.props.accounts[0]
		);
		console.log("hey view my events now", this.events);

		this.account = this.props.accounts[0];
		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
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
			.getPastEvents("CreatedEvent", {
				filter: { owner: this.account },
				fromBlock: 5000000,
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
					console.log("myevents", this.state.MyEvents);
					setTimeout(() => this.setState({ loading: false }), 1000);
				}
			})
			.catch((err) => console.error(err));
	}

	async loadBockchain() {
		// let MyEvents = this.state;
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
			console.log("check props123", openEvents);
			this.setState({ openEvents: openEvents });
			this.setState({ MyEvents: [] });

			const blockNumber = await web3.eth.getBlockNumber();
			this.setState({ blocks: blockNumber - 50000 });
			this.setState({ latestblocks: blockNumber - 1 });
			this.loadActiveEvents();

			//Listen For My Newly Created Events
			this.state.openEvents.events
				.CreatedEvent({
					filter: { owner: this.account },
					fromBlock: blockNumber,
					toBlock: "latest",
				})
				.on("data", (log) =>
					setTimeout(() => {
						console.log("check props123", log);
						if (this.state.isActive) {
							this.setState({
								MyEvents: [...this.state.MyEvents, log],
							});
							var newest = this.state.MyEvents;
							var newsort = newest
								.concat()
								.sort((a, b) => b.blockNumber - a.blockNumber);

							this.setState({
								MyEvents: newsort,
								active_length: this.state.MyEvents.length,
							});
						}
					}, 10000)
				);
		}

		await openEvents
			.getPastEvents("DeletedEvent", {
				fromBlock: 7654042,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				console.log("eventsssss deletedEvents", events);
				this.setState({ Deleted_Events: events });
				return events;
			})
			.catch((err) => {
				console.error(err);
				this.setState({ Deleted_Events: [] });
			});
		let deletedArray = [];
		// var array1 = [];
		for (var key in this.state.MyEvents) {
			this.state.Deleted_Events.filter((data) => {
				if (
					data.returnValues.eventId ==
					this.state.MyEvents[key].returnValues.eventId
				) {
					deletedArray.push(data.returnValues.eventId);
				}
			});
		}
		// var array1 = this.state.MyEvents;
		// for (var key in this.state.MyEvents) {
		// 	for (var key2 in deletedArray) {
		// 		if (deletedArray[key] != this.state.MyEvents[key2]) {
		// 			array1.splice(key, 1);
		// 		}
		// 	}
		// }
		this.setState({
			// top5Events: array1,
			deletedArray: deletedArray,
		});
	}

	render() {
		let body = "";
		console.log("============>", this.state);
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
			console.log("hey123", eventCounts);

			var loading = true
			let eventCache = [];
			let eventDetails = [];
			if (eventCount !== undefined) {
				for (var i = 0; i < eventCount.length; i++) {
					eventCache.push(
						this.contracts["DaoEvents"].methods.getEvent.cacheCall(
							eventCount[i]
						)
					);
					if (
						typeof this.props.contracts["DaoEvents"].getEvent[
							eventCache[i]
						] !== "undefined" &&
						this.props.contracts["DaoEvents"].getEvent[
							eventCache[i]
						].value
					) {
						eventDetails.push({
							result: this.props.contracts["DaoEvents"].getEvent[
								eventCache[i]
							].value,
							id: eventCount[i],
						});
					}
				}
			}
			console.log("event details", eventDetails);

			//console.log(eventDetails)
			var sortBySold = eventDetails
				.concat()
				.sort((a, b) => b.result.sold - a.result.sold);
			let phoenixDAORevenue = eventDetails.filter(
				(event_token) => event_token.result.token == true
			);
			console.log("check phoen", phoenixDAORevenue);
			let limited = eventDetails.filter(
				(event_seats) => event_seats.result.limited == true
			);

			let top_PhoenixDAORevenue = phoenixDAORevenue
				.concat()
				.sort(
					(a, b) =>
						parseInt(
							b.result.sold *
								this.context.drizzle.web3.utils.fromWei(
									b.result.price
								)
						) -
						parseInt(
							a.result.sold *
								this.context.drizzle.web3.utils.fromWei(
									a.result.price
								)
						)
				);
			console.log("hey hey sort", sortBySold);
			var array1 = sortBySold;
			var array2 = this.state.deletedArray;
			var sortBySold = array1.filter(function (val) {
				return array2.indexOf(val.id) == -1;
			});
			let sortSold = [];
			let sortTopRevenue = [];
			let toplist = true;

			console.log("hey hey sort2", sortBySold);

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
			console.log("hey hey sort3", sortSold);

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
					accumulator + parseInt(currentValue.result.sold),
				0
			);
			let revenue = phoenixDAORevenue.reduce(
				(accumulator, currentValue) =>
					accumulator +
					parseInt(
						currentValue.result.sold *
							this.context.drizzle.web3.utils.fromWei(
								currentValue.result.price
							)
					),
				0
			);
			let soldSeats = limited.reduce(
				(accumulator, currentValue) =>
					accumulator + parseInt(currentValue.result.sold),
				0
			);
			let totalSeats = limited.reduce(
				(accumulator, currentValue) =>
					accumulator + parseInt(currentValue.result.seats),
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

			console.log("array sort12", topEvents);
			loading=false

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
				if (sortTopRevenue.length !== 0) {
					return {
						labels: sortTopRevenue.map((event) => [
							event.result.name,
						]),
						datasets: [
							{
								label: "PHNX",
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
								data: sortTopRevenue.map((event) =>
									parseInt(
										event.result.sold *
											this.context.drizzle.web3.utils.fromWei(
												event.result.price
											)
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
								label: "PHNX",
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
											{totalEvents.length}
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
														if(event.result.name!=""){
															console.log(
															"hey uo",
															event.result.name
														);
														return (
															<h4 className="eventTitle"
																key={index + 1}
																title={
																	event.result
																		.name
																}
																onClick={() =>
																	this.goTo(
																		event.id,
																		event
																			.result
																			.name
																	)
																}
															>
																<span>
																	{`${index+1}. `}
																</span>
																{
																	event.result
																		.name
																}
															</h4>
														);}
													}
												)}
											</div>
											<div className="dashboard-events-list-sale">
												<h4 className="mb-2">
													Tickets Sold
												</h4>
												{!loading && topEvents.map(
													(event, index) => {if(event.result.name!=""){
														return (
														<h4
															key={index}
															title={
																event.result
																	.sold +
																" Tickets Sold"
															}
															onClick={() =>
																this.goTo(
																	event.id,
																	event.result
																		.name
																)
															}
														>
															{event.result.sold}
														</h4>
													)}}
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
														"Based On PHNX Revenue",
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
											{numeral(revenue).format("0,0.00")}
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
												revenue *
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
	componentDidMount() {
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
		this._isMounted = true;
		this.getPhoenixDAOMarketValue();
		this.loadBockchain();
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
