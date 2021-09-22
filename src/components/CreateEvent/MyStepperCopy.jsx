<<<<<<< HEAD
import "date-fns";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Divider,
	TextField,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Grid,
	InputLabel,
	MenuItem,
	FormHelperText,
	Select,
	Checkbox,
	InputAdornment,
	StepConnector,
	StepContent,
	IconButton,
	Box,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import {
	Add as AddIcon,
	VisibilityOutlined as VisibilityOutlinedIcon,
	AccessTime,
} from "@material-ui/icons";
import GoldonBlue from "../Images/GoldonBlue.gif";
import { useForm, Controller } from "react-hook-form";
import phnxLogo from "../Images/phnx.png";
import dollarIcon from "../Images/dollar.png";
import eventTopics from "../../config/topics.json";
import altIcon from "../Images/altIcon.png";
import editIcon from "../Images/editIcon.png";
import deleteIcon from "../Images/deleteIcon.png";
import BodyTextEditor from "../common/BodyTextEditor";
import publishIcon from "../Images/publish.png";
import Checkmark from "../Images/Checkmark.gif";
import { withRouter } from "react-router-dom";
import SocialMedia from "../common/SocialMedia";
import { CopyToClipboard } from "react-copy-to-clipboard";
import checkedIcon from "../Images/checked.png";
import uncheckedIcon from "../Images/unchecked.png";
import arrowrighticon from "../Images/arrowrighticon.png";
import arrowbackicon from "../Images/arrowbackicon.png";
import GeoLocation from "../common/GeoLocation";
import { pricingFormatter } from "../../utils/pricingSuffix";

import { useFormControls } from "./StepperFormControls";

import useStyles from "./StepperFormStyling";

var badWords = require("bad-words");

const MyStepper = ({
	handleCreateEvent,
	onFieldsChange,
	onGetRealTimeFields,
	onStepsChange,
	activeStep,
	activeFlamingStep,
	history,
	progressText,
	shareUrl,
}) => {
	const classes = useStyles();

	const { handleInputValue, handleFormSubmit, formIsValid, errors, values } =
		useFormControls();
	const { handleSubmit, control, setValue: setFormValue } = useForm();
	const steps = ["", "", "", ""];
	const [eventTime, setEventTime] = useState("onedayevent");
	const [type, setType] = useState("physical");
	const [category, setCategory] = useState("free");
	const [availability, setAvailability] = useState("unlimited");
	const [images, setImages] = useState([{ name: "" }]);

	const flamingSteps = getFlamingSteps();

	const [categories, setCategories] = useState([]);
	const [addAnotherCat, setaddAnotherCat] = useState(false);
	const [ticketCategory, setTicketCategory] = useState(0);

	useEffect(() => {
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
	}, []);

	const [PhoenixDAO_market, setPhoenixDAO_market] = useState({});
	const [isCopied, setIsCopied] = useState(false);

	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");

	const [dateError, setDateError] = useState({
		message: "",
		isError: false,
	});

	const [timeError, setTimeError] = useState({
		message: "",
		isError: false,
	});

	const [endTimeError, setEndTimeError] = useState({
		message: "",
		isError: false,
	});

	const [categoriesOfTicket, setCategoriesOfTicket] = useState([]);
	const [categoriesOfToken, setCategoriesOfToken] = useState(false);

	const onCopyText = () => {
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	};

	const formatInputNoOfTickets = (e) => {
		// Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
		let checkIfNum;
		if (e.key !== undefined) {
			// Check if it's a "e", ".", "+" or "-"
			checkIfNum =
				e.key === "e" ||
				e.key === "E" ||
				e.key === "." ||
				e.key === "+" ||
				e.key === "-";
		} else if (e.keyCode !== undefined) {
			// Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
			checkIfNum =
				e.keyCode === 69 ||
				e.keyCode === 190 ||
				e.keyCode === 187 ||
				e.keyCode === 189;
		}
		return checkIfNum && e.preventDefault();
	};

	const formatInputDollarPrice = (e) => {
		// Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
		let checkIfNum;
		if (e.key !== undefined) {
			// Check if it's a "e", ".", "+" or "-"
			checkIfNum =
				e.key === "e" ||
				e.key === "E" ||
				// e.key === "." ||
				e.key === "+" ||
				e.key === "-";
		} else if (e.keyCode !== undefined) {
			// Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
			checkIfNum =
				e.keyCode === 69 ||
				// e.keyCode === 190 ||
				e.keyCode === 187 ||
				e.keyCode === 189;
		}
		return checkIfNum && e.preventDefault();
	};

	useEffect(() => {
		getPhoenixdaoMarket();
	}, []);

	const getPhoenixdaoMarket = async () => {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				// this.setState({ PhoenixDAO_market: data.phoenixdao });
				setPhoenixDAO_market(data.phoenixdao);
			})
			.catch(console.log);
	};

	//next button steeper
	const handleNext = (fields) => {
		const filter = new badWords();
		let badEventName = filter.clean(fields.eventName);
		fields.eventName = badEventName;
		let badEventOrg = filter.clean(fields.eventOrganizer);
		fields.eventOrganizer = badEventOrg;

		if (activeStep === 0) {
			//first stepper conditions - eventName, eventOrg, eventdate&time
			setTimeError({ isError: false, message: "" });
			setDateError({ isError: false, message: "" });
			setEndTimeError({ isError: false, message: "" });

			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			if (fields.eventTime === "onedayevent") {
				let eventDateOneDay = fields.eventDate;
				let eventStartTimeOneday = fields.eventStartTime;
				let eventEndTimeOneday = fields.eventEndTime;

				eventDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
				eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
				eventStartTimeOneday.setDate(eventDateOneDay.getDate());

				var today = new Date();
				today.setHours(today.getHours() + 3);
				if (eventStartTimeOneday <= today) {
					setTimeError({
						isError: true,
						message: "Event should be after 3 Hours.",
					});
				} else {
					if (eventEndTimeOneday) {
						eventEndTimeOneday.setFullYear(
							eventDateOneDay.getFullYear()
						);
						eventEndTimeOneday.setMonth(eventDateOneDay.getMonth());
						eventEndTimeOneday.setDate(eventDateOneDay.getDate());
						if (eventStartTimeOneday < eventEndTimeOneday) {
							fields.eventDate = eventDateOneDay;
							fields.eventStartTime = eventStartTimeOneday;
							fields.eventEndTime = eventEndTimeOneday;
							onFieldsChange(fields);
							onStepsChange("inc");
						} else {
							// alert("End Time should greater than Start Time");
							setEndTimeError({
								isError: true,
								message:
									"End Time should greater than Start Time.",
							});
						}
					} else {
						fields.eventDate = eventDateOneDay;
						fields.eventStartTime = eventStartTimeOneday;
						onFieldsChange(fields);
						onStepsChange("inc");
					}
				}
			} else {
				let eventDateOneDay = fields.eventStartDate;
				let eventEndDateOneDay = fields.eventEndDate;
				let eventStartTimeOneday = fields.eventStartTime;
				let eventEndTimeOneday = fields.eventEndTime;
				//change date timing
				eventDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				eventEndDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				//change timing unix date
				eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
				eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
				eventStartTimeOneday.setDate(eventDateOneDay.getDate());
				var today = new Date();
				today.setHours(today.getHours() + 3);
				if (eventStartTimeOneday <= today) {
					setTimeError({
						isError: true,
						message:
							"Event should be after three hours from current time.",
					});
				} else {
					const diffTime = eventEndDateOneDay - eventDateOneDay;
					const diffDays = Math.ceil(
						diffTime / (1000 * 60 * 60 * 24)
					);
					if (diffDays > 0) {
						if (eventEndTimeOneday) {
							eventEndTimeOneday.setFullYear(
								eventDateOneDay.getFullYear()
							);
							eventEndTimeOneday.setMonth(
								eventDateOneDay.getMonth()
							);
							eventEndTimeOneday.setDate(
								eventDateOneDay.getDate()
							);
							//eventStartTimeOneday < eventEndTimeOneday
							if (true) {
								fields.eventStartDate = eventDateOneDay;
								fields.eventEndDateOneDay = eventEndDateOneDay;
								fields.eventStartTime = eventStartTimeOneday;
								fields.eventEndTime = eventEndTimeOneday;
								onFieldsChange(fields);
								onStepsChange("inc");
							} else {
								// alert("End Time should greater than Start Time");
								setEndTimeError({
									isError: true,
									message:
										"End Time should greater than Start Time.",
								});
							}
						} else {
							fields.eventStartDate = eventDateOneDay;
							fields.eventStartTime = eventStartTimeOneday;
							fields.eventEndDateOneDay = eventEndDateOneDay;
							onFieldsChange(fields);
							onStepsChange("inc");
						}
					} else {
						// alert("End Date should greater than Start Date");
						setDateError({
							isError: true,
							message:
								"End date should be greater than start date",
						});
					}
				}
			}
		} else if (activeStep === 1) {
			//2nd stpper - location/link, images, topicI
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
		} else if (activeStep === 2) {
			// 3rd stepper -  event categories (free, single paid, multiple paid)
			// bool token; // false means free
			if (fields.eventCategory === "free") {
				let cat = [];
				let obj = {
					ticketName: "free",
					dollarPrice: "0",
					phnxPrice: "0",
					ticketAvailability:
						fields.ticketAvailability === "unlimited"
							? false
							: true,
					noOfTickets:
						fields.ticketAvailability === "unlimited"
							? "0"
							: fields.noOfTickets,
				};
				cat.push(obj);
				fields.categories = cat;
				fields.token = false; // false means free
				setCategoriesOfTicket(cat);
				setCategoriesOfToken(false);
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else if (fields.eventCategory === "single") {
				let cat = [];
				let obj = {
					ticketName: "single",
					dollarPrice: fields.dollarPrice,
					phnxPrice: fields.phnxPrice,
					ticketAvailability:
						fields.ticketAvailability === "unlimited"
							? false
							: true,
					noOfTickets:
						fields.ticketAvailability === "unlimited"
							? "0"
							: fields.noOfTickets,
				};
				cat.push(obj);
				fields.categories = cat;
				fields.token = true; // false means free
				setCategoriesOfTicket(cat);
				setCategoriesOfToken(true);
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else {
				if (categories.length > 0) {
					let sortedCategories = categories.sort(
						(a, b) =>
							parseFloat(a.dollarPrice) -
							parseFloat(b.dollarPrice)
					);
					fields.categories = sortedCategories;
					fields.token = true; // false means free
					setCategoriesOfTicket(sortedCategories);
					setCategoriesOfToken(true);
					onFieldsChange(fields);
					// setActiveStep((prevActiveStep) => prevActiveStep + 1);
					onStepsChange("inc");
				} else {
				}
			}
		} else if (activeStep === 3) {
			// 4th stepper
			fields.categories = categoriesOfTicket;
			fields.token = categoriesOfToken;
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
			handleCreateEvent();
		} else {
			//publish event
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const maxLengthCheckNumber = (e) => {
		e.target.value = Math.max(0, parseInt(e.target.value))
			.toString()
			.slice(0, 12);
	};

	//back button stepper
	const handleBack = () => {
		// setActiveStep((prevActiveStep) => prevActiveStep - 1);
		onStepsChange("dec");
	};

	const handleImageSelect = (name, index) => {
		const arr = [...images];
		arr[index].name = name;
		setImages([...arr]);
	};

	const handleSaveCatogory = (fields) => {
		let obj = {
			id: ticketCategory,
			ticketName: fields[`ticketName${ticketCategory}`],
			dollarPrice: fields[`dollarPrice${ticketCategory}`],
			phnxPrice: fields[`phnxPrice${ticketCategory}`],
			ticketAvailability:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? false
					: true,
			noOfTickets:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? "0"
					: fields[`noOfTickets${ticketCategory}`],
		};

		// let arr = categories;
		// arr.push(obj);
		upsert(categories, obj);
		setaddAnotherCat(!addAnotherCat);
	};

	function upsert(array, item) {
		const i = array.findIndex((_item) => _item.id === item.id);
		if (i > -1) {
			array[i] = item;
			setCategories([...array]);
		} else {
			array.push(item);
			setCategories([...array]);
		}
	}

	const handleAddAnotherCategory = () => {
		setaddAnotherCat(!addAnotherCat);
		// setTicketCategory(ticketCategory + 10);
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
	};

	const handleDeleteTicketCategory = (data, index, cat) => {
		let arr = categories;
		arr = arr.filter((obj) => obj.id !== cat.id);
		// arr.splice(index, 1);
		setCategories([...arr]);
	};

	const handleEditTicketCategory = (data, index, cat) => {
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
		setaddAnotherCat(!addAnotherCat);
		setTicketCategory(cat.id);
	};

	const convertDollarToPhnx = (d) => {
		let value = parseFloat(d);
		value = value > 0 ? value : 0;
		let usd = PhoenixDAO_market.usd;
		let phoenixValue = value / usd;

		phoenixValue = phoenixValue.toFixed(5);
		return phoenixValue;
	};

	function isValidDate(d) {
		return d instanceof Date && !isNaN(d);
	}

	function getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Details</h3>
							<Divider light />
							<br />

							<label className={classes.label}>EVENT NAME</label>
							<Controller
								name="eventName"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<TextField
										id="event-name"
										name={name}
										fullWidth
										variant="outlined"
										value={value}
										onBlur={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										onChange={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										error={!!error}
										helperText={
											error ? error.message : null
										}
										inputProps={{ maxLength: 50 }}
									/>
								)}
								rules={{
									required: "Please enter event name.",
									minLength: {
										value: 3,
										message:
											"Event name should contain at least 3 characters.",
									},
									maxLength: {
										value: 50,
										message: "Event name too long.",
									},
								}}
							/>

							<br />
							<br />
							<label className={classes.label}>
								EVENT ORGANIZER
							</label>
							<Controller
								name="eventOrganizer"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<TextField
										id="event-organizer"
										name={name}
										fullWidth
										variant="outlined"
										value={value}
										onChange={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										error={!!error}
										helperText={
											error ? error.message : null
										}
										inputProps={{ maxLength: 50 }}
									/>
								)}
								rules={{
									required:
										"Please enter event organizer name.",
									minLength: {
										value: 3,
										message:
											"Event organizer name should contain at least 3 characters.",
									},
									maxLength: {
										value: 50,
										message:
											"Event organizer name too long.",
									},
								}}
							/>

							<br />
							<br />

							<FormControl component="fieldset">
								<Controller
									name="eventTime"
									control={control}
									defaultValue={eventTime}
									render={({
										field: { onChange, value, name },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventTime"
											id="event-time-radio-btn"
											name={name}
											value={value}
											className={classes.radioGroup}
											onChange={(e) => {
												onChange(e);
												setEventTime(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
										>
											<FormControlLabel
												value="onedayevent"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="One day Event"
											/>
											<FormControlLabel
												value="morethanaday"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="More than a day"
											/>
										</RadioGroup>
									)}
									rules={{
										required: "Please select event time.",
									}}
								/>
							</FormControl>

							<br />
							<br />

							{eventTime === "onedayevent" ? (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<div>
											<div>
												<Controller
													name="eventDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => {
														return (
															<span>
																<InputLabel
																	style={{
																		marginBottom:
																			"-7px",
																	}}
																	htmlFor="input-with-icon-adornment"
																>
																	<label
																		className={
																			classes.label
																		}
																	>
																		DATE
																	</label>
																</InputLabel>
																<KeyboardDatePicker
																	fullWidth
																	disableToolbar
																	variant="inline"
																	format="dd-MM-yyyy"
																	margin="normal"
																	id="event-date"
																	name={name}
																	KeyboardButtonProps={{
																		"aria-label":
																			"change date",
																	}}
																	// InputProps={{
																	// 	readOnly: true,
																	// }}
																	inputVariant="outlined"
																	autoOk={
																		true
																	}
																	disablePast
																	placeholder="DD-MM-YYYY"
																	value={
																		value
																	}
																	onChange={(
																		e
																	) => {
																		onChange(
																			e
																		);
																		onGetRealTimeFields(
																			{
																				name,
																				value: e,
																			}
																		);
																	}}
																	error={
																		!!error
																	}
																	helperText={
																		error
																			? error.message
																			: null
																	}
																/>
															</span>
														);
													}}
													rules={{
														required:
															"Please select event date.",
													}}
												/>
											</div>
										</div>

										<br />

										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	START TIME
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="start-time-picker"
																name={name}
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																fullwidth
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	timeError.isError
																}
																helperText={
																	error
																		? error.message
																		: timeError.isError
																		? timeError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event time.",
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	END TIME
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																required={false}
																margin="normal"
																id="end-time-picker"
																name={name}
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																fullwidth
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																// error={!!error}
																// helperText="Don’t have an end time? leave here blank"
																error={
																	!!error ||
																	endTimeError.isError
																}
																helperText={
																	error
																		? error.message
																		: endTimeError.isError
																		? endTimeError.message
																		: "Don’t have an end time? leave here blank"
																}
																FormHelperTextProps={{
																	classes: {
																		root: classes.timeHelperText,
																	},
																}}
															/>
														</span>
													)}
													rules={{
														required: false,
														// "Please select event end time.",
													}}
												/>
											</Grid>
										</Grid>
									</MuiPickersUtilsProvider>
								</div>
							) : (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	START DATE
																</label>
															</InputLabel>
															<KeyboardDatePicker
																className={
																	classes.timeAndDate
																}
																disableToolbar
																variant="inline"
																format="dd-MM-yyyy"
																margin="normal"
																id="event-start-date-picker-inline"
																name={name}
																placeholder="DD-MM-YYYY"
																// InputProps={{
																// 	readOnly: true,
																// }}
																// label="START DATE"
																// value={startDate}
																// onChange={(d) =>
																// 	setStartDate(d)
																// }
																KeyboardButtonProps={{
																	"aria-label":
																		"change date",
																}}
																inputVariant="outlined"
																autoOk={true}
																disablePast
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={!!error}
																helperText={
																	error
																		? error.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event start date.",
													}}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	END DATE
																</label>
															</InputLabel>
															<KeyboardDatePicker
																className={
																	classes.timeAndDate
																}
																disableToolbar
																variant="inline"
																format="dd-MM-yyyy"
																margin="normal"
																name={name}
																id="event-end-date-picker-inline"
																// label="END DATE"
																// value={endDate}
																// onChange={(d) => setEndDate(d)}
																// InputProps={{
																// 	readOnly: true,
																// }}
																KeyboardButtonProps={{
																	"aria-label":
																		"change date",
																}}
																inputVariant="outlined"
																placeholder="DD-MM-YYYY"
																autoOk={true}
																disablePast
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	dateError.isError
																}
																helperText={
																	error
																		? error.message
																		: dateError.isError
																		? dateError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event end date.",
													}}
												/>
											</Grid>
										</Grid>

										<br />

										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	FROM
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="event-start-time-picker"
																name={name}
																// label="TO"
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	timeError.isError
																}
																helperText={
																	error
																		? error.message
																		: timeError.isError
																		? timeError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event start time.",
													}}
												/>
											</Grid>

											<span>
												<InputLabel
													style={{
														marginBottom: "-7px",
													}}
													htmlFor="input-with-icon-adornment"
												>
													<label
														className={
															classes.label
														}
													>
														DATE
													</label>
												</InputLabel>
												<KeyboardDatePicker
													fullWidth
													disableToolbar
													variant="inline"
													format="dd-MM-yyyy"
													margin="normal"
													id="event-date"
													name="eventDate"
													KeyboardButtonProps={{
														"aria-label":
															"change date",
													}}
													// InputProps={{
													// 	readOnly: true,
													// }}
													inputVariant="outlined"
													// autoOk={true}
													// disablePast
													placeholder="DD-MM-YYYY"
													value={eventDate}
													onBlur={(e) => {
														handlePickerValue({
															name: "eventDate",
															value: e,
														});
													}}
													onChange={(e) => {
														handlePickerValue({
															name: "eventDate",
															value: e,
														});
													}}
													{...(errors[
														"eventDate"
													] && {
														error: true,
														helperText: errors[
															"eventDate"
														]
															? errors[
																	"eventDate"
															  ]
															: "",
													})}
												/>
											</span>


											<span>
													<InputLabel
														style={{
															marginBottom:
																"-7px",
														}}
														htmlFor="input-with-icon-adornment"
													>
														<label
															className={
																classes.label
															}
														>
															START TIME
														</label>
													</InputLabel>
													<KeyboardTimePicker
														className={
															classes.timeAndDate
														}
														keyboardIcon={
															<AccessTime />
														}
														margin="normal"
														id="start-time-picker"
														name="eventStartTime"
														placeholder="00:00 AM"
														KeyboardButtonProps={{
															"aria-label":
																"change time",
														}}
														// InputProps={{
														// 	readOnly: true,
														// }}
														fullwidth
														inputVariant="outlined"
														// autoOk={true}
														clearable
														value={eventStartTime}
														onBlur={(e) => {
															handlePickerValue({
																name: "eventStartTime",
																value: e,
															});
														}}
														onChange={(e) => {
															handlePickerValue({
																name: "eventStartTime",
																value: e,
															});
														}}
														{...(errors[
															"eventStartTime"
														] && {
															error: true,
															helperText:
																errors[
																	"eventStartTime"
																],
														})}
													/>
												</span>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	TO
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="event-end-time-picker"
																name={name}
																// label="FROM"
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																FormHelperTextProps={{
																	classes: {
																		root: classes.timeHelperText,
																	},
																}}
																// helperText="Don’t have an end time? leave here blank"
																// error={!!error}
																error={
																	!!error ||
																	endTimeError.isError
																}
																helperText={
																	error
																		? error.message
																		: endTimeError.isError
																		? endTimeError.message
																		: "Don’t have an end time? leave here blank"
																}
															/>
														</span>
													)}
													rules={{
														required: false,
														// "Please select event end time.",
													}}
												/>
											</Grid>
										</Grid>
									</MuiPickersUtilsProvider>
								</div>
							)}
						</div>
					</React.Fragment>
				);
			case 1:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Details</h3>
							<Divider light />
							<br />
							<FormControl component="fieldset">
								<Controller
									name="eventType"
									control={control}
									defaultValue={type}
									render={({
										field: { onChange, value, name },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventType"
											className={classes.radioGroup}
											name={name}
											id="event-Type"
											value={value}
											onChange={(e) => {
												onChange(e);
												setType(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
										>
											<FormControlLabel
												value="physical"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="Physical Event"
											/>
											<FormControlLabel
												value="online"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="Online Event"
											/>
										</RadioGroup>
									)}
									rules={{
										required: "Please select event type.",
									}}
								/>
							</FormControl>

							<br />
							{type === "physical" ? (
								<div>
									<br />
									<Grid container spacing={2}>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={6}
											xl={4}
											px={2}
										>
											<Controller
												name="country"
												control={control}
												defaultValue={country}
												// value={country}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="country"
														name={name}
														id="country"
														isCountry
														onChange={(v) => {
															onChange(v);
															setState("");
															setCity("");
															setCountry(v.id);
															setFormValue(
																"city",
																""
															);
															setFormValue(
																"state",
																""
															);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select country.",
												}}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={6}
											xl={4}
											px={2}
										>
											<Controller
												name="state"
												control={control}
												defaultValue={state}
												// value={state}
												className={
													classes.selectBoxMaxWidth
												}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="state"
														name={name}
														id="state"
														onChange={(v) => {
															onChange(v);
															setState(v.id);
															setCity("");
															setFormValue(
																"city",
																""
															);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														geoId={country}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select state.",
												}}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={12}
											xl={4}
										>
											<Controller
												name="city"
												control={control}
												defaultValue={city}
												// value={city}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="city"
														name={name}
														id="city"
														onChange={(v) => {
															onChange(v);
															setCity(v.id);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														geoId={state}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select city.",
												}}
											/>
										</Grid>
									</Grid>
									<br />
									<label className={classes.label}>
										EVENT LOCATION
									</label>
									<Controller
										name="eventLocation"
										control={control}
										defaultValue=""
										render={({
											field: { onChange, value, name },
											fieldState: { error },
										}) => (
											<TextField
												id="event-location"
												name={name}
												fullWidth
												variant="outlined"
												value={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												error={!!error}
												helperText={
													error ? error.message : null
												}
												inputProps={{ maxLength: 300 }}
											/>
										)}
										rules={{
											required:
												"Please enter event location.",
											minLength: {
												value: 3,
												message:
													"Event location should contain at least 3 characters.",
											},
											maxLength: {
												value: 300,
												message:
													"Event location too long.",
											},
										}}
									/>
								</div>
							) : (
								<div>
									<label className={classes.label}>
										EVENT LINK
									</label>
									<Controller
										name="eventLink"
										control={control}
										defaultValue=""
										render={({
											field: { onChange, value, name },
											fieldState: { error },
										}) => (
											<TextField
												id="event-link"
												name={name}
												fullWidth
												variant="outlined"
												value={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												error={!!error}
												helperText={
													error ? error.message : null
												}
											/>
										)}
										rules={{
											required:
												"Please enter event link.",
											pattern: {
												value: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
												message: "Is Not Valid URL",
											},
										}}
									/>
								</div>
							)}
							{images.slice(0, 3).map((img, index) => {
								return (
									<div key={index}>
										<br />

										<label className={classes.label}>
											COVER IMAGE {index + 1}
										</label>

										<Controller
											name={`image${index}`}
											control={control}
											defaultValue=""
											render={({
												field: {
													onChange,
													value,
													name,
												},
												fieldState: { error },
											}) => (
												<TextField
													variant="outlined"
													id={name}
													name={name}
													fullWidth
													disabled
													value={img.name}
													error={!!error}
													placeholder="Select Image"
													helperText={
														error
															? error.message
															: null
													}
													InputProps={{
														endAdornment: (
															<Button
																component="label"
																style={{
																	padding:
																		"15px 25px",
																	background:
																		"#FFF9E5",
																	left: "13px",
																	textTransform:
																		"capitalize",
																}}
															>
																Browse
																<input
																	type="file"
																	hidden
																	multiple={
																		false
																	}
																	accept="image/*"
																	onChange={(
																		event
																	) => {
																		if (
																			event
																				.target
																				.files &&
																			event
																				.target
																				.files[0]
																		) {
																			if (
																				event
																					.target
																					.files[0]
																					.size <
																				5000000
																			) {
																				handleImageSelect(
																					event
																						.target
																						.files[0]
																						.name,
																					index
																				);
																				onChange(
																					event
																						.target
																						.files[0]
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: event
																							.target
																							.files[0],
																					}
																				);
																			} else {
																				handleImageSelect(
																					"",
																					index
																				);
																				onChange(
																					""
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: "",
																					}
																				);
																			}
																		} else {
																			if (
																				value
																			) {
																				handleImageSelect(
																					value.name,
																					index
																				);
																				onChange(
																					value
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: value,
																					}
																				);
																			} else {
																				handleImageSelect(
																					"",
																					index
																				);
																				onChange(
																					""
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: "",
																					}
																				);
																			}
																		}
																	}}
																/>
															</Button>
														),
													}}
												/>
											)}
											rules={{
												required:
													"Please select an image less than 5MB.",
											}}
										/>

										{index === 0 ? (
											<p
												style={{
													color: "#73727D",
													fontSize: 14,
													fontWeight: 400,
													paddingTop: "10px",
													marginBottom: 0,
												}}
											>
												Max: 3 Pictures. Not greater
												than 5MB (Recommended 1000px *
												1000px)
											</p>
										) : null}
									</div>
								);
							})}

							<br />

							<Button
								disabled={images.length > 3 ? true : false}
								variant="outlined"
								fullWidth
								className={classes.addAnotherImageBtn}
								startIcon={<AddIcon fontSize="large" />}
								onClick={() => {
									setImages([
										...images.slice(0, 6),
										{ name: "" },
									]);
								}}
							>
								Add another Image
							</Button>

							<br />
							<br />

							<label className={classes.label}>TOPIC</label>
							<Controller
								name="eventTopic"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										variant="outlined"
										fullWidth
										className={classes.formControl}
										error={!!error}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="event-topic"
											name={name}
											fullWidth
											value={value}
											onChange={(e) => {
												onChange(e);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
											displayEmpty
											className={classes.menuPaper}
											MenuProps={{
												classes: {
													paper: classes.menuPaper,
												},
											}}
										>
											<MenuItem
												disabled
												value=""
												style={{
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												<em>Topic</em>
											</MenuItem>
											{Object.entries(eventTopics).map(
												(topic) => (
													<MenuItem
														key={topic[1].name}
														value={topic[1].slug}
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														{topic[1].name}
													</MenuItem>
												)
											)}
										</Select>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required: "Please select event topic.",
								}}
							/>
						</div>
					</React.Fragment>
				);
			case 2:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Tickets</h3>
							<Divider light />
							<br />
							<label className={classes.label}>CATEGORY</label>
							<Controller
								name="eventCategory"
								control={control}
								defaultValue={category}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										variant="outlined"
										fullWidth
										// className={classes.formControl}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="event-category"
											name={name}
											value={value}
											onChange={(e) => {
												onChange(e);
												setCategory(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
											fullWidth
											className={classes.dropdownMenu}
										>
											<MenuItem value="free">
												Free Event
											</MenuItem>
											<MenuItem value="single">
												{`Paid (Single Ticket Type Event)`}
											</MenuItem>
											<MenuItem value="multiple">{`Paid (Multiple Ticket Type Event)`}</MenuItem>
										</Select>
									</FormControl>
								)}
								rules={{
									required: "Please select event category.",
								}}
							/>

							<br />
							<br />

							{/* conditonal rendering for event category - free - single_paid - multiple-paid */}
							<div>
								{category === "free" ? (
									<div>
										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<Controller
												name="ticketAvailability"
												control={control}
												defaultValue={availability}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name={name}
														id="ticket-availability"
														value={value}
														className={
															classes.radioGroup
														}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
															onGetRealTimeFields(
																{
																	name: "ticketAvailabilityPreview",
																	value: e
																		.target
																		.value,
																}
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Limited Tickets"
														/>
													</RadioGroup>
												)}
												rules={{
													required:
														"Please select event availability.",
												}}
											/>
										</FormControl>
										{availability === "unlimited" ? null : (
											<div>
												<label
													className={classes.label}
												>
													NUMBER OF TICKETS
												</label>
												<Controller
													name="noOfTickets"
													control={control}
													defaultValue=""
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															onInput={
																maxLengthCheckNumber
															}
															type="number"
															id="no-of-tickets"
															name={name}
															fullWidth
															variant="outlined"
															value={value}
															onChange={(e) => {
																onChange(e);
																onGetRealTimeFields(
																	{
																		name: "noOfTicketsPreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: null
															}
														/>
													)}
													rules={{
														required:
															"Please enter number of tickets.",
														min: {
															value: 1,
															message:
																"Number of ticket should be at least 1",
														},
														maxLength: {
															value: 12,
															message:
																"Number of ticket is too large.",
														},
													}}
												/>
											</div>
										)}
									</div>
								) : category === "single" ? (
									<div>
										<br />
										<div
											className={
												classes.ticketPriceContainer
											}
										>
											{/* single_ticket_cateogry */}
											<Controller
												name="dollarPrice"
												control={control}
												defaultValue=""
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<span>
														<InputLabel htmlFor="input-with-icon-adornment">
															<label
																className={
																	classes.label
																}
															>
																TICKET PRICE
															</label>
														</InputLabel>
														<TextField
															className={
																classes.margin
															}
															onKeyDown={
																formatInputDollarPrice
															}
															id="dollar-price"
															name={name}
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<Button
																				component="label"
																				style={{
																					padding:
																						"15px 15px",
																					background:
																						"#F2F2FD",
																					left: "-13px",
																				}}
																			>
																				<img
																					src={
																						dollarIcon
																					}
																					alt="dollar sign"
																				/>
																			</Button>
																		</InputAdornment>
																	),
																inputProps: {
																	min: 0,
																},
																classes: {},
															}}
															value={value}
															onChange={(e) => {
																onChange(e);
																setFormValue(
																	"phnxPrice",
																	convertDollarToPhnx(
																		e.target
																			.value
																	)
																);
																onGetRealTimeFields(
																	{
																		name: "dollarPricePreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: " "
															}
														/>
													</span>
												)}
												rules={{
													required:
														"Enter price in dollars.",
													maxLength: {
														value: 12,
														message:
															"Ticket price is too large.",
													},
												}}
											/>

											<div
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<img
													src={altIcon}
													alt="alt icon"
													className={classes.altImage}
												/>
											</div>

											{/* single_ticket_cateogry */}
											<Controller
												name="phnxPrice"
												control={control}
												defaultValue=""
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<span>
														<InputLabel htmlFor="input-with-icon-adornment">
															<span>&nbsp;</span>
														</InputLabel>
														<TextField
															className={
																classes.margin
															}
															disabled
															id="phnx-price"
															name={name}
															onKeyDown={
																formatInputDollarPrice
															}
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<Button
																				component="label"
																				style={{
																					padding:
																						"15px 15px",
																					background:
																						"#F2F2FD",
																					left: "-13px",
																				}}
																			>
																				<img
																					src={
																						phnxLogo
																					}
																					alt="phnx logo"
																				/>
																			</Button>
																		</InputAdornment>
																	),
															}}
															value={value}
															onChange={(e) => {
																onChange(e);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: " "
															}
														/>
													</span>
												)}
												rules={{
													required: false,
												}}
											/>
										</div>

										<br />

										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<Controller
												name="ticketAvailability"
												control={control}
												defaultValue={availability}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name={name}
														id="ticket-availability"
														className={
															classes.radioGroup
														}
														value={value}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
															onGetRealTimeFields(
																{
																	name: "ticketAvailabilityPreview",
																	value: e
																		.target
																		.value,
																}
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Limited Tickets"
														/>
													</RadioGroup>
												)}
												rules={{
													required:
														"Please select event availability.",
												}}
											/>
										</FormControl>
										{availability === "unlimited" ? null : (
											<div>
												<label
													className={classes.label}
												>
													NUMBER OF TICKETS
												</label>
												<Controller
													name="noOfTickets"
													control={control}
													defaultValue=""
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															onInput={
																maxLengthCheckNumber
															}
															type="number"
															id="no-of-tickets"
															name={name}
															// label="Event Organizer"
															fullWidth
															variant="outlined"
															value={value}
															onChange={(e) => {
																onChange(e);
																onGetRealTimeFields(
																	{
																		name: "noOfTicketsPreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: null
															}
														/>
													)}
													rules={{
														required:
															"Please enter number of tickets.",

														min: {
															value: 1,
															message:
																"Number of ticket should be at least 1",
														},
														maxLength: {
															value: 12,
															message:
																"Number of ticket is too large.",
														},
													}}
												/>
											</div>
										)}
									</div>
								) : (
									<div>
										{/*paid multiple - ticket category box*/}
										{categories.map((cat, index) => {
											return (
												<div
													key={index}
													style={{ marginBottom: 20 }}
												>
													<Grid container>
														<Grid
															className={
																classes.ticketCard
															}
															container
															item
															xs={10}
															sm={10}
															md={11}
															lg={11}
															xl={11}
															justify="space-between"
															direction="row"
														>
															<Grid
																item
																direction="column"
																xs={12}
																sm={12}
																md={9}
																lg={9}
																xl={9}
															>
																<p
																	className={
																		classes.ticketNameCat
																	}
																>
																	{
																		cat.ticketName
																	}
																	{` Ticket`}
																</p>
																<p
																	className={
																		classes.ticketAvailabilityCat
																	}
																>
																	{cat.ticketAvailability
																		? cat.noOfTickets
																		: `Unlimited  Tickets`}
																</p>
															</Grid>
															<Grid
																xs={12}
																sm={12}
																md={3}
																lg={3}
																xl={3}
																item
																direction="column"
																style={{
																	textAlign:
																		"end",
																}}
															>
																<p
																	className={
																		classes.dollarPriceCat
																	}
																	title={
																		"$" +
																		cat.dollarPrice
																	}
																>
																	{
																		// cat.dollarPrice
																		pricingFormatter(
																			cat.dollarPrice,
																			"$"
																		)
																	}
																</p>
																<p
																	className={
																		classes.phnxPriceCat
																	}
																	title={
																		cat.phnxPrice +
																		" PHNX"
																	}
																>
																	{
																		// cat.phnxPrice
																		pricingFormatter(
																			cat.phnxPrice,
																			"PHNX"
																		)
																	}
																</p>
															</Grid>
														</Grid>
														<Grid
															item
															container
															xs={2}
															sm={2}
															md={1}
															lg={1}
															xl={1}
															direction="column"
															justify="space-evenly"
															alignContent="flex-start"
														>
															<Grid item>
																<Button
																	onClick={handleSubmit(
																		(
																			data
																		) =>
																			handleEditTicketCategory(
																				data,
																				index,
																				cat
																			)
																	)}
																	style={{
																		justifyContent:
																			"center",
																	}}
																>
																	<img
																		src={
																			editIcon
																		}
																		alt="editIcon"
																	/>
																</Button>
															</Grid>
															<Grid item>
																<Button
																	onClick={handleSubmit(
																		(
																			data
																		) =>
																			handleDeleteTicketCategory(
																				data,
																				index,
																				cat
																			)
																	)}
																	style={{
																		justifyContent:
																			"center",
																	}}
																>
																	<img
																		src={
																			deleteIcon
																		}
																		alt="deleteIcon"
																	/>
																</Button>
															</Grid>
														</Grid>
													</Grid>
												</div>
											);
										})}

										{/* for adding new category */}
										{!addAnotherCat ? (
											<div>
												<form
													onSubmit={handleSubmit(
														handleSaveCatogory
													)}
												>
													<label
														className={
															classes.label
														}
													>
														TICKET NAME
													</label>
													<Controller
														name={`ticketName${ticketCategory}`}
														control={control}
														defaultValue=""
														render={({
															field: {
																onChange,
																value,
																name,
															},
															fieldState: {
																error,
															},
														}) => (
															<TextField
																id={name}
																name={name}
																fullWidth
																variant="outlined"
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e
																				.target
																				.value,
																		}
																	);
																}}
																error={!!error}
																helperText={
																	error
																		? error.message
																		: null
																}
																inputProps={{
																	maxLength: 50,
																}}
															/>
														)}
														rules={{
															required:
																"Please enter ticket name.",
															minLength: {
																value: 3,
																message:
																	"Ticket name should contain at least 3 characters.",
															},
															maxLength: {
																value: 50,
																message:
																	"Ticket name too long.",
															},
														}}
													/>

													<br />
													<br />

													<br />
													<div
														className={
															classes.ticketPriceContainer
														}
													>
														<Controller
															name={`dollarPrice${ticketCategory}`}
															control={control}
															defaultValue=""
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<span>
																	<InputLabel htmlFor="input-with-icon-adornment">
																		{/* <span>
																			&nbsp;
																		</span> */}
																		<label
																			className={
																				classes.label
																			}
																		>
																			TICKET
																			PRICE
																		</label>
																	</InputLabel>
																	<TextField
																		className={
																			classes.margin
																		}
																		id={
																			name
																		}
																		name={
																			name
																		}
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<Button
																							component="label"
																							style={{
																								padding:
																									"15px 15px",
																								background:
																									"#F2F2FD",
																								left: "-13px",
																							}}
																						>
																							<img
																								src={
																									dollarIcon
																								}
																								alt="dollar sign"
																							/>
																						</Button>
																					</InputAdornment>
																				),

																			inputProps:
																				{
																					min: 0,
																				},
																		}}
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																			setFormValue(
																				`phnxPrice${ticketCategory}`,
																				convertDollarToPhnx(
																					e
																						.target
																						.value
																				)
																			);
																			onGetRealTimeFields(
																				{
																					name: "dollarPricePreview",
																					value: e
																						.target
																						.value,
																				}
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: " "
																		}
																	/>
																</span>
															)}
															rules={{
																required:
																	"Enter price in dollars.",
																maxLength: {
																	value: 12,
																	message:
																		"Ticket price is too large.",
																},
															}}
														/>

														<div
															style={{
																display: "flex",
																justifyContent:
																	"center",
																alignItems:
																	"center",
															}}
														>
															<img
																src={altIcon}
																alt="alt icon"
																className={
																	classes.altImage
																}
															/>
														</div>

														<Controller
															name={`phnxPrice${ticketCategory}`}
															control={control}
															defaultValue=""
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<span>
																	<InputLabel htmlFor="input-with-icon-adornment">
																		<span>
																			&nbsp;
																		</span>
																	</InputLabel>
																	<TextField
																		className={
																			classes.margin
																		}
																		disabled
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		id={
																			name
																		}
																		name={
																			name
																		}
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<Button
																							component="label"
																							style={{
																								padding:
																									"15px 15px",
																								background:
																									"#F2F2FD",
																								left: "-13px",
																							}}
																						>
																							<img
																								src={
																									phnxLogo
																								}
																								alt="phnx logo"
																							/>
																						</Button>
																					</InputAdornment>
																				),
																			inputProps:
																				{
																					min: 0,
																				},
																		}}
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: " "
																		}
																	/>
																</span>
															)}
															rules={{
																required: false,
															}}
														/>
													</div>

													<br />

													<FormControl component="fieldset">
														<label
															className={
																classes.label
															}
														>
															TICKET AVAILABILITY
														</label>
														<Controller
															name={`ticketAvailability${ticketCategory}`}
															control={control}
															defaultValue={
																availability
															}
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<RadioGroup
																	row
																	aria-label="ticketAvailability"
																	name={name}
																	id={name}
																	className={
																		classes.radioGroup
																	}
																	value={
																		value
																	}
																	onChange={(
																		e
																	) => {
																		onChange(
																			e
																		);
																		setAvailability(
																			e
																				.target
																				.value
																		);
																		onGetRealTimeFields(
																			{
																				name: "ticketAvailabilityPreview",
																				value: e
																					.target
																					.value,
																			}
																		);
																	}}
																>
																	<FormControlLabel
																		value="unlimited"
																		control={
																			<Radio
																				color="primary"
																				icon={
																					<img
																						src={
																							uncheckedIcon
																						}
																					/>
																				}
																				checkedIcon={
																					<img
																						src={
																							checkedIcon
																						}
																					/>
																				}
																			/>
																		}
																		label="Unlimited Tickets"
																	/>
																	<FormControlLabel
																		value="limited"
																		control={
																			<Radio
																				color="primary"
																				icon={
																					<img
																						src={
																							uncheckedIcon
																						}
																					/>
																				}
																				checkedIcon={
																					<img
																						src={
																							checkedIcon
																						}
																					/>
																				}
																			/>
																		}
																		label="Limited Tickets"
																	/>
																</RadioGroup>
															)}
															rules={{
																required:
																	"Please select event availability.",
															}}
														/>
													</FormControl>
													{availability ===
													"unlimited" ? null : (
														<div>
															<label
																className={
																	classes.label
																}
															>
																NUMBER OF
																TICKETS
															</label>
															<Controller
																name={`noOfTickets${ticketCategory}`}
																control={
																	control
																}
																defaultValue=""
																render={({
																	field: {
																		onChange,
																		value,
																		name,
																	},
																	fieldState:
																		{
																			error,
																		},
																}) => (
																	<TextField
																		id={
																			name
																		}
																		name={
																			name
																		}
																		// label="Event Organizer"
																		onKeyDown={
																			formatInputNoOfTickets
																		}
																		onInput={
																			maxLengthCheckNumber
																		}
																		type="number"
																		fullWidth
																		variant="outlined"
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																			onGetRealTimeFields(
																				{
																					name: "noOfTicketsPreview",
																					value: e
																						.target
																						.value,
																				}
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: null
																		}
																	/>
																)}
																rules={{
																	required:
																		"Please enter number of tickets.",
																	min: {
																		value: 1,
																		message:
																			"Number of ticket should be at least 1",
																	},
																	maxLength: {
																		value: 12,
																		message:
																			"Number of ticket is too large.",
																	},
																}}
															/>
														</div>
													)}

													<br />

													{/* save button */}
													<Button
														color="primary"
														variant="outlined"
														fullWidth
														className={
															classes.addAnotherImageBtn
														}
														type="submit"
													>
														Save
													</Button>
												</form>
												<br />
											</div>
										) : (
											<div style={{ marginTop: 35 }}>
												<Button
													variant="outlined"
													fullWidth
													className={
														classes.addAnotherImageBtn
													}
													startIcon={
														<AddIcon fontSize="large" />
													}
													onClick={
														handleAddAnotherCategory
													}
												>
													Add another Ticket Category
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
							<br />
							<Controller
								name="restrictWallet"
								control={control}
								defaultValue={false}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControlLabel
										control={
											<Checkbox
												icon={
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
												}
												checked={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												name={name}
												id="restrict-wallet"
												color="primary"
											/>
										}
										label={
											<span
												style={{
													// fontSize: 20,
													fontWeight: 400,
													color: "#1E1E22",
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												Restrict Wallet Address to one
												Ticket
											</span>
										}
									/>
								)}
								rules={{
									required: false,
								}}
							/>
						</div>
					</React.Fragment>
				);
			case 3:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Description</h3>
							<Divider light />
							<br />
							<label className={classes.label}>
								EVENT DESCRIPTION
							</label>
							<br />

							<Controller
								name="eventDescription"
								control={control}
								defaultValue="<p><br></p>"
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										error={!!error}
										component="fieldset"
										className={classes.formControlDesc}
									>
										<BodyTextEditor
											value={value}
											setValue={(bodyText) => {
												onChange(bodyText);
												// setEventDesc(bodyText);
												onGetRealTimeFields({
													name,
													value: bodyText,
												});
											}}
											readOnly={false}
											name={name}
											id="event-description"
										/>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required: "Please enter event details.",
									minLength: {
										value: 500,
										message:
											"Event description is too short.",
									},
								}}
							/>
							<br />
							<Controller
								name="termsAndConditions"
								control={control}
								defaultValue={false}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										required
										error={!!error}
										component="fieldset"
									>
										<FormControlLabel
											control={
												<Checkbox
													icon={
														<img
															src={uncheckedIcon}
														/>
													}
													checkedIcon={
														<img
															src={checkedIcon}
														/>
													}
													checked={value}
													onChange={(e) => {
														onChange(e);
														onGetRealTimeFields({
															name,
															value: e.target
																.value,
														});
													}}
													name={name}
													id="terms-and-conditions"
													color="primary"
												/>
											}
											// label="By creating an event, I agree to the policies and terms of use."

											label={
												<span
													style={{
														// fontSize: 20,
														fontWeight: 400,
														color: "#1E1E22",
														fontFamily:
															"'Aeonik', sans-serif",
													}}
												>
													By creating an event, I
													agree to the{" "}
													<a
														target="_blank"
														href="/terms-and-conditions"
													>
														policies and terms of
														use
													</a>
													.
												</span>
											}
										/>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required:
										"Please agree to all the terms and conditions before creating an event.",
								}}
							/>
						</div>
					</React.Fragment>
				);
			default:
				return (
					<React.Fragment>
						<div>
							<p>Unknown stepIndex</p>
						</div>
					</React.Fragment>
				);
		}
	}

	// flaming stepper
	function getFlamingSteps() {
		return ["Upload Data", "Confirm Transaction", "Publish Event"];
	}

	function getFlamingStepContent(step) {
		switch (step) {
			case 0:
				return "One Moment we are Uploading your Data";
			case 1:
				return "Data Uploaded Successfully";
			case 2:
				return "Transaction Confirmed";
			case 3:
				return "Event Published";
			default:
				return "Unknown step";
		}
	}

	const publishedEventComponent = () => {
		return (
			<div className={classes.publishedEventContainer}>
				<img
					src={GoldonBlue}
					width={154}
					height={188}
					alt="flaming..."
				/>
				<br />
				{!!progressText && (
					<p className={classes.progressTextStyle}>{progressText}%</p>
				)}
				<br />
				<div>
					<p className={classes.flamingStepContent}>
						{getFlamingStepContent(activeFlamingStep)}
					</p>
				</div>
				<Stepper activeStep={activeFlamingStep} orientation="vertical">
					{flamingSteps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
		);
	};

	return (
		<div
			className={
				activeFlamingStep == 3 ? classes.publishedRoot : classes.root
			}
		>
			{activeStep === steps.length ? null : (
				<Stepper
					activeStep={activeStep}
					alternativeLabel
					className={classes.step}
				>
					{steps.map((label, i) => (
						<Step key={i}>
							<StepLabel className={classes.stepperCircle}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			)}
			<div
				className={
					activeFlamingStep == 3
						? classes.mainStepperContainerForPublishPage
						: classes.mainStepperContainer
				}
			>
				<br />
				{activeStep === steps.length ? (
					<div>
						{activeFlamingStep === flamingSteps.length ? (
							<div className={classes.activeFlamingStepStyle}>
								<img
									src={Checkmark}
									width={238}
									height={238}
									alt="hurray"
								/>
								<br />
								<p
									style={{
										fontSize: 32,
										fontWeight: 700,
										color: "#413AE2",
									}}
								>
									Hurray, Event Published
								</p>
								<br />
								<Typography
									gutterBottom
									className={classes.eventUrl}
								>
									Event URL
								</Typography>
								<FormControl
									variant="outlined"
									className={classes.UrlField}
								>
									<TextField
										id="outlined-helperText"
										label=""
										value={shareUrl}
										defaultValue={shareUrl}
										variant="outlined"
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<CopyToClipboard
														text={shareUrl}
														onCopy={onCopyText}
													>
														<IconButton
															className={
																classes.copyButton
															}
															aria-label="copy text"
														>
															<span
																style={
																	isCopied
																		? {
																				fontSize:
																					"14px",
																		  }
																		: {
																				color: "#413AE2",
																		  }
																}
															>
																{isCopied ? (
																	"Copied!"
																) : (
																	<i class="far fa-copy fa-md"></i>
																)}
															</span>
														</IconButton>
													</CopyToClipboard>
												</InputAdornment>
											),
										}}
									/>
								</FormControl>

								<Grid
									lg={12}
									item
									className={classes.SocialMediaDiv}
								>
									<SocialMedia
										shareUrl={shareUrl}
										disabled={false}
									/>
								</Grid>
								<h5 className={classes.share}>
									Share on Social Media
								</h5>
								<br />
								<br />
								<Button
									color="primary"
									size="large"
									variant="contained"
									startIcon={
										<VisibilityOutlinedIcon fontSize="large" />
									}
									className={classes.viewButton}
									onClick={() => history.push("/myevents/1")}
								>
									View your Event
								</Button>
							</div>
						) : (
							publishedEventComponent()
						)}
					</div>
				) : (
					<div>
						<div>{getStepContent(activeStep)}</div>

						<br />
						<br />

						<div className={classes.buttonsContainer}>
							{activeStep === 0 ? (
								<span />
							) : (
								<Button
									disabled={activeStep === 0}
									onClick={handleBack}
									className={classes.backButton}
									startIcon={
										<img
											src={arrowbackicon}
											alt="arrowbackicon"
										/>
									}
								>
									Back
								</Button>
							)}

							<Button
								size="large"
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleNext)}
								className={classes.nextButton}
								endIcon={
									activeStep === steps.length - 1 ? null : (
										<img
											src={arrowrighticon}
											alt="arrowrighticon"
										/>
									)
								}
								startIcon={
									activeStep === steps.length - 1 ? (
										<img src={publishIcon} atl="publish" />
									) : null
								}
							>
								{activeStep === steps.length - 1
									? "Publish Event"
									: "Next"}
							</Button>
						</div>
					</div>
				)}
			</div>
			{activeFlamingStep == 3 && (
				<a
					href="https://www.travala.com/?ref=phoenixdao"
					target="_blank"
				>
					<div className={classes.travelImage}>
						<img src={"/images/createEvent.jpg"} alt="travel" />
					</div>
				</a>
			)}
		</div>
	);
};

export default withRouter(MyStepper);
=======
import "date-fns";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Divider,
	TextField,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Grid,
	InputLabel,
	MenuItem,
	FormHelperText,
	Select,
	Checkbox,
	InputAdornment,
	StepConnector,
	StepContent,
	IconButton,
	Box,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import {
	Add as AddIcon,
	VisibilityOutlined as VisibilityOutlinedIcon,
	AccessTime,
} from "@material-ui/icons";
import GoldonBlue from "../Images/GoldonBlue.gif";
import { useForm, Controller } from "react-hook-form";
import phnxLogo from "../Images/phnx.png";
import dollarIcon from "../Images/dollar.png";
import eventTopics from "../../config/topics.json";
import altIcon from "../Images/altIcon.png";
import editIcon from "../Images/editIcon.png";
import deleteIcon from "../Images/deleteIcon.png";
import BodyTextEditor from "../common/BodyTextEditor";
import publishIcon from "../Images/publish.png";
import Checkmark from "../Images/Checkmark.gif";
import { withRouter } from "react-router-dom";
import SocialMedia from "../common/SocialMedia";
import { CopyToClipboard } from "react-copy-to-clipboard";
import checkedIcon from "../Images/checked.png";
import uncheckedIcon from "../Images/unchecked.png";
import arrowrighticon from "../Images/arrowrighticon.png";
import arrowbackicon from "../Images/arrowbackicon.png";
import GeoLocation from "../common/GeoLocation";
import { pricingFormatter } from "../../utils/pricingSuffix";

import { useFormControls } from "./StepperFormControls";

import useStyles from "./StepperFormStyling";

var badWords = require("bad-words");

const MyStepper = ({
	handleCreateEvent,
	onFieldsChange,
	onGetRealTimeFields,
	onStepsChange,
	activeStep,
	activeFlamingStep,
	history,
	progressText,
	shareUrl,
}) => {
	const classes = useStyles();

	const { handleInputValue, handleFormSubmit, formIsValid, errors, values } =
		useFormControls();
	const { handleSubmit, control, setValue: setFormValue } = useForm();
	const steps = ["", "", "", ""];
	const [eventTime, setEventTime] = useState("onedayevent");
	const [type, setType] = useState("physical");
	const [category, setCategory] = useState("free");
	const [availability, setAvailability] = useState("unlimited");
	const [images, setImages] = useState([{ name: "" }]);

	const flamingSteps = getFlamingSteps();

	const [categories, setCategories] = useState([]);
	const [addAnotherCat, setaddAnotherCat] = useState(false);
	const [ticketCategory, setTicketCategory] = useState(0);

	useEffect(() => {
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
	}, []);

	const [PhoenixDAO_market, setPhoenixDAO_market] = useState({});
	const [isCopied, setIsCopied] = useState(false);

	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");

	const [dateError, setDateError] = useState({
		message: "",
		isError: false,
	});

	const [timeError, setTimeError] = useState({
		message: "",
		isError: false,
	});

	const [endTimeError, setEndTimeError] = useState({
		message: "",
		isError: false,
	});

	const [categoriesOfTicket, setCategoriesOfTicket] = useState([]);
	const [categoriesOfToken, setCategoriesOfToken] = useState(false);

	const onCopyText = () => {
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	};

	const formatInputNoOfTickets = (e) => {
		// Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
		let checkIfNum;
		if (e.key !== undefined) {
			// Check if it's a "e", ".", "+" or "-"
			checkIfNum =
				e.key === "e" ||
				e.key === "E" ||
				e.key === "." ||
				e.key === "+" ||
				e.key === "-";
		} else if (e.keyCode !== undefined) {
			// Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
			checkIfNum =
				e.keyCode === 69 ||
				e.keyCode === 190 ||
				e.keyCode === 187 ||
				e.keyCode === 189;
		}
		return checkIfNum && e.preventDefault();
	};

	const formatInputDollarPrice = (e) => {
		// Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
		let checkIfNum;
		if (e.key !== undefined) {
			// Check if it's a "e", ".", "+" or "-"
			checkIfNum =
				e.key === "e" ||
				e.key === "E" ||
				// e.key === "." ||
				e.key === "+" ||
				e.key === "-";
		} else if (e.keyCode !== undefined) {
			// Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
			checkIfNum =
				e.keyCode === 69 ||
				// e.keyCode === 190 ||
				e.keyCode === 187 ||
				e.keyCode === 189;
		}
		return checkIfNum && e.preventDefault();
	};

	useEffect(() => {
		getPhoenixdaoMarket();
	}, []);

	const getPhoenixdaoMarket = async () => {
		fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
		)
			.then((res) => res.json())
			.then((data) => {
				// this.setState({ PhoenixDAO_market: data.phoenixdao });
				setPhoenixDAO_market(data.phoenixdao);
			})
			.catch(console.log);
	};

	//next button steeper
	const handleNext = (fields) => {
		const filter = new badWords();
		let badEventName = filter.clean(fields.eventName);
		fields.eventName = badEventName;
		let badEventOrg = filter.clean(fields.eventOrganizer);
		fields.eventOrganizer = badEventOrg;

		if (activeStep === 0) {
			//first stepper conditions - eventName, eventOrg, eventdate&time
			setTimeError({ isError: false, message: "" });
			setDateError({ isError: false, message: "" });
			setEndTimeError({ isError: false, message: "" });

			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			if (fields.eventTime === "onedayevent") {
				let eventDateOneDay = fields.eventDate;
				let eventStartTimeOneday = fields.eventStartTime;
				let eventEndTimeOneday = fields.eventEndTime;

				eventDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
				eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
				eventStartTimeOneday.setDate(eventDateOneDay.getDate());

				var today = new Date();
				today.setHours(today.getHours() + 3);
				if (eventStartTimeOneday <= today) {
					setTimeError({
						isError: true,
						message: "Event should be after 3 Hours.",
					});
				} else {
					if (eventEndTimeOneday) {
						eventEndTimeOneday.setFullYear(
							eventDateOneDay.getFullYear()
						);
						eventEndTimeOneday.setMonth(eventDateOneDay.getMonth());
						eventEndTimeOneday.setDate(eventDateOneDay.getDate());
						if (eventStartTimeOneday < eventEndTimeOneday) {
							fields.eventDate = eventDateOneDay;
							fields.eventStartTime = eventStartTimeOneday;
							fields.eventEndTime = eventEndTimeOneday;
							onFieldsChange(fields);
							onStepsChange("inc");
						} else {
							// alert("End Time should greater than Start Time");
							setEndTimeError({
								isError: true,
								message:
									"End Time should greater than Start Time.",
							});
						}
					} else {
						fields.eventDate = eventDateOneDay;
						fields.eventStartTime = eventStartTimeOneday;
						onFieldsChange(fields);
						onStepsChange("inc");
					}
				}
			} else {
				let eventDateOneDay = fields.eventStartDate;
				let eventEndDateOneDay = fields.eventEndDate;
				let eventStartTimeOneday = fields.eventStartTime;
				let eventEndTimeOneday = fields.eventEndTime;
				//change date timing
				eventDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				eventEndDateOneDay.setHours(
					eventStartTimeOneday.getHours(),
					eventStartTimeOneday.getMinutes(),
					eventStartTimeOneday.getSeconds(),
					0
				);
				//change timing unix date
				eventStartTimeOneday.setFullYear(eventDateOneDay.getFullYear());
				eventStartTimeOneday.setMonth(eventDateOneDay.getMonth());
				eventStartTimeOneday.setDate(eventDateOneDay.getDate());
				var today = new Date();
				today.setHours(today.getHours() + 3);
				if (eventStartTimeOneday <= today) {
					setTimeError({
						isError: true,
						message:
							"Event should be after three hours from current time.",
					});
				} else {
					const diffTime = eventEndDateOneDay - eventDateOneDay;
					const diffDays = Math.ceil(
						diffTime / (1000 * 60 * 60 * 24)
					);
					if (diffDays > 0) {
						if (eventEndTimeOneday) {
							eventEndTimeOneday.setFullYear(
								eventDateOneDay.getFullYear()
							);
							eventEndTimeOneday.setMonth(
								eventDateOneDay.getMonth()
							);
							eventEndTimeOneday.setDate(
								eventDateOneDay.getDate()
							);
							//eventStartTimeOneday < eventEndTimeOneday
							if (true) {
								fields.eventStartDate = eventDateOneDay;
								fields.eventEndDateOneDay = eventEndDateOneDay;
								fields.eventStartTime = eventStartTimeOneday;
								fields.eventEndTime = eventEndTimeOneday;
								onFieldsChange(fields);
								onStepsChange("inc");
							} else {
								// alert("End Time should greater than Start Time");
								setEndTimeError({
									isError: true,
									message:
										"End Time should greater than Start Time.",
								});
							}
						} else {
							fields.eventStartDate = eventDateOneDay;
							fields.eventStartTime = eventStartTimeOneday;
							fields.eventEndDateOneDay = eventEndDateOneDay;
							onFieldsChange(fields);
							onStepsChange("inc");
						}
					} else {
						// alert("End Date should greater than Start Date");
						setDateError({
							isError: true,
							message:
								"End date should be greater than start date",
						});
					}
				}
			}
		} else if (activeStep === 1) {
			//2nd stpper - location/link, images, topicI
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
		} else if (activeStep === 2) {
			// 3rd stepper -  event categories (free, single paid, multiple paid)
			// bool token; // false means free
			if (fields.eventCategory === "free") {
				let cat = [];
				let obj = {
					ticketName: "free",
					dollarPrice: "0",
					phnxPrice: "0",
					ticketAvailability:
						fields.ticketAvailability === "unlimited"
							? false
							: true,
					noOfTickets:
						fields.ticketAvailability === "unlimited"
							? "0"
							: fields.noOfTickets,
				};
				cat.push(obj);
				fields.categories = cat;
				fields.token = false; // false means free
				setCategoriesOfTicket(cat);
				setCategoriesOfToken(false);
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else if (fields.eventCategory === "single") {
				let cat = [];
				let obj = {
					ticketName: "single",
					dollarPrice: fields.dollarPrice,
					phnxPrice: fields.phnxPrice,
					ticketAvailability:
						fields.ticketAvailability === "unlimited"
							? false
							: true,
					noOfTickets:
						fields.ticketAvailability === "unlimited"
							? "0"
							: fields.noOfTickets,
				};
				cat.push(obj);
				fields.categories = cat;
				fields.token = true; // false means free
				setCategoriesOfTicket(cat);
				setCategoriesOfToken(true);
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else {
				if (categories.length > 0) {
					let sortedCategories = categories.sort(
						(a, b) =>
							parseFloat(a.dollarPrice) -
							parseFloat(b.dollarPrice)
					);
					fields.categories = sortedCategories;
					fields.token = true; // false means free
					setCategoriesOfTicket(sortedCategories);
					setCategoriesOfToken(true);
					onFieldsChange(fields);
					// setActiveStep((prevActiveStep) => prevActiveStep + 1);
					onStepsChange("inc");
				} else {
				}
			}
		} else if (activeStep === 3) {
			// 4th stepper
			fields.categories = categoriesOfTicket;
			fields.token = categoriesOfToken;
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
			handleCreateEvent();
		} else {
			//publish event
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const maxLengthCheckNumber = (e) => {
		e.target.value = Math.max(0, parseInt(e.target.value))
			.toString()
			.slice(0, 12);
	};

	//back button stepper
	const handleBack = () => {
		// setActiveStep((prevActiveStep) => prevActiveStep - 1);
		onStepsChange("dec");
	};

	const handleImageSelect = (name, index) => {
		const arr = [...images];
		arr[index].name = name;
		setImages([...arr]);
	};

	const handleSaveCatogory = (fields) => {
		let obj = {
			id: ticketCategory,
			ticketName: fields[`ticketName${ticketCategory}`],
			dollarPrice: fields[`dollarPrice${ticketCategory}`],
			phnxPrice: fields[`phnxPrice${ticketCategory}`],
			ticketAvailability:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? false
					: true,
			noOfTickets:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? "0"
					: fields[`noOfTickets${ticketCategory}`],
		};

		// let arr = categories;
		// arr.push(obj);
		upsert(categories, obj);
		setaddAnotherCat(!addAnotherCat);
	};

	function upsert(array, item) {
		const i = array.findIndex((_item) => _item.id === item.id);
		if (i > -1) {
			array[i] = item;
			setCategories([...array]);
		} else {
			array.push(item);
			setCategories([...array]);
		}
	}

	const handleAddAnotherCategory = () => {
		setaddAnotherCat(!addAnotherCat);
		// setTicketCategory(ticketCategory + 10);
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
	};

	const handleDeleteTicketCategory = (data, index, cat) => {
		let arr = categories;
		arr = arr.filter((obj) => obj.id !== cat.id);
		// arr.splice(index, 1);
		setCategories([...arr]);
	};

	const handleEditTicketCategory = (data, index, cat) => {
		setTicketCategory(Math.floor(100000 + Math.random() * 900000));
		setaddAnotherCat(!addAnotherCat);
		setTicketCategory(cat.id);
	};

	const convertDollarToPhnx = (d) => {
		let value = parseFloat(d);
		value = value > 0 ? value : 0;
		let usd = PhoenixDAO_market.usd;
		let phoenixValue = value / usd;

		phoenixValue = phoenixValue.toFixed(5);
		return phoenixValue;
	};

	function isValidDate(d) {
		return d instanceof Date && !isNaN(d);
	}

	function getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Details</h3>
							<Divider light />
							<br />

							<label className={classes.label}>EVENT NAME</label>
							<Controller
								name="eventName"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<TextField
										id="event-name"
										name={name}
										fullWidth
										variant="outlined"
										value={value}
										onBlur={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										onChange={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										error={!!error}
										helperText={
											error ? error.message : null
										}
										inputProps={{ maxLength: 50 }}
									/>
								)}
								rules={{
									required: "Please enter event name.",
									minLength: {
										value: 3,
										message:
											"Event name should contain at least 3 characters.",
									},
									maxLength: {
										value: 50,
										message: "Event name too long.",
									},
								}}
							/>

							<br />
							<br />
							<label className={classes.label}>
								EVENT ORGANIZER
							</label>
							<Controller
								name="eventOrganizer"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<TextField
										id="event-organizer"
										name={name}
										fullWidth
										variant="outlined"
										value={value}
										onChange={(e) => {
											onChange(e);
											onGetRealTimeFields({
												name,
												value: e.target.value,
											});
										}}
										error={!!error}
										helperText={
											error ? error.message : null
										}
										inputProps={{ maxLength: 50 }}
									/>
								)}
								rules={{
									required:
										"Please enter event organizer name.",
									minLength: {
										value: 3,
										message:
											"Event organizer name should contain at least 3 characters.",
									},
									maxLength: {
										value: 50,
										message:
											"Event organizer name too long.",
									},
								}}
							/>

							<br />
							<br />

							<FormControl component="fieldset">
								<Controller
									name="eventTime"
									control={control}
									defaultValue={eventTime}
									render={({
										field: { onChange, value, name },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventTime"
											id="event-time-radio-btn"
											name={name}
											value={value}
											className={classes.radioGroup}
											onChange={(e) => {
												onChange(e);
												setEventTime(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
										>
											<FormControlLabel
												value="onedayevent"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="One day Event"
											/>
											<FormControlLabel
												value="morethanaday"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="More than a day"
											/>
										</RadioGroup>
									)}
									rules={{
										required: "Please select event time.",
									}}
								/>
							</FormControl>

							<br />
							<br />

							{eventTime === "onedayevent" ? (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<div>
											<div>
												<Controller
													name="eventDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => {
														return (
															<span>
																<InputLabel
																	style={{
																		marginBottom:
																			"-7px",
																	}}
																	htmlFor="input-with-icon-adornment"
																>
																	<label
																		className={
																			classes.label
																		}
																	>
																		DATE
																	</label>
																</InputLabel>
																<KeyboardDatePicker
																	fullWidth
																	disableToolbar
																	variant="inline"
																	format="dd-MM-yyyy"
																	margin="normal"
																	id="event-date"
																	name={name}
																	KeyboardButtonProps={{
																		"aria-label":
																			"change date",
																	}}
																	// InputProps={{
																	// 	readOnly: true,
																	// }}
																	inputVariant="outlined"
																	autoOk={
																		true
																	}
																	disablePast
																	placeholder="DD-MM-YYYY"
																	value={
																		value
																	}
																	onChange={(
																		e
																	) => {
																		onChange(
																			e
																		);
																		onGetRealTimeFields(
																			{
																				name,
																				value: e,
																			}
																		);
																	}}
																	error={
																		!!error
																	}
																	helperText={
																		error
																			? error.message
																			: null
																	}
																/>
															</span>
														);
													}}
													rules={{
														required:
															"Please select event date.",
													}}
												/>
											</div>
										</div>

										<br />

										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	START TIME
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="start-time-picker"
																name={name}
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																fullwidth
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	timeError.isError
																}
																helperText={
																	error
																		? error.message
																		: timeError.isError
																		? timeError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event time.",
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	END TIME
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																required={false}
																margin="normal"
																id="end-time-picker"
																name={name}
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																fullwidth
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																// error={!!error}
																// helperText="Don’t have an end time? leave here blank"
																error={
																	!!error ||
																	endTimeError.isError
																}
																helperText={
																	error
																		? error.message
																		: endTimeError.isError
																		? endTimeError.message
																		: "Don’t have an end time? leave here blank"
																}
																FormHelperTextProps={{
																	classes: {
																		root: classes.timeHelperText,
																	},
																}}
															/>
														</span>
													)}
													rules={{
														required: false,
														// "Please select event end time.",
													}}
												/>
											</Grid>
										</Grid>
									</MuiPickersUtilsProvider>
								</div>
							) : (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	START DATE
																</label>
															</InputLabel>
															<KeyboardDatePicker
																className={
																	classes.timeAndDate
																}
																disableToolbar
																variant="inline"
																format="dd-MM-yyyy"
																margin="normal"
																id="event-start-date-picker-inline"
																name={name}
																placeholder="DD-MM-YYYY"
																// InputProps={{
																// 	readOnly: true,
																// }}
																// label="START DATE"
																// value={startDate}
																// onChange={(d) =>
																// 	setStartDate(d)
																// }
																KeyboardButtonProps={{
																	"aria-label":
																		"change date",
																}}
																inputVariant="outlined"
																autoOk={true}
																disablePast
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={!!error}
																helperText={
																	error
																		? error.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event start date.",
													}}
												/>
											</Grid>

											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	END DATE
																</label>
															</InputLabel>
															<KeyboardDatePicker
																className={
																	classes.timeAndDate
																}
																disableToolbar
																variant="inline"
																format="dd-MM-yyyy"
																margin="normal"
																name={name}
																id="event-end-date-picker-inline"
																// label="END DATE"
																// value={endDate}
																// onChange={(d) => setEndDate(d)}
																// InputProps={{
																// 	readOnly: true,
																// }}
																KeyboardButtonProps={{
																	"aria-label":
																		"change date",
																}}
																inputVariant="outlined"
																placeholder="DD-MM-YYYY"
																autoOk={true}
																disablePast
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	dateError.isError
																}
																helperText={
																	error
																		? error.message
																		: dateError.isError
																		? dateError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event end date.",
													}}
												/>
											</Grid>
										</Grid>

										<br />

										<Grid container spacing={6}>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
											>
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	FROM
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="event-start-time-picker"
																name={name}
																// label="TO"
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																error={
																	!!error ||
																	timeError.isError
																}
																helperText={
																	error
																		? error.message
																		: timeError.isError
																		? timeError.message
																		: null
																}
															/>
														</span>
													)}
													rules={{
														required:
															"Please select event start time.",
													}}
												/>
											</Grid>

											<span>
												<InputLabel
													style={{
														marginBottom: "-7px",
													}}
													htmlFor="input-with-icon-adornment"
												>
													<label
														className={
															classes.label
														}
													>
														DATE
													</label>
												</InputLabel>
												<KeyboardDatePicker
													fullWidth
													disableToolbar
													variant="inline"
													format="dd-MM-yyyy"
													margin="normal"
													id="event-date"
													name="eventDate"
													KeyboardButtonProps={{
														"aria-label":
															"change date",
													}}
													// InputProps={{
													// 	readOnly: true,
													// }}
													inputVariant="outlined"
													// autoOk={true}
													// disablePast
													placeholder="DD-MM-YYYY"
													value={eventDate}
													onBlur={(e) => {
														handlePickerValue({
															name: "eventDate",
															value: e,
														});
													}}
													onChange={(e) => {
														handlePickerValue({
															name: "eventDate",
															value: e,
														});
													}}
													{...(errors[
														"eventDate"
													] && {
														error: true,
														helperText: errors[
															"eventDate"
														]
															? errors[
																	"eventDate"
															  ]
															: "",
													})}
												/>
											</span>


											<span>
													<InputLabel
														style={{
															marginBottom:
																"-7px",
														}}
														htmlFor="input-with-icon-adornment"
													>
														<label
															className={
																classes.label
															}
														>
															START TIME
														</label>
													</InputLabel>
													<KeyboardTimePicker
														className={
															classes.timeAndDate
														}
														keyboardIcon={
															<AccessTime />
														}
														margin="normal"
														id="start-time-picker"
														name="eventStartTime"
														placeholder="00:00 AM"
														KeyboardButtonProps={{
															"aria-label":
																"change time",
														}}
														// InputProps={{
														// 	readOnly: true,
														// }}
														fullwidth
														inputVariant="outlined"
														// autoOk={true}
														clearable
														value={eventStartTime}
														onBlur={(e) => {
															handlePickerValue({
																name: "eventStartTime",
																value: e,
															});
														}}
														onChange={(e) => {
															handlePickerValue({
																name: "eventStartTime",
																value: e,
															});
														}}
														{...(errors[
															"eventStartTime"
														] && {
															error: true,
															helperText:
																errors[
																	"eventStartTime"
																],
														})}
													/>
												</span>
											<Grid
												item
												xs={12}
												sm={12}
												md={12}
												lg={6}
												className={classes.secondField}
											>
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<span>
															<InputLabel
																style={{
																	marginBottom:
																		"-7px",
																}}
																htmlFor="input-with-icon-adornment"
															>
																<label
																	className={
																		classes.label
																	}
																>
																	TO
																</label>
															</InputLabel>
															<KeyboardTimePicker
																className={
																	classes.timeAndDate
																}
																keyboardIcon={
																	<AccessTime />
																}
																margin="normal"
																id="event-end-time-picker"
																name={name}
																// label="FROM"
																placeholder="00:00 AM"
																KeyboardButtonProps={{
																	"aria-label":
																		"change time",
																}}
																// InputProps={{
																// 	readOnly: true,
																// }}
																inputVariant="outlined"
																autoOk={true}
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e,
																		}
																	);
																}}
																FormHelperTextProps={{
																	classes: {
																		root: classes.timeHelperText,
																	},
																}}
																// helperText="Don’t have an end time? leave here blank"
																// error={!!error}
																error={
																	!!error ||
																	endTimeError.isError
																}
																helperText={
																	error
																		? error.message
																		: endTimeError.isError
																		? endTimeError.message
																		: "Don’t have an end time? leave here blank"
																}
															/>
														</span>
													)}
													rules={{
														required: false,
														// "Please select event end time.",
													}}
												/>
											</Grid>
										</Grid>
									</MuiPickersUtilsProvider>
								</div>
							)}
						</div>
					</React.Fragment>
				);
			case 1:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Details</h3>
							<Divider light />
							<br />
							<FormControl component="fieldset">
								<Controller
									name="eventType"
									control={control}
									defaultValue={type}
									render={({
										field: { onChange, value, name },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventType"
											className={classes.radioGroup}
											name={name}
											id="event-Type"
											value={value}
											onChange={(e) => {
												onChange(e);
												setType(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
										>
											<FormControlLabel
												value="physical"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="Physical Event"
											/>
											<FormControlLabel
												value="online"
												control={
													<Radio
														color="primary"
														icon={
															<img
																src={
																	uncheckedIcon
																}
															/>
														}
														checkedIcon={
															<img
																src={
																	checkedIcon
																}
															/>
														}
													/>
												}
												label="Online Event"
											/>
										</RadioGroup>
									)}
									rules={{
										required: "Please select event type.",
									}}
								/>
							</FormControl>

							<br />
							{type === "physical" ? (
								<div>
									<br />
									<Grid container spacing={2}>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={6}
											xl={4}
											px={2}
										>
											<Controller
												name="country"
												control={control}
												defaultValue={country}
												// value={country}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="country"
														name={name}
														id="country"
														isCountry
														onChange={(v) => {
															onChange(v);
															setState("");
															setCity("");
															setCountry(v.id);
															setFormValue(
																"city",
																""
															);
															setFormValue(
																"state",
																""
															);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select country.",
												}}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={6}
											xl={4}
											px={2}
										>
											<Controller
												name="state"
												control={control}
												defaultValue={state}
												// value={state}
												className={
													classes.selectBoxMaxWidth
												}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="state"
														name={name}
														id="state"
														onChange={(v) => {
															onChange(v);
															setState(v.id);
															setCity("");
															setFormValue(
																"city",
																""
															);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														geoId={country}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select state.",
												}}
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={12}
											xl={4}
										>
											<Controller
												name="city"
												control={control}
												defaultValue={city}
												// value={city}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<GeoLocation
														locationTitle="city"
														name={name}
														id="city"
														onChange={(v) => {
															onChange(v);
															setCity(v.id);
															onGetRealTimeFields(
																{
																	name,
																	value: v,
																}
															);
														}}
														error={error}
														geoId={state}
														value={value}
													/>
												)}
												rules={{
													required:
														"Please select city.",
												}}
											/>
										</Grid>
									</Grid>
									<br />
									<label className={classes.label}>
										EVENT LOCATION
									</label>
									<Controller
										name="eventLocation"
										control={control}
										defaultValue=""
										render={({
											field: { onChange, value, name },
											fieldState: { error },
										}) => (
											<TextField
												id="event-location"
												name={name}
												fullWidth
												variant="outlined"
												value={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												error={!!error}
												helperText={
													error ? error.message : null
												}
												inputProps={{ maxLength: 300 }}
											/>
										)}
										rules={{
											required:
												"Please enter event location.",
											minLength: {
												value: 3,
												message:
													"Event location should contain at least 3 characters.",
											},
											maxLength: {
												value: 300,
												message:
													"Event location too long.",
											},
										}}
									/>
								</div>
							) : (
								<div>
									<label className={classes.label}>
										EVENT LINK
									</label>
									<Controller
										name="eventLink"
										control={control}
										defaultValue=""
										render={({
											field: { onChange, value, name },
											fieldState: { error },
										}) => (
											<TextField
												id="event-link"
												name={name}
												fullWidth
												variant="outlined"
												value={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												error={!!error}
												helperText={
													error ? error.message : null
												}
											/>
										)}
										rules={{
											required:
												"Please enter event link.",
											pattern: {
												value: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
												message: "Is Not Valid URL",
											},
										}}
									/>
								</div>
							)}
							{images.slice(0, 3).map((img, index) => {
								return (
									<div key={index}>
										<br />

										<label className={classes.label}>
											COVER IMAGE {index + 1}
										</label>

										<Controller
											name={`image${index}`}
											control={control}
											defaultValue=""
											render={({
												field: {
													onChange,
													value,
													name,
												},
												fieldState: { error },
											}) => (
												<TextField
													variant="outlined"
													id={name}
													name={name}
													fullWidth
													disabled
													value={img.name}
													error={!!error}
													placeholder="Select Image"
													helperText={
														error
															? error.message
															: null
													}
													InputProps={{
														endAdornment: (
															<Button
																component="label"
																style={{
																	padding:
																		"15px 25px",
																	background:
																		"#FFF9E5",
																	left: "13px",
																	textTransform:
																		"capitalize",
																}}
															>
																Browse
																<input
																	type="file"
																	hidden
																	multiple={
																		false
																	}
																	accept="image/*"
																	onChange={(
																		event
																	) => {
																		if (
																			event
																				.target
																				.files &&
																			event
																				.target
																				.files[0]
																		) {
																			if (
																				event
																					.target
																					.files[0]
																					.size <
																				5000000
																			) {
																				handleImageSelect(
																					event
																						.target
																						.files[0]
																						.name,
																					index
																				);
																				onChange(
																					event
																						.target
																						.files[0]
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: event
																							.target
																							.files[0],
																					}
																				);
																			} else {
																				handleImageSelect(
																					"",
																					index
																				);
																				onChange(
																					""
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: "",
																					}
																				);
																			}
																		} else {
																			if (
																				value
																			) {
																				handleImageSelect(
																					value.name,
																					index
																				);
																				onChange(
																					value
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: value,
																					}
																				);
																			} else {
																				handleImageSelect(
																					"",
																					index
																				);
																				onChange(
																					""
																				);
																				onGetRealTimeFields(
																					{
																						name,
																						value: "",
																					}
																				);
																			}
																		}
																	}}
																/>
															</Button>
														),
													}}
												/>
											)}
											rules={{
												required:
													"Please select an image less than 5MB.",
											}}
										/>

										{index === 0 ? (
											<p
												style={{
													color: "#73727D",
													fontSize: 14,
													fontWeight: 400,
													paddingTop: "10px",
													marginBottom: 0,
												}}
											>
												Max: 3 Pictures. Not greater
												than 5MB (Recommended 1000px *
												1000px)
											</p>
										) : null}
									</div>
								);
							})}

							<br />

							<Button
								disabled={images.length > 3 ? true : false}
								variant="outlined"
								fullWidth
								className={classes.addAnotherImageBtn}
								startIcon={<AddIcon fontSize="large" />}
								onClick={() => {
									setImages([
										...images.slice(0, 6),
										{ name: "" },
									]);
								}}
							>
								Add another Image
							</Button>

							<br />
							<br />

							<label className={classes.label}>TOPIC</label>
							<Controller
								name="eventTopic"
								control={control}
								defaultValue=""
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										variant="outlined"
										fullWidth
										className={classes.formControl}
										error={!!error}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="event-topic"
											name={name}
											fullWidth
											value={value}
											onChange={(e) => {
												onChange(e);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
											displayEmpty
											className={classes.menuPaper}
											MenuProps={{
												classes: {
													paper: classes.menuPaper,
												},
											}}
										>
											<MenuItem
												disabled
												value=""
												style={{
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												<em>Topic</em>
											</MenuItem>
											{Object.entries(eventTopics).map(
												(topic) => (
													<MenuItem
														key={topic[1].name}
														value={topic[1].slug}
														style={{
															fontFamily:
																"'Aeonik', sans-serif",
														}}
													>
														{topic[1].name}
													</MenuItem>
												)
											)}
										</Select>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required: "Please select event topic.",
								}}
							/>
						</div>
					</React.Fragment>
				);
			case 2:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Tickets</h3>
							<Divider light />
							<br />
							<label className={classes.label}>CATEGORY</label>
							<Controller
								name="eventCategory"
								control={control}
								defaultValue={category}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										variant="outlined"
										fullWidth
										// className={classes.formControl}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="event-category"
											name={name}
											value={value}
											onChange={(e) => {
												onChange(e);
												setCategory(e.target.value);
												onGetRealTimeFields({
													name,
													value: e.target.value,
												});
											}}
											fullWidth
											className={classes.dropdownMenu}
										>
											<MenuItem value="free">
												Free Event
											</MenuItem>
											<MenuItem value="single">
												{`Paid (Single Ticket Type Event)`}
											</MenuItem>
											<MenuItem value="multiple">{`Paid (Multiple Ticket Type Event)`}</MenuItem>
										</Select>
									</FormControl>
								)}
								rules={{
									required: "Please select event category.",
								}}
							/>

							<br />
							<br />

							{/* conditonal rendering for event category - free - single_paid - multiple-paid */}
							<div>
								{category === "free" ? (
									<div>
										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<Controller
												name="ticketAvailability"
												control={control}
												defaultValue={availability}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name={name}
														id="ticket-availability"
														value={value}
														className={
															classes.radioGroup
														}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
															onGetRealTimeFields(
																{
																	name: "ticketAvailabilityPreview",
																	value: e
																		.target
																		.value,
																}
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Limited Tickets"
														/>
													</RadioGroup>
												)}
												rules={{
													required:
														"Please select event availability.",
												}}
											/>
										</FormControl>
										{availability === "unlimited" ? null : (
											<div>
												<label
													className={classes.label}
												>
													NUMBER OF TICKETS
												</label>
												<Controller
													name="noOfTickets"
													control={control}
													defaultValue=""
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															onInput={
																maxLengthCheckNumber
															}
															type="number"
															id="no-of-tickets"
															name={name}
															fullWidth
															variant="outlined"
															value={value}
															onChange={(e) => {
																onChange(e);
																onGetRealTimeFields(
																	{
																		name: "noOfTicketsPreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: null
															}
														/>
													)}
													rules={{
														required:
															"Please enter number of tickets.",
														min: {
															value: 1,
															message:
																"Number of ticket should be at least 1",
														},
														maxLength: {
															value: 12,
															message:
																"Number of ticket is too large.",
														},
													}}
												/>
											</div>
										)}
									</div>
								) : category === "single" ? (
									<div>
										<br />
										<div
											className={
												classes.ticketPriceContainer
											}
										>
											{/* single_ticket_cateogry */}
											<Controller
												name="dollarPrice"
												control={control}
												defaultValue=""
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<span>
														<InputLabel htmlFor="input-with-icon-adornment">
															<label
																className={
																	classes.label
																}
															>
																TICKET PRICE
															</label>
														</InputLabel>
														<TextField
															className={
																classes.margin
															}
															onKeyDown={
																formatInputDollarPrice
															}
															id="dollar-price"
															name={name}
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<Button
																				component="label"
																				style={{
																					padding:
																						"15px 15px",
																					background:
																						"#F2F2FD",
																					left: "-13px",
																				}}
																			>
																				<img
																					src={
																						dollarIcon
																					}
																					alt="dollar sign"
																				/>
																			</Button>
																		</InputAdornment>
																	),
																inputProps: {
																	min: 0,
																},
																classes: {},
															}}
															value={value}
															onChange={(e) => {
																onChange(e);
																setFormValue(
																	"phnxPrice",
																	convertDollarToPhnx(
																		e.target
																			.value
																	)
																);
																onGetRealTimeFields(
																	{
																		name: "dollarPricePreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: " "
															}
														/>
													</span>
												)}
												rules={{
													required:
														"Enter price in dollars.",
													maxLength: {
														value: 12,
														message:
															"Ticket price is too large.",
													},
												}}
											/>

											<div
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<img
													src={altIcon}
													alt="alt icon"
													className={classes.altImage}
												/>
											</div>

											{/* single_ticket_cateogry */}
											<Controller
												name="phnxPrice"
												control={control}
												defaultValue=""
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<span>
														<InputLabel htmlFor="input-with-icon-adornment">
															<span>&nbsp;</span>
														</InputLabel>
														<TextField
															className={
																classes.margin
															}
															disabled
															id="phnx-price"
															name={name}
															onKeyDown={
																formatInputDollarPrice
															}
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<Button
																				component="label"
																				style={{
																					padding:
																						"15px 15px",
																					background:
																						"#F2F2FD",
																					left: "-13px",
																				}}
																			>
																				<img
																					src={
																						phnxLogo
																					}
																					alt="phnx logo"
																				/>
																			</Button>
																		</InputAdornment>
																	),
															}}
															value={value}
															onChange={(e) => {
																onChange(e);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: " "
															}
														/>
													</span>
												)}
												rules={{
													required: false,
												}}
											/>
										</div>

										<br />

										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<Controller
												name="ticketAvailability"
												control={control}
												defaultValue={availability}
												render={({
													field: {
														onChange,
														value,
														name,
													},
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name={name}
														id="ticket-availability"
														className={
															classes.radioGroup
														}
														value={value}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
															onGetRealTimeFields(
																{
																	name: "ticketAvailabilityPreview",
																	value: e
																		.target
																		.value,
																}
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio
																	color="primary"
																	icon={
																		<img
																			src={
																				uncheckedIcon
																			}
																		/>
																	}
																	checkedIcon={
																		<img
																			src={
																				checkedIcon
																			}
																		/>
																	}
																/>
															}
															label="Limited Tickets"
														/>
													</RadioGroup>
												)}
												rules={{
													required:
														"Please select event availability.",
												}}
											/>
										</FormControl>
										{availability === "unlimited" ? null : (
											<div>
												<label
													className={classes.label}
												>
													NUMBER OF TICKETS
												</label>
												<Controller
													name="noOfTickets"
													control={control}
													defaultValue=""
													render={({
														field: {
															onChange,
															value,
															name,
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															onInput={
																maxLengthCheckNumber
															}
															type="number"
															id="no-of-tickets"
															name={name}
															// label="Event Organizer"
															fullWidth
															variant="outlined"
															value={value}
															onChange={(e) => {
																onChange(e);
																onGetRealTimeFields(
																	{
																		name: "noOfTicketsPreview",
																		value: e
																			.target
																			.value,
																	}
																);
															}}
															error={!!error}
															helperText={
																error
																	? error.message
																	: null
															}
														/>
													)}
													rules={{
														required:
															"Please enter number of tickets.",

														min: {
															value: 1,
															message:
																"Number of ticket should be at least 1",
														},
														maxLength: {
															value: 12,
															message:
																"Number of ticket is too large.",
														},
													}}
												/>
											</div>
										)}
									</div>
								) : (
									<div>
										{/*paid multiple - ticket category box*/}
										{categories.map((cat, index) => {
											return (
												<div
													key={index}
													style={{ marginBottom: 20 }}
												>
													<Grid container>
														<Grid
															className={
																classes.ticketCard
															}
															container
															item
															xs={10}
															sm={10}
															md={11}
															lg={11}
															xl={11}
															justify="space-between"
															direction="row"
														>
															<Grid
																item
																direction="column"
																xs={12}
																sm={12}
																md={9}
																lg={9}
																xl={9}
															>
																<p
																	className={
																		classes.ticketNameCat
																	}
																>
																	{
																		cat.ticketName
																	}
																	{` Ticket`}
																</p>
																<p
																	className={
																		classes.ticketAvailabilityCat
																	}
																>
																	{cat.ticketAvailability
																		? cat.noOfTickets
																		: `Unlimited  Tickets`}
																</p>
															</Grid>
															<Grid
																xs={12}
																sm={12}
																md={3}
																lg={3}
																xl={3}
																item
																direction="column"
																style={{
																	textAlign:
																		"end",
																}}
															>
																<p
																	className={
																		classes.dollarPriceCat
																	}
																	title={
																		"$" +
																		cat.dollarPrice
																	}
																>
																	{
																		// cat.dollarPrice
																		pricingFormatter(
																			cat.dollarPrice,
																			"$"
																		)
																	}
																</p>
																<p
																	className={
																		classes.phnxPriceCat
																	}
																	title={
																		cat.phnxPrice +
																		" PHNX"
																	}
																>
																	{
																		// cat.phnxPrice
																		pricingFormatter(
																			cat.phnxPrice,
																			"PHNX"
																		)
																	}
																</p>
															</Grid>
														</Grid>
														<Grid
															item
															container
															xs={2}
															sm={2}
															md={1}
															lg={1}
															xl={1}
															direction="column"
															justify="space-evenly"
															alignContent="flex-start"
														>
															<Grid item>
																<Button
																	onClick={handleSubmit(
																		(
																			data
																		) =>
																			handleEditTicketCategory(
																				data,
																				index,
																				cat
																			)
																	)}
																	style={{
																		justifyContent:
																			"center",
																	}}
																>
																	<img
																		src={
																			editIcon
																		}
																		alt="editIcon"
																	/>
																</Button>
															</Grid>
															<Grid item>
																<Button
																	onClick={handleSubmit(
																		(
																			data
																		) =>
																			handleDeleteTicketCategory(
																				data,
																				index,
																				cat
																			)
																	)}
																	style={{
																		justifyContent:
																			"center",
																	}}
																>
																	<img
																		src={
																			deleteIcon
																		}
																		alt="deleteIcon"
																	/>
																</Button>
															</Grid>
														</Grid>
													</Grid>
												</div>
											);
										})}

										{/* for adding new category */}
										{!addAnotherCat ? (
											<div>
												<form
													onSubmit={handleSubmit(
														handleSaveCatogory
													)}
												>
													<label
														className={
															classes.label
														}
													>
														TICKET NAME
													</label>
													<Controller
														name={`ticketName${ticketCategory}`}
														control={control}
														defaultValue=""
														render={({
															field: {
																onChange,
																value,
																name,
															},
															fieldState: {
																error,
															},
														}) => (
															<TextField
																id={name}
																name={name}
																fullWidth
																variant="outlined"
																value={value}
																onChange={(
																	e
																) => {
																	onChange(e);
																	onGetRealTimeFields(
																		{
																			name,
																			value: e
																				.target
																				.value,
																		}
																	);
																}}
																error={!!error}
																helperText={
																	error
																		? error.message
																		: null
																}
																inputProps={{
																	maxLength: 50,
																}}
															/>
														)}
														rules={{
															required:
																"Please enter ticket name.",
															minLength: {
																value: 3,
																message:
																	"Ticket name should contain at least 3 characters.",
															},
															maxLength: {
																value: 50,
																message:
																	"Ticket name too long.",
															},
														}}
													/>

													<br />
													<br />

													<br />
													<div
														className={
															classes.ticketPriceContainer
														}
													>
														<Controller
															name={`dollarPrice${ticketCategory}`}
															control={control}
															defaultValue=""
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<span>
																	<InputLabel htmlFor="input-with-icon-adornment">
																		{/* <span>
																			&nbsp;
																		</span> */}
																		<label
																			className={
																				classes.label
																			}
																		>
																			TICKET
																			PRICE
																		</label>
																	</InputLabel>
																	<TextField
																		className={
																			classes.margin
																		}
																		id={
																			name
																		}
																		name={
																			name
																		}
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<Button
																							component="label"
																							style={{
																								padding:
																									"15px 15px",
																								background:
																									"#F2F2FD",
																								left: "-13px",
																							}}
																						>
																							<img
																								src={
																									dollarIcon
																								}
																								alt="dollar sign"
																							/>
																						</Button>
																					</InputAdornment>
																				),

																			inputProps:
																				{
																					min: 0,
																				},
																		}}
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																			setFormValue(
																				`phnxPrice${ticketCategory}`,
																				convertDollarToPhnx(
																					e
																						.target
																						.value
																				)
																			);
																			onGetRealTimeFields(
																				{
																					name: "dollarPricePreview",
																					value: e
																						.target
																						.value,
																				}
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: " "
																		}
																	/>
																</span>
															)}
															rules={{
																required:
																	"Enter price in dollars.",
																maxLength: {
																	value: 12,
																	message:
																		"Ticket price is too large.",
																},
															}}
														/>

														<div
															style={{
																display: "flex",
																justifyContent:
																	"center",
																alignItems:
																	"center",
															}}
														>
															<img
																src={altIcon}
																alt="alt icon"
																className={
																	classes.altImage
																}
															/>
														</div>

														<Controller
															name={`phnxPrice${ticketCategory}`}
															control={control}
															defaultValue=""
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<span>
																	<InputLabel htmlFor="input-with-icon-adornment">
																		<span>
																			&nbsp;
																		</span>
																	</InputLabel>
																	<TextField
																		className={
																			classes.margin
																		}
																		disabled
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		id={
																			name
																		}
																		name={
																			name
																		}
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<Button
																							component="label"
																							style={{
																								padding:
																									"15px 15px",
																								background:
																									"#F2F2FD",
																								left: "-13px",
																							}}
																						>
																							<img
																								src={
																									phnxLogo
																								}
																								alt="phnx logo"
																							/>
																						</Button>
																					</InputAdornment>
																				),
																			inputProps:
																				{
																					min: 0,
																				},
																		}}
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: " "
																		}
																	/>
																</span>
															)}
															rules={{
																required: false,
															}}
														/>
													</div>

													<br />

													<FormControl component="fieldset">
														<label
															className={
																classes.label
															}
														>
															TICKET AVAILABILITY
														</label>
														<Controller
															name={`ticketAvailability${ticketCategory}`}
															control={control}
															defaultValue={
																availability
															}
															render={({
																field: {
																	onChange,
																	value,
																	name,
																},
																fieldState: {
																	error,
																},
															}) => (
																<RadioGroup
																	row
																	aria-label="ticketAvailability"
																	name={name}
																	id={name}
																	className={
																		classes.radioGroup
																	}
																	value={
																		value
																	}
																	onChange={(
																		e
																	) => {
																		onChange(
																			e
																		);
																		setAvailability(
																			e
																				.target
																				.value
																		);
																		onGetRealTimeFields(
																			{
																				name: "ticketAvailabilityPreview",
																				value: e
																					.target
																					.value,
																			}
																		);
																	}}
																>
																	<FormControlLabel
																		value="unlimited"
																		control={
																			<Radio
																				color="primary"
																				icon={
																					<img
																						src={
																							uncheckedIcon
																						}
																					/>
																				}
																				checkedIcon={
																					<img
																						src={
																							checkedIcon
																						}
																					/>
																				}
																			/>
																		}
																		label="Unlimited Tickets"
																	/>
																	<FormControlLabel
																		value="limited"
																		control={
																			<Radio
																				color="primary"
																				icon={
																					<img
																						src={
																							uncheckedIcon
																						}
																					/>
																				}
																				checkedIcon={
																					<img
																						src={
																							checkedIcon
																						}
																					/>
																				}
																			/>
																		}
																		label="Limited Tickets"
																	/>
																</RadioGroup>
															)}
															rules={{
																required:
																	"Please select event availability.",
															}}
														/>
													</FormControl>
													{availability ===
													"unlimited" ? null : (
														<div>
															<label
																className={
																	classes.label
																}
															>
																NUMBER OF
																TICKETS
															</label>
															<Controller
																name={`noOfTickets${ticketCategory}`}
																control={
																	control
																}
																defaultValue=""
																render={({
																	field: {
																		onChange,
																		value,
																		name,
																	},
																	fieldState:
																		{
																			error,
																		},
																}) => (
																	<TextField
																		id={
																			name
																		}
																		name={
																			name
																		}
																		// label="Event Organizer"
																		onKeyDown={
																			formatInputNoOfTickets
																		}
																		onInput={
																			maxLengthCheckNumber
																		}
																		type="number"
																		fullWidth
																		variant="outlined"
																		value={
																			value
																		}
																		onChange={(
																			e
																		) => {
																			onChange(
																				e
																			);
																			onGetRealTimeFields(
																				{
																					name: "noOfTicketsPreview",
																					value: e
																						.target
																						.value,
																				}
																			);
																		}}
																		error={
																			!!error
																		}
																		helperText={
																			error
																				? error.message
																				: null
																		}
																	/>
																)}
																rules={{
																	required:
																		"Please enter number of tickets.",
																	min: {
																		value: 1,
																		message:
																			"Number of ticket should be at least 1",
																	},
																	maxLength: {
																		value: 12,
																		message:
																			"Number of ticket is too large.",
																	},
																}}
															/>
														</div>
													)}

													<br />

													{/* save button */}
													<Button
														color="primary"
														variant="outlined"
														fullWidth
														className={
															classes.addAnotherImageBtn
														}
														type="submit"
													>
														Save
													</Button>
												</form>
												<br />
											</div>
										) : (
											<div style={{ marginTop: 35 }}>
												<Button
													variant="outlined"
													fullWidth
													className={
														classes.addAnotherImageBtn
													}
													startIcon={
														<AddIcon fontSize="large" />
													}
													onClick={
														handleAddAnotherCategory
													}
												>
													Add another Ticket Category
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
							<br />
							<Controller
								name="restrictWallet"
								control={control}
								defaultValue={false}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControlLabel
										control={
											<Checkbox
												icon={
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
												}
												checked={value}
												onChange={(e) => {
													onChange(e);
													onGetRealTimeFields({
														name,
														value: e.target.value,
													});
												}}
												name={name}
												id="restrict-wallet"
												color="primary"
											/>
										}
										label={
											<span
												style={{
													// fontSize: 20,
													fontWeight: 400,
													color: "#1E1E22",
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												Restrict Wallet Address to one
												Ticket
											</span>
										}
									/>
								)}
								rules={{
									required: false,
								}}
							/>
						</div>
					</React.Fragment>
				);
			case 3:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Description</h3>
							<Divider light />
							<br />
							<label className={classes.label}>
								EVENT DESCRIPTION
							</label>
							<br />

							<Controller
								name="eventDescription"
								control={control}
								defaultValue="<p><br></p>"
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										error={!!error}
										component="fieldset"
										className={classes.formControlDesc}
									>
										<BodyTextEditor
											value={value}
											setValue={(bodyText) => {
												onChange(bodyText);
												// setEventDesc(bodyText);
												onGetRealTimeFields({
													name,
													value: bodyText,
												});
											}}
											readOnly={false}
											name={name}
											id="event-description"
										/>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required: "Please enter event details.",
									minLength: {
										value: 500,
										message:
											"Event description is too short.",
									},
								}}
							/>
							<br />
							<Controller
								name="termsAndConditions"
								control={control}
								defaultValue={false}
								render={({
									field: { onChange, value, name },
									fieldState: { error },
								}) => (
									<FormControl
										required
										error={!!error}
										component="fieldset"
									>
										<FormControlLabel
											control={
												<Checkbox
													icon={
														<img
															src={uncheckedIcon}
														/>
													}
													checkedIcon={
														<img
															src={checkedIcon}
														/>
													}
													checked={value}
													onChange={(e) => {
														onChange(e);
														onGetRealTimeFields({
															name,
															value: e.target
																.value,
														});
													}}
													name={name}
													id="terms-and-conditions"
													color="primary"
												/>
											}
											// label="By creating an event, I agree to the policies and terms of use."

											label={
												<span
													style={{
														// fontSize: 20,
														fontWeight: 400,
														color: "#1E1E22",
														fontFamily:
															"'Aeonik', sans-serif",
													}}
												>
													By creating an event, I
													agree to the{" "}
													<a
														target="_blank"
														href="/terms-and-conditions"
													>
														policies and terms of
														use
													</a>
													.
												</span>
											}
										/>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required:
										"Please agree to all the terms and conditions before creating an event.",
								}}
							/>
						</div>
					</React.Fragment>
				);
			default:
				return (
					<React.Fragment>
						<div>
							<p>Unknown stepIndex</p>
						</div>
					</React.Fragment>
				);
		}
	}

	// flaming stepper
	function getFlamingSteps() {
		return ["Upload Data", "Confirm Transaction", "Publish Event"];
	}

	function getFlamingStepContent(step) {
		switch (step) {
			case 0:
				return "One Moment we are Uploading your Data";
			case 1:
				return "Data Uploaded Successfully";
			case 2:
				return "Transaction Confirmed";
			case 3:
				return "Event Published";
			default:
				return "Unknown step";
		}
	}

	const publishedEventComponent = () => {
		return (
			<div className={classes.publishedEventContainer}>
				<img
					src={GoldonBlue}
					width={154}
					height={188}
					alt="flaming..."
				/>
				<br />
				{!!progressText && (
					<p className={classes.progressTextStyle}>{progressText}%</p>
				)}
				<br />
				<div>
					<p className={classes.flamingStepContent}>
						{getFlamingStepContent(activeFlamingStep)}
					</p>
				</div>
				<Stepper activeStep={activeFlamingStep} orientation="vertical">
					{flamingSteps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
		);
	};

	return (
		<div
			className={
				activeFlamingStep == 3 ? classes.publishedRoot : classes.root
			}
		>
			{activeStep === steps.length ? null : (
				<Stepper
					activeStep={activeStep}
					alternativeLabel
					className={classes.step}
				>
					{steps.map((label, i) => (
						<Step key={i}>
							<StepLabel className={classes.stepperCircle}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			)}
			<div
				className={
					activeFlamingStep == 3
						? classes.mainStepperContainerForPublishPage
						: classes.mainStepperContainer
				}
			>
				<br />
				{activeStep === steps.length ? (
					<div>
						{activeFlamingStep === flamingSteps.length ? (
							<div className={classes.activeFlamingStepStyle}>
								<img
									src={Checkmark}
									width={238}
									height={238}
									alt="hurray"
								/>
								<br />
								<p
									style={{
										fontSize: 32,
										fontWeight: 700,
										color: "#413AE2",
									}}
								>
									Hurray, Event Published
								</p>
								<br />
								<Typography
									gutterBottom
									className={classes.eventUrl}
								>
									Event URL
								</Typography>
								<FormControl
									variant="outlined"
									className={classes.UrlField}
								>
									<TextField
										id="outlined-helperText"
										label=""
										value={shareUrl}
										defaultValue={shareUrl}
										variant="outlined"
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<CopyToClipboard
														text={shareUrl}
														onCopy={onCopyText}
													>
														<IconButton
															className={
																classes.copyButton
															}
															aria-label="copy text"
														>
															<span
																style={
																	isCopied
																		? {
																				fontSize:
																					"14px",
																		  }
																		: {
																				color: "#413AE2",
																		  }
																}
															>
																{isCopied ? (
																	"Copied!"
																) : (
																	<i class="far fa-copy fa-md"></i>
																)}
															</span>
														</IconButton>
													</CopyToClipboard>
												</InputAdornment>
											),
										}}
									/>
								</FormControl>

								<Grid
									lg={12}
									item
									className={classes.SocialMediaDiv}
								>
									<SocialMedia
										shareUrl={shareUrl}
										disabled={false}
									/>
								</Grid>
								<h5 className={classes.share}>
									Share on Social Media
								</h5>
								<br />
								<br />
								<Button
									color="primary"
									size="large"
									variant="contained"
									startIcon={
										<VisibilityOutlinedIcon fontSize="large" />
									}
									className={classes.viewButton}
									onClick={() => history.push("/myevents/1")}
								>
									View your Event
								</Button>
							</div>
						) : (
							publishedEventComponent()
						)}
					</div>
				) : (
					<div>
						<div>{getStepContent(activeStep)}</div>

						<br />
						<br />

						<div className={classes.buttonsContainer}>
							{activeStep === 0 ? (
								<span />
							) : (
								<Button
									disabled={activeStep === 0}
									onClick={handleBack}
									className={classes.backButton}
									startIcon={
										<img
											src={arrowbackicon}
											alt="arrowbackicon"
										/>
									}
								>
									Back
								</Button>
							)}

							<Button
								size="large"
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleNext)}
								className={classes.nextButton}
								endIcon={
									activeStep === steps.length - 1 ? null : (
										<img
											src={arrowrighticon}
											alt="arrowrighticon"
										/>
									)
								}
								startIcon={
									activeStep === steps.length - 1 ? (
										<img src={publishIcon} atl="publish" />
									) : null
								}
							>
								{activeStep === steps.length - 1
									? "Publish Event"
									: "Next"}
							</Button>
						</div>
					</div>
				)}
			</div>
			{activeFlamingStep == 3 && (
				<a
					href="https://www.travala.com/?ref=phoenixdao"
					target="_blank"
				>
					<div className={classes.travelImage}>
						<img src={"/images/createEvent.jpg"} alt="travel" />
					</div>
				</a>
			)}
		</div>
	);
};

export default withRouter(MyStepper);
>>>>>>> d4284ba7c117a681d67e372101c7a3818ff18595
