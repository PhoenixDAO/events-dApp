import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

import Form from "./Form";
import ipfs from "../../utils/ipfs";
import Loader from "./Loader";
import Done from "./Done";
import { Redirect } from "react-router-dom";

class CreateEvent extends Component {
	tx_checkerInterval=0;
	updaterInterval=0;
	constructor(props, context) {
		super(props);
		this.state = {
			done: false,
			upload: false,
			stage: 0,
			title: null,
			error: false,
			error_text: "Transaction Rejected",
			ipfs: null,
			fileImg: null,
			data: {
				fileHandle:false,
				eventId: 0,
				name: null,
				description: null,
				time: 0,
				currency: null,
				price: 0,
				organizer: null,
				limited: false,
				seats: 0,
				type: null,
			},
		};
		this.contracts = context.drizzle.contracts;
	}

	createEvent = (
		fileHandle,
		fileImg,
		eventId,
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
		seats
	) => {
		this.setState(
			{
				upload: true,
				redirect: false,
				stage: 25,
				title: "Uploading event image...",
				data: {
					fileHandle:fileHandle,
					fileImg: fileImg,
					eventId: eventId,
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
				},
			},
			() => {
				if (fileHandle == true) {
					this.stageUpdater(90);
					this.readFile(file);
				}
				else{
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
				organizer: this.state.data.organizer
			});
		} else {
			data = JSON.stringify({
				image: this.state.data.fileImg,
				text: this.state.data.description,
				location: this.state.data.location,
				organizer: this.state.data.organizer
			});
		}
		let buffer = Buffer.from(data);
		ipfs.add(buffer, { pin: pinit })
			.then((hash) => {
				this.setState({
					stage: 95,
					title: "Creating transaction...",
					ipfs: hash[0].hash,
				});
				this.props.passtransaction(
					this.contracts["DaoEvents"].methods.updateEvent(
						this.state.data.eventId,
						this.state.data.time,
						this.state.data.price,
						this.state.data.currency === "eth" ? false : true,
						this.state.data.limited,
						this.state.data.seats,
						this.state.ipfs,
						this.state.data.type,
					),"edit"
				);
			})
			.catch((error) => {
				this.setState(
					{
						error: true,
						error_text: "Transaction Rejected",
					},
					() => {
						// console.log(this.state.error_text);
					}
				);
				// console.log(error);
			});
	};

	uploadTransaction = () => {
		let id = this.contracts["DaoEvents"].methods.updateEvent.cacheSend(
			this.state.data.eventId,
			this.state.data.time,
			this.state.data.price,
			this.state.data.seats,
			this.state.ipfs,
			this.state.data.type,
			this.state.organizer
		);
		this.transactionChecker(id);
		this.createNewEvent();

		this.setRedirect();
	};

	setRedirect = () => {
		this.setState({
			redirect: true,
		});
		if (this.state.redirect) {
			return <Redirect to="/" />;
		}
	};

	createNewEvent = () => {
		this.setState({ error: false, done: false, upload: false }, () =>
			console.log()
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
	componentWillUnmount(){
		clearInterval(this.updaterInterval)
		clearInterval(this.tx_checkerInterval)
	}
	componentDidMount() {
		this.props.executeScroll({ behavior: "smooth", block: "start" });
	}

	render() {
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
							disabledStatus={this.props.disabledStatus}
							{...this.props.location.state}
						/>
					</div>
				</React.Fragment>
			);
		if (this.state.error || this.props.error) {
			body = (
				<div className="row">
				<Form
							createEvent={this.createEvent}
							account={this.props.account}
							disabledStatus={this.props.disabledStatus}
							{...this.props.location.state}
						/>
											</div>

			);
		}

		return (
			<div className="home-wrapper">
				<h2>
					<i className="fa fa-edit"></i> Edit Event
				</h2>
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

				<hr />
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
export default AppContainer;
