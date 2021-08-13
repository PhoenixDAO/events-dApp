import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
// import { Link } from 'react-router-dom';
import moment from "moment";
import "../styles/calendar.css";
// import main from '../styles/main.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Grid, FormControl, Select } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { getUserDetails } from "../config/serverAPIs";
import Header from "./common/Header";
import { getTickets } from "../utils/graphApis";
const styles = (theme) => ({
	content: {
		backgroundColor: "white",
		margin: "40px 0px",
		padding: "50px",
		borderRadius: "8px",
		paddingBottom: "80px",
		[theme.breakpoints.down("xs")]: {
			padding: "10px",
		},
	},
	categorySelect: {
		// width: "219px",

		"& .MuiSelect-select": {
			paddingRight: "32px !important",
		},
		marginTop: "10px",
		marginBottom: "10px",
		height: "40px",
		"& .MuiSelect-outlined": {
			padding: "10px",
		},
		[theme.breakpoints.down("xs")]: {
			width: "auto",
			minWidth: "141px",
		},
	},
	selectDiv: {
		position: "absolute",
		top: "195px",
		right: "50px"
	},
	calenderContainer: {
		position: "relative",
	},
});
class Calendars extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hideEvent: [],
			Events_Blockchain: [],
			event_copy: [],
			activeEvents: "",
			latestblocks: 6000000,
			blocks: 5000000,
			events: [],
			Deleted_Events: [],
			event_copy: [],
		};
		this._isMounted = false;
		this.account = this.props.accounts[0];
	}

	calendarComponentRef = React.createRef();

	async loadBlockchain() {
		// GRAPH BLOCK //
		const ownerTickets = await getTickets(this.props.accounts[0]);
		this.setState({ activeEvents: ownerTickets });
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

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
			  {
				events {
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
					onsite
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
				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					this.setState({
						Events_Blockchain: [],
						active_length: 0,
						event_copy: [],
					});
				} else {
					if (this._isMounted) {
						this.setState({
							Events_Blockchain: graphEvents.data.data.events,
							active_length: graphEvents.data.data.events.length,
							event_copy: graphEvents.data.data.events,
						});
					}
				}
			})
			.catch((err) => console.error(err));
	}
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

	goToEvent = (event_calendar) => {
		event_calendar = event_calendar.event;
		let rawTitle = event_calendar.title;
		var titleRemovedSpaces = rawTitle;
		titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, "-");
		var pagetitle = titleRemovedSpaces
			.toLowerCase()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(" ");
		// let titleURL;
		// if (event_calendar.extendedProps.account.toLowerCase() === this.account.toLowerCase()) {
		//     titleURL = "/event-stat/" + pagetitle + "/" + event_calendar.id;
		// }
		// else {
		let titleURL = "/event/" + pagetitle + "/" + event_calendar.id;
		this.props.history.push(titleURL);
	};
	categoryChange = async (event) => {
		let category = event.target.value;
		if (category == "created") {
			let data = this.state.event_copy;
			let userEvents = data.filter(
				(event) =>
					event.owner.toLowerCase() == this.account.toLowerCase()
			);
			this.setState({
				Events_Blockchain: userEvents,
			});
		} else if (category == "favourite") {
			// console.log("props",this.account, this.props.networkId);
			const data = await getUserDetails({
				address: this.account,
				networkId: this.props.networkId,
			});
			if (data.result.result.favourites != "undefined") {
				let favoriteEvents = this.state.event_copy.filter((item) =>
					data.result.result.favourites.includes(item.eventId)
				);
				this.setState({
					Events_Blockchain: favoriteEvents,
				});
			}
		} else if (category == "tickets") {
			let tickets = this.state.event_copy.filter((item) =>
				this.state.activeEvents.includes(item.eventId)
			);
			this.setState({
				Events_Blockchain: tickets,
			});
		} else {
			this.setState({
				Events_Blockchain: this.state.event_copy,
			});
		}
	};
	render() {
		const { classes } = this.props;

		let body = "";
		const localizer = momentLocalizer(moment); // or globalizeLocalizer
		{
			let events_calendar = [];
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

			for (var i = 0; i < events_list.length; i++) {
				events_calendar.push({
					id: events_list[i].eventId,
					title: events_list[i].name,
					start: parseInt(events_list[i].time, 10) * 1000,
					end: parseInt(events_list[i].time, 10) * 1000,
					// allDay: true,
					account: events_list[i].owner,
				});
			}
			body = (
				<div className={classes.calenderContainer}>
					<Header title="Calendar" phnxButton={true} />
					<div className={classes.content}>
						<FullCalendar
							localizer={localizer}
							schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
							ref={this.calendarComponentRef}
							defaultView="dayGridMonth"
							dateClick={this.handleDateClick}
							displayEventTime={true}
							headerToolbar={{
								left: "dayGridMonth,timeGridWeek,timeGridDay",
								center: "prev,title,next",
								right: "",
							}}
							selectable={true}
							plugins={[
								dayGridPlugin,
								interactionPlugin,
								timeGridPlugin,
								resourceTimeGridPlugin,
							]}
							eventClick={(events_calendar) =>
								this.goToEvent(events_calendar)
							}
							dayMaxEvents={1}
							timeFormat="H:mm"
							eventOverlap={false}
							eventLimit={3}
							events={events_calendar}
							// select={this.handleSelectedDates}
							slotEventOverlap={false}
							eventTimeFormat={{
								// like '14:30:00'
								hour: "2-digit",
								minute: "2-digit",
								meridiem: true,
							}}
							eventMaxStack={1}
							allDaySlot={false}
						/>
						<div className={classes.selectDiv}>
							<FormControl
								variant="outlined"
								className={classes.categorySelect}
							>
								<Select
									native
									value={this.state.category}
									onChange={this.categoryChange}
								// inputProps={{
								//     name: "age",
								//     id: "outlined-age-native-simple",
								// }}
								>
									<option aria-label="None" value="all">
										All Events
									</option>
									<option value="tickets">Tickets</option>
									<option value="created">
										Created Events
									</option>
									<option value="favourite">
										Favourites
									</option>
								</Select>
							</FormControl>
						</div>
					</div>
				</div>
			);
		}

		return <div>{body}</div>;
	}

	componentDidMount() {
		this.props.executeScroll();
		this._isMounted = true;
		this.loadBlockchain();
		this.filterHideEvent();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
}
Calendars.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		accounts: state.accounts,
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(Calendars, mapStateToProps);
export default withStyles(styles, { withTheme: true })(AppContainer);
