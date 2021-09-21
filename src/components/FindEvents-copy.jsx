import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import Carousel from "react-bootstrap/Carousel";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import axios from "axios";
// Import dApp Components
// import Loading from "./Loading";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Event from "./Event";
import EmptyState from "./EmptyState";
// import Web3 from "web3";
// import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
// import { INFURA_WEB_URL } from "../config/const.js";

// TODO: Make slides dynamic: import slidesJson from '../config/slides.json';
import topicsJson from "../config/topics.json";
// import eventCTAsJson from "../config/event_ctas.json";
import Header from "./common/Header";

//Material UI styles
import { withStyles } from "@material-ui/core/styles";
import {
	AppBar,
	Tabs,
	Tab,
	Divider,
	InputLabel,
	Grid,
	Typography,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Slider from "./common/Slider";
import roundlogo from "./Images/roundlogo.svg";
import ConnectWalletButton from "./common/ConnectWalletButton";
import SearchBar from "./common/SearchBar";
import { getNetworkId } from "../config/getGraphApi";

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
		"& .MuiTabScrollButton-root": {
			"& .MuiSvgIcon-root": {
				background: "#413AE2",
				borderRadius: "10px",
				color: "#fff",
			},
		},
		"& .MuiTabScrollButton-root.Mui-disabled": {
			position: "absolute",
		},
	},
	tabBar: {
		fontWeight: "500",
		fontFamily: '"Aeonik" ,sans-serif',
		textTransform: "Capitalize",

		"&:hover, &:focus ": {
			outline: "none",
		},
		" &:active ": {
			borderBottom: "2.5px solid #413AE2",
		},
		"&.MuiTab-textColorPrimary.Mui-selected": {
			color: "#413AE2",
			borderBottom: "2.5px solid #413AE2",
			fontWeight: "700",
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
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	sortBy: {
		position: "absolute",
		left: "-50px",
		top: "15px",
		color: "#73727D",
		fontSize: "18px",
		"@media (max-width: 575px)": {
			left: "0",
		},
	},
});

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
}

class FindEventsTest extends Component {
	// _isMounted = false;

	constructor(props, context) {
		super(props);
		// console.log("props", props);
		this.state = {
			openEvents: "",
			upload: false,
			blocks: 5000000,
			latestblocks: 6000000,
			loading: true,
			Events_Blockchain: [],
			Deleted_Events: [],
			Updated_Events: [],
			// active_length: "",
			isOldestFirst: false,
			event_copy: [],
			prevPath: -1,
			hideEvent: [],
			selectedTab: "allevents",
			eventCount: 0,
			category: "allevents",
		};

		// this.contracts = context.drizzle.contracts;
		// this.eventCount = this.contracts["DaoEvents"].methods.getEventsCount.cacheCall();

		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.myRef = React.createRef();

		this.toggleSortDate = this.toggleSortDate.bind(this);
		this.categoryChange = this.categoryChange.bind(this);
	}

	async categoryChange(event) {
		if (event.target.value === "populartopics") {
			this.props.history.push("/topics");
		} else {
			this.setState({ category: event.target.value });
			let query;
			if (event.target.value === "allevents") {
				query = `
				{
				  events(orderBy:eventId orderDirection:asc) {
					  id
					  eventId
					  owner
					  name
					  topic
					  location
					  city
					  ipfsHash
					  tktLimited
					  tktTotalQuantity
					  tktTotalQuantitySold
					  oneTimeBuy
					  token
					  time
					  onsite
					  catTktQuantity
					  catTktQuantitySold	
					  categories
					  prices
					  eventRevenueInDollar
					  eventRevenueInPhnx
				  }
				}
				`;
			} else {
				query = `
				{
				  events(where: {tktTotalQuantitySold_gte: 5} orderBy:eventId orderDirection:asc) {
					  id
					  eventId
					  owner
					  name
					  topic
					  location
					  city
					  ipfsHash
					  tktLimited
					  tktTotalQuantity
					  tktTotalQuantitySold
					  oneTimeBuy
					  token
					  time
					  onsite
					  catTktQuantity
					  catTktQuantitySold	
					  categories
					  prices
					  eventRevenueInDollar
					  eventRevenueInPhnx
				  }
				}
				`;
			}
			this.loadBlockchain(query);
		}
	}

	topicClick(slug) {
		this.props.history.push("/topic/" + slug + "/" + 1);
		window.scrollTo(0, 80);
	}

	readMoreClick(location) {
		this.props.history.push(location);
		// window.scrollTo(0, 0);
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

	executeScroll = () => {
		this.myRef.current.scrollIntoView();
	};

	//Loads Blockhain Data,
	async loadBlockchain(query) {
		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())

		// await axios({
		// 	url: graphURL,
		// 	method: "post",
		// 	data: {
		// 		query: `
		// 		  {
		// 			eventsRemoveds {
		// 			  id
		// 			  eventId
		// 			}
		// 		  }
		// 		  `,
		// 	},
		// })
		// 	.then((graphDeletedEvents) => {
		// 		// console.log("GraphQL query all deleted events",graphDeletedEvents.data.data)
		// 		if (
		// 			!graphDeletedEvents.data ||
		// 			!graphDeletedEvents.data.data == "undefined"
		// 		) {
		// 			this.setState({ Deleted_Events: [] });
		// 		} else {
		// 			console.log("Deleted_Events", graphDeletedEvents.data);
		// 			this.setState({
		// 				Deleted_Events:
		// 					graphDeletedEvents.data.data.eventsRemoveds,
		// 			});
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 		this.setState({ Deleted_Events: [] });
		// 	});

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: query,
			},
		})
			.then((graphEvents) => {
				console.log(
					"GraphQL query response",
					Date.now(),
					graphEvents.data.data.events
				);

				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					console.log("GraphQL query -- graphEvents undefined");
					this.setState({
						Events_Blockchain: [],
						// active_length: 0,
						event_copy: [],
					});
				} else {
					// if (this._isMounted) {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					this.setState({ loading: true });
					// console.log("events", graphEvents.data.data.events);
					let newsort = graphEvents.data.data.events
						.concat()
						.sort((a, b) => b.blockNumber - a.blockNumber)
						.filter((activeEvents) => activeEvents.time >= dateNow);
					// console.log("GraphQL query newsort",newsort)

					this.setState({
						Events_Blockchain: newsort,
						// active_length: newsort.length,
						event_copy: newsort,
					});
					this.setState({ loading: false });
					// }
				}
			})
			.catch((err) => console.error(err));
	}

	//Search Active Events By Name
	updateSearch = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			try {
				if (this.state.value !== "") {
					var filteredEvents = this.state.event_copy;
					filteredEvents = filteredEvents.filter((event) => {
						return (
							event.name
								.toLowerCase()
								.search(this.state.value.toLowerCase()) !== -1
						);
					});
				} else {
					filteredEvents = this.state.event_copy;
				}
			} catch (e) {
				console.log(e);
			}
			this.setState({
				Events_Blockchain: filteredEvents,
				// active_length: filteredEvents.length,
			});
			this.props.history.push("/upcomingevents/" + 1);
		});
	};

	//Sort Active Events By Date(Newest/Oldest)
	toggleSortDate = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			const { Events_Blockchain } = this.state;
			const { ended } = Events_Blockchain;
			var newPolls = ended;

			if (this.state.isOldestFirst) {
				newPolls = Events_Blockchain.concat().sort(
					(a, b) => a.eventId - b.eventId
				);
			} else {
				newPolls = Events_Blockchain.concat().sort(
					(a, b) => b.eventId - a.eventId
				);
			}

			this.setState({
				isOldestFirst: !this.state.isOldestFirst,
				Events_Blockchain: newPolls,
			});
		});
	};

	filterHideEvent = async () => {
		try {
			const networkId = await getNetworkId();
            const get = await axios.get(
                `${API_URL}${REPORT_EVENT}/${networkId}`
            );			this.setState({
				hideEvent: get.data.result,
			});
			// console.log("hide event", this.state.hideEvent);
			return;
		} catch (error) {
			console.log("check error", error);
		}
	};

	onTabChange = (event, newValue) => {
		this.setState({ selectedTab: newValue });
		let query;
		if (newValue === "allevents") {
			query = `
			{	
			  events(orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "neartoyou") {
			//to discuss with Hugbo Clement
			console.log(newValue);
		} else if (newValue === "today") {
			console.log(newValue);
			var todaydate = new Date();
			todaydate.setDate(todaydate.getDate() + 1);
			todaydate = parseInt(
				(new Date(todaydate).getTime() / 1000).toFixed(0)
			);
			console.log(todaydate);
			query = `
			{
			  events(where: {time_lte: ${todaydate} } orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "thisweek") {
			console.log(newValue);
			var thisWeekdate = new Date();
			thisWeekdate.setDate(thisWeekdate.getDate() + 7);
			thisWeekdate = parseInt(
				(new Date(thisWeekdate).getTime() / 1000).toFixed(0)
			);
			console.log(thisWeekdate);
			query = `
				{
				  events(where: {time_lte: ${thisWeekdate} } orderBy:eventId orderDirection:asc) {
					  id
					  eventId
					  owner
					  name
					  topic
					  location
					  city
					  ipfsHash
					  tktLimited
					  tktTotalQuantity
					  tktTotalQuantitySold
					  oneTimeBuy
					  token
					  time
					  onsite
					  catTktQuantity
					  catTktQuantitySold	
					  categories
					  prices
					  eventRevenueInDollar
					  eventRevenueInPhnx
				  }
				}
				`;
			this.loadBlockchain(query);
		} else if (newValue === "thismonth") {
			console.log(newValue);
			var thisMonthdate = new Date();
			thisMonthdate.setDate(thisMonthdate.getDate() + 30);
			thisMonthdate = parseInt(
				(new Date(thisMonthdate).getTime() / 1000).toFixed(0)
			);
			console.log(thisMonthdate);
			query = `
			{
			  events(where: {time_lte: ${thisMonthdate} } orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "paidevents") {
			console.log(newValue);
			query = `
			{	
			  events(where: {token: true} orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "freeevents") {
			console.log(newValue);
			query = `
			{	
			  events(where: {token: false} orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "onlineevents") {
			console.log(newValue);
			query = `
			{	
			  events(where: {onsite: false} orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else if (newValue === "physicalevents") {
			console.log(newValue);
			query = `
			{	
			  events(where: {onsite: true} orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		} else {
			console.log(newValue);
			query = `
			{	
			  events(orderBy:eventId orderDirection:asc) {
				  id
				  eventId
				  owner
				  name
				  topic
				  location
				  city
				  ipfsHash
				  tktLimited
				  tktTotalQuantity
				  tktTotalQuantitySold
				  oneTimeBuy
				  token
				  time
				  onsite
				  catTktQuantity
				  catTktQuantitySold	
				  categories
				  prices
				  eventRevenueInDollar
				  eventRevenueInPhnx
			  }
			}
			`;
			this.loadBlockchain(query);
		}
	};

	// async componentDidMount() {
	// 	console.log("props", this.props);
	// 	let eventCount = await this.props.eventsContract.methods
	// 		.getEventsCount()
	// 		.call();
	// 	console.log("event contract", this.props.eventsContract);
	// 	if (eventCount) {
	// 		this.setState({ eventCount });
	// 	}
	// }

	render() {
		//when user is not connectd hide connect wallet button
		// console.log("accounts---->", this.props.accounts);

		const { classes } = this.props;
		let body = <PhoenixDAOLoader />;

		// if (
		// 	// typeof this.props.contracts["DaoEvents"].getEventsCount[
		// 	// 	this.eventCount
		// 	// ] !== "undefined"

		// 	// this.state.eventCount == 0
		// 	// &&
		// 	this.state.active_length !== ""
		// ) {
		let count = this.state.Events_Blockchain.length;
		if (this.state.loading) {
			body = <PhoenixDAOLoader />;
		} else if (
			this.state.Events_Blockchain.length === 0 &&
			!this.state.loading
		) {
			body = (
				<EmptyState
					text="No events found 🤔.Be the first;"
					btnText="Try creating one"
					url="/createevent"
				/>
			);
		} else {
			let currentPage = Number(this.props.match.params.page);
			let events_list = [];
			let skip = false;
			for (let i = 0; i < this.state.Events_Blockchain.length; i++) {
				for (let j = 0; j < this.state.Deleted_Events.length; j++) {
					if (
						this.state.Events_Blockchain[i].eventId ==
						this.state.Deleted_Events[j].eventId
					) {
						skip = true;
					}
				}
				if (!skip) {
					for (let j = 0; j < this.state.hideEvent.length; j++) {
						if (
							this.state.Events_Blockchain[i].eventId ==
							this.state.hideEvent[j].id
						) {
							skip = true;
						}
					}
				}
				if (!skip) {
					events_list.push(this.state.Events_Blockchain[i]);
				}
				skip = false;
			}

			events_list.reverse();
			// console.log("events_listt",events_list)
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
						toggleBuying={this.props.toggleDisabling}
						disabledStatus={this.props.disabledStatus}
						inquire={this.props.inquire}
						key={events_list[i].eventId}
						id={events_list[i].eventId}
						ipfs={events_list[i].ipfsHash}
						eventData={events_list[i]}
					/>
				);
			}

			let pagination = "";
			if (pages > 1) {
				let links = [];

				if (pages > 5 && currentPage >= 3) {
					// console.log("pag pages > 5 && currentPage >= 3");
					for (
						let i = currentPage - 2;
						i <= currentPage + 2 && i <= pages;
						i++
					) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/upcomingevents/" + i}
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
						if (this.state.prevPath != -1) {
							this.executeScroll({
								behavior: "smooth",
								block: "start",
							});
						}
					}
				} else if (pages > 5 && currentPage < 3) {
					// console.log("pag pages > 5 && currentPage < 3");
					for (let i = 1; i <= 5 && i <= pages; i++) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/upcomingevents/" + i}
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
						if (this.state.prevPath != -1) {
							this.executeScroll({
								behavior: "smooth",
								block: "start",
							});
						}
					}
				} else {
					// console.log("pag else");
					for (let i = 1; i <= pages; i++) {
						let active = i === currentPage ? "active" : "";
						links.push(
							<li className={"page-item " + active} key={i}>
								<Link
									to={"/upcomingevents/" + i}
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
						if (this.state.prevPath != -1) {
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
			if (updated_list.length == 0) {
				body = (
					<EmptyState
					text="No events found 🤔. Be the first;"
					btnText="Try creating one"
					url="/createevent"
				/>
				);
			} else {
				body = (
					<div>
						<div className="row user-list mt-4">{updated_list}</div>
						{pagination}
					</div>
				);
			}
		}
		// }

		return (
			<React.Fragment>
				<div>
					{/* <div
						className="input-group input-group-lg"
						ref={this.myRef}
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

					{/* sticky bar start */}
					<div className={`${classes.sticky}`}>
						<Header
							page="dashboard"
							searchBar="true"
							title={
								<div style={{ display: "flex" }}>
									<img src={roundlogo} alt="phnx logo" />
									<span>&nbsp;&nbsp;</span>
									<h2
										style={{
											fontWeight: 900,
											color: "#1E1E22",
											marginBottom: "0px",
										}}
									>
										PhoenixDAO Events Marketplace
									</h2>
								</div>
							}
						/>
						{/* <div>
							<br />
							<br />

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div style={{ display: "flex" }}>
									<img src={roundlogo} alt="phnx logo" />
									<span>&nbsp;&nbsp;&nbsp;</span>
									<h2
										style={{
											fontWeight: 700,
											color: "#1E1E22",
										}}
									>
										PhoenixDAO Events Marketplace
									</h2>
								</div>

								<div
									style={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<SearchBar />

									<ConnectWalletButton />
								</div>
							</div>


						</div>
					
					 */}
						{/* <Grid container>
								<Grid item>
									LOGO PhoenixDAO Events Marketplace
								</Grid>
								<Grid item>SearchBar</Grid>
								<Grid item>Connect Wallet</Grid>
							</Grid> */}
						<br />

						{/* tabs */}
						<div>
							<div className={classes.root}>
								<AppBar
									position="sticky"
									className={classes.appBar}
									color="transparent"
								>
									<Tabs
										value={this.state.selectedTab}
										onChange={this.onTabChange.bind(this)}
										indicatorColor="primary"
										textColor="primary"
										variant="scrollable"
										scrollButtons="auto"
										aria-label="scrollable auto tabs example"
									>
										<Tab
											className={`${classes.tabBar} ${
												classes.tabBar - 2
											}`}
											label="All Events"
											value="allevents"
											// {...a11yProps(0)}
										/>
										<Tab
											className={classes.tabBar}
											label="Near to you"
											value="neartoyou"
											// {...a11yProps(1)}
										/>
										<Tab
											className={classes.tabBar}
											label="Today"
											value="today"
											// {...a11yProps(2)}
										/>
										<Tab
											className={classes.tabBar}
											label="This Week"
											value="thisweek"
											// {...a11yProps(3)}
										/>
										<Tab
											className={classes.tabBar}
											label="This Month"
											value="thismonth"
											// {...a11yProps(4)}
										/>
										<Tab
											className={classes.tabBar}
											label="Paid Events"
											value="paidevents"
											// {...a11yProps(5)}
										/>
										<Tab
											className={classes.tabBar}
											label="Free Events"
											value="freeevents"
											// {...a11yProps(6)}
										/>
										<Tab
											className={classes.tabBar}
											label="Online Events"
											value="onlineevents"
											// {...a11yProps(7)}
										/>
										<Tab
											className={classes.tabBar}
											label="Physical Events"
											value="physicalevents"
											// {...a11yProps(8)}
										/>
									</Tabs>
									<Divider light />
								</AppBar>
							</div>
						</div>
					</div>
					{/* sticky bar ends */}
					<br />
					<br />

					{/* scrollToTop while click on pagination */}
					<div ref={this.myRef} />

					{/* slider */}
					<div>
						<div>
							<Slider />
						</div>
					</div>
					<br />
					<br />
					<br />

					<div>
						<div className="row row_mobile dashboard-dropdown-row">
							<h2 className="col-lg-9 col-md-8 col-sm-7 main-title">
								{this.state.category === "allevents"
									? `All Events`
									: `Trending Events`}
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
									value={this.state.category}
									onChange={this.categoryChange}
								>
									<option
										aria-label="None"
										value="allevents"
										style={{ padding: "20px" }}
									>
										All Events
									</option>
									<option
										value="trendingevents"
										style={{ padding: "20px" }}
									>
										Trending Events
									</option>
									<option
										value="populartopics"
										style={{ padding: "20px" }}
									>
										Popular Topics
									</option>
								</Select>
							</FormControl>
							{/* <button
								className="btn sort_button btn-dark col-lg-2 col-md-3 col-sm-3"
								value={this.state.value}
								onClick={this.toggleSortDate}
								onChange={this.toggleSortDate.bind(this)}
							>
								{this.state.isOldestFirst
									? "Sort: Oldest"
									: "Sort: Newest"}
							</button> */}
						</div>

						<br />
						<br />

						{body}
					</div>

					{/* <div className="topics-wrapper">
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
					</div> */}
				</div>
			</React.Fragment>
		);
	}

	async componentDidMount() {
		// console.log("props", this.props);
		// let eventCount = await this.props.eventsContract.methods
		// 	.getEventsCount()
		// 	.call();
		// console.log("event contract", this.props.eventsContract);
		// if (eventCount) {
		// 	this.setState({ eventCount });
		// }
		if (this.state.prevPath == -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		// this._isMounted = true;
		//where: {tktTotalQuantitySold_gte: 0}
		const query = `
		{
		  events(orderBy:eventId orderDirection:asc) {
			  id
			  eventId
			  owner
			  name
			  topic
			  location
			  city
			  ipfsHash
			  tktLimited
			  tktTotalQuantity
			  tktTotalQuantitySold
			  oneTimeBuy
			  token
			  time
			  onsite
			  catTktQuantity
			  catTktQuantitySold	
			  categories
			  prices
			  eventRevenueInDollar
			  eventRevenueInPhnx
		  }
		}
		`;
		this.loadBlockchain(query);
		this.filterHideEvent();
	}

	componentWillUnmount() {
		// this._isMounted = false;

		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}
}

FindEventsTest.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(FindEventsTest, mapStateToProps);
export default withStyles(useStyles)(AppContainer);
