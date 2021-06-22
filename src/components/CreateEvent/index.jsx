import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

import ipfs from "../../utils/ipfs";

import Form from "./Form";
import Loader from "./Loader";
import Done from "./Done";

// material UI styles
import { withStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import BuyPhnxButton from "../common/BuyPhnxButton";

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
	main: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontWeight: 700,
		color: "#1E1E22",
	},
});

class CreateEvent extends Component {
	tx_checkerInterval = 0;
	updaterInterval = 0;
	constructor(props, context) {
		super(props);
		this.state = {
			done: false,
			upload: false,
			stage: 0,
			title: null,
			error: false,
			error_text: "Transaction Rejectesd",
			ipfs: null,
			fileImg: null,
			data: {
				fileHandle: false,
				name: null,
				description: null,
				time: 0,
				currency: null,
				price: 0,
				organizer: null,
				limited: false,
				seats: 0,
				type: null,
				file_name: null,
			},
		};
		this.contracts = context.drizzle.contracts;
	}

	createEvent = (
		fileHandle,
		fileImg,
		name,
		description,
		location,
		time,
		file,
		organizer,
		type,
		topic,
		currency,
		price,
		limited,
		seats,
		file_name
	) => {
		// console.log("price", price);
		this.setState(
			{
				upload: true,
				redirect: false,
				stage: 25,
				title: "Uploading event image...",
				price: price,
				data: {
					fileHandle: fileHandle,
					fileImg: fileImg,
					name: name,
					description: description,
					time: time,
					currency: currency,
					price: this.context.drizzle.web3.utils.toWei(price),
					organizer: organizer,
					limited: limited,
					seats: seats === "" ? 0 : parseInt(seats, 10),
					type: type,
					location: location,
					topic: topic,
					file_name: file_name,
				},
			},
			() => {
				if (fileHandle) {
					this.stageUpdater(90);
					this.readFile(file);
				} else {
					this.stageUpdater(100);
					this.convertAndUpload();
				}
			}
		);
	};

	readFile = (file) => {
		let reader = new window.FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => this.convertAndUpload(reader);
	};

	convertAndUpload = (reader) => {
		let data;
		let pinit = process.env.NODE_ENV === "production";
		if (this.state.data.fileHandle) {
			data = JSON.stringify({
				image: reader.result,
				text: this.state.data.description,
				location: this.state.data.location,
				organizer: this.state.data.organizer,
				topic: this.state.data.topic,
			});
		} else {
			data = JSON.stringify({
				image: this.state.data.fileImg,
				text: this.state.data.description,
				location: this.state.data.location,
				organizer: this.state.data.organizer,
				topic: this.state.data.topic,
			});
		}
		let buffer = Buffer.from(data);
		ipfs.add(buffer, { pin: pinit })
			.then((hash) => {
				// console.log("hashhh",hash)
				this.setState({
					stage: 95,
					title: "Creating transaction...",
					ipfs: hash[0].hash,
				});
				this.props.passtransaction(
					this.contracts["DaoEvents"].methods.createEvent(
						this.state.data.name,
						this.state.data.time,
						this.state.data.price,
						this.state.data.currency === "eth" ? false : true,
						this.state.data.limited,
						this.state.data.seats,
						this.state.ipfs,
						this.state.data.type
					),
					"create"
				);
			})
			.catch((error) => {
				// console.log("error in convertAndUpload",error)
				this.setState(
					{
						error: true,
						error_text: "Transaction Rejected",
					},
					() => {}
				);
			});
	};

	uploadTransaction = () => {
		let id = this.contracts["DaoEvents"].methods.createEvent.cacheSend(
			this.state.data.name,
			this.state.data.time,
			this.state.data.price,
			this.state.data.currency === "eth" ? false : true,
			this.state.data.limited,
			this.state.data.seats,
			this.state.ipfs,
			this.state.data.type,
			this.state.data.organizer
		);

		this.transactionChecker(id);
	};
	createNewEvent = () => {
		this.setState(
			{
				error: false,
				done: false,
				upload: false,
				data: {
					fileHandle: false,
					name: null,
					description: null,
					time: 0,
					currency: null,
					price: 0,
					organizer: null,
					limited: false,
					seats: 0,
					type: null,
					file_name: null,
				},
			},
			() => console.log()
		);
	};

	transactionChecker = (id) => {
		this.tx_checkerInterval = setInterval(() => {
			let tx = this.props.transactionStack[id];
			if (typeof tx !== "undefined") {
				this.setState({
					upload: false,
					done: true,
				});
				clearInterval(this.tx_checkerInterval);
			}
		}, 100);
	};

	stageUpdater = (max) => {
		this.updaterInterval = setInterval(() => {
			if (this.state.stage < max) {
				this.setState({
					stage: this.state.stage + 1,
				});
			} else {
				clearInterval(this.updaterInterval);
			}
		}, 500);
	};
	componentWillUnmount() {
		clearInterval(this.tx_checkerInterval);
		clearInterval(this.updaterInterval);
	}
	componentDidMount() {
		this.props.executeScroll({ behavior: "smooth", block: "start" });
	}

	render() {
		const { classes } = this.props;

		let disabled = true;
		if (this.props.account.length !== 0) {
			disabled = false;
		}

		if (this.props.done) {
			return (
				<Done
					createNewEvent={this.createNewEvent}
					createNewEvent2={this.props.createNewEvent}
				/>
			);
		}

		let body =
			this.state.upload || this.props.upload ? (
				<Loader progress={this.state.stage} text={this.state.title} />
			) : (
				<React.Fragment>
					<div className="row">
						<Form
							createEvent={this.createEvent}
							account={this.props.account}
							data={{
								name: this.state.data.name,
								description: this.state.data.description,
								organizer: this.state.data.organizer,
								location: this.state.data.location,
								time: this.state.data.time,
								price: this.state.data.price,
								currency:
									this.state.data.currency === "eth"
										? false
										: true,
								limited: this.state.data.limited,
								seats: this.state.data.seats,
								ipfs: this.state.ipfs,
								type: this.state.data.type,
								fileImg: this.state.data.fileImg,
								topic: this.state.data.topic,
								file_name: this.state.data.file_name,
							}}
						/>
					</div>
				</React.Fragment>
			);
		if (this.state.error || this.props.error) {
			body = (
				<div className="row">
					<Form
						data={{
							name: this.state.data.name,
							description: this.state.data.description,
							organizer: this.state.data.organizer,
							location: this.state.data.location,
							time: this.state.data.time,
							price: this.state.price,
							currency:
								this.state.data.currency === "eth"
									? false
									: true,
							limited: this.state.data.limited,
							seats: this.state.data.seats,
							ipfs: this.state.ipfs,
							type: this.state.data.type,
							fileImg: this.state.data.fileImg,
							topic: this.state.data.topic,
							file_name: this.state.data.file_name,
						}}
						createEvent={this.createEvent}
						account={this.props.account}
					/>
				</div>
			);
		}

		return (
			<div className="home-wrapper">
				{/* <h2>
					<i className="fa fa-edit"></i> Create Event
				</h2> */}

				{/* top sticky header */}
				<div className={classes.sticky}>
					<div>
						<br />
						<br />
						<div className={classes.main}>
							<div>
								<h2 className={classes.title}>Create Event</h2>
							</div>
							<div>
								<BuyPhnxButton />
							</div>
						</div>
						<Divider light />
					</div>
				</div>

				{disabled && (
					<div className="alert-connection col-lg-6 mb-6">
						<div className="connection-box">
							<p className="mt-1 mb-1">
								<span>
									⚠️ You are on VIEW ONLY mode. You won't be
									able to submit because you are not connected
									to a network.
								</span>
							</p>
						</div>
					</div>
				)}

				{/* <hr /> */}
				{body}
			</div>
		);
	}
}

CreateEvent.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		contracts: state.contracts,
		transactionStack: state.transactionStack,
	};
};

const AppContainer = drizzleConnect(CreateEvent, mapStateToProps);
export default withStyles(useStyles)(AppContainer);
