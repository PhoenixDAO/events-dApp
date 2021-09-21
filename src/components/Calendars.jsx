import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
// import { Link } from 'react-router-dom';
import moment from "moment";
import "../styles/calendar.css";
// import main from '../styles/main.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL, REPORT_EVENT } from "../config/const";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import MenuItem from "@material-ui/core/MenuItem";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Grid, FormControl, Select } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { getUserDetails } from "../config/serverAPIs";
import Header from "./common/Header";
import { getTickets } from "../utils/graphApis";
import GetGraphApi, { getNetworkId }  from '../config/getGraphApi';

const styles = (theme) => ({
	content: {
		position:"relative",
		// "@media screen and (min-width: 1200px)": {
		// 	margin: "40px 0px",
		// },
		margin: "40px 0px",
		backgroundColor: "white",
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
			background: "#fff",
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
	selectDropDown:{
		maxHeight: "200px",
		width:"150px",
	},
	selectDiv: {
		"@media (min-width:1200px)":{
			position: "absolute",
			top: "43px",
			right: "50px",
		},
		"@media (max-width: 1200px)":{
			top: "14%",
			right:"50%"
		}
	},
	calenderContainer: {
		position: "relative",
	},
	menuPaper: {
		maxHeight: "200px",
		"& .MuiInputBase-fullWidth": {
			width: "150px",
		},
	},
	fullWidth:{
		width:"150px",
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
			category:"all",
		};

		this._isMounted = false;
		this.account = this.props.accounts[0];
	}
	
	selectBoxRef = React.createRef();
	calendarComponentRef = React.createRef();

	async loadBlockchain() {
		// GRAPH BLOCK //
		const graphURL  = await GetGraphApi();
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
				events(first: 1000) {
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
		let titleURL = `/event/${event_calendar.id}`;
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
				category:"created"
			});
		} else if (category == "favourite") {
			const data = await getUserDetails({
				address: this.account,
				networkId: this.props.networkId,
			});
			if (data.result.result.userHldr.favourites != "undefined") {
				let favoriteEvents = this.state.event_copy.filter((item) =>
					data.result.result.userHldr.favourites.includes(item.eventId)
				);
				this.setState({
					Events_Blockchain: favoriteEvents,
					category:"favourite"
				});
			}
		} else if (category == "tickets") {
			let tickets = this.state.event_copy.filter((item) =>
				this.state.activeEvents.includes(item.eventId)
			);
			this.setState({
				Events_Blockchain: tickets,
				category:"tickets"
			});
		} else {
			this.setState({
				Events_Blockchain: this.state.event_copy,
				category:"all"
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
			this.selectBox=(
				<FormControl
									variant="outlined"
									className={classes.categorySelect}
									// ref={this.selectBoxRef}
								>
									<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									fullWidth
									value={this.state.category}
									onChange={this.categoryChange}
									displayEmpty
									className={classes.fullWidth}
									MenuProps={{
										classes: {
											paper: classes.menuPaper,
										},
										getContentAnchorEl: null,
										anchorOrigin: {
											vertical: "bottom",
											horizontal: "left",
										},
									}}
								>
											<MenuItem value="all"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														All Events
													</MenuItem>
													<MenuItem			
														value="tickets"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Tickets
													</MenuItem>
													<MenuItem			
														value="created"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Created Events
													</MenuItem>
													<MenuItem			
														value="favourite"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Favourites
													</MenuItem>
										</Select>
							</FormControl>
			)
			body = (
				<div className={classes.calenderContainer}>
					<Header title="Calendar" phnxButton={true} />
					<div className={classes.content}>
					<div className={`${classes.selectDiv}`}>
						{/* <FormControl
									variant="outlined"
									className={classes.categorySelect}
									ref={this.selectBoxRef}
								>
									<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											fullWidth
											value={this.state.category}
											onChange={this.categoryChange}
											displayEmpty
											className={classes.selectDropDown}
											MenuProps={{
												classes: {
													paper: classes.menuPaper,
												},
												getContentAnchorEl: null,
												anchorOrigin: {
												vertical: "bottom",
												horizontal: "left"}
											}}
										>
											<MenuItem value="all"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														All Events
													</MenuItem>
													<MenuItem			
														value="tickets"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Tickets
													</MenuItem>
													<MenuItem			
														value="created"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Created Events
													</MenuItem>
													<MenuItem			
														value="favourite"
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														Favourites
													</MenuItem>
										</Select>
							</FormControl> */}
							{/* <FormControl
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
							</FormControl> */}
						</div>
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
								right: 'selectBox',
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
							customButtons={{
								selectBox: {
									text: this.selectBox,
									// click: this.selectBox
								  }
								}
							}
						/>
					
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
