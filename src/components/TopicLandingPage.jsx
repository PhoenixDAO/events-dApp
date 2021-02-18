import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Loading from "./Loading";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Event from "./Event";

import Web3 from "web3";
import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
import {
	DirectLink,
	Element,
	Events,
	animateScroll as scroll,
	scrollSpy,
	scroller,
} from "react-scroll";
// import {  Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import topicsJson from "../config/topics.json";

class TopicLandingPage extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			openEvents: "",
			blocks: 5000000,
			latestblocks: 6000000,
			blocks: 0,
			loading: true,
			Topic_Events: [],
			topic_copy: [],
			active_length: "",
			isOldestFirst: false,
			isActive: true,
			Deleted_Events: [],
			Filtered_Events_length: 0,

			dateNow: "",
		};

		this.contracts = context.drizzle.contracts;
		this.eventCount = this.contracts[
			"DaoEvents"
		].methods.getEventsCount.cacheCall();
		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.theTopic = this.getTopicData();
		this.topicBackground = this.theTopic["image"];

		this.ActiveEvent = this.ActiveEvent.bind(this);
		this.PastEvent = this.PastEvent.bind(this);
		this.toggleSortDate = this.toggleSortDate.bind(this);

		this.scrollTo = this.scrollTo.bind(this);
	}
	scrollTo() {
		scroller.scrollTo("scroll-to-element", {
			duration: 800,
			delay: 0,
			smooth: "easeInOutQuart",
		});
	}

	componentDidUpdate() {
		//this.theTopic = this.getTopicData();
	}

	componentDidMount() {
		this.scrollTo();
		this._isMounted = true;
		this.loadBlockchain();
		//this.theTopic = this.getTopicData();
	}

	componentWillUnmount() {}

	topicClick(slug) {
		this.ActiveEvent();
		this.props.history.push("/topic/" + slug + "/" + 1);
		this.theTopic = this.getTopicData();
		this.loadBlockchain();
		this.scrollTo();
	}

	getLastURLSegment() {
		console.log(this.props.history.location.pathname);
		let currentRoute = this.props.history.location.pathname;
		let middleSegment = currentRoute.split("/");
		//let lastSegment = currentRoute.substr(currentRoute.lastIndexOf('/') + 1);
		return middleSegment[middleSegment.length - 2];
	}

	getTopicData() {
		let topicSlug = this.getLastURLSegment();

		let theTopic = topicsJson.filter(function (topic) {
			return topic.slug == topicSlug;
		});

		return theTopic[0];
	}

	//Loadblockchain Data
	async loadBlockchain() {
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
			this.setState({ Topic_Events: [], active_length: 0 });

			const dateTime = Date.now();
			const dateNow = Math.floor(dateTime / 1000);
			const blockNumber = await web3.eth.getBlockNumber();

			this.setState({ dateNow });
			this.setState({ blocks: blockNumber });
			this.setState({ latestblocks: blockNumber - 1 });
			this.setState({ Topic_Events: [] });

			if (this.state.isActive) {
				this.loadActiveEvents();
			} else {
				this.loadPastEvents();
			}
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

		openEvents.events
			.CreatedEvent({ fromBlock: this.state.blocks, toBlock: "latest" })
			.on("data", (log) =>
				setTimeout(() => {
					if (
						this.state.isActive &&
						log.returnValues.category ===
							this.props.match.params.page
					) {
						this.setState({
							Topic_Events: [...this.state.Topic_Events, log],
						});
						var newest = this.state.Topic_Events;
						var newsort = newest
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber);
						if (this._isMounted) {
							//this.setState({incoming:false});
							this.setState({
								Topic_Events: newsort,
								topic_copy: newsort,
							});
							this.setState({
								active_length: this.state.Topic_Events.length,
							});
						}
					}
				}, 10000)
			);
	}

	//Get My Active Events on Blockchain
	async loadActiveEvents() {
		if (this._isMounted) {
			this.setState({ Topic_Events: [], active_length: 0 });
		}

		this.state.openEvents
			.getPastEvents("CreatedEvent", {
				fromBlock: 5000000,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				this.setState({ loading: true });
				var newest = events.filter(
					(activeEvents) =>
						activeEvents.returnValues.time >= this.state.dateNow &&
						activeEvents.returnValues.category ===
							this.props.match.params.page
				);
				var newsort = newest
					.concat()
					.sort((a, b) => b.blockNumber - a.blockNumber);

				if (this._isMounted) {
					this.setState({
						Topic_Events: newsort,
						topic_copy: newsort,
					});
					this.setState({
						active_length: this.state.Topic_Events.length,
					});
					setTimeout(() => this.setState({ loading: false }), 1000);
				}
			})
			.catch((err) => console.error(err));
	}

	//Get My Active Events on Blockchain
	async loadPastEvents() {
		if (this._isMounted) {
			this.setState({ Topic_Events: [], active_length: 0 });
		}

		this.state.openEvents
			.getPastEvents("CreatedEvent", {
				fromBlock: 5000000,
				toBlock: this.state.latestblocks,
			})
			.then((events) => {
				this.setState({ loading: true });
				var newest = events.filter(
					(activeEvents) =>
						activeEvents.returnValues.time <= this.state.dateNow &&
						activeEvents.returnValues.category ===
							this.props.match.params.page
				);
				var newsort = newest
					.concat()
					.sort((a, b) => b.blockNumber - a.blockNumber);

				if (this._isMounted) {
					this.setState({
						Topic_Events: newsort,
						topic_copy: newsort,
					});
					this.setState({
						active_length: this.state.Topic_Events.length,
					});
					setTimeout(() => this.setState({ loading: false }), 1000);
				}
			})
			.catch((err) => console.error(err));
	}

	//Display My Close Events
	PastEvent = (e) => {
		this.setState(
			{
				isActive: false,
				loading: true,
			},
			() => {
				if (!this.state.isActive) {
					this.loadPastEvents();
				}
			}
		);
	};

	//Display My Active Events
	ActiveEvent = (e) => {
		this.setState(
			{
				isActive: true,
				loading: true,
			},
			() => {
				if (this.state.isActive) {
					this.loadActiveEvents();
				}
			}
		);
	};

	//Search Active Events By Name
	updateSearch = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			try {
				if (this.state.value !== "") {
					var filteredEvents = this.state.topic_copy;
					filteredEvents = filteredEvents.filter((events) => {
						return (
							events.returnValues.name
								.toLowerCase()
								.search(this.state.value.toLowerCase()) !== -1
						);
					});
				} else {
					filteredEvents = this.state.topic_copy;
				}
			} catch (e) {}
			this.setState({
				Topic_Events: filteredEvents,
				active_length: filteredEvents.length,
			});
			this.props.history.push(
				"/topic/" + this.props.match.params.page + "/" + 1
			);
		});
	};

	//Sort Active Events By Date(Newest/Oldest)
	toggleSortDate = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			const { Topic_Events } = this.state;
			var newPolls = Topic_Events;

			if (this.state.isOldestFirst) {
				newPolls = Topic_Events.concat().sort(
					(a, b) => b.returnValues.eventId - a.returnValues.eventId
				);
			} else {
				newPolls = Topic_Events.concat().sort(
					(a, b) => a.returnValues.eventId - b.returnValues.eventId
				);
			}

			this.setState({
				isOldestFirst: !this.state.isOldestFirst,
				Topic_Events: newPolls,
			});
		});
	};

	// scrollTo() {
	//   scroller.scrollTo('scroll-to-element', {
	//     duration: 800,
	//     delay: 0,
	//     smooth: 'easeInOutQuart'
	//   })
	// }

	render() {
		let body = <Loading />;
		const topic = this.theTopic;

		if (
			typeof this.props.contracts["DaoEvents"].getEventsCount[
				this.eventCount
			] !== "undefined"
		) {
			let count = this.state.active_length;
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
				for (let i = 0; i < this.state.Topic_Events.length; i++) {
					for (let j = 0; j < this.state.Deleted_Events.length; j++) {
						if (
							this.state.Topic_Events[i].returnValues.eventId ==
							this.state.Deleted_Events[j].returnValues.eventId
						) {
							skip = true;
						}
					}
					if (!skip) {
						events_list.push(this.state.Topic_Events[i]);
					}
					skip = false;
				}
				console.log("events_list _lanht", events_list);
				if (events_list.length == 0) {
					console.log("events_list _lanht", events_list);

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
								disabledStatus={this.props.disabledStatus}
								inquire={this.props.inquire}
								key={events_list[i].returnValues.eventId}
								id={events_list[i].returnValues.eventId}
								ipfs={events_list[i].returnValues.ipfs}
							/>
						);
					}
					// updated_list.reverse();

					let pagination = "";
					if (pages > 1) {
						let links = [];

						for (let i = 1; i <= pages; i++) {
							let active = i === currentPage ? "active" : "";
							links.push(
								<li className={"page-item " + active} key={i}>
									<Link
										to={
											"/topic/" +
											this.props.match.params.page +
											"/" +
											i
										}
										className="page-link"
									>
										{i}
									</Link>
								</li>
							);
						}

						pagination = (
							<nav>
								<ul className="pagination justify-content-center">
									{links}
								</ul>
							</nav>
						);
					}

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
				<div className="retract-page-inner-wrapper">
					<div className="topic-hero-wrapper">
						<img
							src={"/images/topics/" + this.theTopic["image"]}
							alt={topic.name}
						/>
					</div>
				</div>

				<div className="retract-page-inner-wrapper-alternative dash topicsDiv">
					<br />
					<br />

					{/* <Element name="scroll-to-element" className="element"> */}
					<div
						id="scroll-to-element"
						className="input-group input-group-lg"
					>
						<div className="input-group-prepend ">
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
					{/* </Element> */}
					<br />
					<br />

					<div>
						<h2 className="">
							<i
								className={
									this.state.isActive
										? " fa fa-calendar-alt"
										: " fa fa-archive"
								}
							></i>
							{this.state.isActive ? " Active" : " Past"} Events
							In The <strong>{topic.name}</strong> Topic
						</h2>

						<div className="row row_mobile mt-4 mb-2">
							<button
								className="btn sort_button col-md-2 mx-2 mt-2 activeButton"
								onClick={this.ActiveEvent}
							>
								Active Events
							</button>
							<button
								className="btn sort_button col-md-2 mx-2 mt-2"
								onClick={this.PastEvent}
							>
								Past Events
							</button>
							<button
								className="btn sort_button col-md-2 mx-2 mt-2"
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
							<i className="fa fa-calendar-alt"></i> More Topics
						</h2>

						<hr />
						<div className="row user-list mt-4">
							{topicsJson.map((topic) => (
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
											this.topicClick(topic.slug);
										}}
									>
										<div className="topic-caption">
											<h3>{topic.name}</h3>
											<button className="btn sort_button col-md-2">
												View Topic
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

TopicLandingPage.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(TopicLandingPage, mapStateToProps);
export default AppContainer;
