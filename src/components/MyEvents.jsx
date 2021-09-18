import React, { Component } from "react";
import { Link } from "react-router-dom";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Typography, Box, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Header from "./common/Header";
import EmptyState from "./EmptyState";
import GetGraphApi from "../config/getGraphApi";

import Event from "./Event";
import axios from "axios";
import { setTimeout } from "drizzle";

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
				<Box p={0} pt={4}>
					<Typography component={"div"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
const styles = (theme) => ({
	AppBar: {
		"&.MuiPaper-elevation4": {
			boxShadow: "none",
		},
	},
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,
		display: "flex",
		flexDirection: "column",
		background: `#F2F2FD !important`,
		opacity: `1 !important`,
		marginLeft: -2,
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
		fontFamily: "AeonikReg",
	},
	searchRow: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: "40px",
		alignItems: "baseline",
	},
	sticky: {
		position: "sticky",
		zIndex: 1,
		top: 0,
		display: "flex",
		flexDirection: "column",
		background: `#F2F2FD !important`,
		opacity: `1 !important`,
		marginLeft: -2,
	},
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
			value: "",
		};
		console.log("qwe", this.props.accounts[0]);
		// this.contracts = context.drizzle.contracts;
		// this.events = this.contracts["DaoEvents"].methods.eventsOf.cacheCall(
		// 	this.props.accounts[0]
		// );
		this.perPage = 6;
		this.account = this.props.accounts[0];
		this.myRef = React.createRef();
		this.ActiveEvent = this.ActiveEvent.bind(this);
		this.PastEvent = this.PastEvent.bind(this);
		this.updateSearch = this.updateSearch.bind(this);
	}

	//Get Blockchain State
	async loadBlockchain() {
		const graphURL = await GetGraphApi();
		if (this._isMounted) {
			this.setState({
				MyEvents: [],
				active_length: false,
				loading: true,
			});
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
					// console.log("GraphQL query all deleted events",graphDeletedEvents.data.data)

					if (
						!graphDeletedEvents.data ||
						!graphDeletedEvents.data.data === undefined
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
					this.setState({ Deleted_Events: [], loading: false });
				});
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
		const graphURL = await GetGraphApi();
		console.log(
			"checking this.accounts",
			typeof this.account,
			this.account
		);
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `{
                        events(where : {owner:"${this.account.toLowerCase()}"} orderBy:eventId orderDirection:desc) {
                            id
                            token
                            eventId
                            owner
                            name
                            topic
                            location
							city
                            ipfsHash
                            tktLimited
                            oneTimeBuy
                            time
                            onsite
                            tktTotalQuantity
                            tktTotalQuantitySold
                            catTktQuantity
                            catTktQuantitySold  
                            categories
                            prices
                            eventRevenueInDollar
                            eventRevenueInPhnx
            }
          }`,
			},
		})
			.then((graphEvents) => {
				console.log(
					"GraphQL query response in MyEvents Upcoming Events",
					Date.now(),
					graphEvents.data.data
				);
				if (!graphEvents.data || graphEvents.data.data === undefined) {
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
								);
							this.setState({
								MyEvents: newsort,
								check: newsort,
								active_length: newsort.length,
							});
						}
						setTimeout(() => {
							this.setState({ loading: false });
						}, 3000);
					}
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
	}

	//Get My Concluded Events on Blockchain
	async loadPastEvents() {
		if (this._isMounted) {
			this.setState({ MyEvents: [], active_length: 0, loading: true });
		}
		// GRAPH BLOCK //
		const graphURL = await GetGraphApi();

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `{
						events(where : {owner: "${this.account.toLowerCase()}"} orderBy:eventId orderDirection:desc) {
							id
							token
							eventId
							owner
							name
							topic
							location
							city
							ipfsHash
							tktLimited
							oneTimeBuy
							time
							onsite
							tktTotalQuantity
							tktTotalQuantitySold
							catTktQuantity
							catTktQuantitySold	
							categories
							prices
							eventRevenueInDollar
							eventRevenueInPhnx
						  }
		  }`,
			},
		})
			.then((graphEvents) => {
				console.log(
					"GraphQL query response in MyEvents Past Events",
					Date.now(),
					graphEvents.data.data
				);

				if (!graphEvents.data || graphEvents.data.data === undefined) {
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
								);
							this.setState({
								MyEvents: newsort,
								check: newsort,
								active_length: newsort.length,
							});
							setTimeout(() => {
								this.setState({ loading: false });
							}, 3000);
						}
						setTimeout(() => {
							this.setState({ loading: false });
						}, 3000);
					}
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
			});
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
	};

	//Search for My Events By Name
	updateSearch = (value) => {
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
		console.log("class props for event card", classes.tabBar);
		let body;
		// if (
		// 	// typeof this.props.contracts["DaoEvents"].eventsOf[this.events] !==
		// 	// "undefined"
		// 	this.state.active_length != ""
		// ) {
		let events = this.state.MyEvents.length;
		// if (this.state.loading) {
		// 	body = <PhoenixDAOLoader />;
		// }
		if (events === 0 && !this.state.loading) {
			body = (
				<EmptyState
					text="You have no created events 😔"
					btnText="Create an Event"
					url="/createevent"
				/>
			);
		}
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
					loading={this.state.loading}
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
								{i} am
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
		if (updated_list.length === 0 && this.state.loading) {
			body = <PhoenixDAOLoader />;
		} else if (updated_list.length === 0 && !this.state.loading) {
			body = (
				<EmptyState
					text="You have no created events 😔"
					btnText="Create an Event"
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
		return (
			<div className={`event-page-wrapper`} ref={this.myRef}>
				<div className={`${classes.sticky}`}>
				<Header
					title="Created Events"
					page="myEvent"
					searchBar={true}
					handleSearch={this.updateSearch}
				/>

				<AppBar
					position="static"
					style={{ padding: "0 19px" }}
					className={classes.AppBar}
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
						style={{ height: "40px" }}
					>
						<Tab
							className={classes.tabBar}
							mx="0"
							label="Upcoming Events"
							{...a11yProps(0)}
						/>
						<Tab
							className={classes.tabBar}
							label="Past Events"
							{...a11yProps(1)}
						/>
					</Tabs>
					<Divider light />
				</AppBar>
				</div>
				<TabPanel value={this.state.selectedTab} index={0}>
					<div>{body}</div>
				</TabPanel>
				<TabPanel value={this.state.selectedTab} index={1}>
					{body}
					{/* <FindEvents {...this.props}/> */}
				</TabPanel>
				
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
		// contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(MyEvents, mapStateToProps);
export default withStyles(styles, { withTheme: true })(AppContainer);
