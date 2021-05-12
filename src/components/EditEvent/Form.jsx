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
import { title } from "process";
var moment = require("moment");
var Filter = require("bad-words");

let numeral = require("numeral");
class Form extends Component {
	constructor(props) {
		super(props);
		// console.log("rejectedprops", props);

		this.form = {};
		this.web3 = props.web3;
		this.state = {
			fileHandle: false,
			eventId: this.props.eventId,
			title: this.props.event[0],
			title_length: title.length,
			description: this.props.description,
			description_length: 0,
			organizer: this.props.organizer,
			organizer_length: 0,
			price: numeral(this.props.price).format("0.000"),
			dollarPrice:
				this.props.PhoenixDAO_market.usd *
				numeral(this.props.price).format("0.000"),
			location: this.props.locations,
			time: this.props.event[1],
			// time:Math.floor(Date.now() / 1000),
			timeForHumans: null,
			currency: this.props.event.price == 0 ? "eth" : "phnx",
			type: this.props.event.category,
			topic: "appearance-or-signing",
			limited: this.props.event.limited,
			terms: false,
			seatsForHumans: 0,
			allowedSeats: this.props.event.sold,
			seats: this.props.event.seats,
			wrong_file: false,
			file_name: "file.jpg",
			file: null,
			blockie: "/images/PhoenixDAO.png",
			fileImg: this.props.image,
			form_validation: [],
			currentBlock: null,
			updateTimeStamp: true,
			free: this.props.price == 0,
			PhoenixDAO_market: "",
			dateDisplay: new Date(parseInt(this.props.event[1], 10) * 1000),
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
		this.setState({ free: !this.state.free });
		if (event.target.value == "phnx") {
			this.setState({
				currency: event.target.value,
				price: "",
				dollarPrice: "",
			});
		} else {
			this.setState({
				currency: event.target.value,
				price: "0",
			});
		}
	};

	handleLimited = () => {
		this.setState({
			limited: !this.state.limited,
			seats: this.state.seats,
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
			return;
		}
		if (file != undefined) {
			this.setState({ fileHandle: true });
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
			if (test == null && event.target.value.length != 0) {
				return event.preventDefault();
			}
			if (
				price.includes(".") &&
				price.split(".")[1].split("").length > 3
			) {
				event.preventDefault();
				return;
			}

			if (event.target.value.length > 15) {
				event.preventDefault();
				return;
			}

			this.setState({
				price: price,
			});
			let number = numeral(
				event.target.value * this.state.PhoenixDAO_market.usd
			).format("0[.]000001");
			if (isNaN(number)) {
				number = numeral(0 * 0).format("0.00");
				this.setState({ dollarPrice: number });
			} else {
				this.setState({ dollarPrice: number });
			}
		} else {
			let price = "0";
			this.setState({
				price: price,
			});
		}
	};

	ticketsChange = (event) => {
		let test = event.target.value.match(/^\d+$/);
		if (test == null && event.target.value.length != 0) {
			this.form.seats.value = this.state.seats;
			return event.preventDefault();
		}
		let seats = this.form.seats.value;
		if (
			(seats && seats.length > 16) ||
			(seats && seats < this.state.allowedSeats)
		) {
			event.preventDefault();
			return;
		}
		this.setState({
			seats: seats,
		});
	};
     valid=(current)=> {
     let yesterday = moment().subtract(1, "day");
	  return current.isAfter(yesterday);
	}
	
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

		let filteredDescription = "";
		let filteredTitle = "";
		let filteredOrganizer = "";
		let filteredLocation = "";
		let reg=new RegExp(/^[a-z\sA-Z]+$/)
		if (this.form.description.value !== "") {
			// console.log("this.form.description.value",this.form.description.value)
			if(reg.test(this.form.description.value)){
				let filter = new Filter();
				filteredDescription = filter.clean(this.form.description.value);
				this.setState({ description: filteredDescription });
			}else{
				// let filter = new Filter();
			// filteredLocation = filter.clean(this.form.description.value);
			this.setState({ description: this.form.description.value });
			}
			
		}
		if (this.state.title !== "") {
			// console.log("title is title",this.state.title)
			// console.log("title is reg.test(this.state.title) ",reg.test(this.state.title))
			if(reg.test(this.state.title)){
				let filter = new Filter();
				filteredTitle = filter.clean(this.state.title);
				this.setState({ title: filteredTitle });
				// console.log("title is filteredTitle",filteredTitle)
			}
			// let filter = new Filter();
			// filteredTitle = filter.clean(this.state.title);
			// this.setState({ title: this.state.title });
			
		}
		if (this.state.organizer !== "") {
			if(reg.test(this.state.organizer)){
				let filter = new Filter();
				filteredOrganizer = filter.clean(this.state.organizer);
			}
			// let filter = new Filter();
			// filteredOrganizer = filter.clean(this.state.organizer);
			// this.setState({ organizer: filteredOrganizer });
		}
		if (this.state.location !== "") {
			if(reg.test(this.state.location)){
				let filter = new Filter();
			filteredLocation = filter.clean(this.state.location);
			}
			// let filter = new Filter();
			// filteredLocation = filter.clean(this.state.location);
			// this.setState({ location: filteredLocation });
		}
		let form_validation = [];
		if (this.state.title === "") form_validation.push("name");
		if (this.state.location === "") form_validation.push("location");
		if (this.state.organizer === "") form_validation.push("organizer");
		if (this.form.description.value === "")
			form_validation.push("description");
		if (this.state.wrong_file === true) form_validation.push("image");
		if (this.state.time === 0) form_validation.push("time");
		if (
			(this.state.currency == "phnx" && this.state.price == "") ||
			(this.state.currency == "phnx" && this.state.price == "0") ||
			// this.state.price == "0.0" ||
			// this.state.price == "0.00" ||
			// this.state.price == "0.000" ||
			(this.state.currency == "phnx" &&
				this.state.price.includes("0") &&
				this.state.price.includes(".") &&
				!this.state.price.includes("1") &&
				!this.state.price.includes("2") &&
				!this.state.price.includes("3") &&
				!this.state.price.includes("4") &&
				!this.state.price.includes("5") &&
				!this.state.price.includes("6") &&
				!this.state.price.includes("7") &&
				!this.state.price.includes("8") &&
				!this.state.price.includes("9")) ||
			(this.state.currency == "phnx" &&
				this.state.price.includes("0") &&
				!this.state.price.includes(".") &&
				!this.state.price.includes("1") &&
				!this.state.price.includes("2") &&
				!this.state.price.includes("3") &&
				!this.state.price.includes("4") &&
				!this.state.price.includes("5") &&
				!this.state.price.includes("6") &&
				!this.state.price.includes("7") &&
				!this.state.price.includes("8") &&
				!this.state.price.includes("9"))
		)
			form_validation.push("price");
		if (this.state.limited === true && this.form.seats.value < 1)
			form_validation.push("seats");
		if (this.state.type === "") form_validation.push("type");
		if (!this.state.terms) form_validation.push("terms");

		this.setState({
			form_validation: form_validation,
		});
		
		if (form_validation.length === 0) {
			// console.log("filteredOrganizer",filteredOrganizer)
		// console.log("filteredOrganizer this.state.organizer",this.state.organizer)
			this.props.createEvent(
				this.state.fileHandle,
				this.state.fileImg,
				this.state.eventId,
				filteredTitle!=""?filteredTitle:this.state.title,
				filteredDescription!=""?filteredDescription:this.form.description.value,
				filteredLocation!=""?filteredLocation:this.state.location,
				this.state.time,
				this.state.file,
				filteredOrganizer!=""?filteredOrganizer:this.state.organizer,
				this.state.type,
				this.state.topic,
				this.state.currency,
				this.state.price,
				this.state.limited,
				this.form.seats ? this.form.seats.value : ""
			);
		}
		return;
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
				this.state.form_validation.indexOf("image") !== -1
					? "is-invalid"
					: this.state.wrong_file
					? "wrong-format"
					: "",

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
		let yesterday = moment().subtract(1, "day");
		function valid(current) {
			return current.isAfter(yesterday);
		}

		// let buttonText = event_data[3] ? "Buy Ticket" : "Get Ticket";
		let type = this.state.type.replace(/[- )(]/g, " ");
		return (
			<React.Fragment>
				<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12">
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
							disabled={true}
						/>
						<small className="form-text text-muted">
							This field is not editable.
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="description">Event Description:</label>
						{warning.description && (
							<small
								style={{ color: "red" }}
								className="form-text text-muted color-red"
							>
								Invalid description
							</small>
						)}
						<textarea
							className={"form-control " + warning.description}
							maxLength="500"
							id="description"
							title="Event Description"
							rows="5"
							value={this.state.description}
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
						<input
							type="text"
							className={"form-control " + warning.location}
							id="location"
							disabled={true}
							value={this.state.location}
							title="Event Location"
							onChange={this.locationChange}
							autoComplete="off"
						/>
						<small className="form-text text-muted">
							This field is not editable.
						</small>
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
								{/* <small
									style={{
										color: "#1a90ff",
										marginTop: "0",
									}}
									className="form-text text-muted "
								>
									Loading current timestamp, please wait ...
								</small> */}
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
							isValidDate={valid}
							autoComplete="off"
						/>
					</div>
					<div className="form-group">
						<p>Event Cover Image:</p>
						{warning.image == "is-invalid" ? (
							<small
								style={{ color: "red" }}
								className="form-text text-muted color-red"
							>
								No image selected
							</small>
						) : warning.image == "wrong-format" ? (
							<small
								style={{ color: "red" }}
								className="form-text text-muted color-red"
							>
								Image is too big. Please upload an image up to
								1mb in size.
							</small>
						) : null}
						<div className="custom-file">
							<input
								type="file"
								className={
									warning.image == "wrong-format"
										? "custom-file-input is-invalid"
										: "custom-file-input " + warning.image
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
						{warning.topic && (
							<small
								style={{ color: "red" }}
								className="form-text text-muted color-red"
							>
								No Type selected
							</small>
						)}
						<select
							className={"form-control " + warning.topic}
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
						{warning.type && (
							<small
								style={{ color: "red" }}
								className="form-text text-muted color-red"
							>
								No topic selected
							</small>
						)}
						<select
							className="form-control"
							id="topic"
							title="Event Topic"
							onChange={this.categoryChange}
							value={this.state.type}
							className={"form-control " + warning.topic}
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
								value="phnx"
								title="PHNX"
								defaultChecked={
									this.props.price != 0 ? true : false
								}
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
								defaultChecked={
									this.props.price == 0 ? true : false
								}
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
										warning.price && !this.state.free
											? "form-text text-muted color-red"
											: "form-text text-muted"
									}
								>
									{this.state.free
										? null
										: "Value must be greater or equals to 0.001"}
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
										value={this.state.price}
										className={
											"form-control " + warning.price
										}
										id="price"
										title={"Price in PHNX"}
										ref={(input) =>
											(this.form.price = input)
										}
										disabled={this.state.free}
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
											(this.form.price = input)
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
										value={0.0}
										className={
											"form-control " + warning.price
										}
										id="price"
										title={"Price in USD"}
										ref={(input) =>
											(this.form.price = input)
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
								// checked={this.props.event.limited}
								checked={this.state.limited}
							/>
							<label
								className="custom-control-label"
								htmlFor="limited"
							>
								Limited tickets
							</label>
						</div>
						{this.state.limited && (
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
										Value must be greater than number of
										tickets already sold
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
							</div>
						)}
					</div>
					<div className="form-group">
						<p>Terms and conditions:</p>
						<div className="custom-control custom-checkbox">
							<input
								type="checkbox"
								// className="custom-control-input"
								className={"custom-control-input "}
								id="terms"
								title="Terms and conditions"
								value="true"
								onChange={this.handleTerms}
								autoComplete="off"
							/>
							<label
								className={"custom-control-label "}
								style={{
									color:
										warning.terms === "is-invalid"
											? "#dc3545"
											: "#333333",
								}}
								htmlFor="terms"
							>
								By creating an event, I agree to the{" "}
								<a target="_blank" href="/terms-and-conditions">
									policies and terms of use
								</a>
								.
							</label>
						</div>
					</div>
					{alert}
					<br />
					<button
						// type="submit"
						className="btn btn-outline-dark"
						title="Make Your Event Live"
						onClick={this.handleForm}
						disabled={disabled}
					>
						Update Your Event
					</button>
				</div>

				<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 create-event">
					<label>Event Preview:</label>
					<div className="card2">
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
							<p style={{ whiteSpace: "pre-line" }}>
								{this.state.description}
							</p>
						</div>

						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<strong>Location:</strong> {this.state.location}{" "}
							</li>
							<li
								className="list-group-item"
								style={{ textTransform: "capitalize" }}
							>
								<strong>Category:</strong> {type}{" "}
							</li>
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
							<button className="btn btn-dark" disabled="true">
								{this.state.currency === "eth"
									? "Get Ticket"
									: "Buy Ticket"}
							</button>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		this.setState({
			limited: this.props.event.limited,
			seats: this.props.event.seats,
		});
		this.getPhoenixDAOMarketValue();
		// window.scrollTo(0, 0);
	}
}

Form.contextTypes = {
	drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
	// console.log("state", state.currentBlock);
	return {
		currentBlock: state.currentBlock,
	};
};

const AppContainer = drizzleConnect(Form, mapStateToProps);
export default AppContainer;
