import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { FacebookCircularProgress } from "./TimeAndDateLoader";

// import { Link } from 'react-router-dom';
// import ReactTooltip from 'react-tooltip'
import eventTypes from "../../config/types.json";
import eventTopics from "../../config/topics.json";
var moment = require("moment");

let numeral = require("numeral");
class Form extends Component {
	constructor(props) {
		super(props);

		// console.log("props.currentBlock",props.currentBlock)
		this.form = {};
		this.web3 = props.web3;
		this.state = {
			title: "",
			title_length: 0,
			description_length: 0,
			organizer: "",
			organizer_length: 0,
			price: "",
			dollarPrice: "",
			location: "",
			time: 0,
			// time:Math.floor(Date.now() / 1000),
			timeForHumans: null,
			currency: "phnx",
			type: "auto-boat-and-air",
			topic: "appearance-or-signing",
			limited: false,
			terms: false,
			seatsForHumans: 0,
			seats:0,
			wrong_file: false,
			file_name: null,
			file: null,
			blockie: "/images/PhoenixDAO.png",
			fileImg: "/images/event-placeholder.png",
			form_validation: [],
			currentBlock: null,
			updateTimeStamp: true,

			PhoenixDAO_market: "",
			dateDisplay: new Date(Date.now() + 10800000),
			// dateDisplay:new Date(parseInt('1577952000', 10) * 1000)
			// dateDisplay:''
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		// console.log("1",nextProps.currentBlock.timestamp, nextState);
		// console.log("2",this.state.currentBlock	, this.state);
		if (
			nextProps.currentBlock &&
			nextProps.currentBlock.timestamp &&
			this.state.updateTimeStamp
		) {
			console.log("updating now");
			this.setState({
				currentBlock: nextProps.currentBlock,
				updateTimeStamp: false,
			});
			// this.setState({updateTimeStamp:false});
		}
		return true;
	}
	getCurrentTime = async () => {
		// console.log("this.web3.customProvider.eth : ",this.web3)

		// const blockNumber= await this.web3.customProvider.eth.getBlockNumber()
		// console.log("blocknumber : ",blockNumber)

		// const block = await this.web3.customProvider.eth.getBlock(blockNumber)
		// console.log("timestamp : ",block.timestamp)
		this.setState({ updateTimeStamp: true });

		const todayDate = new Date(
			parseInt(this.state.currentBlock.timestamp, 10) * 1000
		);
		console.log("Date : ", todayDate);

		return todayDate;
		// this.setState({dateDisplay:todayDate});
	};

	getPhoenixDAOMarketValue = () => {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				this.setState({ PhoenixDAO_market: data.phoenixdao });
			})
			.catch(console.log);
	};

	getPhoenixDAOMarketValue = () => {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				this.setState({ PhoenixDAO_market: data.phoenixdao });
			})
			.catch(console.log);
	};

	handleDate = (date) => {
		// console.log("date is d",  date._d.toString())
		// console.log("date is i",  date._i.toString())
		// console.log("if equal ",  date._i.toString() == date._d.toString())
		// console.log("Date(Date.now()) is",typeof Date.now())
		// console.log("this.state.currentBlock : ",this.state.currentBlock)
		// console.log("date.unix() : ",date.unix())
		// console.log("todayDay",todayDay._i/1000)
		// let todayDay= moment.unix(this.state.currentBlock.timestamp)
		// console.log("date by adding to timestamp",new Date(parseInt(this.state.currentBlock.timestamp+10800, 10) * 1000))
		if (
			typeof date === "object" &&
			date.isValid() &&
			this.state.currentBlock &&
			this.state.currentBlock.timestamp &&
			date.unix() >
				moment.unix(this.state.currentBlock.timestamp + 10800)._i / 1000
		) {
			// console.log("updating")
			// console.log("date display ", new Date(parseInt(date.unix(), 10) * 1000))
			this.setState(
				{
					dateDisplay: new Date(parseInt(date.unix(), 10) * 1000),
					timeForHumans: date.time,
					time: date.unix(),
				}
				// ()=>this.setState({dateDisplay: new Date(parseInt(this.state.time, 10) * 1000)})
			);
			// console.log(date)
		}
	};

	handleCurrency = (event) => {
		console.log("handleCurrency====>", event.target.value);
		if (event.target.value == "phnx") {
			this.setState(
				{
					currency: event.target.value,
					price: "",
					dollarPrice: "",
				},
				() =>
					console.log(
						"currency",
						this.state.currency,
						this.state.price
					)
			);
		} else {
			this.setState(
				{
					currency: event.target.value,
					price: "0",
				},
				() =>
					console.log(
						"currency",
						this.state.currency,
						this.state.price
					)
			);
		}
	};

	handleLimited = () => {
		this.setState({
			limited: !this.state.limited,
			seats: 0,
		});
	};

	handleTerms = () => {
		this.setState({
			terms: !this.state.terms,
		});
	};

	handleFile = (event) => {
		let file = event.target.files[0];
		if (!file) {
			console.log("file", file);

			return;
		}
		if (
			file.size > 1024 * 1024 ||
			(file.type !== "image/jpeg" && file.type !== "image/png")
		) {
			this.setState({
				wrong_file: true,
				file: null,
			});
		} else {
			this.setState({
				wrong_file: false,
				file_name: file.name,
				file: file,
				fileImg: URL.createObjectURL(event.target.files[0]),
			});
		}
	};

	titleChange = (event) => {
		let title = event.target.value;
		if (title.length > 80) {
			title = title.slice(0, 80);
		}
		this.setState({
			title: title,
			title_length: title.length,
		});
	};

	descriptionChange = (event) => {
		let description = event.target.value;
		if (description.length > 500) {
			description = description.slice(0, 500);
		}
		this.setState({
			description: description,
			description_length: description.length,
		});
	};

	organizerChange = (event) => {
		let organizer = event.target.value;
		if (organizer.length > 100) {
			organizer = organizer.slice(0, 100);
		}
		this.setState({
			organizer: organizer,
			organizer_length: organizer.length,
		});
	};

	locationChange = (event) => {
		let location = event.target.value;

		this.setState({
			location: location,
		});
	};

	typeChange = (event) => {
		let topic = event.target.value;

		this.setState(
			{
				topic: topic,
			},
			() => console.log()
		);
	};

	categoryChange = (event) => {
		let type = event.target.value;

		this.setState(
			{
				type: type,
			},
			() => console.log()
		);
	};

	priceChange = (event) => {
		if (this.state.currency === "phnx") {
			let price = event.target.value;
			console.log("event.target.value", event.target.value);

			// var reg = new RegExp("^[0-9]+$");
			// let test = reg.test(event.target.value);
			// if (!test && event.target.value.length != 0) {
			// 	event.preventDefault();
			// 	return;
			// }
			// if (event.target.value < -1) {
			// 	event.preventDefault();
			// 	return;
			// }
			let test = event.target.value.match(/^\d*\.?\d*$/);
			console.log("e.target.value",event.target.value)
			console.log("e.target.value test",test)
	  		if ((test == null && event.target.value.length != 0)) {
				  console.log("e.target.value returned",event.target.value.charAt(event.target.value.length-1)) 
				  return event.preventDefault();}
			if (
				price.includes(".") &&
				price.split(".")[1].split("").length > 3
			) {
				event.preventDefault();
				return;
			}
			console.log("this.form.price.value",this.form.price.value, " length" ,this.form.price.value.length)
			if (event.target.value.length > 15) {
				event.preventDefault();
				return;
			}

			console.log("price", price);
			this.setState(
				{
					price: price,
				},
				() => console.log("price", this.state.price)
			);
			let number = numeral(
				event.target.value * this.state.PhoenixDAO_market.usd
			).format("0[.]000001");
			if (isNaN(number)) {
				number = numeral(0 * 0).format("0.00");
				this.setState({ dollarPrice: number });
				console.log(this.state.dollarPrice);
			} else {
				this.setState({ dollarPrice: number });
			}
		} else {
			let price = "0";
			this.setState(
				{
					price: price,
				},
				() => console.log("price", this.state.price)
			);
		}
	};

	ticketsChange = (event) => {
		let test = event.target.value.match(/^\d+$/);
			console.log("e.target.value",event.target.value)
			console.log("e.target.value test",test)
	  		if ((test == null && event.target.value.length != 0) ) {
				this.form.seats.value=this.state.seats  
				return event.preventDefault();}
		let seats = this.form.seats.value;
		console.log("seats.length", seats.length);
		if (seats && seats.length > 16) {
			event.preventDefault();
			return;
		}
		this.setState({
			seats: seats,
		});
	};

	// restrictMinusForTickets = (e) => {
	// 	let test = e.target.value.match(/^\d+$/);
	// 	console.log("e.target.value",e.target.value)
	// 	console.log("e.target.value test",test)
	//   if ((test == null && e.target.value.length != 0) ) e.preventDefault();
	//   };

	// restrictMinusForTickets = (e) => {
	// 	console.log("qwert e.which", e.which);
	// 	let inputKeyCode = e.which;
	// 	console.log("qwert key", e.key);
	// 	// console.log("this.form.price.value",this.form.price.value)
	// 	const allowedKeyCodes = [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
	// 	if (!allowedKeyCodes.includes(inputKeyCode)) {
	// 		e.preventDefault();
	// 		return;
	// 	}
	// };

	// restrictMinus = (e) => {
	// 	let test = e.target.value.match(/^\d+$/);
	// 	console.log("e.target.value",e.target.value)
	// 	console.log("e.target.value test",test)
	//   if ((test == null && e.target.value.length != 0) ) return e.preventDefault();
	//   };

	// restrictMinus = (e) => {
	// 	console.log("qwert e.which", e.which);
	// 	let inputKeyCode = e.which;
	// 	console.log("qwert key", e.key);
	// 	// console.log("this.form.price.value",this.form.price.value)
	// 	const allowedKeyCodes = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
	// 	if (inputKeyCode == 46 && this.form.price.value.split(".").length > 1) {
	// 		e.preventDefault();
	// 		return;
	// 	}
	// 	if (!allowedKeyCodes.includes(inputKeyCode)) {
	// 		e.preventDefault();
	// 		return;
	// 	}
	// };
	handleForm = (event) => {
		event.preventDefault();
		console.log("state===>",  this.state.seats);
		// const todayDate=new Date((parseInt(this.state.currentBlock.timestamp, 10) * 1000));
		// console.log('moment.unix()',moment.unix().toString());
		// let todayDate = moment.unix(this.state.currentBlock.timestamp).format();
		// let selectedDate = moment.unix(this.state.time).format();
		// console.log('selectedData',selectedDate)
		// console.log('todayDate',todayDate)
		// console.log("Date : " , todayDate)
		let form_validation = [];
		if (this.state.title === "") form_validation.push("name");
		if (this.state.location === "") form_validation.push("location");
		if (this.state.organizer === "") form_validation.push("organizer");
		if (this.form.description.value === "")
			form_validation.push("description");
		if (this.state.wrong_file === true || this.state.file === null)
			form_validation.push("image");
		if (this.state.time === 0) form_validation.push("time");
		if (
			(this.state.currency == "phnx" && this.state.price == "") ||
			(this.state.currency == "phnx" && this.state.price == "0") ||
			this.state.price == "0.0" ||
			this.state.price == "0.00" ||
			this.state.price == "0.000"
		)
			form_validation.push("price");
		if (this.state.limited === true && this.form.seats.value < 1)
			form_validation.push("seats");
		if (this.state.type === "") form_validation.push("type");
		if (!this.state.terms) form_validation.push("terms");


		this.setState({
			form_validation: form_validation,
		});
		console.log("this.state",this.state)
		console.log("this.form",this.form)
		if (form_validation.length === 0) {
			
			this.props.createEvent(
				this.state.title,
				this.form.description.value,
				this.state.location,
				this.state.time,
				this.state.file,
				this.state.organizer,
				this.state.type,
				this.state.topic,
				this.state.currency,
				this.state.price,
				this.state.limited,
				this.form.seats? this.form.seats.value : "",
			);
		}
	};

	render() {
		let symbol = "PhoenixDAO.png";
		let currency = this.state.currency === "eth" ? "ETH" : "PHNX";
		let freeEvent = "";
		if (this.state.currency === "eth") {
			freeEvent = <p className="free_event">Free Event</p>;
		}

		let file_label =
			!this.state.wrong_file && this.state.file_name !== ""
				? this.state.file_name
				: "Select file";

		let warning = {
			name:
				this.state.form_validation.indexOf("name") === -1
					? ""
					: "is-invalid",
			location:
				this.state.form_validation.indexOf("location") === -1
					? ""
					: "is-invalid",
			organizer:
				this.state.form_validation.indexOf("organizer") === -1
					? ""
					: "is-invalid",
			type:
				this.state.form_validation.indexOf("type") === -1
					? ""
					: "is-invalid",
			topic:
				this.state.form_validation.indexOf("topic") === -1
					? ""
					: "is-invalid",
			description:
				this.state.form_validation.indexOf("description") === -1
					? ""
					: "is-invalid",
			image:
				this.state.form_validation.indexOf("image") === -1 &&
				!this.state.wrong_file
					? ""
					: "is-invalid",
			time:
				this.state.form_validation.indexOf("time") === -1
					? ""
					: "is-invalid",
			price:
				this.state.form_validation.indexOf("price") === -1
					? ""
					: "is-invalid",
			seats:
				this.state.form_validation.indexOf("seats") === -1
					? ""
					: "is-invalid",
			terms:
				this.state.form_validation.indexOf("terms") === -1
					? ""
					: "is-invalid",
					
		};
		console.log("warning",warning)

		let alert;

		if (this.state.form_validation.length > 0) {
			alert = (
				<div className="alert alert-dark mt-2" role="alert">
					Required fields are missed.
				</div>
			);
		}
		let seatsForHumans = "";
		let organizerForHumans = "";

		if (this.state.limited === true) {
			if (this.state.seats === 0) {
				seatsForHumans = "0/∞";
			} else {
				seatsForHumans = "0/" + this.state.seats;
			}
		} else {
			seatsForHumans = "0/∞";
		}

		if (this.state.organizer === "") {
			organizerForHumans = "";
		} else {
			organizerForHumans = "Organizer: " + this.state.organizer;
		}
		let date = new Date(parseInt(this.state.date, 10) * 1000);

		let disabled = false;
		if (this.props.account.length == 0) {
			disabled = true;
		}
		return (
			<React.Fragment>
				<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12">
					<form>
						<div className="form-group">
							<label htmlFor="name">Event Name:</label>
							{warning.name && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									Invalid name
								</small>
							)}

							<input
								type="text"
								className={"form-control " + warning.name}
								id="name"
								title="Event Name"
								value={this.state.title}
								onChange={this.titleChange}
								autoComplete="off"
							/>
							<small className="form-text text-muted">
								{this.state.title_length}/80 characters
								available.
							</small>
						</div>
						<div className="form-group">
							<label htmlFor="description">
								Event Description:
							</label>
							{warning.description && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									Invalid description
								</small>
							)}
							<textarea
								className={
									"form-control " + warning.description
								}
								maxLength="500"
								id="description"
								title="Event Description"
								rows="5"
								ref={(input) => (this.form.description = input)}
								onChange={this.descriptionChange}
								autoComplete="off"
							></textarea>
							<small className="form-text text-muted">
								{this.state.description_length}/500 characters
								available.
							</small>
						</div>
						<div className="form-group">
							<label htmlFor="location">Event Location:</label>
							{warning.location && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									Invalid location
								</small>
							)}
							<input
								type="text"
								className={"form-control " + warning.location}
								id="location"
								title="Event Location"
								onChange={this.locationChange}
								autoComplete="off"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="description">
								Event Date and Time:
							</label>
							{!this.state.currentBlock && (
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "left",
										alignItem: "end",
									}}
								>
									<FacebookCircularProgress />
									<small
										style={{
											color: "#1a90ff",
											marginTop: "0",
										}}
										className="form-text text-muted "
									>
										Loading current timestamp, please wait
										...
									</small>
								</div>
							)}
							{warning.time && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									Invalid date and time
								</small>
							)}

							<Datetime
								value={this.state.dateDisplay}
								onChange={this.handleDate}
								inputProps={{
									disabled: !this.state.currentBlock,
									className: "form-control " + warning.time,
									title: "Event Date and Time",
								}}
								autoComplete="off"
							/>
						</div>
						<div className="form-group">
							<p>Event Cover Image:</p>
							{warning.image && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									No image selected
								</small>
							)}
							<div className="custom-file">
								<input
									type="file"
									className={
										"custom-file-input " + warning.image
									}
									id="customFile"
									title="Event Cover Image"
									onChange={this.handleFile}
									autoComplete="off"
								/>
								<label
									className="custom-file-label"
									htmlFor="customFile"
								>
									{file_label}
								</label>
							</div>
							<small className="form-text text-muted">
								Image format: jpg, png. Max file size 1mb.
							</small>
						</div>
						<div className="form-group">
							<label htmlFor="organizer">Organizer Name:</label>
							{warning.organizer && (
								<small
									style={{ color: "red" }}
									className="form-text text-muted color-red"
								>
									Invalid organizer name
								</small>
							)}
							<input
								type="text"
								className={"form-control " + warning.organizer}
								id="organizer"
								title="Organizer Name"
								value={this.state.organizer}
								onChange={this.organizerChange}
								autoComplete="off"
							/>
							<small className="form-text text-muted">
								{this.state.organizer_length}/100 characters
								available.
							</small>
						</div>
						<div className="form-group">
							<label htmlFor="description">Event Type:</label>
							<select
								className="form-control"
								id="type"
								title="Event Type"
								onChange={this.typeChange}
							>
								<option value="" disabled="disabled">
									Select the type of the event
								</option>
								{eventTypes.map((Type, index) => (
									<option value={Type.slug} key={Type.name}>
										{Type.name}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="description">Event Topic:</label>
							<select
								className="form-control"
								id="topic"
								title="Event Topic"
								onChange={this.categoryChange}
							>
								<option value="" disabled="disabled">
									Select the topic of the event
								</option>
								{eventTopics.map((Topic, index) => (
									<option value={Topic.slug} key={Topic.name}>
										{Topic.name}
									</option>
								))}
							</select>
						</div>
						<br />
						<hr />
						<br />
						<div className="form-group">
							<p>Event Options:</p>
							<div className="custom-control custom-radio custom-control-inline">
								<input
									type="radio"
									id="payment2"
									name="payment"
									className="custom-control-input"
									defaultChecked="true"
									value="phnx"
									title="PHNX"
									onChange={this.handleCurrency}
									autoComplete="off"
								/>
								<label
									className="custom-control-label"
									htmlFor="payment2"
								>
									Paid Event
								</label>
							</div>
							<div className="custom-control custom-radio custom-control-inline">
								<input
									type="radio"
									id="payment1"
									name="payment"
									className="custom-control-input"
									value="eth"
									title="Ethereum"
									onChange={this.handleCurrency}
									autoComplete="off"
								/>
								<label
									className="custom-control-label"
									htmlFor="payment1"
								>
									Free Event
								</label>
							</div>
						</div>
						<div className="form-group row">
							<div className="col-lg-6">
								<label htmlFor="price">Ticket Price:</label>
								{/* {warning.price && <small  className="form-text text-muted color-red">Invalid price</small>} */}
								{this.state.currency === "phnx" && (
									<small
										style={{ marginTop: "0" }}
										className={
											warning.price
												? "form-text text-muted color-red"
												: "form-text text-muted"
										}
									>
										Value must be greater or equals to 0.001
									</small>
								)}
								<div className="input-group mb-3">
									<div className="input-group-prepend">
										<span className="input-group-text">
											<img
												src={"/images/" + symbol}
												className="event_price-image"
												alt=""
											/>
										</span>
									</div>
									{this.state.currency === "phnx" && (
										<input
											type="string"
											min="0.0001"
											maxLength="15"
											// onKeyDown={this.restrictMinus}
											// onKeyUp={this.restrictMinus}
											// onKeyPress={this.restrictMinus}
											value={this.state.price}
											className={
												"form-control " + warning.price
											}
											id="price"
											title={"Price in PHNX"}
											ref={(input) =>
												this.form.price = input
													
											}
											autoComplete="off"
											onChange={this.priceChange}
										/>
									)}

									{this.state.currency === "eth" && (
										<input
											type="string"
											min="0.0001"
											maxLength="15"
											// onKeyUp={this.restrictMinus}
											// onKeyPress={this.restrictMinus}
											value={this.state.price}
											className={
												"form-control " + warning.price
											}
											id="price"
											title={"Price in ETH"}
											value={this.state.price}
											autoComplete="off"
											disabled={true}
											// onChange={this.priceChange}
										/>
									)}
								</div>

								{/* {this.state.currency === "phnx" && (
									<div className="input-group mb-3">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<img
													src={
														"/images/dollarsign.png"
													}
													className="event_price-image"
													alt=""
												/>
											</span>
										</div>
										<div
											className={
												"form-control " + warning.price
											}
											title="Price in USD"
										>
											{this.state.dollarPrice}
										</div>
									</div>
								)} */}
								<div className="input-group mb-3">
									<div className="input-group-prepend">
										<span className="input-group-text">
											<img
												src={"/images/dollarsign.png"}
												className="event_price-image"
												alt=""
											/>
										</span>
									</div>
								{this.state.currency === "phnx" && (
										<input
											type="string"
											min="0.0001"
											maxLength="15"
											// onKeyUp={this.restrictMinus}
											// onKeyPress={this.restrictMinus}
											value={this.state.dollarPrice}
											className={
												"form-control " + warning.price
											}
											id="price"
											title={"Price in USD"}
											ref={(input) =>
												this.form.price = input
													
											}
											autoComplete="off"
											disabled={true}
											// onChange={this.priceChange}
										/>
									)}

								{this.state.currency === "eth" && (
									<input
									type="string"
									min="0.0001"
									maxLength="15"
									// onKeyUp={this.restrictMinus}
									// onKeyPress={this.restrictMinus}
									value={0.00}
									className={
										"form-control " + warning.price
									}
									id="price"
									title={"Price in USD"}
									ref={(input) =>
										this.form.price = input
											
									}
									autoComplete="off"
									disabled={true}
									// onChange={this.priceChange}
								/>
								)}
								</div>
							</div>
						</div>
						<div className="form-group">
							<p>Ticket Options:</p>
							<div className="custom-control custom-checkbox">
								<input
									type="checkbox"
									className="custom-control-input"
									id="limited"
									title="Limited tickets"
									value="true"
									onChange={this.handleLimited}
									autoComplete="off"
								/>
								<label
									className="custom-control-label"
									htmlFor="limited"
								>
									Limited tickets
								</label>
							</div>
							{this.state.limited && 
							<div className="row mt-3">
								<div className="col-lg-6">
									<label htmlFor="seats">
										Tickets available:
									</label>
									
										<small
											style={{ marginTop: "0" }}
											className={
												warning.seats
													? "form-text text-muted color-red"
													: "form-text text-muted"
											}
										>
											Value must be greater than 0
										</small>
									
									<input
										type="string"
										className={
											"form-control " + warning.seats
										}
										min="1"
										maxLength="15"
										value={
											this.form.seats
												? this.state.seats
												: ""
										}
										// pattern="^[1-9]"
										// onKeyDown={
										// 	this.restrictMinusForTickets
										// }
										// onKeyUp={
										// 	this.restrictMinusForTickets
										// }
										// onKeyPress={
										// 	this.restrictMinusForTickets
										// }
										id="seats"
										title="Tickets available"
										disabled={!this.state.limited}
										ref={(input) =>
											(this.form.seats = input)
										}
										autoComplete="off"
										onChange={this.ticketsChange}
									/>
								</div>
							</div>}	
							
						</div>
						<div className="form-group">
							<p>Terms and conditions:</p>
							<div className="custom-control custom-checkbox">
								<input
									type="checkbox"
									// className="custom-control-input"
									className={
										"custom-control-input " 
									}
									id="terms"
									title="Terms and conditions"
									value="true"
									onChange={this.handleTerms}
									autoComplete="off"
								/>
								<label
									className={"custom-control-label "}
									style={{color: warning.terms === "is-invalid" ? "#dc3545" : "#333333"}}
									htmlFor="terms"
								>
									By creating an event, I agree to the <a target='blank' href="www.facebook.com">policies and terms of use</a>.
								</label>
							</div>
							
						</div>
						{alert}
						<br />
						<button
							type="submit"
							className="btn btn-outline-dark"
							title="Make Your Event Live"
							onClick={this.handleForm}
							disabled={disabled}
						>
							Make Your Event Live
						</button>
					</form>
				</div>

				<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 create-event">
					<label>Event Preview:</label>
					<div className="card">
						<div className="image_wrapper">
							{/* <Link to={"/event/"}> */}
							<img
								className="card-img-top event-image"
								src={this.state.fileImg}
								alt="Placeholder Event"
							/>
							{/* </Link> */}
							{freeEvent}
						</div>
						<div className="card-header text-muted event-header">
							<img
								className="float-left"
								src={this.state.blockie}
								alt=""
							/>
							<p className="small text-truncate mb-0">
								{organizerForHumans}
							</p>
						</div>
						<div className="card-body">
							<h5 className="card-title event-title">
								{this.state.title}
							</h5>
							{this.state.description}
						</div>
						<ul className="list-group list-group-flush">
							{this.state.currency == "phnx" && (
								<li className="list-group-item">
									<strong>Price:</strong>{" "}
									<img
										src={"/images/" + symbol}
										className="event_price-image"
										alt=""
									/>{" "}
									{numeral(this.state.price).format("0,0.00")}{" "}
									or{" "}
									<img
										src={"/images/dollarsign.png"}
										className="event_price-image"
										alt="Event Price"
									/>
									{this.state.dollarPrice}
								</li>
							)}
							{this.state.currency == "eth" && (
								<li className="list-group-item">
									<strong>Price:</strong>{" "}
									<img
										src={"/images/" + symbol}
										className="event_price-image"
										alt=""
									/>{" "}
									{this.state.price}
								</li>
							)}
							<li className="list-group-item">
								<strong>
									Date:{" "}
									{this.state.dateDisplay.toLocaleDateString()}{" "}
									at{" "}
									{this.state.dateDisplay.toLocaleTimeString()}
								</strong>{" "}
							</li>
							<li className="list-group-item">
								<strong>Location:</strong> {this.state.location}{" "}
							</li>
							<li className="list-group-item">
								<strong>Tickets Sold:</strong> {seatsForHumans}
							</li>
						</ul>
						<div className="card-footer text-muted text-center">
							<button className="btn btn-dark" disabled="">
								Buy Now
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		// window.scroll({
		// 	top: 0,
		// 	behavior: 'smooth'
		// });
		// this.temp();
		this.getPhoenixDAOMarketValue();
		// window.scrollTo(0, 0);
	}
}

Form.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	console.log("state", state.currentBlock);
	return {
		currentBlock: state.currentBlock,
	};
};

const AppContainer = drizzleConnect(Form, mapStateToProps);
export default AppContainer;
