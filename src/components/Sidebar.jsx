import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import Web3 from "web3";
import Snackbar from "./Snackbar";
import Snackbar2 from "./Snackbar2";
import {
	Menu,
	DashboardOutlined,
	Dashboard,
	ModeCommentOutlined,
	TodayOutlined,
	ListAltOutlined,
	InfoOutlined,
	ForumOutlined,
	Forum,
	Favorite,
	Error,
} from "@material-ui/icons";
import "../styles/navbar.css";
import ThemeSwitch from "./common/Switch";
import ipfs from "../utils/ipfs";

import {
	AnalyticsIcon,
	Topics,
	ConfirmPurchase,
	Calendar,
	CreateEvent,
	CreatedEvents,
	MyTickets,
	Guide,
	Terms,
	Works,
	Faq,
} from "./Images/Icon.js";
import {
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
	INFURA_URL,
	INFURA_URL_2,
} from "../config/const.js";
import DialogueBox from "./common/DialogueBox";
import Wallet from "./common/Wallet";
import { Button } from "@material-ui/core";

class Sidebar extends Component {
	constructor(props, context) {
		console.log("accounts props in sidebar", props.account);
		super(props);
		this.state = {
			errorMessage: "",
			openSnackbar: false,
			avatarCustom: false,
			avatar: "",
			avatarId: 0,
			loading: false,
			networkId: false,
			openWallet: false,
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
	}

	componentDidMount() {
		this.toggleSidebarClass(false);
		this.getNetworkId();
	}

	componentDidUpdate(prevProps) {
		// console.log("this.props.userDetails", this.props.userDetails);
		// console.log("prevProps.userDetails", prevProps.userDetails);
		if (
			JSON.stringify(this.props.userDetails) !==
			JSON.stringify(prevProps.userDetails)
		) {
			this.provideImage();
		}
	}

	sidebarClick() {
		// this.toggleSidebarClass(true);
		var isActive = this.context.router.route.location.pathname;
		var activeClassName = "";
		var linkLocation = this.props.to;

		if (isActive == linkLocation) {
			activeClassName = "nav-item active";
		} else {
			activeClassName = "nav-item";
		}
	}

	handleOpenWallet = () => {
		this.setState({ openWallet: true });
	};

	handleCloseWallet = () => {
		this.setState({ openWallet: false });
	};

	toggleSidebarClass = (closeOnly) => {
		if (!closeOnly) {
			const oldSidebarClassName =
				document.getElementById("sidebar-wrapper").className;
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

			document.getElementById("sidebar-wrapper").className =
				newSidebarClassName;
			document.getElementById("page-content-wrapper").className =
				newPageWrapperClassName;
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
						openSnackbarForPendingRequest: false,
						openSnackbarForPendingRequest: true,
					});
				}
			}
		} else {
			this.setState({
				errorMessage:
					"MetaMask is not installed. Please install MetaMask to continue !",
				openSnackbarForPendingRequest: true,
				openSnackbarForPendingRequest: false,
			});
		}
	}
	handleSnackbarClose = (number) => {
		if (number == 1) {
			this.setState({ openSnackbarForPendingRequest: false });
		} else {
			this.setState({ openSnackbarForPendingRequest: false });
		}
	};

	imageData = (index) => {
		let myArray = [
			{ img: "/images/avatars/bennu.svg", name: "Bennu", onclick: false },
			{
				img: "/images/avatars/milcham.svg",
				name: "Milcham",
				onclick: false,
			},
			{
				img: "/images/avatars/thunderbird.svg",
				name: "Thunderbird",
				onclick: false,
			},
			{
				img: "/images/avatars/garuda.svg",
				name: "Garuda",
				onclick: false,
			},
			{
				img: "/images/avatars/firebird.svg",
				name: "Firebird",
				onclick: false,
			},
			{
				img: "/images/avatars/metamask.svg",
				name: "Custom",
				onclick: true,
			},
		];
		return myArray[index].img;
	};

	provideImage = () => {
		console.log("this.props.userDetails", this.props.userDetails);
		if (Object.keys(this.props.userDetails).length > 0) {
			// console.log("userdetailsss", this.props.userDetails);
			// console.log("", this.props.userDetails);
			const avatarCustom =
				this.props.userDetails.result.result.userHldr.avatarCustom;
			const avatarId =
				this.props.userDetails.result.result.userHldr.avatarNumber;
			const avatar = this.props.userDetails.result.result.userHldr.avatar;
			this.setState({
				avatarCustom: avatarCustom,
				avatarId: avatarId,
			});
			if (avatarCustom) {
				ipfs.get(avatar).then((file) => {
					// console.log("ipfs file,", file);
					let data = JSON.parse(file[0].content.toString());
					// console.log("dataaaa", data.image0);
					this.setState({
						avatar: data.image0,
					});
				});
			}
		}
	};

	renderImage = () => {
		if (this.state.avatarCustom) {
			// return <image
			// console.log("avatar ipfs image", this.state.avatar);
			return (
				<img
					src={this.state.avatar}
					style={{ width: "40px", height: "40px" }}
					className="bird"
				/>
			);
		} else {
			return (
				<img
					src={this.imageData(this.state.avatarId)}
					style={{ display: "block", margin: "5px" }}
					className="bird"
				/>
			);
		}
	};

	getNetworkId = async () => {
		try {
			this.setState({
				loading: true,
			});
			let web3;
			if (window.ethereum && window.ethereum.isMetaMask) {
				web3 = new Web3(window.ethereum);
			} else if (typeof web3 !== "undefined") {
				web3 = new Web3(web3.currentProvider);
			} else {
				const network = await web3.eth.net.getId();
				let infura;
				if (network === GLOBAL_NETWORK_ID) {
					infura = INFURA_URL;
				} else if (network === GLOBAL_NETWORK_ID_2) {
					infura = INFURA_URL_2;
				}
				web3 = new Web3(new Web3.providers.HttpProvider(infura));
			}
			const networkId = await web3.eth.net.getId();

			console.log("This called getNetworkId", networkId);
			if (networkId === GLOBAL_NETWORK_ID) {
				this.setState({
					networkId: true,
					loading: false,
				});
				return;
			} else if (networkId === GLOBAL_NETWORK_ID_2) {
				this.setState({
					networkId: true,
					loading: false,
				});
				return;
			} else {
				console.log("network id not suported");
			}
			this.setState({
				loading: false,
				networkId: false,
			});
			return;
		} catch (err) {
			console.log("err", err);
		}
	};

	render() {
		let user = (
			<div>
				{/* <div className="user-status-icon">
					<i className="fas fa-plug"></i>
				</div> */}

				<p className="small connection">
					<span className="toggleHidden">
						{this.state.loading ? null : this.state.networkId ? (
							<span className="sidebarOpenWallet" onClick={this.handleOpenWallet}>
								<img
									className="switch-img"
									src="/images/icons/switch.svg"
								/>
								Connect Wallet
							</span>
						) : (
							<span>
								<img
									className="switch-img"
									src="/images/icons/switch.svg"
								/>
								Switch to Matic or Main net
							</span>
						)}
				<p className="small connection" style={{display:"flex", alignItems:"start"}}>
					<img
						className="switch-img"
						src="/images/icons/switch.svg"
					/>
					<span className="toggleHidden" style={{padding: "5px 0px"}}>
						{this.state.loading
							? null
							: this.state.networkId
							? "Connect Wallet"
							: "Switch to Rinkbey or Goerli network"}
					</span>
				</p>
			</div>
		);
		if (this.props.connection === true && this.props.account) {
			user = (
				<div className="mt-5">
					<div className="user-status-icon">
						<NavLink
							to="/accountdetails"
							style={{ display: "flex", alignItems: "center" }}
						>
							{/* <img
								src={makeBlockie(this.props.account)}
								alt={this.props.account}
							/> */}
							{/* {console.log(
								"this.props.userDetails",
								this.props.userDetails
							)} */}
							{/* {this.provideImage(this.props.userDetails)} */}
							{/* <img src="./images/metamask.svg" className="bird" /> */}

							{this.renderImage()}

							<span
								style={{
									marginLeft: "20px",
									fontSize: "15px",
									fontWeight: "bold",
								}}
							>
								{this.props.account.substring(0, 2)}
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
		//routes that display when user is not connected
		if (
			!this.props.account ||
			this.props.account.length === 0 ||
			!this.props.status
		) {
			console.log(
				"I am doing that",
				this.props.networkId == GLOBAL_NETWORK_ID ||
					this.props.networkId == GLOBAL_NETWORK_ID_2
			);
			return (
				<React.Fragment>
					<Snackbar
						open={this.state.openSnackbarForPendingRequest}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(1)}
					/>
					<Snackbar2
						style={{ zIndex: "9999999 !important" }}
						open={this.state.openSnackbarForPendingRequest}
						message={this.state.errorMessage}
						handleClose={() => this.handleSnackbarClose(2)}
					/>

					<div
						id="sidebar-wrapper"
						className="my-sidebar sidebar-closed"
					>
						<div
							className="hamburgerNav"
							onClick={() => {
								this.toggleSidebarClass(false);
							}}
						>
							<Menu className="icon" />
						</div>
						<div className="user-status">{user}</div>
						<div className="menu mt-5">
							<h5 className="toggleHidden header">
								Events and Tickets
							</h5>
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
										<span className="iconMargin">
											<Dashboard
												style={{ color: "#73727D" ,fontSize:"20px"}}
											/>
										</span>{" "}
										<span className="toggleHidden">
											Dashboard
										</span>
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
										{/* <ModeCommentOutlined /> */}
										<span className="iconMargin">
											{Topics}
										</span>{" "}
										<span className="toggleHidden">
											Topics
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/confirm-purchase"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										{/* <i className="far fa-check-square fontAwesomeIcon"></i>{" "} */}
										<span className="iconMargin">
											{ConfirmPurchase}
										</span>
										<span className="toggleHidden  ml-1">
											Confirm Purchase
										</span>
									</NavLink>
								</li>
							</ul>
							{/* <h5 className="mt-5 toggleHidden header">Manage Events</h5>
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
							</ul> */}
							<h5 className="mt-5 toggleHidden header">
								Resources
							</h5>
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
										<span className="iconMargin">
											<InfoOutlined
												style={{
													color: "#73727D",
													fill: "#73727D",
												}}
											/>
										</span>{" "}
										<span className="toggleHidden">
											How It Works
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/faq"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										{/* <ForumOutlined /> */}
										<span className="iconMargin">
											{Faq}
										</span>{" "}
										<span className="toggleHidden">
											FAQ's
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
										{/* <i
											className="fa fa-file-alt fontAwesomeIcon"
											title="Terms and Conditions"
										></i> */}
										<span className="iconMargin">
											{Terms}
										</span>{" "}
										<span className="toggleHidden">
											Terms and Conditions
										</span>
									</NavLink>
								</li>
								<li>
									{/* <div
										className="nav-link"
										onClick={
											this.connectToMetaMask
										}
									>
										<i className="fas fa-plug"></i>{" "}
										<span className="toggleHidden">
											Connect Wallet
									</span>
									</div> */}
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
										<img src="/images/icons/telegram.svg" alt="telegram"/>
									</a>
								</div>
								<div className="imageHolder">
									<a
										aria-label="Homepage"
										target="blank"
										title="Twitter"
										href="https://twitter.com/phnxdao"
									>
										<img src="/images/icons/twitter.svg" alt="twitter"/>
									</a>
								</div>
								<div className="imageHolder">
									<a
										aria-label="Homepage"
										target="blank"
										title="GitHub"
										href="https://github.com/PhoenixDAO/events-dApp/tree/designing"
									>
										<img src="/images/icons/github.svg" alt="github" />
									</a>
								</div>
							</ul>
						</div>
					</div>
					<DialogueBox
						open={this.state.openWallet}
						handleClose={this.handleCloseWallet}
						maxWidth="xs"
					>
						{/* <IdentityForm setNextForm={setNextForm} nextForm={nextForm} /> */}
						<Wallet />
					</DialogueBox>
				</React.Fragment>
			);
		} else
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
					<div
						id="sidebar-wrapper"
						className="my-sidebar sidebar-closed"
					>
						<div
							className="hamburgerNav"
							onClick={() => {
								this.toggleSidebarClass(false);
							}}
						>
							<Menu className="icon" />
						</div>
						<div className="user-status">{user}</div>
						<div className="menu mt-5">
							<h5 className="toggleHidden header">
								Events and Tickets
							</h5>
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
										<span className="iconMargin">
											<Dashboard
												style={{ color: "#73727D" ,fontSize:"20px"}}
												/>
										</span>{" "}
										<span className="toggleHidden">
											Dashboard
										</span>
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
										{/* <ModeCommentOutlined /> */}
										<span className="iconMargin">
											{Topics}
										</span>{" "}
										<span className="toggleHidden">
											Topics
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/calendar"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										{/* <TodayOutlined /> */}
										<span className="iconMargin">
											{Calendar}
										</span>{" "}
										<span className="toggleHidden">
											Calendar
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/confirm-purchase"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										{/* <i className="far fa-check-square fontAwesomeIcon"></i> */}
										<span className="iconMargin">
											{ConfirmPurchase}
										</span>
										<span className="toggleHidden ml-1">
											Confirm Purchase
										</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">
								Manage Events
							</h5>
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
										{/* <i
											className="fa fa-edit fontAwesomeIcon"
											// class="fa fa-pencil-square"
											// class="fas fa-pen-square"
											title="Create Event"
										></i> */}
										<span className="iconMargin">
											{CreateEvent}
										</span>{" "}
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
										{/* <ListAltOutlined /> */}
										<span className="iconMargin">
											{CreatedEvents}
										</span>{" "}
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
										{/* <i
											className="fa fa-ticket-alt fontAwesomeIcon"
											title="My Tickets"
										></i> */}
										<span className="iconMargin">
											{MyTickets}
										</span>{" "}
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
											this.sidebarClick(this);
										}}
									>
										<span className="iconMargin">
											<Favorite
												style={{ color: "#73727D" ,fontSize:"20px"}}
												/>
										</span>
										{"  "}
										<span className="toggleHidden">
											Favourites
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/analytics"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<span className="iconMargin">
											{AnalyticsIcon}
										</span>
										{"  "}
										<span className="toggleHidden">
											Analytics
										</span>
									</NavLink>
								</li>
							</ul>
							<h5 className="mt-5 toggleHidden header">
								Resources
							</h5>
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
										<span className="iconMargin">
											{Works}
										</span>
										{/* <InfoOutlined /> */}{" "}
										<span className="toggleHidden">
											How It Works
										</span>
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/faq"
										className="nav-link"
										activeClassName="nav-link-active"
										onClick={() => {
											this.sidebarClick(this);
										}}
									>
										<span className="iconMargin">
											{Faq}
										</span>{" "}
										<span className="toggleHidden">
											FAQ's
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
										{/* <i
											className="fa fa-file-alt fontAwesomeIcon"
											title="How It Works"
										></i> */}
										<span className="iconMargin">
											{Terms}
										</span>{" "}
										<span className="toggleHidden">
											Terms and Conditions
										</span>
									</NavLink>
								</li>
								<li>
									<ThemeSwitch />
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
										<img src="/images/icons/telegram.svg" />
									</a>
								</div>
								<div className="imageHolder">
									<a
										aria-label="Homepage"
										target="blank"
										title="Twitter"
										href="https://twitter.com/phnxdao"
									>
										<img src="/images/icons/twitter.svg" />
									</a>
								</div>
								<div className="imageHolder">
									<a
										aria-label="Homepage"
										target="blank"
										title="GitHub"
										href="https://github.com/PhoenixDAO/events-dApp/tree/designing"
									>
										<img src="/images/icons/github.svg" />
									</a>
								</div>
							</ul>
						</div>
					</div>
				</React.Fragment>
			);
	}
}

Sidebar.contextTypes = {
	router: PropTypes.object,
};

export default Sidebar;
