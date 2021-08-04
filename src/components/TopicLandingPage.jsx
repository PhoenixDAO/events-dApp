import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./common/Header";

import Loading from "./Loading";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Event from "./Event";
import EmptyState from "./EmptyState";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
// import {INFURA_WEB_URL} from "../config/const.js";
// import Web3 from "web3";
// import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
// import {
// 	DirectLink,
// 	Element,
// 	Events,
// 	animateScroll as scroll,
// 	scrollSpy,
// 	scroller,
// } from "react-scroll";
// import {  Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import topicsJson from "../config/topics.json";

// material UI styles
import { withStyles } from "@material-ui/core/styles";
import { Divider, IconButton, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Slider from "./common/Slider";
import ConnectWalletButton from "./common/ConnectWalletButton";
import SearchBar from "./common/SearchBar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = (theme) => ({
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,
		display: "flex",
		flexDirection: "column",
		background: `#FCFCFD !important`,
		opacity: `1 !important`,
		marginLeft: -2,
	},
	root: {
		flexGrow: 1,
		width: "100%",
	},
	appBar: {
		"&.MuiPaper-elevation4": {
			boxShadow: "none",
		},
	},
	tabBar: {
		"&:hover, &:focus ": {
			outline: "none",
		},
		" &:active ": {
			borderBottom: "2.5px solid #413AE2",
		},
		"&.MuiTab-textColorPrimary.Mui-selected": {
			color: "#413AE2",
			borderBottom: "2.5px solid #413AE2",
		},
	},
	formControls: {
		"@media (min-width: 1024px)": {
			maxWidth: "20% !important",
			flex: "0 0 20% !important",
			marginLeft: "5%",
		},
		minWidth: 120,
		background: "#fff",
		"& .MuiInputBase-formControl": {
			"@media (max-width: 575px)": {
				marginLeft: "50px",
			},
		},
		"& .MuiSelect-root.MuiSelect-select": {
			fontWeight: 700,
			padding: "13px",
		},
		"& option": {
			padding: "10px",
		},
	},
	sortBy: {
		position: "absolute",
		left: "-40px",
		top: "15px",
		color: "#73727D",
		fontSize: "18px",
		"@media (max-width: 575px)": {
			left: "0",
		},
	},
});

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
			hideEvent: [],
			disabledBuying: false,
			eventCount: 0,
			dateNow: "",
		};
		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.theTopic = this.getTopicData();
		this.topicBackground = this.theTopic["image"];

		this.ActiveEvent = this.ActiveEvent.bind(this);
		this.PastEvent = this.PastEvent.bind(this);
		this.toggleSortDate = this.toggleSortDate.bind(this);
		this.myRef = React.createRef();

		this.scrollTo = this.scrollTo.bind(this);
		this.goBack = this.goBack.bind(this); // i think you are missing this
	}

	scrollTo() {
		this.myRef.current.scrollIntoView();
	}

	goBack() {
		this.props.history.goBack();
	}

	componentDidUpdate() {}

	componentDidMount() {
		this.scrollTo();
		this._isMounted = true;
		this.loadBlockchain();
		this.filterHideEvent();
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
		let currentRoute = this.props.history.location.pathname;
		let middleSegment = currentRoute.split("/");
		return middleSegment[middleSegment.length - 2];
	}

	getTopicData() {
		let topicSlug = this.getLastURLSegment();
		console.log("topicSlug", topicSlug);
		let theTopic = {};
		if (topicsJson[topicSlug]) {
			theTopic = topicsJson[topicSlug];
		}
		console.log("theTopic", theTopic);
		return theTopic.name;
	}

	//Loadblockchain Data
	async loadBlockchain() {
		if (this._isMounted) {
			this.setState({
				loading: true,
				Topic_Events: [],
				active_length: 0,
			});
		}
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
			  {
				eventsRemoveds {
				  id
				  eventId
				}
			  }
			  `,
			},
		})
			.then((graphDeletedEvents) => {
				if (
					!graphDeletedEvents.data ||
					!graphDeletedEvents.data.data == "undefined"
				) {
					this.setState({ Deleted_Events: [] });
				} else {
					this.setState({
						Deleted_Events:
							graphDeletedEvents.data.data.eventsRemoveds,
					});
				}
			})
			.catch((err) => {
				console.error(err);
				this.setState({ Deleted_Events: [] });
			});
		if (this.state.isActive) {
			this.loadActiveEvents();
		} else {
			this.loadPastEvents();
		}
	}

	//Get My Active Events on Blockchain
	async loadActiveEvents() {
		if (this._isMounted) {
			this.setState({
				loading: true,
				Topic_Events: [],
				active_length: 0,
			});
		}
		const dateTime = Date.now();
		const dateNow = Math.floor(dateTime / 1000);
		// GRAPH BLOCK //
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
				{
					events( where:{topic:"${this.props.match.params.page}" time_gte: "${dateNow}"} orderBy:time orderDirection:desc) {
						id
						eventId
						owner
						name
						topic
						location
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						duration
						catTktQuantity
						catTktQuantitySold	
						categories
						prices
						eventRevenueInDollar
						eventRevenueInPhnx
					}
					
				  }
  	`,
			},
		})
			.then((graphEvents) => {
				// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					// console.log("GraphQL query -- graphEvents undefined")
					console.log("topic data", graphEvents.data);
					this.setState({
						loading: false,
						Topic_Events: [],
						active_length: 0,
					});
				} else {
					if (this._isMounted) {
						console.log("topic data", graphEvents.data);
						console.log("topic data", graphEvents.data.data.events);
						let newsort = graphEvents.data.data.events
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber);
						// .filter(
						// 	(activeEvents) =>{
						// 		console.log("activeEvents", activeEvents.topic)
						// 		console.log("this.props.match.params.page", this.props.match.params.page)
						// 		// activeEvents.time >= dateNow &&
						// 		activeEvents.topic ===
						// 			this.props.match.params.page}
						// );
						console.log("GraphQL query newsort", newsort);
						if (this._isMounted) {
							this.setState({
								Topic_Events: newsort,
								topic_copy: newsort,
								active_length: newsort.length,
								loading: false,
							});
						}
						this.setState({ loading: false });
					}
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	}

	// Get My Past Events on Blockchain
	async loadPastEvents() {
		// console.log("inLoadPastEvents")
		if (this._isMounted) {
			this.setState({
				loading: true,
				Topic_Events: [],
				active_length: 0,
			});
		}

		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
				{
					events(orderBy:eventId orderDirection:asc) {
						id
						eventId
						owner
						name
						topic
						location
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						duration
						catTktQuantity
						catTktQuantitySold	
						categories
						prices
						eventRevenueInDollar
						eventRevenueInPhnx
					}
				  }
		`,
			},
		})
			.then((graphEvents) => {
				// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					// console.log("GraphQL query -- graphEvents undefined")
					this.setState({
						loading: false,
						Topic_Events: [],
						active_length: 0,
					});
				} else {
					if (this._isMounted) {
						const dateTime = Date.now();
						const dateNow = Math.floor(dateTime / 1000);
						let newsort = graphEvents.data.data.events
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber)
							.filter(
								(activeEvents) =>
									activeEvents.time < dateNow &&
									activeEvents.category ===
										this.props.match.params.page
							);
						// console.log("GraphQL query newsort",newsort)

						if (this._isMounted) {
							this.setState({
								Topic_Events: newsort,
								topic_copy: newsort,
								active_length: newsort.length,
								loading: false,
							});
						}
						this.setState({ loading: false });
					}
				}
			})
			.catch((err) => console.error(err));
	}

	// Display My Close Events

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
				if (
					this.state.value !== "" &&
					this.state.topic_copy.length != 0
				) {
					var filteredEvents = this.state.topic_copy;
					filteredEvents = filteredEvents.filter((events) => {
						return (
							events.name
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

	toggleBuying = () => {
		this.setState({ disabledBuying: !this.state.disabledBuying });
	};

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
	//Sort Active Events By Date(Newest/Oldest)
	toggleSortDate = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			const { Topic_Events } = this.state;
			var newPolls = Topic_Events;

			if (this.state.isOldestFirst) {
				newPolls = Topic_Events.concat().sort(
					(a, b) => a.eventId - b.eventId
				);
			} else {
				newPolls = Topic_Events.concat().sort(
					(a, b) => b.eventId - a.eventId
				);
			}

			this.setState({
				isOldestFirst: !this.state.isOldestFirst,
				Topic_Events: newPolls,
			});
		});
	};

	render() {
		const { classes } = this.props;
		let body = <Loading />;
		const topic = this.theTopic;

		// if (
		// this.state.active_length == 0
		// ) {
		let count = this.state.active_length;
		if (this.state.loading) {
			body = <PhoenixDAOLoader />;
		} else if (count === 0 && !this.state.loading) {
			body = (
				<EmptyState
					text="No events found 🤔.Be the first;"
					btnText="Try creating one"
					url="/createevent"
				/>
			);
		} else {
			// console.log("this.props.match.params.page",this.props.match.params.id)
			let currentPage = Number(this.props.match.params.id);
			let events_list = [];
			let skip = false;
			for (let i = 0; i < this.state.Topic_Events.length; i++) {
				for (let j = 0; j < this.state.Deleted_Events.length; j++) {
					if (
						this.state.Topic_Events[i].eventId ==
						this.state.Deleted_Events[j].eventId
					) {
						skip = true;
					}
				}
				if (!skip) {
					for (let j = 0; j < this.state.hideEvent.length; j++) {
						if (
							this.state.Topic_Events[i].eventId ==
							this.state.hideEvent[j].id
						) {
							skip = true;
						}
					}
				}
				if (!skip) {
					events_list.push(this.state.Topic_Events[i]);
				}
				skip = false;
			}
			if (events_list.length == 0) {
				body = (
					<EmptyState
						text="No events found 🤔.Be the first;"
						btnText="Try creating one"
						url="/createevent"
					/>
				);
			} else {
				let updated_list = [];
				// console.log("events_list",events_list)
				count = events_list.length;
				// console.log("currentPage",currentPage)
				// console.log("this.perPage",this.perPage)
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
							disabledStatus={this.props.disabledStatus}
							inquire={this.props.inquire}
							key={events_list[i].eventId}
							id={events_list[i].eventId}
							ipfs={events_list[i].ipfs}
						/>
					);
				}
				// console.log("updated_list",updated_list)
				// updated_list.reverse();

				let pagination = "";
				if (pages > 1) {
					let links = [];

					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li
								className={"page-item " + active}
								key={i}
								onClick={this.scrollTo()}
							>
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
						<div className="row user-list mt-4">{updated_list}</div>
						{pagination}
					</div>
				);
			}
		}

		return (
			<React.Fragment>
				{/* <div className="retract-page-inner-wrapper">
					<div className="topic-hero-wrapper">
						<img
							src={"/images/topics/" + this.theTopic["image"]}
							alt={topic.name}
						/>
					</div>
				</div> */}

				<div className="retract-page-inner-wrapper-alternative dash topicsDiv">
					<Header
						// title={this.theTopic.name}
						title={topic}
						phnxButton={true}
						goBack={this.goBack}
						page="topic"
					/>
					<br />
					<br />
					<div
						id="scroll-to-element"
						ref={this.myRef}
						// className="input-group input-group-lg"
					/>

					{/* slider */}
					<div>
						<div>
							<Slider />
						</div>
					</div>
					<br />
					<br />
					<br />

					{/* <div
						id="scroll-to-element"
						ref={this.myRef}
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
					</div> */}

					<div>
						{/* <h2 className="">
							<i
								className={
									this.state.isActive
										? " fa fa-calendar-alt"
										: " fa fa-archive"
								}
							></i>
							{this.state.isActive ? " Active" : " Past"} Events
							In The <strong>{topic.name}</strong> Topic
						</h2> */}

						{/* <div className="row row_mobile mt-4 mb-2">
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
						</div> */}

						<div className="row row_mobile dashboard-dropdown-row">
							<h2 className="col-lg-9 col-md-8 col-sm-7 main-title">
								{topic}
							</h2>
							<FormControl
								variant="outlined"
								className={`col-lg-3 col-md-4 col-sm-5 ${classes.formControls}`}
							>
								<Typography
									variant="p"
									className={classes.sortBy}
								>
									Sort:
								</Typography>
								<Select
									native
									//value={this.state.category}
									//onChange={this.categoryChange}
								>
									<option id="0">All Events</option>
									<option id="1">Trending Events</option>
									<option id="2">Near you</option>
								</Select>
							</FormControl>
						</div>

						<br />
						<br />

						{body}
					</div>

					{/* 
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
					</div> */}
				</div>
			</React.Fragment>
		);
	}
}

// TopicLandingPage.contextTypes = {
// 	drizzle: PropTypes.object,
// };

// const mapStateToProps = (state) => {
// 	return {
// 		contracts: state.contracts,
// 		accounts: state.accounts,
// 	};
// };

// const AppContainer = drizzleConnect(TopicLandingPage, mapStateToProps);
export default withStyles(useStyles)(TopicLandingPage);
