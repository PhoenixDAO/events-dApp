import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import makeBlockie from "ethereum-blockies-base64";
import Web3 from 'web3'
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";

class Sidebar extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			errorMessage: "",
			openSnackbar:false
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
	}

	sidebarClick() {
		this.toggleSidebarClass(true);
		var isActive = this.context.router.route.location.pathname;
		var activeClassName = "";
		var linkLocation = this.props.to;

		if (isActive == linkLocation) {
			activeClassName = "nav-item active";
		} else {
			activeClassName = "nav-item";
		}

		//console.log(this);
	}

	toggleSidebarClass = (closeOnly) => {
		console.log("closeOnly", closeOnly);
		if (!closeOnly) {
			const oldSidebarClassName = document.getElementById(
				"sidebar-wrapper"
			).className;
			const newSidebarClassName =
				oldSidebarClassName === "my-sidebar sidebar-closed"
					? "my-sidebar sidebar-open"
					: "my-sidebar sidebar-closed";

			const oldPageWrapperClassName = document.getElementById(
				"page-content-wrapper"
			).className;
			const newPageWrapperClassName =
				oldPageWrapperClassName === "sidebar-closed"
					? "sidebar-open"
					: "sidebar-closed";

			document.getElementById(
				"sidebar-wrapper"
			).className = newSidebarClassName;
			document.getElementById(
				"page-content-wrapper"
			).className = newPageWrapperClassName;
		} else {
			const newSidebarClassName = "my-sidebar sidebar-closed";

			const newPageWrapperClassName = "sidebar-closed";
			console.log(
				"document.getElementById('sidebar-wrapper').className -->",
				document.getElementById("sidebar-wrapper").className
			);
			console.log(
				"document.getElementById('page-content-wrapper').className -->",
				document.getElementById("page-content-wrapper").className
			);
			document.getElementById("sidebar-wrapper").className =
				"my-sidebar sidebar-closed";
			document.getElementById("page-content-wrapper").className =
				"sidebar-open";
		}
	};
	async connectToMetaMask() {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log("here");

			let web3 = new Web3(window.ethereum);
			try {
				const a = await window.ethereum.enable();
			} catch (e) {
				if ((e.code = -32002)) {
					console.log("eeee", e, e.message, e.code);
					// window.alert(e.message)
					this.setState({
						errorMessage:
							"Connection request already pending. Please check MetaMask !",
						openSnackbar1: false,
						openSnackbar2: true,
					});
					console.log("this.state",this.state)
				}
			}
		} else {
			this.setState({
				errorMessage:
					"MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbar1: true,
				openSnackbar2: false,
			});
		}
	}
	handleSnackbarClose = (number) => {
		if (number == 1) {
			this.setState({ openSnackbar1: false });
		} else {
			this.setState({ openSnackbar2: false });
		}
	};

	render() {
		console.log("this.props", this.props.account);

		let user = (
			<div>
				<div className="user-status-icon">
					<i className="fas fa-plug"></i>
				</div>
				<p className="mt-3 small connection">
					<span className="toggleHidden">
						You are not connected to the Ethereum network. Please
						check MetaMask.
					</span>
				</p>
			</div>
		);
		if (this.props.connection === true && this.props.account.length !== 0) {
			console.log("123456", this.props);
			user = (
				<div>
					<div className="user-status-icon">
						<NavLink to="/" style={{ display: "flex" }}>
							<img
								src={makeBlockie(this.props.account)}
								alt={this.props.account}
							/>
							<span
								style={{
									marginLeft: "10px",
									fontSize: "17px",
									marginTop: "8px",
								}}
							>
								...
								{this.props.account.substring(
									this.props.account.length - 10,
									this.props.account.length
								)}
							</span>
						</NavLink>
					</div>
					{/* {this.props.account} */}
				</div>
			);
		}
		console.log(
			"this.context.router.route.location.pathname",
			this.context.router.route.location.pathname.split("/pastevents/")
		);
		if (this.props.account.length === 0)
			{return (
				<React.Fragment>
				<Snackbar
						open={this.state.openSnackbar1}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(1)}
					/>
					<Snackbar2
						style={{zIndex:"9999999 !important"}}
						open={this.state.openSnackbar2}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(2)}
					/>

				<div id="sidebar-wrapper" className="my-sidebar sidebar-closed">
						
					<div
						className="hamburgerNav"
						onClick={() => {
							this.toggleSidebarClass(false);
						}}
					>
						<i className="fa fa-bars"></i>
					</div>
					<div className="user-status mt-5">{user}</div>
					<div className="menu mt-5">
						<h5 className="toggleHidden">Events & Tickets</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/findevents/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/findevents/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/event/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/event-stat/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i className="fa fa-search"></i>{" "}
									<span className="toggleHidden">Upcoming Events</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/pastevents/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/pastevents/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i className="fa fa-archive"></i>{" "}
									<span className="toggleHidden">
										Past Events
									</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/topics"
									className="nav-link"
									activeClassName="nav-link-active"
									//isActive={() => ['/topics','/topic/music/1','/topic/charity-and-causes/1','/topic/parties/1','/topic/sports-and-fitness/1'].includes(this.context.router.route.location.pathname)}
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/topic/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/topics"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-comment-alt"
										title="Topics"
									></i>{" "}
									<span className="toggleHidden">Topics</span>
								</NavLink>
							</li>
							{/* <li>
								<NavLink to="/locations" className="nav-link" activeClassName="nav-link-active" onClick={() => { this.sidebarClick(this) }}><i className="fa fa-map-marker-alt"></i> <span className="toggleHidden">Locations</span></NavLink>
							</li> */}
							<li>
								<NavLink
									to="/calendar"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.toggleSidebarClass(true);
									}}
								>
									<i className="fa fa-calendar-alt"></i>{" "}
									<span className="toggleHidden">
										Calendar
									</span>
								</NavLink>
							</li>
						</ul>
						<h5 className="mt-5 toggleHidden">Manage Events</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/createevent"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i className="fa fa-edit"></i>{" "}
									<span className="toggleHidden">
										Create Event
									</span>
								</NavLink>
							</li>
						</ul>
						<h5 className="mt-5 toggleHidden">Tools</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/how-it-works"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i className="fa fa-question-circle"></i>{" "}
									<span className="toggleHidden">
										How It Works
									</span>
								</NavLink>
							</li>
							<li>
								<div
									className="nav-link"
									onClick={
										this.connectToMetaMask
									}
								>
									<i className="fas fa-plug"></i>{" "}
									<span className="toggleHidden">
										Connect Wallet
									</span>
								</div>
							</li>
						</ul>

						<a
							aria-label="Homepage"
							target="blank"
							title="GitHub"
							className="github footer-octicon align-items-end mx-lg-4 mt-5"
							href="https://github.com/PhoenixDAO/events-dApp"
						>
							<svg
								height="32"
								className="octicon octicon-mark-github align-items-end mt-5"
								viewBox="0 0 16 16"
								version="1.1"
								width="32"
								aria-hidden="true"
							>
								<path
									fill="#fff"
									fillRule="evenodd"
									d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
								></path>
							</svg>
						</a>
					</div>
				</div>
			</React.Fragment>
			)}
		else
			return (
				<React.Fragment>

				<Snackbar
						open={this.state.Snackbar1}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(1)}
					/>
					<Snackbar2
						open={this.state.Snackbar2}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(2)}
					/>
				<div id="sidebar-wrapper" className="my-sidebar sidebar-closed">
					
					<div
						className="hamburgerNav"
						onClick={() => {
							this.toggleSidebarClass(false);
						}}
					>
						<i className="fa fa-bars"></i>
					</div>
					<div className="user-status mt-5">{user}</div>
					<div className="menu mt-5">
						<h5 className="toggleHidden">Events & Tickets</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/findevents/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/findevents/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/event/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/event-stat/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-search"
										title="Upcoming Events"
									></i>{" "}
									<span className="toggleHidden">Upcoming Events</span>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="/pastevents/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/pastevents/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-archive"
										title="Past Events"
									></i>{" "}
									<span className="toggleHidden">
										Past Events
									</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/topics"
									className="nav-link"
									activeClassName="nav-link-active"
									//isActive={() => ['/topics','/topic/music/1','/topic/charity-and-causes/1','/topic/parties/1','/topic/sports-and-fitness/1'].includes(this.context.router.route.location.pathname)}
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/topic/"
										).length > 1 ||
										this.context.router.route.location.pathname.split(
											"/topics"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-comment-alt"
										title="Topics"
									></i>{" "}
									<span className="toggleHidden">Topics</span>
								</NavLink>
							</li>
							{/* <li>
							<NavLink to="/locations" className="nav-link" activeClassName="nav-link-active" onClick={() => {this.sidebarClick(this)}}><i className="fa fa-map-marker-alt" title="Locations"></i> <span className="toggleHidden">Locations</span></NavLink>
						</li> */}
							<li>
								<NavLink
									to="/calendar"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.toggleSidebarClass(true);
									}}
								>
									<i
										className="fa fa-calendar-alt"
										title="Calendar"
									></i>{" "}
									<span className="toggleHidden">
										Calendar
									</span>
								</NavLink>
							</li>
						</ul>
						<h5 className="mt-5 toggleHidden">Manage Events</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/dashboard"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.toggleSidebarClass(true);
									}}
								>
									<i
										className="fas fa-chart-bar"
										title="Dashboard"
									></i>{" "}
									<span className="toggleHidden">
										Dashboard
									</span>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="/createevent"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-edit"
										title="Create Event"
									></i>{" "}
									<span className="toggleHidden">
										Create Event
									</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/myevents/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/myevents/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fas fa-list-alt"
										title="My Created Events"
									></i>{" "}
									<span className="toggleHidden">
										My Created Events
									</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/mytickets/1"
									className="nav-link"
									activeClassName="nav-link-active"
									isActive={() =>
										this.context.router.route.location.pathname.split(
											"/mytickets/"
										).length > 1
									}
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fa fa-ticket-alt"
										title="My Tickets"
									></i>{" "}
									<span className="toggleHidden">
										My Tickets
									</span>
								</NavLink>
							</li>
						</ul>
						<h5 className="mt-5 toggleHidden">Tools</h5>
						<ul className="nav flex-column">
							<li>
								<NavLink
									to="/how-it-works"
									className="nav-link"
									activeClassName="nav-link-active"
									onClick={() => {
										this.sidebarClick(this);
									}}
								>
									<i
										className="fas fa-question-circle"
										title="How It Works"
										style={{ alignItems: "baseline" }}
									></i>{" "}
									<span className="toggleHidden">
										How It Works
									</span>
								</NavLink>
							</li>
							{/* <li className="nav-item">
							<NavLink to="/token" className="nav-link" activeClassName="nav-link-active"><img src="/images/PhoenixDAO.png" className="sidebar_PhoenixDAO-logo" alt="PhoenixDAO Token Logo" title="PHNX Faucet" /> <span className="toggleHidden">Get PHNX Tokens</span></NavLink>
						</li> */}
						</ul>

						<ul className="nav flex-column ">
							<a
								aria-label="Homepage"
								target="blank"
								title="GitHub"
								className="github footer-octicon align-items-end mx-lg-4 mt-5"
								href="https://github.com/PhoenixDAO/events-dApp/tree/heroku-deployment"
							>
								<svg
									height="32"
									className="octicon octicon-mark-github align-items-end"
									viewBox="0 0 16 16"
									version="1.1"
									width="32"
									aria-hidden="true"
								>
									<path
										fill="#fff"
										fillRule="evenodd"
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
									></path>
								</svg>
							</a>
						</ul>
					</div>
				</div>
				</React.Fragment>
			
			)

	}
}

Sidebar.contextTypes = {
	router: PropTypes.object,
};

export default Sidebar;
