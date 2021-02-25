import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import axios from "axios";
import QrReader from "react-qr-reader";
import CircularProgress from "@material-ui/core/CircularProgress";
import PhoenixDAOLoader from "./PhoenixDAOLoader";
import Loading from "./Loading";
import Snackbar from "./Snackbar";
import { API_URL, REPORT_EVENT } from "../utils/const";
import { ToastContainer, toast } from "react-toastify";
import NotifyReport from "./NotifyReport";

class CheckUser extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			tab: 1,
			wrong_address: false,
			loading: false,
			status: false,
			requests: {
				ticketsOfUser: false,
				listOfTickets: false,
				requestsDone: false,
			},
		};
		this.account = this.props.accounts[0];
		this.address = null;
		this.ticketsOfUser = null;
		this.listOfTickets = [];
		this.event = this.contracts["DaoEvents"].methods.getEvent.cacheCall(
			this.props.event_id
		);
		this.event_data = this.props.contracts["DaoEvents"].getEvent[
			this.event
		].value;
		this.organizerName = this.contracts[
			"DaoEvents"
		].methods.getOwnerDetails.cacheCall(this.event);
		this.reportEvent = this.reportEvent.bind(this);
		console.log("view this.props", this.props);
	}

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			tab: tab,
		});
	};

	checkManual = () => {
		console.log("!this.address.value", !this.address.value);
		console.log(
			"!this.context.drizzle.web3.utils.isAddress(this.address.value)",
			!this.context.drizzle.web3.utils.isAddress(this.address.value)
		);
		if (
			!this.address.value ||
			!this.context.drizzle.web3.utils.isAddress(this.address.value)
		) {
			this.setState({ wrong_address: true });
		} else {
			this.runChecking(this.address.value);
		}
	};

	reportEvent = async () => {
		try {
			this.setState({
				loading: true,
			});
			console.log("cehck now 123", this.event);
			let ownerDetails = this.props.contracts["DaoEvents"]
				.getOwnerDetails[this.event];
			let payload = {
				reportAccounts: this.account,
				eventName: this.event_data.name,
				id: this.props.event_id,
				count: 1,
			};
			console.log("here==>");
			const report = await axios.post(
				`${API_URL}${REPORT_EVENT}`,
				payload
			);
			console.log("report==>", report);
			toast(<NotifyReport text={"Report successful!"}/>, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				});
			this.props.history.push("/upcomingevents/1");
			this.setState({
				loading: false,
			});
		} catch (error) {
			// console.log("error", error.response.data.responseMessage);
			// console.log("error", error);
			toast(<NotifyReport text={error.response.data.responseMessage+"!"}/>, {
				position: "bottom-right",
				autoClose: true,
				pauseOnHover: true,
			});
			this.setState({
				loading: false,
			});
		}
	};

	checkQR = (data) => {
		if (data) {
			if (this.context.drizzle.web3.utils.isAddress(data)) {
				this.runChecking(data);
			}
		}
	};

	runChecking = (address) => {
		this.ticketsOfUser = this.contracts[
			"DaoEvents"
		].methods.ticketsOf.cacheCall(address);
		this.setState({
			wrong_address: false,
			requests: {
				ticketsOfUser: true,
				listOfTickets: false,
				requestsDone: false,
			},
			status: false,
		});
	};

	// filterHideEvents = async () => {
	// 	const get=await
	// };

	checkTickets = () => {
		if (
			this.state.requests.ticketsOfUser &&
			this.ticketsOfUser !== null &&
			typeof this.props.contracts["DaoEvents"].ticketsOf[
				this.ticketsOfUser
			] !== "undefined" &&
			!this.state.requests.listOfTickets
		) {
			let tickets = this.props.contracts["DaoEvents"].ticketsOf[
				this.ticketsOfUser
			].value;

			for (let i = 0; i < tickets.length; i++) {
				this.listOfTickets.push(
					this.contracts["DaoEvents"].methods.getTicket.cacheCall(
						tickets[i]
					)
				);
			}

			this.setState({
				requests: {
					ticketsOfUser: true,
					listOfTickets: true,
					requestsDone: false,
				},
			});
		}

		if (this.state.requests.listOfTickets) {
			let loading = false;
			let found = false;

			for (let i = 0; i < this.listOfTickets.length; i++) {
				if (
					typeof this.props.contracts["DaoEvents"].getTicket[
						this.listOfTickets[i]
					] === "undefined"
				) {
					loading = true;
				} else {
					if (
						this.props.contracts["DaoEvents"].getTicket[
							this.listOfTickets[i]
						].value[0] === this.props.event_id
					) {
						found = true;
					}
				}
			}

			if (!loading) {
				this.setState({
					requests: {
						ticketsOfUser: false,
						listOfTickets: false,
						requestsDone: true,
					},
					status: found,
				});

				this.ticketsOfUser = null;
				this.listOfTickets = [];
			}
		}
	};

	render() {
		let ownerDetails = this.props.contracts["DaoEvents"].getOwnerDetails[
			this.event
		];
		if (ownerDetails != undefined) {
			ownerDetails = ownerDetails.value;
		}
		console.log("owner1",ownerDetails)
		console.log("hey props", this.props);
		console.log("hey props", this.event);
		console.log("hey props", this.event_data);
		<Snackbar
			// open={this.state.openSnackbar1}
			open={true}
			message={"You have alredy report this event"}
			// handleClose={() => this.handleSnackbarClose(1)}
		/>;
		let body, message;
		if (this.state.tab === 1) {
			let warning = this.state.wrong_address ? "is-invalid" : "";
			body = (
				<div className="mt-3">
					<div className="form-group">
						<label htmlFor="address">Ethereum address</label>
						<input
							type="text"
							className={"form-control " + warning}
							id="address"
							ref={(input) => (this.address = input)}
						/>
					</div>
					<div
					className="buttonsDiv"
					>
						<button
							className="btn btn-dark col-xs-12"
							onClick={this.checkManual}
						>
							<i className="fas fa-receipt"></i> Confirm Purchase
						</button>
						<button
							disabled={this.state.loading || this.props.disabledStatus}
							className="btn btn-dark reportbtn col-xs-12"
							onClick={this.reportEvent}
						>
							{this.state.loading ? (
								<CircularProgress
									style={{ marginRight: "5px" }}
									size={15}
									color="white"
								/>
							) : (
								<i
									style={{ marginRight: "5px" }}
									className="fas fa-flag"
								></i>
							)}
							Report An Event
						</button>
					</div>
				</div>
			);
		} else if (this.state.tab === 2) {
			body = (
				<div className="mt-3">
					<QrReader
						delay={300}
						onScan={this.checkQR}
						onError={() => {
							return;
						}}
						style={{ width: "100%" }}
					/>
				</div>
			);
		}

		if (
			this.state.requests.ticketsOfUser ||
			this.state.requests.listOfTickets
		) {
			message = (
				<div className="alert alert-secondary" role="alert">
					<i className="fas fa-spinner"></i> We are checking
				</div>
			);
		} else if (this.state.wrong_address) {
			message = (
				<div className="alert alert-danger" role="alert">
					<i className="fas fa-times"></i> Invalid wallet address
				</div>
			);
		} else if (this.state.requests.requestsDone) {
			if (this.state.status) {
				message = (
					<div className="alert alert-success" role="alert">
						<i className="fas fa-check-circle"></i> User has ticket
						to this event
					</div>
				);
			} else {
				message = (
					<div className="alert alert-danger" role="alert">
						<i className="fas fa-times"></i> User has no ticket to
						this event
					</div>
				);
			}
		}

		return (
			<div>
				<hr className="mt-5" />
				<h3>Confirm Purchase</h3>
				<p>Check if a user has purchased a ticket to this event.</p>
				{message}
				{/* <ul className="nav nav-pills nav-fill nav-justified mt-3">
					<li className="nav-item">
						<a href="" className={"nav-link " + (this.state.tab === 1 ? 'active' : '')} onClick={(e) => this.changeTab(1, e)}>Enter Address</a>
					</li>
					<li className="nav-item">
						<a href="" className={"nav-link " + (this.state.tab === 2 ? 'active' : '')} onClick={(e) => this.changeTab(2, e)}>QR Scanner</a>
					</li>
				</ul> */}
				{body}
			</div>
		);
	}

	componentDidUpdate() {
		this.checkTickets();
	}

	componentDidMount() {
		this.checkTickets();
		// this.filterHideEvents();
	}
}

CheckUser.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(CheckUser, mapStateToProps);
export default AppContainer;
