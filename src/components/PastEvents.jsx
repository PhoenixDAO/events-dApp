import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { API_URL, REPORT_EVENT,graphURL } from "../config/const";
// Import dApp Components
// import Loading from "./Loading";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
// import {INFURA_WEB_URL} from "../config/const.js";

import Event from "./Event";
// import Web3 from "web3";
// import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";

// TODO: Make slides dynamic: import slidesJson from '../config/slides.json';
import topicsJson from "../config/topics.json";
import { getNetworkId } from "../config/getGraphApi";

class PastEvents extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			openEvents: "",
			blocks: 5000000,
			latestblocks: "",
			loading: true,
			past_length: "",
			isOldestFirst: false,
			past_events: [],
			past_events_copy: [],
			prevPath: -1,
			hideEvent: [],
			disabledBuying: false,
		};
		this.contracts = context.drizzle.contracts;
		this.eventCount = this.contracts[
			"DaoEvents"
		].methods.getEventsCount.cacheCall();
		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.myRef = React.createRef();
	}

	topicClick(slug) {
		this.props.history.push("/topic/" + slug + "/" + 1);
		window.scrollTo(0, 80);
	}

	readMoreClick(location) {
		this.props.history.push(location);
	}

	ctasClick(slug) {
		this.props.history.push("/" + slug);
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
	}

	caruselClick(location) {
		this.props.history.push(location);
	}
	executeScroll = () => this.myRef.current.scrollIntoView();

	//Load Blockchain Data
	async loadBlockchain() {

	// GRAPH BLOCK //
	// console.log("GraphQL query before call",Date.now())

	await axios({
		url: graphURL,
		method: 'post',
		data: {
		query: `
		{
			eventsRemoveds {
			id
			eventId
			}
		}
		`
		}
	}).then((graphDeletedEvents)=>{
		// console.log("GraphQL query all deleted events",graphDeletedEvents.data.data)

		if(!graphDeletedEvents.data || !graphDeletedEvents.data.data === undefined){
			this.setState({ Deleted_Events: [] });
		}else{
			this.setState({ Deleted_Events: graphDeletedEvents.data.data.eventsRemoveds });
		}
	}).catch((err)=>{
		console.error(err);
		this.setState({ Deleted_Events: [] });
	})


	await axios({
	url: graphURL,
	method: 'post',
	data: {
	query: `
	{
		events(first: 1000) {
		id
		eventId
		name
		time
		price
		token
		limited
		seats
		sold
		ipfs
		category
		owner
		revenueOfEvent
		}
	}
	`
	}
	}).then((graphEvents)=>{
	// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

	if(!graphEvents.data || graphEvents.data.data === undefined){
		// console.log("GraphQL query -- graphEvents undefined")
		this.setState({ past_events: [] ,past_events_copy: [],
			past_length: 0
			});
	}else{
		if (this._isMounted) {
			const dateTime = Date.now();
			const dateNow = Math.floor(dateTime / 1000);
			this.setState({ loading: true });
		
			let newsort = graphEvents.data.data.events
				.concat()
				.sort((a, b) => b.blockNumber - a.blockNumber)
				.filter(
					(pastEvents) =>
					pastEvents.time < dateNow
				)
					// console.log("GraphQL query newsort",newsort)
			
					this.setState({
						past_events: newsort,
						past_events_copy: newsort,
						past_length: newsort.length,
					});
			this.setState({ loading: false });
		}

	}

	}).catch((err) => console.error(err))
	}

	//Search Past Events By Name
	updateSearch = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			try {
				if (this.state.value !== "" && this.state.past_events_copy.length!==0) {
					var filteredEvents = this.state.past_events_copy;
					filteredEvents = filteredEvents.filter((events) => {
						return (
							events.name
								.toLowerCase()
								.search(this.state.value.toLowerCase()) !== -1
						);
					});
				} else {
					filteredEvents = this.state.past_events_copy;
				}
			} catch (exception) {}
			this.setState({
				past_events: filteredEvents,
				past_length: filteredEvents.length,
			});
			this.props.history.push("/pastevents/" + 1);
		});
	};
	toggleBuying = () => {
		this.setState({ disabledBuying: !this.state.disabledBuying });
	};
	//Sort Past Events By Newest/Oldest
	toggleSortDate = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			const { past_events } = this.state;
			const { ended } = past_events;
			var newPolls = ended;

			if (this.state.isOldestFirst) {
				newPolls = past_events
					.concat()
					.sort(
						(a, b) =>
							a.eventId - b.eventId
					);
			} else {
				newPolls = past_events
					.concat()
					.sort(
						(a, b) =>
							b.eventId - a.eventId
					);
			}

			this.setState({
				isOldestFirst: !this.state.isOldestFirst,
				past_events: newPolls,
			});
		});
	};

	render() {
		let body = <PhoenixDAOLoader />;
		if (
			typeof this.props.contracts["DaoEvents"].getEventsCount[
				this.eventCount
			] !== "undefined" &&
			this.state.active_length !== "undefined" &&
			this.state.loading !== true
		) {
			let count = this.state.past_length;
			if (this.state.loading) {
				body = <PhoenixDAOLoader />;
			} else if (count === 0 && !this.state.loading) {
				body = (
					<p className="text-center not-found">
						<span role="img" aria-label="thinking">
							🤔
						</span>
						&nbsp;No events found.{" "}
						<a href="/createevent">Try creating one.</a>
					</p>
				);
			} else {
				let currentPage = Number(this.props.match.params.page);
				let events_list = [];
				let skip = false;
				for (let i = 0; i < this.state.past_events.length; i++) {
					for (let j = 0; j < this.state.Deleted_Events.length; j++) {
						if (
							this.state.past_events[i].eventId ===
							this.state.Deleted_Events[j].eventId
						) {
							skip = true;
						}
					}
					if (!skip) {
						for (let j = 0; j < this.state.hideEvent.length; j++) {
							if (
								this.state.past_events[i]
									.eventId === this.state.hideEvent[j].id
							) {
								skip = true;
							}
						}
					}
					if (!skip) {
						events_list.push(this.state.past_events[i]);
					}
					skip = false;
				}
				events_list.reverse();
				let updated_list = [];
				count = events_list.length;
				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);
				for (let i = start; i < end; i++) {
					updated_list.push(
						<Event
							eventData={events_list[i]}
							toggleBuying={this.toggleBuying}
							disabledBuying={this.state.disabledBuying}
							key={events_list[i].eventId}
							id={events_list[i].eventId}
							ipfs={events_list[i].ipfs}
						/>
					);
				}
				let pagination = "";
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
										to={"/pastevents/" + i}
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
										to={"/pastevents/" + i}
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
										to={"/pastevents/" + i}
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
				if (updated_list.length === 0) {
					body = (
						<p className="text-center not-found">
							<span role="img" aria-label="thinking">
								🤔
							</span>
							&nbsp;No events found.{" "}
							<a href="/createevent">Try creating one.</a>
						</p>
					);
				} else {
					body = (
						<div>
							<div className="row user-list mt-4">
								{updated_list}
							</div>
							{pagination}
						</div>
					);
				}
			}
		}

		return (
			<React.Fragment>
				<div className="retract-page-inner-wrapper-alternative dashh">
					<div
						className="input-group input-group-lg"
						ref={this.myRef}
					>
						<div className="input-group-prepend">
							<span
								className="input-group-text search-icon"
								id="inputGroup-sizing-lg"
							>
								<i className="fa fa-search"></i>&nbsp;Search{" "}
							</span>
						</div>
						<input
							type="text"
							value={this.state.value}
							onChange={this.updateSearch.bind(this)}
							className="form-control"
							aria-label="Large"
							aria-describedby="inputGroup-sizing-sm"
						/>
					</div>
					<br />
					<br />

					<div>
						<div className="row row_mobile">
							<h2 className="col-lg-10 col-md-9 col-sm-8">
								<i className="fa fa-calendar-alt"></i> Past
								Events
							</h2>
							<button
								className="btn sort_button btn-dark col-lg-2 col-md-3 col-sm-3"
								value={this.state.value}
								onClick={this.toggleSortDate}
								onChange={this.toggleSortDate.bind(this)}
							>
								{this.state.isOldestFirst
									? "Sort: Oldest"
									: "Sort: Newest"}
							</button>
						</div>
						<hr />
						{body}
					</div>

					<br />
					<br />

					<div className="topics-wrapper">
						<h2>
							<i className="fa fa-calendar-alt"></i> Popular
							Topics
						</h2>
						<hr />
						<div className="row user-list mt-4">
							{topicsJson &&
								topicsJson
									.filter((topic) => topic.popular === "true")
									.map((topic, index) => {
										return (
											<div
												className="col-lg-4 pb-4 d-flex align-items-stretch"
												key={topic.slug}
											>
												<div
													className="topic"
													style={{
														backgroundImage:
															"url(/images/topics/" +
															topic.image +
															")",
													}}
													onClick={() => {
														this.topicClick(
															topic.slug
														);
													}}
												>
													<div className="topic-caption">
														<h3>{topic.name}</h3>
														<button className="btn">
															View Topic
														</button>
													</div>
												</div>
											</div>
										);
									})}

							<button
								className="btn read-more"
								onClick={() => {
									this.readMoreClick("/topics");
								}}
							>
								All Topics
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	filterHideEvent = async () => {
		try {
			const networkId = await getNetworkId();
            const get = await axios.get(
                `${API_URL}${REPORT_EVENT}/${networkId}`
            );
			this.setState({
				hideEvent: get.data.result,
			});
			return;
		} catch (error) {
		}
	};

	componentDidMount() {
		if (this.state.prevPath === -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		this._isMounted = true;
		this.loadBlockchain();
		this.filterHideEvent();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
}

PastEvents.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(PastEvents, mapStateToProps);
export default AppContainer;
