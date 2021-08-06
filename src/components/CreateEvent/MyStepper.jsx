import "date-fns";
import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import AddIcon from "@material-ui/icons/Add";
import eventTopics from "../../config/topics.json";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import RichTextEditor from "react-rte";
import GoldonBlue from "../Images/GoldonBlue.gif";
import clsx from "clsx";
import PropTypes from "prop-types";
import Check from "@material-ui/icons/Check";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { useForm, Controller } from "react-hook-form";
import EventPreviewPage from "./EventPreviewPage";
import phnxLogo from "../Images/phnx.png";
import dollarIcon from "../Images/dollar.png";
import altIcon from "../Images/altIcon.png";
import editIcon from "../Images/editIcon.png";
import deleteIcon from "../Images/deleteIcon.png";
import BodyTextEditor from "../common/BodyTextEditor";
import PublishIcon from "@material-ui/icons/Publish";
import publishIcon from "../Images/publish.png";
import Checkmark from "../Images/Checkmark.gif";
import { withRouter } from "react-router-dom";
import SocialMedia from "../common/SocialMedia";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AccessTime from "@material-ui/icons/AccessTime";
var badWords = require("bad-words");

const ColorlibConnector = withStyles({
	root: {
		width: 50,
		height: 50,
	},
	alternativeLabel: {
		top: 22,
	},
	active: {
		"& $line": {
			backgroundImage:
				"linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
		},
	},
	completed: {
		"& $line": {
			backgroundImage:
				"linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
		},
	},
	line: {
		height: 3,
		border: 0,
		backgroundColor: "#eaeaf0",
		borderRadius: 1,
	},
})(StepConnector);

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		paddingTop: "20px",
		backgroundColor: "white",
		borderRadius: "12px",
		paddingBottom: "50px",
	},
	backButton: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
		color: "#413AE2",
	},
	nextButton: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
		background: "#413AE2",
		color: "white",
	},
	title: {
		color: "#413AE2",
		marginBottom: theme.spacing(1),
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "space-between",
	},
	mainStepperContainer: {
		marginLeft: theme.spacing(5),
		marginRight: theme.spacing(5),
		"& .MuiButton-label": {
			fontFamily: "'Aeonik', sans-serif",
			fontWeight: "500",
		},
		"& .MuiFormControl-root .MuiMenuItem-root": {
			fontFamily: "'Aeonik', sans-serif",
		},
	},
	addAnotherImageBtn: {
		textTransform: "none",
		"&:focus": {
			outline: "none",
		},
	},
	editor: {
		height: 430,
		overflow: "auto",
		zIndex: 2,
	},
	label: {
		color: "#999999",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
	eventUrl: {
		textAlign: "center",
		fontSize: "14px",
		color: "#4E4E55",
	},
	UrlField: {
		width: "100%",
		margin: "0px auto",
	},
	copyButton: {
		"&:focus": {
			outline: "none",
		},
	},
	SocialMediaDiv: {
		margin: "30px 0px 20px",
	},
	step: {
		"& .MuiStepIcon-root text": {
			fontFamily: "'Aeonik', sans-serif",
			// fontSize: "24px",
		},
		"& .MuiStepIcon-root.MuiStepIcon-active": {
			color: "#fff",
			borderRadius: "100%",
			border: "1px solid #CECED2",
		},
		"& .MuiStepIcon-root.MuiStepIcon-active text": {
			fill: "#413AE2",
			fontWeight: "900",
			fontFamily: "'Aeonik', sans-serif",
		},
		// "& .MuiStepIcon-root": {
		// 	height: "48px",
		// 	width: "48px",
		// },
	},
	alternativeLabel: {
		"font-size": "11px",
	},
	alternativeLabelActive: {
		"font-weight": "bold !important",
	},
	stepIcon: {
		transform: "scale(0.5)",
		"font-size": "50px",
		// height: "48px",
		// width: "48px",
	},
	radioGroup: {
		"& .MuiFormControlLabel-label.MuiTypography-body1": {
			fontFamily: "'Aeonik', sans-serif",
		},
	},
	formControlDesc: {
		maxWidth: "100%",
	},
	dropdownMenu: {
		fontFamily: "'Aeonik', sans-serif",
	},
	timeContainer: {
		display: "flex",
		justifyContent: "space-between",
		[theme.breakpoints.between("xs", "sm")]: {
			flexDirection: "column",
		},
	},
	timeAndDate: {
		[theme.breakpoints.between("xs", "sm")]: {
			width: "100%",
		},
	},
	ticketPriceContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		[theme.breakpoints.between("xs", "sm")]: {
			flexDirection: "column",
		},
	},
	altImage: {
		[theme.breakpoints.between("xs", "sm")]: {
			transform: `rotate(90deg)`,
		},
	},
	menuPaper: {
		maxHeight: "200px",
	},
}));

const MyStepper = ({
	handleCreateEvent,
	onFieldsChange,
	onStepsChange,
	activeStep,
	onFlamingStepsChange,
	activeFlamingStep,
	isEventCreated,
	history,
}) => {
	const classes = useStyles();
	const { handleSubmit, control, register } = useForm();

	// const [activeStep, setActiveStep] = useState(0);
	const steps = ["", "", "", ""];
	const [value, setValue] = useState("onedayevent");
	const [eventTime, setEventTime] = useState("onedayevent");
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [selectTime, setSelectTime] = useState(new Date());
	const [type, setType] = useState("physical");
	const [topic, setTopic] = useState("music");
	const [category, setCategory] = useState("free");
	const [availability, setAvailability] = useState("unlimited");
	const [richValue, setRichValue] = useState(
		RichTextEditor.createEmptyValue()
	);
	const [images, setImages] = useState([{ name: "" }]);

	//state object variable
	const [state, setState] = useState({
		eventName: "",
		eventOrganizer: "",
	});

	//state variable
	const [eventName, setEventName] = useState("");
	const [eventOrganizer, setEventOrganizer] = useState("");

	//flaming stepper
	// const [activeFlamingStep, setActiveFlamingStep] = useState(0);
	const flamingSteps = getFlamingSteps();

	//oneday event state & more than a day event
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState([]);
	const [addAnotherCat, setaddAnotherCat] = useState(false);
	const [ticketCategory, setTicketCategory] = useState(0);
	const [PhoenixDAO_market, setPhoenixDAO_market] = useState({});
	const [phnxValue, setPhnxValue] = useState(0);
	const [isCopied, setIsCopied] = useState(false);

	let URL = "https://phoenixdao-events-dapp.herokuapp.com";

	const toolbarConfig = {
		// Optionally specify the groups to display (displayed in the order listed).
		display: [
			"INLINE_STYLE_BUTTONS",
			"BLOCK_TYPE_BUTTONS",
			// "LINK_BUTTONS",
			"BLOCK_TYPE_DROPDOWN",
			"HISTORY_BUTTONS",
		],
		INLINE_STYLE_BUTTONS: [
			{ label: "Bold", style: "BOLD", className: "custom-css-class" },
			{ label: "Italic", style: "ITALIC" },
			{ label: "Underline", style: "UNDERLINE" },
		],
		BLOCK_TYPE_DROPDOWN: [
			{ label: "Normal", style: "unstyled" },
			{ label: "Heading Large", style: "header-one" },
			{ label: "Heading Medium", style: "header-two" },
			{ label: "Heading Small", style: "header-three" },
		],
		BLOCK_TYPE_BUTTONS: [
			{ label: "UL", style: "unordered-list-item" },
			{ label: "OL", style: "ordered-list-item" },
		],
	};

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

	// useEffect(() => {
	// 	onStepsChange(activeStep);
	// }, [activeStep]);

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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	//first stepper date setter
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	//first stepper time setter
	const handleTimeChange = (time) => {
		setSelectTime(time);
	};

	//event type handle
	const handleType = (event) => {
		setType(event.target.value);
	};

	//next button steeper
	const handleNext = (fields) => {
		// console.log("categories", categories);
		const filter = new badWords();

		if (activeStep === 0) {
			//first stepper conditions - eventName, eventOrg, eventdate&time
			const badEventName = filter.clean(fields.eventName);
			fields.eventName = badEventName;
			const badEventOrg = filter.clean(fields.eventOrganizer);
			fields.eventOrganizer = badEventOrg;
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
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
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else if (fields.eventCategory === "single") {
				let cat = [];
				let obj = {
					ticketName: "single",
					dollarPrice: fields.dollarPrice,
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
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			} else {
				fields.categories = categories;
				fields.token = true; // false means free
				onFieldsChange(fields);
				// setActiveStep((prevActiveStep) => prevActiveStep + 1);
				onStepsChange("inc");
			}
		} else if (activeStep === 3) {
			// 4th stepper
			onFieldsChange(fields);
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
			onStepsChange("inc");
			handleCreateEvent();
		} else {
			//publish event
			// setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	//back button stepper
	const handleBack = () => {
		// setActiveStep((prevActiveStep) => prevActiveStep - 1);
		onStepsChange("dec");
	};

	//reset stepper
	const handleReset = () => {
		// setActiveStep(0);
	};

	const onChangeRichText = (value) => {
		console.log("rich value", value);
		setRichValue(value);
	};

	const handleSaveCatogory = (fields) => {
		console.log(fields);
		console.log("ticketCategory", ticketCategory);

		let obj = {
			ticketName: fields[`ticketName${ticketCategory}`],
			dollarPrice: fields[`dollarPrice${ticketCategory}`],
			ticketAvailability:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? false
					: true,
			noOfTickets:
				fields[`ticketAvailability${ticketCategory}`] === "unlimited"
					? "0"
					: fields[`noOfTickets${ticketCategory}`],
		};

		let arr = categories;
		// arr.splice(ticketCategory, 1, obj);

		arr.push(obj);
		console.log("arr", arr);
		setCategories([...arr]);
		setaddAnotherCat(!addAnotherCat);
	};

	const handleAddAnotherCategory = () => {
		setaddAnotherCat(!addAnotherCat);
		setTicketCategory(ticketCategory + 1);
		// setTicketCategory(categories.length + 1);
	};

	const handleDeleteTicketCategory = (index) => {
		console.log("delete clicked");
		let arr = categories;
		arr.splice(index, 1);
		setCategories([...arr]);
	};

	const handleEditTicketCategory = (index) => {
		console.log("edit index", index);
		setaddAnotherCat(!addAnotherCat);
		setTicketCategory(index);
	};

	const onPriceChanges = (e) => {
		let value = parseFloat(e.target.value);
		value = value > 0 ? value : 0;
		let usd = PhoenixDAO_market.usd;
		let phoenixValue = value / usd;
		phoenixValue = phoenixValue.toFixed(5);
		setPhnxValue(phoenixValue);
	};

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
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<TextField
										id="event-name"
										fullWidth
										variant="outlined"
										value={value}
										onChange={onChange}
										error={!!error}
										helperText={
											error ? error.message : null
										}
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
										value: 300,
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
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<TextField
										id="event-organizer"
										fullWidth
										variant="outlined"
										value={value}
										onChange={onChange}
										error={!!error}
										helperText={
											error ? error.message : null
										}
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
										value: 300,
										message:
											"Event organizer name too long.",
									},
								}}
							/>

							<br />
							<br />

							<FormControl component="fieldset">
								<label className={classes.label}>
									TICKET AVAILABILITY
								</label>
								<Controller
									name="eventTime"
									control={control}
									defaultValue={eventTime}
									render={({
										field: { onChange, value },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventTime"
											name="eventTime"
											value={value}
											className={classes.radioGroup}
											onChange={(e) => {
												onChange(e);
												setEventTime(e.target.value);
											}}
										>
											<FormControlLabel
												value="onedayevent"
												control={
													<Radio color="primary" />
												}
												label="One day Event"
											/>
											<FormControlLabel
												value="morethanaday"
												control={
													<Radio color="primary" />
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
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													DATE
												</label>
												<Controller
													name="eventDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => {
														return (
															<KeyboardDatePicker
																fullWidth
																disableToolbar
																variant="inline"
																format="dd-MM-yyyy"
																margin="normal"
																id="event-date"
																// label="DATE"
																KeyboardButtonProps={{
																	"aria-label":
																		"change date",
																}}
																InputProps={{
																	readOnly: true,
																}}
																inputVariant="outlined"
																autoOk={true}
																disablePast
																placeholder="DD-MM-YYYY"
																value={value}
																onChange={
																	onChange
																}
																error={!!error}
																helperText={
																	error
																		? error.message
																		: null
																}
															/>
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

										<div className={classes.timeContainer}>
											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													START TIME
												</label>
												<br />
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
														<KeyboardTimePicker
															className={
																classes.timeAndDate
															}
															keyboardIcon={
																<AccessTime />
															}
															margin="normal"
															id="start-time-picker"
															// label="START TIME"
															placeholder="00:00 AM"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
															}}
															InputProps={{
																readOnly: true,
															}}
															inputVariant="outlined"
															autoOk={true}
															value={value}
															onChange={onChange}
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
															"Please select event time.",
													}}
												/>
											</div>
											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													END TIME
												</label>
												<br />
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
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
															// label="END TIME"
															placeholder="00:00 AM"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
															}}
															InputProps={{
																readOnly: true,
															}}
															inputVariant="outlined"
															autoOk={true}
															value={value}
															onChange={onChange}
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
															"Please select event end time.",
													}}
												/>
											</div>
										</div>
									</MuiPickersUtilsProvider>
								</div>
							) : (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<div className={classes.timeContainer}>
											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													START DATE
												</label>
												<br />
												<Controller
													name="eventStartDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
														<KeyboardDatePicker
															className={
																classes.timeAndDate
															}
															disableToolbar
															variant="inline"
															format="dd-MM-yyyy"
															margin="normal"
															id="date-picker-inline"
															placeholder="DD-MM-YYYY"
															InputProps={{
																readOnly: true,
															}}
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
															onChange={onChange}
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
															"Please select event start date.",
													}}
												/>
											</div>

											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													END DATE
												</label>
												<br />
												<Controller
													name="eventEndDate"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
														<KeyboardDatePicker
															className={
																classes.timeAndDate
															}
															disableToolbar
															variant="inline"
															format="dd-MM-yyyy"
															margin="normal"
															id="date-picker-inline"
															// label="END DATE"
															// value={endDate}
															// onChange={(d) => setEndDate(d)}
															InputProps={{
																readOnly: true,
															}}
															KeyboardButtonProps={{
																"aria-label":
																	"change date",
															}}
															inputVariant="outlined"
															placeholder="DD-MM-YYYY"
															autoOk={true}
															disablePast
															value={value}
															onChange={onChange}
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
															"Please select event end date.",
													}}
												/>
											</div>
										</div>

										<br />

										<div className={classes.timeContainer}>
											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													FROM
												</label>
												<br />
												<Controller
													name="eventStartTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
														<KeyboardTimePicker
															className={
																classes.timeAndDate
															}
															keyboardIcon={
																<AccessTime />
															}
															margin="normal"
															id="time-picker"
															// label="TO"
															placeholder="00:00 AM"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
															}}
															InputProps={{
																readOnly: true,
															}}
															inputVariant="outlined"
															autoOk={true}
															value={value}
															onChange={onChange}
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
															"Please select event start time.",
													}}
												/>
											</div>

											<div>
												<label
													className={classes.label}
													style={{ marginBottom: 0 }}
												>
													TO
												</label>
												<br />
												<Controller
													name="eventEndTime"
													control={control}
													defaultValue={null}
													render={({
														field: {
															onChange,
															value,
														},
														fieldState: { error },
													}) => (
														<KeyboardTimePicker
															className={
																classes.timeAndDate
															}
															keyboardIcon={
																<AccessTime />
															}
															margin="normal"
															id="time-picker"
															// label="FROM"
															placeholder="00:00 AM"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
															}}
															InputProps={{
																readOnly: true,
															}}
															inputVariant="outlined"
															autoOk={true}
															value={value}
															onChange={onChange}
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
															"Please select event end time.",
													}}
												/>
											</div>
										</div>
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
								<label className={classes.label}>
									TICKET AVAILABILITY
								</label>
								<Controller
									name="eventType"
									control={control}
									defaultValue={type}
									render={({
										field: { onChange, value },
										fieldState: { error },
									}) => (
										<RadioGroup
											row
											aria-label="eventType"
											className={classes.radioGroup}
											name="eventType"
											value={value}
											onChange={(e) => {
												onChange(e);
												setType(e.target.value);
											}}
										>
											<FormControlLabel
												value="physical"
												control={
													<Radio color="primary" />
												}
												label="Physical Event"
											/>
											<FormControlLabel
												value="online"
												control={
													<Radio color="primary" />
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
									<label className={classes.label}>
										EVENT LOCATION
									</label>
									<Controller
										name="eventLocation"
										control={control}
										defaultValue=""
										render={({
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<TextField
												id="event-location"
												fullWidth
												variant="outlined"
												value={value}
												onChange={onChange}
												error={!!error}
												helperText={
													error ? error.message : null
												}
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
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<TextField
												id="event-link"
												fullWidth
												variant="outlined"
												value={value}
												onChange={onChange}
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
							<br />
							{images.slice(0, 3).map((img, index) => {
								return (
									<div key={index}>
										<label className={classes.label}>
											COVER IMAGE {index + 1}
										</label>

										<Controller
											name={`image${index}`}
											control={control}
											defaultValue=""
											render={({
												field: { onChange, value },
												fieldState: { error },
											}) => (
												<TextField
													variant="outlined"
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
																				.files[0]
																				.size >
																			5000000
																		) {
																			onChange(
																				""
																			);
																		} else {
																			const arr =
																				[
																					...images,
																				];
																			arr[
																				index
																			].name =
																				event.target.files[0].name;
																			setImages(
																				arr
																			);
																			onChange(
																				event
																					.target
																					.files[0]
																			);
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
													fontSize: 14,
													fontWeight: 400,
													fontFamily:
														"'Aeonik', sans-serif",
												}}
											>
												Max: 3 Pictures. Not greater
												than 5MB (Recommended 1000px *
												1000px)
											</p>
										) : null}
										<br />
										<br />
									</div>
								);
							})}

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
									field: { onChange, value },
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
											id="demo-simple-select-outlined"
											fullWidth
											value={value}
											onChange={onChange}
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
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<FormControl
										variant="outlined"
										fullWidth
										// className={classes.formControl}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											value={value}
											onChange={(e) => {
												onChange(e);
												setCategory(e.target.value);
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
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name="ticketAvailability"
														value={value}
														className={
															classes.radioGroup
														}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio color="primary" />
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio color="primary" />
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
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															type="number"
															id="outlined-basic"
															fullWidth
															variant="outlined"
															value={value}
															onChange={onChange}
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
													}}
												/>
											</div>
										)}
									</div>
								) : category === "single" ? (
									<div>
										<label className={classes.label}>
											TICKET PRICE
										</label>
										<br />
										<div
											className={
												classes.ticketPriceContainer
											}
										>
											<Controller
												name="dollarPrice"
												control={control}
												defaultValue=""
												render={({
													field: { onChange, value },
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
															onKeyDown={
																formatInputDollarPrice
															}
															id="input-with-icon-textfield"
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<img
																				src={
																					dollarIcon
																				}
																				alt="dollar sign"
																			/>
																		</InputAdornment>
																	),
															}}
															value={value}
															onChange={(e) => {
																onChange(e);
																onPriceChanges(
																	e
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
														"Price in dollars.",
													// min: {
													// 	value: 1,
													// 	message:
													// 		"Price of ticket should be at least 1 dollar.",
													// },
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
											<Controller
												name="phnxPrice"
												control={control}
												defaultValue=""
												render={({
													field: { onChange, value },
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
															id="input-with-icon-textfield"
															onKeyDown={
																formatInputDollarPrice
															}
															type="number"
															variant="outlined"
															InputProps={{
																startAdornment:
																	(
																		<InputAdornment position="start">
																			<img
																				src={
																					phnxLogo
																				}
																				alt="phnx logo"
																			/>
																		</InputAdornment>
																	),
															}}
															// value={value}
															value={phnxValue}
															onChange={onChange}
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
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name="ticketAvailability"
														className={
															classes.radioGroup
														}
														value={value}
														onChange={(e) => {
															onChange(e);
															setAvailability(
																e.target.value
															);
														}}
													>
														<FormControlLabel
															value="unlimited"
															control={
																<Radio color="primary" />
															}
															label="Unlimited Tickets"
														/>
														<FormControlLabel
															value="limited"
															control={
																<Radio color="primary" />
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
														},
														fieldState: { error },
													}) => (
														<TextField
															onKeyDown={
																formatInputNoOfTickets
															}
															type="number"
															id="outlined-basic"
															// label="Event Organizer"
															fullWidth
															variant="outlined"
															value={value}
															onChange={onChange}
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
													}}
												/>
											</div>
										)}
									</div>
								) : (
									<div>
										{/*paid multiple - ticket category box*/}
										{categories.map((cat, index) => {
											// console.log("cat", cat);
											return (
												<div key={index}>
													<br />
													<Grid container spacing={2}>
														<Grid
															style={{
																background: `linear-gradient(270deg, rgba(94, 91, 255, 0.12) 0%, rgba(124, 118, 255, 0) 131.25%)`,
																padding: 15,
															}}
															container
															item
															xs={11}
															sm={11}
															md={11}
															lg={11}
															xl={11}
															justify="space-between"
															direction="row"
														>
															<Grid
																item
																direction="column"
															>
																<h4>
																	{
																		cat.ticketName
																	}
																	{` Ticket`}
																</h4>
																<h6>
																	{cat.ticketAvailability
																		? cat.noOfTickets
																		: `Unlimited  Tickets`}
																</h6>
															</Grid>
															<Grid
																item
																direction="column"
															>
																<h2>
																	$
																	{
																		cat.dollarPrice
																	}
																</h2>
																<h6>
																	{
																		cat.phnxPrice
																	}
																	PHNX
																</h6>
															</Grid>
														</Grid>
														<Grid
															item
															container
															xs={1}
															sm={1}
															md={1}
															lg={1}
															xl={1}
															direction="column"
															justify="space-evenly"
														>
															<Grid item>
																<Button
																// onClick={() =>
																// 	handleEditTicketCategory(
																// 		index
																// 	)
																// }
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
																	onClick={() =>
																		handleDeleteTicketCategory(
																			index
																		)
																	}
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
													<br />
												</div>
											);
										})}

										{!addAnotherCat ? (
											<div>
												<form
													onSubmit={handleSubmit(
														handleSaveCatogory
													)}
												>
													{/* ticket name */}
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
															},
															fieldState: {
																error,
															},
														}) => (
															<TextField
																id="ticket-name"
																fullWidth
																variant="outlined"
																value={value}
																onChange={
																	onChange
																}
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
																"Please enter ticket name.",
															minLength: {
																value: 3,
																message:
																	"Ticket name should contain at least 3 characters.",
															},
															maxLength: {
																value: 300,
																message:
																	"Ticket name too long.",
															},
														}}
													/>

													<br />
													<br />

													<label
														className={
															classes.label
														}
													>
														TICKET PRICE
													</label>
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
																		id="input-with-icon-textfield"
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<img
																							src={
																								dollarIcon
																							}
																							alt="dollar sign"
																						/>
																					</InputAdornment>
																				),
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
																			onPriceChanges(
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
																required:
																	"Price in dollars.",
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
																		id="input-with-icon-textfield"
																		onKeyDown={
																			formatInputDollarPrice
																		}
																		type="number"
																		variant="outlined"
																		InputProps={{
																			startAdornment:
																				(
																					<InputAdornment position="start">
																						<img
																							src={
																								phnxLogo
																							}
																							alt="phnx logo"
																						/>
																					</InputAdornment>
																				),
																		}}
																		// value={
																		// 	value
																		// }
																		value={
																			phnxValue
																		}
																		onChange={
																			onChange
																		}
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
																},
																fieldState: {
																	error,
																},
															}) => (
																<RadioGroup
																	row
																	aria-label="ticketAvailability"
																	name="ticketAvailability"
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
																	}}
																>
																	<FormControlLabel
																		value="unlimited"
																		control={
																			<Radio color="primary" />
																		}
																		label="Unlimited Tickets"
																	/>
																	<FormControlLabel
																		value="limited"
																		control={
																			<Radio color="primary" />
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
																	},
																	fieldState:
																		{
																			error,
																		},
																}) => (
																	<TextField
																		id="outlined-basic"
																		// label="Event Organizer"
																		onKeyDown={
																			formatInputNoOfTickets
																		}
																		type="number"
																		fullWidth
																		variant="outlined"
																		value={
																			value
																		}
																		onChange={
																			onChange
																		}
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
												<br />
											</div>
										) : (
											<div>
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

							<Controller
								name="restrictWallet"
								control={control}
								defaultValue={false}
								render={({
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<FormControlLabel
										control={
											<Checkbox
												checked={value}
												onChange={onChange}
												name="checkedB"
												color="primary"
											/>
										}
										label="Restrict Wallet Address to one Ticket"
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
							<h3 className={classes.title}>
								Event Descriptions
							</h3>
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
									field: { onChange, value },
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
											}}
											readOnly={false}
										/>
										<FormHelperText>
											{error ? error.message : null}
										</FormHelperText>
									</FormControl>
								)}
								rules={{
									required: "Please enter event details.",
									minLength: {
										value: 100,
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
									field: { onChange, value },
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
													checked={value}
													onChange={onChange}
													name="checkedB"
													color="primary"
												/>
											}
											// label="By creating an event, I agree to the policies and terms of use."

											label={
												<span
												// className={
												// 	"custom-control-label "
												// }
												// style={{
												// 	color:
												// 		warning.terms ===
												// 		"is-invalid"
												// 			? "#dc3545"
												// 			: "#333333",
												// }}
												// htmlFor="terms"
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyItems: "center",
				}}
			>
				<img
					src={GoldonBlue}
					width={154}
					height={188}
					alt="flaming..."
				/>
				<br />
				<br />

				<div>
					<p>{getFlamingStepContent(activeFlamingStep)}</p>
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
		<div className={classes.root}>
			{activeStep === steps.length ? null : (
				<Stepper
					activeStep={activeStep}
					alternativeLabel
					// connector={<ColorlibConnector />}
					className={classes.step}
					// classes={{
					// 	alternativeLabel: classes.alternativeLabel,
					// 	active: classes.alternativeLabelActive,
					// 	iconContainer: classes.stepIcon,
					// }}
				>
					{steps.map((label, i) => (
						<Step key={i}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			)}

			<div className={classes.mainStepperContainer}>
				<br />

				{activeStep === steps.length ? (
					<div>
						{activeFlamingStep === flamingSteps.length ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
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
										value={URL}
										defaultValue={URL}
										variant="outlined"
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<CopyToClipboard
														text={URL}
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
									<SocialMedia />
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
									onClick={() => history.push("/myevents/1")}
								>
									View your Event
								</Button>
							</div>
						) : (
							publishedEventComponent()
						)}
						{/* <Typography className={classes.instructions}>
							All steps completed
						</Typography>
						<Button onClick={handleReset}>Reset</Button> */}
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
										<KeyboardBackspaceIcon fontSize="large" />
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
										<ArrowRightAltIcon fontSize="large" />
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
		</div>
	);
};

export default withRouter(MyStepper);
