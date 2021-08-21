import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import Notify from "../Notify";

import ipfs from "../../utils/ipfs";

import Form from "./Form";
import Loader from "./Loader";
import Done from "./Done";

//revamp
import MyStepper from "./MyStepper";
import PreviewEvent from "./PreviewEvent";

// material UI styles
import { withStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import BuyPhnxButton from "../common/BuyPhnxButton";

import Header from "../common/Header";

import Web3 from "web3";
import { INFURA_URL } from "../../config/const";




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
			fields: {},
			activeStep: 0,
			activeFlamingStep: 0,
			isEventCreated: false,
			progressText: 0,
		};
		this.contracts = context.drizzle.contracts;
		this.onHandleTxReject = this.onHandleTxReject.bind(this);
	}

	onFieldsChange = (f) => {
		this.setState({ fields: { ...this.state.fields, ...f } });
	};

	onStepsChange = (type) => {
		console.log("type", type);
		this.setState((prevState) => {
			return {
				activeStep:
					type == "inc"
						? prevState.activeStep + 1
						: prevState.activeStep - 1,
			};
		});
	};

	onFlamingStepsChange = () => {
		console.log("onFlamingStepsChange");
		// this.setState({ activeFlamingStep: this.state.activeFlamingStep + 1 });
		this.setState((prevState) => {
			return {
				activeFlamingStep: prevState.activeFlamingStep + 1,
			};
		});
	};

	onHandleTxReject(err) {
		console.log("onHandleTxReject", err);
		this.setState((prevState) => {
			return {
				activeStep: prevState.activeStep - 1,
				activeFlamingStep: 0,
				progressText:0
			};
		});
	}

	handleCreateEvent = async () => {
		console.log("handleCreateEvent", this.state.fields);
		this.stageUpdater(90);

		let {
			eventName,
			eventOrganizer,
			eventTopic,
			eventCategory,
			eventLocation,
			eventLink,
			restrictWallet: oneTimeBuy,
			categories: ticketCategories,
			token, //false means free
			eventDate, //onedayevent date format
			eventStartDate, //morethanadayevent
			eventEndDate, //morethanadayevent
			eventStartTime,
			eventEndTime,
			eventTime, //oneday/moreday event
			eventType, //physical or online
			image0,
			image1,
			image2,
			eventDescription,
			country,
			state,
			city,
		} = this.state.fields;

		let image0Base64 = image0 ? await this.getBase64(image0) : "";
		let image1Base64 = image1 ? await this.getBase64(image1) : "";
		let image2Base64 = image2 ? await this.getBase64(image2) : "";

		let ticketLimited = [];
		let tktQnty = [];
		let prices = [];
		let tktQntySold = [];
		let categories = [];
		let totalQuantity = 0;
		let location = eventType === "physical" ? eventLocation : eventLink;
		let onsite = eventType === "physical" ? true : false;

		let countryName = eventType === "physical" ? country.name : "";
		let stateName = eventType === "physical" ? state.name : "";
		let cityName = eventType === "physical" ? city.name : "";

		let time =
			Date.parse(
				eventTime === "onedayevent" ? eventDate : eventStartDate
			) / 1000;

		for (var i = 0; i < ticketCategories.length; i++) {
			ticketLimited.push(ticketCategories[i].ticketAvailability);
			tktQnty.push(ticketCategories[i].noOfTickets);
			prices.push(Web3.utils.toWei(ticketCategories[i].dollarPrice));
			tktQntySold.push("0");
			categories.push(ticketCategories[i].ticketName);
			totalQuantity =
				totalQuantity + parseInt(ticketCategories[i].noOfTickets);
		}

		let pinit = process.env.NODE_ENV === "production";
		let ipfsData = JSON.stringify({
			//new
			image0: image0Base64,
			image1: image1Base64,
			image2: image2Base64,
			eventOrganizer,
			eventDate,
			eventStartDate,
			eventEndDate,
			eventStartTime,
			eventEndTime,
			eventTime,
			eventType,
			eventDescription,
			country: countryName,
			state: stateName,
			city: cityName,
			//old
			image: image0Base64,
			text: eventDescription,
			location: location,
			organizer: eventOrganizer,
			topic: eventTopic,
		});

		let buffer = Buffer.from(ipfsData);
		ipfs.add(buffer, { pin: pinit })
			.then(async (hash) => {
				console.log("hashhh", hash[0].hash);
				this.setState({
					progressText: 100,
				});
				this.onFlamingStepsChange();

				// ipfs.get(hash[0].hash).then((file) => {
				// 	let data = JSON.parse(file[0].content.toString());
				// 	console.log("data", data);
				// });

				let txreceipt = "";
				let txconfirmed = "";
				let txerror = "";

				await this.props.eventsContract.methods
					.createEvent([
						oneTimeBuy,
						token, // false means free
						onsite, // true means event is onsite
						this.props.accounts[0], //owner
						time.toString(), //time
						totalQuantity.toString(), //totalQuantity
						"0", //totalQntySold
						eventName,
						eventTopic,
						location,
						cityName,
						hash[0].hash,
						ticketLimited,
						tktQnty,
						prices,
						tktQntySold,
						categories,
					])
					.send({
						from: this.props.accounts[0],
					})
					.on("transactionHash", (txhash) => {
						// hash of tx
						if (txhash !== null) {
							console.log("txhash", txhash);
							this.onFlamingStepsChange();
							toast(
								<Notify
									hash={txhash}
									text={"Preparing your event...🚀"}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);

							const web3 = new Web3(INFURA_URL);
					
							let intervalVar = setInterval(async () => {
								

								console.log('web3.eth',web3.eth)
								let receipt = await web3.eth.getTransactionReceipt(
									txhash
								);
								if (receipt) {
									toast(
										<Notify
											text={
												"Transaction successfull!\nYou can check event now."
											}
											icon="fas fa-check-circle fa-3x"
											color="#413AE2"
											hash={receipt.transactionHash}
										/>,
										{
											position: "bottom-right",
											autoClose: true,
											pauseOnHover: true,
										}
									);
									this.onFlamingStepsChange();
									clearInterval(intervalVar);
								}
							}, 5000);
						}

					

					})
					.then((receipt) => {
						console.log("receipt----->", receipt);
						// toast(
						// 	<Notify
						// 		text={
						// 			"Transaction successfull!\nYou can check event now."
						// 		}
						// 		icon="fas fa-check-circle fa-3x"
						// 		color="#413AE2"
						// 		hash={receipt.transactionHash}
						// 	/>,
						// 	{
						// 		position: "bottom-right",
						// 		autoClose: true,
						// 		pauseOnHover: true,
						// 	}
						// );
						// this.onFlamingStepsChange();
					})
					.catch((error) => {
						console.log("tx error", error);
						this.onHandleTxReject(error);
						if (error !== null) {
							txerror = error;
							toast(
								<Notify
									error={error}
									message={txerror.message}
								/>,
								{
									position: "bottom-right",
									autoClose: true,
									pauseOnHover: true,
								}
							);
						}
					});
			})
			.catch((error) => {
				console.log("ipfs error", error);
				this.onHandleTxReject(error);
				if (error !== null) {
					let txerror = error;
					toast(
						<Notify
							error={error}
							message={
								txerror.message
									? txerror.message
									: "Something went wrong!"
							}
						/>,
						{
							position: "bottom-right",
							autoClose: true,
							pauseOnHover: true,
						}
					);
				}
			});
	};

	getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

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
		console.log("readFile calling", file);
		let reader = new window.FileReader();
		console.log("reader", reader);
		reader.readAsDataURL(file);
		console.log("reader.readAsDataURL", reader);
		reader.onloadend = () => this.convertAndUpload(reader);
	};

	convertAndUpload = (reader) => {
		let data;
		let pinit = process.env.NODE_ENV === "production";
		if (this.state.data.fileHandle) {
			console.log("fileHandle", true);
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

		console.log("createevent data", data);

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
			console.log("tx -------->", tx);
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
			if (this.state.progressText < max) {
				this.setState({
					// stage: this.state.stage + 1,
					progressText:this.state.progressText+10
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
						<div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<br />
							<br />
							<br />
							<MyStepper
								handleCreateEvent={this.handleCreateEvent}
								onFieldsChange={this.onFieldsChange}
								onStepsChange={this.onStepsChange}
								activeStep={this.state.activeStep}
								onFlamingStepsChange={this.onFlamingStepsChange}
								activeFlamingStep={this.state.activeFlamingStep}
								isEventCreated={this.state.isEventCreated}
								progressText={this.state.progressText}
							/>
						</div>
						<div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-xs-12 create-event">
							<br />
							<br />
							<br />
							<PreviewEvent
								fields={this.state.fields}
								activeStep={this.state.activeStep}
							/>
						</div>
					</div>
				</React.Fragment>
			);
		if (this.state.error || this.props.error) {
			body = (
				<div className="row">
					<div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<br />
						<br />
						<br />
						<MyStepper
							handleCreateEvent={this.handleCreateEvent}
							onFieldsChange={this.onFieldsChange}
							onStepsChange={this.onStepsChange}
							onFlamingStepsChange={this.onFlamingStepsChange}
							activeFlamingStep={this.state.activeFlamingStep}
							isEventCreated={this.state.isEventCreated}
							progressText={this.state.progressText}
						/>
					</div>
					<div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-xs-12 create-event">
						<br />
						<br />
						<br />
						<PreviewEvent
							fields={this.state.fields}
							activeStep={this.state.activeStep}
						/>
					</div>
				</div>
			);
		}

		return (
			<div className="home-wrapper">
				<Header
					title="Create Event"
					page="createevent"
					phnxButton="true"
				/>

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

				{/* <button
					type="button"
					onClick={() => {
						ipfs.get(
							"Qmbw4rc97n8F4KrjrRnxCw6Fm72EgUR2nE9YsTFiUdSSL1"
						).then((file) => {
							let data = JSON.parse(file[0].content.toString());
							console.log("data", data);
						});
					}}
				>
					doIPFS
				</button> */}

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
		accounts: state.accounts,
	};
};

const AppContainer = drizzleConnect(CreateEvent, mapStateToProps);
export default withStyles(useStyles)(AppContainer);
