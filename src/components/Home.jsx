import React, { Component } from "react";
import "../styles/main.css";

class Home extends Component {
	render() {
		return (
			<div className="welcomeWrapper">
				<div className="opaqueBackground">
					<h2 className="welcomeHead">
						WELCOME TO PHOENIX EVENT DAPP
					</h2>
					<p>
						The PhoenixDAO Events Marketplace is a dApp that allows
						people to create events and sell tickets online, with
						the option to make an event, paid or free.
					</p>
					<p>
						The tickets created on this service are ERC721 tokens,
						which means that users are able to move, gift, or sell
						those tickets to other users.
					</p>
					<p>
						The PhoenixDAO Events Marketplace is a dApp powered by
						the Ethereum blockchain. In order to create events or
						purchase tickets, you are required have an Ethereum
						wallet. If you do not have one currently, you can use{" "}
						{typeof InstallTrigger !== "undefined" ? (
							<a
								target="_blank"
								style={{ textAlign: "center" }}
								href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
							>
								{" "}
								[LINK]
							</a>
						) : (
							<a
								target="_blank"
								style={{ textAlign: "center" }}
								href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
							>
								{" "}
								MetaMask
							</a>
						)}
						.
					</p>
					<div className="row user-list mt-4 pb-5">
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage:
											"url(/images/topics/bar-crawl.jpg)",
										backgroundSize: "cover",
										borderRadius: "7px",
										paddingTop: "26px",
									}}
								>
									<img
										className="welcome-img"
										src={
											"/welcomePage/Icon material-event-available.svg"
										}
									></img>
									<p className="mt-2 headings">
										13 Past Events
										{/* {this.props.accounts[0].slice(0, 15) +
											"..."} */}
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption metamaskDiv"
									style={{ paddingTop: "26px" }}
								>
									<img
										src={"/welcomePage/metamask-fox.svg"}
										height="85px "
										width="85px"
									></img>
									<h3
										style={{
											color: "#FFA200",
											fontWeight: "bold",
											opacity: 1,
											zIndex: 1,
										}}
									>
										Connect to MetaMask
									</h3>
									<h4 className="dashboard-data">
										{/* {eventCount.length} */}
									</h4>
									<p className="dashboard-footer">Events</p>
								</div>
							</div>
						</div>

						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/slides/slide3.png")`,
										backgroundSize: "cover",
										paddingTop: "26px",
									}}
								>
									<h3>
										<i className="fas fa-calendar-alt welcome-img"></i>
									</h3>

									<p className="mt-2 headings">
										20 Upcoming Events
										{/* {this.props.accounts[0].slice(0, 15) +
											"..."} */}
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/topics/charity-and-causes.jpg")`,
										backgroundSize: "cover",
										opacity: 0.9,
										paddingTop: "26px",
									}}
								>
									<img
										src={
											"/welcomePage/Icon feather-user.svg"
										}
										className="welcome-img"
									></img>
									<p className="mt-2 headings">
										34 Active Users
										{/* {this.props.accounts[0].slice(0, 15) +
											"..."} */}
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption metamaskDiv"
									style={{ paddingTop: "26px" }}
								>
									<img
										src={
											"/welcomePage/Icon ionic-logo-youtube.svg"
										}
										style={{ width: "50px" }}
										className="welcome-img"
									></img>
									<h3 className="mt-2 headings">
										Walk Through Video{" "}
									</h3>
								</div>
							</div>
						</div>

						<div className="col-lg-4 pb-4 d-flex align-items-stretch">
							<div className="dashboard-card">
								<div
									className="dashboard-caption"
									style={{
										backgroundImage: `url("/images/slides/slide1.png")`,
										backgroundSize: "cover",
										opacity: 0.9,
										paddingTop: "26px",
									}}
								>
									<img
										src={
											"/welcomePage/Icon awesome-ticket-alt.svg"
										}
										className="welcome-img"
									></img>
									<p className="mt-2 headings">
										25 Ticket Sold
										{/* {this.props.accounts[0].slice(0, 15) +
											"..."} */}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.props.executeScroll();
	}
}
export default Home;
