import React, { Component } from "react";
import { Link } from "react-router-dom";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import {
	AppBar, Tabs, Tab, Typography, Box, Divider
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import PhoenixDAOLoader from "./PhoenixDAOLoader";
import { graphURL } from "../config/const.js";
import SearchBar from './common/SearchBar';

import Event from "./Event";
// import Web3 from "web3";
import axios from "axios";
// import { Open_events_ABI, Open_events_Address } from "../config/OpenEvents";
function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
}
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography component={'div'} >{children}</Typography>
				</Box>
			)}
		</div>
	);
}
const styles = theme => ({
	AppBar: {
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

		fontWeight: 700,
		textTransform: "Capitalize",
		fontFamily: "AeonikReg"


	},
	searchRow: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop:"40px",
		alignItems: "baseline",
	}
});
class MyEvents extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			openEvents: "",
			blocks: 5000000,
			latestblocks: 6000000,
			loading: true,
			MyEvents: [],
			check: [],
			active_length: "",
			isOldestFirst: false,
			isActive: true,
			account: [],
			dateNow: "",
			prevPath: -1,
			Deleted_Events: [],
			disabledBuying: false,
			selectedTab: 0,

		};
		console.log("qwe",this.props.accounts[0])
		this.contracts = context.drizzle.contracts;
		this.events = this.contracts["DaoEvents"].methods.eventsOf.cacheCall(
			this.props.accounts[0]
		);
		this.perPage = 6;
		this.account = this.props.accounts[0];
		this.myRef = React.createRef();
		this.ActiveEvent = this.ActiveEvent.bind(this);
		this.PastEvent = this.PastEvent.bind(this);
		this.updateSearch = this.updateSearch.bind(this);
	}

	//Get Blockchain State
	async loadBlockchain() {
		if (this._isMounted) {
			this.setState({ MyEvents: [], active_length: false, loading: true });
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
			}).then((graphDeletedEvents) => {
				// console.log("GraphQL query all deleted events",graphDeletedEvents.data.data)

				if (!graphDeletedEvents.data || !graphDeletedEvents.data.data === undefined) {
					this.setState({ Deleted_Events: [] });
				} else {
					this.setState({ Deleted_Events: graphDeletedEvents.data.data.eventsRemoveds });
				}
			}).catch((err) => {
				this.setState({ Deleted_Events: [], loading: false });
			})
			// console.log("Graph this.state.isActive",this.state.isActive)
			if (this.state.isActive) {
				this.loadActiveEvents();
			} else {
				this.loadPastEvents();
			}
		}
	}

	//Get My Active Events on Blockchain
	async loadActiveEvents() {
		if (this._isMounted) {
			this.setState({ MyEvents: [], active_length: 0, loading: true });
		}
		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())
		await axios({
			url: graphURL,
			method: 'post',
			data: {
				query: `{
					events(where : {owner: ${this.accounts}}) {
						id
						token
						eventId
						owner
						name
						topic
						location
						ipfsHash
						tktLimited
						oneTimeBuy
						time
						duration
						tktTotalQuantity
						tktTotalQuantitySold
						catTktQuantity
						catTktQuantitySold	
						categories
						prices
						eventRevenueInDollar
						eventRevenueInPhnx
					  }
		}
	  }`
			}
		}).then((graphEvents) => {
			console.log("GraphQL query response in MyEvents Active Events",Date.now(),graphEvents.data.data)
			if (!graphEvents.data || graphEvents.data.data === undefined) {
				// console.log("GraphQL query -- graphEvents undefined")
				this.setState({ loading: false, Topic_Events: [], active_length: 0 });
			} else {
				if (this._isMounted) {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					let userEvents = graphEvents.data.data.events; 
					//graphEvents.data.data.users.find((user) => user.account.toLowerCase() === this.account.toLowerCase())
					if (userEvents) {
						// let newsort = userEvents.userEvents
						let newsort = userEvents
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber)
							.filter(
								(activeEvents) =>
									activeEvents.time >= dateNow
							)
						this.setState({
							MyEvents: newsort,
							check: newsort,
							active_length: newsort.length,
						});
					}

					this.setState({ loading: false });
				}

			}

		}).catch((err) => {
			this.setState({ loading: false });
		})

	}

	//Get My Concluded Events on Blockchain
	async loadPastEvents() {
		if (this._isMounted) {
			this.setState({ MyEvents: [], active_length: 0, loading: true });
		}
		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())

		await axios({
			url: graphURL,
			method: 'post',
			data: {
				query:

					`{
						events(where : {owner: ${this.accounts}}) {
							id
							token
							eventId
							owner
							name
							topic
							location
							ipfsHash
							tktLimited
							oneTimeBuy
							time
							duration
							tktTotalQuantity
							tktTotalQuantitySold
							catTktQuantity
							catTktQuantitySold	
							categories
							prices
							eventRevenueInDollar
							eventRevenueInPhnx
						  }
			}
		  }`

			}
		}).then((graphEvents) => {
			console.log("GraphQL query response in MyEvents Past Events",Date.now(),graphEvents.data.data)

			if (!graphEvents.data || graphEvents.data.data === undefined) {
				// console.log("GraphQL query -- graphEvents undefined")
				this.setState({ loading: false, Topic_Events: [], active_length: 0 });
			} else {
				if (this._isMounted) {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					let userEvents = graphEvents.data.data.events; 
					//graphEvents.data.data.users.find((user) => user.account.toLowerCase() === this.account.toLowerCase())
					if (userEvents) {
						// let newsort = userEvents.userEvents
						let newsort = userEvents
							.concat()
							.sort((a, b) => b.blockNumber - a.blockNumber)
							.filter(
								(activeEvents) =>
									activeEvents.time < dateNow
							)
						this.setState({
							MyEvents: newsort,
							check: newsort,
							active_length: newsort.length,
						});
					}
					this.setState({ loading: false });
				}

			}

		}).catch((err) => {
			this.setState({ loading: false });
		})
	}
	//Display My Concluded Events
	PastEvent = (e) => {
		let value = "";
		console.log("past event");
		this.setState(
			{
				isActive: false,
				value,
			},
			() => {
				if (!this.state.isActive) {
					this.loadPastEvents();
					this.props.history.push("/myevents/" + 1);
				}
			}
		);
	};
	//Display My Active Events
	ActiveEvent = (e) => {
		let value = "";
		this.setState(
			{
				isActive: true,
				value,
			},
			() => {
				if (this.state.isActive) {
					this.loadActiveEvents();
					this.props.history.push("/myevents/" + 1);
				}
			}
		);
	};
	toggleBuying = () => {
		this.setState({ disabledBuying: !this.state.disabledBuying });
	}

	//Search for My Events By Name
	updateSearch = (e) => {
		let { value } = e.target;
		this.setState({ value }, () => {
			try {
				if (this.state.value !== "" && this.state.check.length !== 0) {
					var filteredEvents = this.state.check;
					filteredEvents = filteredEvents.filter((events) => {
						return (
							events.name
								.toLowerCase()
								.search(this.state.value.toLowerCase()) !== -1
						);
					});
				} else {
					filteredEvents = this.state.check;
				}
			} catch (e) { }
			this.setState({
				MyEvents: filteredEvents,
				active_length: filteredEvents.length,
			});
			this.props.history.push("/myevents/" + 1);
		});
	};
	executeScroll = () => this.myRef.current.scrollIntoView();
	onTabChange = (event, newValue) => {
		this.setState({ selectedTab: newValue });
		if (newValue === 0) {
			this.ActiveEvent();
		}
		if (newValue === 1) {
			this.PastEvent();

		}
	};
	render() {
		const { classes } = this.props;
		let body = <PhoenixDAOLoader />;
		if (
			typeof this.props.contracts["DaoEvents"].eventsOf[this.events] !==
			"undefined"
		) {
			let events = this.state.MyEvents.length;
			if (this.state.loading) {
				body = <PhoenixDAOLoader />;
			} else if (events === 0) {
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
				let count = this.state.MyEvents.length;
				let currentPage = Number(this.props.match.params.page);
				let events_list = [];
				let skip = false;
				for (let i = 0; i < count; i++) {
					for (let j = 0; j < this.state.Deleted_Events.length; j++) {
						if (
							this.state.MyEvents[i].eventId ===
							this.state.Deleted_Events[j].eventId
						) {
							skip = true;
						}
					}
					if (!skip) {
						events_list.push(this.state.MyEvents[i]);
					}
					skip = false;
				}
				let updated_list = [];
				count = events_list.length;
				if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
				let end = currentPage * this.perPage;
				let start = end - this.perPage;
				if (end > count) end = count;
				let pages = Math.ceil(count / this.perPage);
console.log("updated_list",updated_list);
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
							ipfs={events_list[i].ipfsHash}
							myEvents={true}
						/>
					);
				}

				let pagination;

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
										to={"/myevents/" + i}
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
										to={"/myevents/" + i}
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
										to={"/myevents/" + i}
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
			<div className="event-page-wrapper">
				<div className={classes.searchRow}>
					<h2 className="main-heading">
						My Created Events
				    </h2>
					<SearchBar />

					{/* <TextField
						className={classes.margin}
						id="input-with-icon-textfield"
						variant="outlined"
						placeholder="Search for events"
						size="medium"
						onChange={this.updateSearch.bind(this)}
						value={this.state.value}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon style={{ color: "#C1C1C1" }} />
								</InputAdornment>
							),
						}}
					/> */}
				</div>
				<AppBar position="static" className={classes.AppBar} color="transparent">
					<Tabs
						value={this.state.selectedTab}
						onChange={this.onTabChange.bind(this)}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						aria-label="scrollable auto tabs example"
						style={{ height: "40px" }}
					>
						
						<Tab
							className={classes.tabBar}

							label="Upcoming Events"
							{...a11yProps(0)}
						/>
						<Tab
							className={classes.tabBar}
							label="Past Events" {...a11yProps(1)} />

					</Tabs>
					<Divider light />
				</AppBar>
				<TabPanel value={this.state.selectedTab} index={0}>
					<div>
					{body}
					</div>
				</TabPanel>
				<TabPanel value={this.state.selectedTab} index={1}>
					{body}
					{/* <FindEvents {...this.props}/> */}
				</TabPanel>
			
				{/* <h2 className="col-md-10" ref={this.myRef}>
					{this.state.isActive ? (
						<i className="fa fa-calendar-alt "></i>
					) : (
						<i className="fa fa-archive"></i>
					)}{" "}
					My{this.state.isActive ? " Active" : " Past"} Events
				</h2>
				<div className="input-group input-group-lg mb-2">
					<button
						className="btn rounded-pill btn-dark col-md-2 mx-2 mt-2"
						onClick={this.ActiveEvent}
					>
						Active Events
					</button>
					<button
						className="btn rounded-pill btn-dark col-md-2 mx-2 mt-2"
						onClick={this.PastEvent}
					>
						Past Events
					</button>
					<div className="input-group-prepend ml-2 mt-2">
						<span
							className="input-group-text rounded-left  search-icon float-right"
							id="inputGroup-sizing-lg"
						>
							<i className="fa fa-search"></i>&nbsp;Search{" "}
						</span>
					</div>
					<input
						type="text"
						value={this.state.value}
						onChange={this.updateSearch.bind(this)}
						className="form-control mr-2 mt-2 col-md-6"
						aria-label="Large"
						aria-describedby="inputGroup-sizing-sm"
					/>
				</div>

				<hr />
				{body} */}
			</div>
		);
	}

	componentDidMount() {
		if (this.state.prevPath === -1) {
			this.props.executeScroll({ behavior: "smooth", block: "start" });
		}
		this._isMounted = true;
		this.loadBlockchain();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
}

MyEvents.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(MyEvents, mapStateToProps);
export default withStyles(styles, { withTheme: true })(AppContainer);
