import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import Carousel from 'react-bootstrap/Carousel'

import Loading from "./Loading";
import Event from "./Event";

import topicsJson from "../config/topics.json";
import Header from "./common/Header";

// material UI styles
import { withStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import Slider from "./common/Slider";
import MenuItem from "@material-ui/core/MenuItem";
import TopicCard from "./common/TopicCard";
import ConnectWalletButton from "./common/ConnectWalletButton";
import SearchBar from "./common/SearchBar";
import { Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SkeletonTopic from "./common/SkeletonTopic";
import EmptyState from "./EmptyState";

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
		// minWidth: 120,
		justifyContent: "space-around",
		alignItems: "flex-end",
		"& .MuiInputBase-formControl": {
			"@media (max-width: 575px)": {
				marginLeft: "50px",
				maxWidth: "80%",
			},
		},
		"& .MuiSelect-root.MuiSelect-select": {
			padding: "10px",
			fontWeight: 700,
			// minWidth:130,
			background: "#fff",
		},
	},
	mobilePadding: {
		padding: "0 20px",
	},
	selectDropDown: {
		maxHeight: "200px",
		width: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	sortBy: {
		position: "absolute",
		left: "-40px",
		color: "#73727D",
		fontSize: "18px",
		"@media (max-width: 575px)": {
			left: "0",
		},
	},
	dropdownStyle: {
		border: "1px solid black",
		borderRadius: "5%",
		backgroundColor: "black",
	},
});

class TopicsLandingPage extends Component {
	constructor(props, context) {
		super(props);
		// this.contracts = context.drizzle.contracts;
		this.state = {
			eventCount: 0,
			category: "All Topics",
			Topic_Events: [],
			topic_copy: [],
			active_length: "",
			isActive: true,
		};
		// this.eventCount =
		// 	this.contracts["DaoEvents"].methods.getEventsCount.cacheCall();

		this.perPage = 6;
		this.topicClick = this.topicClick.bind(this);
		this.compare = this.compare.bind(this);
	}

	topicClick(slug) {
		// this.props.history.push("/topic/" + slug + "/" + 1);
		// window.scrollTo(0, 180);
	}

	caruselClick(location) {
		this.props.history.push(location);
		window.scrollTo(0, 80);
	}
	compare(a, b) {
		if (a.last_nom < b.last_nom) {
			return -1;
		}
		if (a.last_nom > b.last_nom) {
			return 1;
		}
		return 0;
	}

	handleChangeCategory = (e) => {
		this.setState({
			category: e.target.value,
		});
	};

	render() {
		const { classes } = this.props;
		let check = this.props.eventObj && !this.state.loading;
		// let body = <Loading />;
		let body;
		if (
			this.props.eventObj &&
			Object.keys(this.props.eventObj).length > 0
		) {
			body = Object.keys(this.props.eventObj)
				.filter((key) => this.props.eventObj[key].eventCount >= 7)
				.map((key) => {
					return (
						<div
							key={this.props.eventObj[key].topic}
							className="col-xl-4 col-lg-4 col-md-6 col-sm-12 pb-4"
						>
							<TopicCard
								image={
									"images/topics/" +
									this.props.eventObj[key].image
								}
								name={this.props.eventObj[key].name}
								slug={this.props.eventObj[key].topic}
								count={this.props.eventObj[key].eventCount}
							/>
						</div>
					);
				});
		}

		return (
			<React.Fragment>
				<div
				// className="retract-page-inner-wrapper-alternative topicsDiv"
				>
					<div
					// className="topics-wrapper"
					>
						{/* top sticky header */}
						<Header
							title="Topics"
							searchBar={true}
							handleSearch={this.props.handleSearch}
						/>
						<br />
						<br />
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
							<div
								className={`row row_mobile dashboard-dropdown-row ${classes.mobilePadding}`}
							>
								<h2 className="col-lg-9 col-md-8 col-sm-7 main-title">
									{this.state.category}
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
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										fullWidth
										value={this.state.category}
										onChange={this.handleChangeCategory}
										displayEmpty
										className={classes.selectDropDown}
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
										<MenuItem
											value="All Topics"
											style={{
												fontFamily:
													"'Aeonik', sans-serif",
											}}
										>
											All Topics
										</MenuItem>
										<MenuItem
											value="Trending Topics"
											style={{
												fontFamily:
													"'Aeonik', sans-serif",
											}}
										>
											Trending Topics
										</MenuItem>
									</Select>
								</FormControl>
							</div>

							<br />
							<br />
							<div>
								<div className="row user-list mt-4">
									{check &&
									Object.keys(this.props.eventObj).length ===
										0 &&
									!this.props.loading ? (
										<div style={{ margin: "0 auto" }}>
											<EmptyState
												text="No topics found 😔. Want to be the first?"
												btnText="Create an Event"
												url="/createevent"
											/>
										</div>
									) : this.props.eventObj &&
									  Object.keys(this.props.eventObj).length >
											0 ? (
										this.state.category === "All Topics" ? (
											Object.keys(
												this.props.eventObj
											).map((key) => {
												return (
													<div
														key={
															this.props.eventObj[
																key
															].topic
														}
														className="col-xl-4 col-lg-4 col-md-6 col-sm-12 pb-4"
													>
														{this.props.loading ? (
															<SkeletonTopic />
														) : (
															<TopicCard
																userDetails={
																	this.props
																		.userDetail
																}
																tokensListContract={
																	this.props
																		.tokensListContract
																}
																image={
																	"images/topics/" +
																	this.props
																		.eventObj[
																		key
																	].image
																}
																name={
																	this.props
																		.eventObj[
																		key
																	].name
																}
																slug={
																	this.props
																		.eventObj[
																		key
																	].topic
																}
																count={
																	this.props
																		.eventObj[
																		key
																	].eventCount
																}
															/>
														)}
													</div>
												);
											})
										) : body.length > 0 ? (
											body
										) : (
											<div style={{ margin: "0 auto" }}>
												<EmptyState
													text="There is no trending Topics 😔. Want to be the first?"
													btnText="Create an Event"
													url="/createevent"
												/>
											</div>
										)
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
	async componentDidMount() {
		// userDetails={this.state.userDetail}
		// tokensListContract={this.props.tokensListContract}
		window.scroll({
			top: 0,
			behavior: "smooth",
		});
	}
}

// const AppContainer = drizzleConnect(TopicsLandingPage, mapStateToProps);
export default withStyles(useStyles)(TopicsLandingPage);
