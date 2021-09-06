import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import axios from "axios";
import QrReader from "react-qr-reader";
import CircularProgress from "@material-ui/core/CircularProgress";
// import PhoenixDAOLoader from "./PhoenixDAOLoader";
// import Loading from "./Loading";
import Snackbar from "./Snackbar";
import {
	API_URL,
	REPORT_EVENT,
	INFURA_URL,
	INFURA_URL_2,
	GLOBAL_NETWORK_ID,
	GLOBAL_NETWORK_ID_2,
} from "../config/const";
import { toast } from "react-toastify";
import Notify from "./Notify";
import Web3 from "web3";

class CheckUser extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			blockChainEvent: this.props.blockChainEvent,
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
		this.reportEvent = this.reportEvent.bind(this);
	}

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			tab: tab,
		});
	};

	checkManual = () => {
		if (
			!this.address.value ||
			!this.context.drizzle.web3.utils.isAddress(this.address.value)
		) {
			this.setState({ wrong_address: true });
		} else {
			this.runChecking(this.address.value);
		}
	};

	// async getNetworkId() {
	// 	let web3 = window.web3;
	// 	try {
	// 		if (window.ethereum && window.ethereum.isMetaMask) {
	// 			web3 = new Web3(window.ethereum);
	// 		} else if (typeof web3 !== "undefined") {
	// 			web3 = new Web3(web3.currentProvider);
	// 		} else {
	// 			const network = await web3.eth.net.getId();
	// 			let infura;
	// 			if (network === GLOBAL_NETWORK_ID) {
	// 				infura = INFURA_URL;
	// 			} else if (network === GLOBAL_NETWORK_ID_2) {
	// 				infura = INFURA_URL_2;
	// 			}
	// 			web3 = new Web3(new Web3.providers.HttpProvider(infura));
	// 		}
	// 		const networkId = await web3.eth.net.getId();
	// 		console.log("This called getNetworkId", networkId);
	// 		if (networkId === GLOBAL_NETWORK_ID) {
	// 			return networkId;
	// 		} else if (networkId === GLOBAL_NETWORK_ID_2) {
	// 			return networkId;
	// 		} else {
	// 			console.log("network id not suported");
	// 		}
	// 		return null;
	// 	} catch (err) {
	// 		console.log("err", err);
	// 	}
	// }

	reportEvent = async () => {
		try {
			const networkId = this.props.web3.networkId;
			const token = localStorage.getItem("AUTH_TOKEN");
			this.setState({
				loading: true,
			});
			let payload = {
				reportAccounts: this.account,
				eventName: this.state.blockChainEvent.name,
				id: 98,
				count: 1,
				networkId: networkId,
			};
			const report = await axios.post(
				`${API_URL}${REPORT_EVENT}`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// console.log("Consoleee notify report response",report)
			toast(
				<Notify
					text="Report successful!"
					icon="fas fa-thumbs-down fa-3x"
					color="#413AE2"
				/>,
				{
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true,
				}
			);
			this.props.history.push("/upcomingevents/1");
			this.setState({
				loading: false,
			});
		} catch (error) {
			// console.log("Consoleee notify report response catch",error)
			if (error.response && error.response.data) {
				// console.log("Consoleee notify report response error.response.data",error.response.data)
				toast(
					<Notify
						text={error.response.data.responseMessage + "!"}
						icon="fas fa-exclamation-circle fa-3x"
						color="#F43C3C"
					/>,
					{
						position: "bottom-right",
						autoClose: true,
						pauseOnHover: true,
					}
				);
			}
			this.props.history.push("/upcomingevents/1");
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
		this.ticketsOfUser =
			this.contracts["DaoEvents"].methods.ticketsOf.cacheCall(address);
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

	checkTickets = () => {
		if (
			this.state.requests.ticketsOfUser &&
			this.ticketsOfUser !== null &&
			typeof this.props.contracts["DaoEvents"].ticketsOf[
				this.ticketsOfUser
			] !== "undefined" &&
			!this.state.requests.listOfTickets
		) {
			let tickets =
				this.props.contracts["DaoEvents"].ticketsOf[this.ticketsOfUser]
					.value;

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
		<Snackbar open={true} message={"You have alredy report this event"} />;
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
					<div className="buttonsDiv">
						<button
							className="btn btn-dark col-xs-12"
							onClick={this.checkManual}
						>
							<i className="fas fa-receipt"></i> Confirm Purchase
						</button>
						<button
							disabled={
								this.state.loading || this.props.disabledStatus
							}
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
							Report Event
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
						<i className="fas fa-check-circle"></i> This address has
						a ticket to the event.
					</div>
				);
			} else {
				message = (
					<div className="alert alert-danger" role="alert">
						<i className="fas fa-times"></i> This address has no
						ticket to the event.
					</div>
				);
			}
		}

		return (
			<div>
				<hr className="mt-5" />
				<h3>Confirm Purchase</h3>
				<p>Check if an address has purchased a ticket to this event.</p>
				{message}
				{body}
			</div>
		);
	}

	componentDidUpdate() {
		this.checkTickets();
	}

	componentDidMount() {
		this.checkTickets();
	}
}

CheckUser.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		accounts: state.accounts,
		web3: state.web3,
	};
};

const AppContainer = drizzleConnect(CheckUser, mapStateToProps);
export default AppContainer;
