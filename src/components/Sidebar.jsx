import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Web3 from 'web3';
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";
import { Menu, DashboardOutlined, ModeCommentOutlined, TodayOutlined, ListAltOutlined, InfoOutlined, ForumOutlined,FavoriteBorder } from '@material-ui/icons';
import '../styles/navbar.css'
class Sidebar extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			errorMessage: "",
			openSnackbar: false
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
	}

	toggleSidebarClass = (closeOnly) => {
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

			document.getElementById("sidebar-wrapper").className =
				"my-sidebar sidebar-closed";
			document.getElementById("page-content-wrapper").className =
				"sidebar-open";
		}
	};
	async connectToMetaMask() {
		if (window.ethereum && window.ethereum.isMetaMask) {

			let web3 = new Web3(window.ethereum);
			try {
				const a = await window.ethereum.enable();
			} catch (e) {
				if ((e.code = -32002)) {
					this.setState({
						errorMessage:
							"Connection request already pending. Please check MetaMask !",
						openSnackbar1: false,
						openSnackbar2: true,
					});
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

		let user = (
			<div>
				<div className="user-status-icon">
					<i className="fas fa-plug"></i>
				</div>
				<p className="mt-3 small connection">
					<span className="toggleHidden">
					You are not connected to the Matic Mainnet. Please
                        check MetaMask.
					</span>
				</p>
			</div>
		);
		if (this.props.connection === true && this.props.account.length !== 0) {
			user = (
				<div>
					<div className="user-status-icon">
						<NavLink to="/" style={{ display: "flex" }}>
							{/* <img
								src={makeBlockie(this.props.account)}
								alt={this.props.account}
							/> */}

							<img src="./images/metamask.svg" className="bird" />
							<span
								style={{
									marginLeft: "20px",
									fontSize: "15px",
									marginTop: "8px",
									fontWeight: "bold"
								}}
							>
								{this.props.account.substring(
									0,
									2)}
								...
								{this.props.account.substring(
										this.props.account.length - 10,
										this.props.account.length
									)}
							</span>
						</NavLink>
					</div>
				</div>
			);
		}

		if (this.props.account.length === 0) {
			return (
				<React.Fragment>
					<Snackbar
						open={this.state.openSnackbar1}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(1)}
					/>
					<Snackbar2
						style={{ zIndex: "9999999 !important" }}
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

							<Menu className="icon" />
						</div>
						<div className="user-status mt-5">{user}</div>
						<div className="menu mt-5">
							<h5 className="toggleHidden header">Events & Tickets</h5>
							<ul className="nav flex-column">
								<li>
									<NavLink
										to="/upcomingevents/1"
										className="nav-link"
										activeClassName="nav-link-active"
										isActive={() =>
											this.context.router.route.location.pathname.split(
												"/upcomingevents/"
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
										<DashboardOutlined /> {" "}
										<span className="toggleHidden">Dashboard</span>
									</NavLink>
								</li>
								{/* <li>
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
							</li> */}
								<li>
									<NavLink
										to="/topics"
										className="nav-link"
										activeClassName="nav-link-active"
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
										<ModeCommentOutlined />{" "}
										<span className="toggleHidden">Topics</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/calendar"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.toggleSidebarClass(true);
										}}
									>
										<TodayOutlined />{" "}
										<span className="toggleHidden">
											Calendar
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/calendar"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.toggleSidebarClass(true);
										}}
									>
										<ModeCommentOutlined />{" "}
										<span className="toggleHidden">
											Validate Tickets
									</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">Manage Events</h5>
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
										<i className="fa fa-edit fontAwesomeIcon"></i>{" "}
										<span className="toggleHidden">
											Create Event
									</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">Tools</h5>
							<ul className="nav flex-column">
								<li>
									<NavLink
										to="/guide"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<InfoOutlined />{" "}
										<span className="toggleHidden">
											How It Works
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/terms-and-conditions"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<i
											className="fa fa-file-alt fontAwesomeIcon"
											title="How It Works"
										></i>{" "}
										<span className="toggleHidden">FAQ's</span>
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
								href="https://github.com/PhoenixDAO/events-dApp/tree/heroku-deployment"
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
			)
		}
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
							<Menu className="icon" />
						</div>
						<div className="user-status mt-5">{user}</div>
						<div className="menu mt-5">
							<h5 className="toggleHidden header">Events & Tickets</h5>
							<ul className="nav flex-column">
								<li>
									<NavLink
										to="/upcomingevents/1"
										className="nav-link"
										activeClassName="nav-link-active"
										isActive={() =>
											this.context.router.route.location.pathname.split(
												"/upcomingevents/"
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
										<DashboardOutlined /> {" "}
										<span className="toggleHidden">Dashboard</span>
									</NavLink>
								</li>

								{/* <li>
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
							</li> */}
								<li>
									<NavLink
										to="/topics"
										className="nav-link"
										activeClassName="nav-link-active"
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
										<ModeCommentOutlined />{" "}
										<span className="toggleHidden">Topics</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/calendar"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.toggleSidebarClass(true);
										}}
									>
										<TodayOutlined />{" "}
										<span className="toggleHidden">
											Calendar
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/calendar"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.toggleSidebarClass(true);
										}}
									>
										<ModeCommentOutlined />{" "}
										<span className="toggleHidden">
											Validate Tickets
									</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">Manage Events</h5>
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
										<i
											className="fa fa-edit fontAwesomeIcon"
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
										<ListAltOutlined />{" "}
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
											className="fa fa-ticket-alt fontAwesomeIcon"
											title="My Tickets"
										></i>{" "}
										<span className="toggleHidden">
											My Tickets
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/favorites"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.toggleSidebarClass(true);
										}}
									>
										<FavoriteBorder/>{"  "}
										<span className="toggleHidden">
											Favourites
									</span>
									</NavLink>
								</li>
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
											className="fas fa-chart-bar fontAwesomeIcon"
											title="Dashboard"
										></i>{"  "}
										<span className="toggleHidden">
											Analytics
									</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">Resources</h5>
							<ul className="nav flex-column">
								<li>
									<NavLink
										to="/guide"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<InfoOutlined />{" "}
										<span className="toggleHidden">
											How It Works
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/faqs"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<ForumOutlined />{" "}
										<span className="toggleHidden">FAQ's</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/terms-and-conditions"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<i
											className="fa fa-file-alt fontAwesomeIcon"
											title="How It Works"
											>
										</i>{" "}
										<span className="toggleHidden">
											Terms and Conditions
									</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/terms-and-conditions"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<i
											className="fa fa-file-alt fontAwesomeIcon"
											title="How It Works"
										
										></i>{" "}
										<span className="toggleHidden">
											Privacy Policy
											</span>
									</NavLink>
								</li>
							</ul>

							<ul className="grid toggleHidden">
								<div className="imageHolder">

									<a
										aria-label="Homepage"
										target="blank"
										title="Telegram"
										href="https://t.me/PHNXDAO"
									>
										<img src="./images/navbar/telegram.svg" />
									</a>
								</div>
								<div className="imageHolder">

									<a
										aria-label="Homepage"
										target="blank"
										title="Twitter"
										href="https://twitter.com/phnxdao"
									>
										<img src="./images/navbar/twitter.svg" />
									</a>
								</div>
								<div className="imageHolder">

									<a
										aria-label="Homepage"
										target="blank"
										title="GitHub"
										href="https://github.com/PhoenixDAO/events-dApp/tree/heroku-deployment"
									>
										<img src="./images/navbar/github.svg" />
									</a>
								</div>
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
