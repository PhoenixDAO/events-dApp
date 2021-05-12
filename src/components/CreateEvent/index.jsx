import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";

import ipfs from "../../utils/ipfs";

import Form from "./Form";
import Loader from "./Loader";
import Error from "./Error";
import Done from "./Done";
//import { Redirect } from 'react-router-dom';

class CreateEvent extends Component {
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
				if (fileHandle == true) {
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
		// let buffer2 = Buffer.from(JSON.stringify({name:"Jaffer",company:"Xord"}))
		// ipfs.add(buffer2,{pin: pinit}).then((hash)=>{
		// 	console.log("hash is buffer2",hash);

		// })
		ipfs.add(buffer, { pin: pinit })
			.then((hash) => {
				// console.log("hashhh",hash)
				this.setState({
					stage: 95,
					title: "Creating transaction...",
					ipfs: hash[0].hash,
				});
				//this.uploadTransaction();
				// console.log("testing",this.contracts["DaoEvents"].methods.createEvent(
				// 	this.state.data.name,
				// 	this.state.data.time,
				// 	this.state.data.price,
				// 	this.state.data.currency === "eth" ? false : true,
				// 	this.state.data.limited,
				// 	this.state.data.seats,
				// 	this.state.ipfs,
				// 	this.state.data.type,
				// 	this.state.organizer
				// ))
				// this.contracts["DaoEvents"].methods.eventsOf(
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
						// this.state.data.organizer
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
		//this.setRedirect();
	};

	/*setRedirect=()=>{
		this.setState({
			redirect: true
		  })
		if(this.state.redirect){
			return <Redirect to='/'/>
		}
	}*/

	createNewEvent = () => {
		this.setState({ error: false, done: false, upload: false, data: {
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
		}}, () =>
			console.log()
		);
	};

	transactionChecker = (id) => {
		let tx_checker = setInterval(() => {
			let tx = this.props.transactionStack[id];
			if (typeof tx !== "undefined") {
				this.setState({
					upload: false,
					done: true,
				});
				clearInterval(tx_checker);
			}
		}, 100);
	};

	stageUpdater = (max) => {
		let updater = setInterval(() => {
			if (this.state.stage < max) {
				this.setState({
					stage: this.state.stage + 1,
				});
			} else {
				clearInterval(updater);
			}
		}, 500);
	};
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
				<h2>
					<i className="fa fa-edit"></i> Create Event
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
