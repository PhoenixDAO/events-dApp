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
// import { CloseIcon } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import MUIRichTextEditor from "mui-rte";
import RichTextEditor from "react-rte";
import GoldonBlue from "../Images/GoldonBlue.gif";
import clsx from "clsx";
import PropTypes from "prop-types";
import Check from "@material-ui/icons/Check";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckSquare,
	faCoffee,
	faSquare,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import EventPreviewPage from "./EventPreviewPage";
import phnxLogo from "../Images/phnx.png";
import dollarIcon from "../Images/dollar.png";
import altIcon from "../Images/altIcon.png";
import editIcon from "../Images/editIcon.png";
import deleteIcon from "../Images/deleteIcon.png";

const QontoConnector = withStyles({
	alternativeLabel: {
		top: 10,
		left: "calc(-50% + 16px)",
		right: "calc(50% + 16px)",
	},
	active: {
		"& $line": {
			borderColor: "#784af4",
		},
	},
	completed: {
		"& $line": {
			borderColor: "#784af4",
		},
	},
	line: {
		borderColor: "#eaeaf0",
		borderTopWidth: 3,
		borderRadius: 1,
	},
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
	root: {
		color: "#eaeaf0",
		display: "flex",
		height: 22,
		alignItems: "center",
	},
	active: {
		color: "#784af4",
	},
	circle: {
		width: 8,
		height: 8,
		borderRadius: "50%",
		backgroundColor: "currentColor",
	},
	completed: {
		color: "#784af4",
		zIndex: 1,
		fontSize: 18,
	},
});

function QontoStepIcon(props) {
	const classes = useQontoStepIconStyles();
	const { active, completed } = props;

	return (
		<div
			className={clsx(classes.root, {
				[classes.active]: active,
			})}
		>
			{completed ? (
				<Check className={classes.completed} />
			) : (
				<div className={classes.circle} />
			)}
		</div>
	);
}

QontoStepIcon.propTypes = {
	/**
	 * Whether this step is active.
	 */
	active: PropTypes.bool,
	/**
	 * Mark the step as completed. Is passed to child components.
	 */
	completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
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
}));

const MyStepper = ({ handleCreateEvent }) => {
	const classes = useStyles();
	const { handleSubmit, control, register } = useForm();

	const [activeStep, setActiveStep] = useState(0);
	const steps = ["", "", "", ""];
	const [value, setValue] = useState("onedayevent");
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
	const [activeFlamingStep, setActiveFlamingStep] = useState(0);
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
		// console.log("activesteps", activeStep);
		// console.log("state", state);
		console.log("fields", fields);
		// for (const key of Object.keys(fields)) {
		// 	console.log(key, fields[key]);
		// 	setState((prevState) => ({
		// 		...prevState,
		// 		[key]: fields[key],
		// 	}));
		// }

		setActiveStep((prevActiveStep) => prevActiveStep + 1);

		// if (activeStep === 0) {
		// 	//first stepper conditions - eventdate&time
		// 	setActiveStep((prevActiveStep) => prevActiveStep + 1);
		// } else if (activeStep === 1) {
		// 	//2nd stpper
		// } else if (activeStep === 2) {
		// 	// 3rd stepper
		// } else if (activeStep === 3) {
		// 	// 4th stepper
		// } else {
		// 	//publish event
		// }
	};

	//back button stepper
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	//reset stepper
	const handleReset = () => {
		setActiveStep(0);
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
			phnxPrice: fields[`phnxPrice${ticketCategory}`],
			ticketAvailability: fields[`ticketAvailability${ticketCategory}`],
			noOfTickets: fields[`noOfTickets${ticketCategory}`],
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

	function getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return (
					<React.Fragment>
						<div>
							<h3 className={classes.title}>Event Details</h3>
							<Divider light />
							<br />
							<label>EVENT NAME</label>
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
											"Event name should contain atleast 3 characters.",
									},
								}}
							/>

							<br />
							<br />
							<label>EVENT ORGANIZER</label>
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
									required: "Please enter event organizer.",
								}}
							/>

							<br />
							<br />
							<FormControl component="fieldset">
								<RadioGroup
									row
									aria-label="eventTime"
									name="eventTime"
									value={value}
									onChange={handleChange}
								>
									<FormControlLabel
										value="onedayevent"
										control={<Radio color="primary" />}
										label="One day Event"
									/>
									<FormControlLabel
										value="morethanaday"
										control={<Radio color="primary" />}
										label="More than a day"
									/>
								</RadioGroup>
							</FormControl>
							<br />
							{value === "onedayevent" ? (
								<div>
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<div>
											<Controller
												name="eventDate"
												control={control}
												defaultValue={null}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => {
													return (
														<KeyboardDatePicker
															fullWidth
															disableToolbar
															variant="inline"
															format="MM/dd/yyyy"
															margin="normal"
															id="event-date"
															label="DATE"
															KeyboardButtonProps={{
																"aria-label":
																	"change date",
															}}
															inputVariant="outlined"
															autoOk={true}
															disablePast
															placeholder="31/12/2021"
															value={value}
															onChange={onChange}
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

										<br />

										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<div>
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
															margin="normal"
															id="start-time-picker"
															label="START TIME"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
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
															required={false}
															margin="normal"
															id="end-time-picker"
															label="END TIME"
															KeyboardButtonProps={{
																"aria-label":
																	"change time",
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
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Controller
												name="eventStartDate"
												control={control}
												defaultValue={null}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<KeyboardDatePicker
														disableToolbar
														variant="inline"
														format="MM/dd/yyyy"
														margin="normal"
														id="date-picker-inline"
														label="START DATE"
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

											<Controller
												name="eventEndDate"
												control={control}
												defaultValue={null}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<KeyboardDatePicker
														disableToolbar
														variant="inline"
														format="MM/dd/yyyy"
														margin="normal"
														id="date-picker-inline"
														label="END DATE"
														// value={endDate}
														// onChange={(d) => setEndDate(d)}
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
														"Please select event end date.",
												}}
											/>
										</div>

										<br />

										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<Controller
												name="eventStartTime"
												control={control}
												defaultValue={null}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<KeyboardTimePicker
														margin="normal"
														id="time-picker"
														label="TO"
														KeyboardButtonProps={{
															"aria-label":
																"change time",
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

											<Controller
												name="eventEndTime"
												control={control}
												defaultValue={null}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<KeyboardTimePicker
														margin="normal"
														id="time-picker"
														label="FROM"
														KeyboardButtonProps={{
															"aria-label":
																"change time",
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
									</MuiPickersUtilsProvider>
								</div>
							)}

							{/* preview button */}
							<EventPreviewPage
								open={open}
								handleClose={handleClose}
								description="Yayy, I’m getting Married Yáll
								Him boisterous invitation dispatched had connection inhabiting projection. By mutual an mr danger garret edward an. Diverted as strictly exertion addition no disposal by stanhill. This call wife do so sigh no gate felt. You and abode spite order get. Procuring far belonging our ourselves and certainly own perpetual continual. It elsewhere of sometimes or my certainty. Lain no as five or at high. Everything travelling set how law literature. 
								belonging our ourselves and certainly own perpetual continual. It elsewhere of sometimes or my certainty. Lain no as five or at high. Everything travelling set how law literature. "
								image="./images/problem_ipfs.png"
								category={category}
								title="Moe's Wedding"
								startDate={"startDate"}
								startTime={startTime}
								endDate={"endDate"}
								endTime={endTime}
								eventOrganizer={eventOrganizer}
								availability={availability}
								location="karachi"
							/>
							<Button
								color="primary"
								size="large"
								startIcon={
									<VisibilityOutlinedIcon fontSize="large" />
								}
								onClick={handleClickOpen}
							>
								Preview Event
							</Button>
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
								<RadioGroup
									row
									aria-label="eventType"
									name="eventType"
									value={type}
									onChange={handleType}
								>
									<FormControlLabel
										value="physical"
										control={<Radio color="primary" />}
										label="Physical Event"
									/>
									<FormControlLabel
										value="online"
										control={<Radio color="primary" />}
										label="Online Event"
									/>
								</RadioGroup>
							</FormControl>
							<br />
							{type === "physical" ? (
								<div>
									<label>EVENT LOCATION</label>
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
										}}
									/>
								</div>
							) : (
								<div>
									<label>EVENT LINK</label>
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
										}}
									/>
								</div>
							)}
							<br />
							{images.slice(0, 3).map((img, index) => {
								return (
									<div key={index}>
										<label>COVER IMAGE {index}</label>

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
													helperText={
														error
															? error.message
															: null
													}
													InputProps={{
														endAdornment: (
															<Button component="label">
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
																		);
																	}}
																/>
															</Button>
														),
													}}
												/>
											)}
											rules={{
												required:
													"Please upload image.",
											}}
										/>

										{index === 0 ? (
											<span>
												Max: 3 Pictures. Not greater
												than 5MB (Recommended 1000px *
												1000px)
											</span>
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

							<label>TOPIC</label>
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
										// className={classes.formControl}
										error={!!error}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											fullWidth
											value={value}
											onChange={onChange}
										>
											{eventTopics.map((topic) => (
												<MenuItem
													key={topic.name}
													value={topic.slug}
												>
													{topic.name}
												</MenuItem>
											))}
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
							<label>CATEGORY</label>
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
											<label>TICKET AVAILABILITY</label>
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
												<label>NUMBER OF TICKETS</label>
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
													}}
												/>
											</div>
										)}
									</div>
								) : category === "single" ? (
									<div>
										<label>TICKET PRICE</label>
										<br />
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<Controller
												name="dollarPrice"
												control={control}
												defaultValue=""
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<TextField
														className={
															classes.margin
														}
														id="input-with-icon-textfield"
														type="number"
														variant="outlined"
														InputProps={{
															startAdornment: (
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
														onChange={onChange}
														error={!!error}
														helperText={
															error
																? error.message
																: " "
														}
													/>
												)}
												rules={{
													required:
														"Price in dollars.",
												}}
											/>

											<div>
												<img
													src={altIcon}
													alt="alt icon"
													// style={{
													// 	marginTop: "auto",
													// 	marginBottom: "auto",
													// }}
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
													<TextField
														className={
															classes.margin
														}
														id="input-with-icon-textfield"
														type="number"
														variant="outlined"
														InputProps={{
															startAdornment: (
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
														value={value}
														onChange={onChange}
														error={!!error}
														helperText={
															error
																? error.message
																: " "
														}
													/>
												)}
												rules={{
													required: "Price in PHNX.",
												}}
											/>
										</div>

										<br />

										<FormControl component="fieldset">
											<label>TICKET AVAILABILITY</label>
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
												<label>NUMBER OF TICKETS</label>
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
																	{cat.noOfTickets
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
													<label>TICKET NAME</label>
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
														}}
													/>

													<br />
													<br />

													<label>TICKET PRICE</label>
													<br />
													<div
														style={{
															display: "flex",
															justifyContent:
																"space-between",
															alignItems:
																"center",
														}}
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
																<TextField
																	className={
																		classes.margin
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
																			: " "
																	}
																/>
															)}
															rules={{
																required:
																	"Price in dollars.",
															}}
														/>

														<div>
															<img
																src={altIcon}
																alt="alt icon"
																// style={{
																// 	marginTop: "auto",
																// 	marginBottom: "auto",
																// }}
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
																<TextField
																	className={
																		classes.margin
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
																							phnxLogo
																						}
																						alt="phnx logo"
																					/>
																				</InputAdornment>
																			),
																	}}
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
																			: " "
																	}
																/>
															)}
															rules={{
																required:
																	"Price in PHNX.",
															}}
														/>
													</div>

													<br />

													<FormControl component="fieldset">
														<label>
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
															<label>
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
																		type="number"
																		id="outlined-basic"
																		// label="Event Organizer"
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
							<h3 className={classes.title}>Event Descritions</h3>
							<Divider light />
							<br />
							<label>EVENT DESCRIPTION</label>
							<br />

							<Controller
								name="eventDescription"
								control={control}
								defaultValue={RichTextEditor.createEmptyValue()}
								render={({
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<FormControl
										// required
										error={!!error}
										component="fieldset"
									>
										<RichTextEditor
											autoFocus
											className={classes.editor}
											// editorClassName={}
											value={value}
											onChange={(v) => onChange(v)}
											// toolbarConfig={toolbarConfig}
											placeholder="Type something here....."
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
											"Event description should contain atleast 500 characters.",
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
											label="By creating an event, I agree to the policies and terms of use."
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
				return "Select campaign settings...";
			case 1:
				return "What is an ad group anyways?";
			case 2:
				return "This is the bit I really care about!";
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

				{/* <Stepper
					alternativeLabel
					activeStep={activeFlamingStep}
					connector={<QontoConnector />}
					orientation="vertical"
				>
					{flamingSteps.map((label) => (
						<Step key={label}>
							<StepLabel StepIconComponent={QontoStepIcon}>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper> */}

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
			{/* <div
				className="block-icon"
				style={{
					position: "relative",
					display: "inline-flex",
				}}
			>
				<img
					className="m-2 shadow-sm"
					width="32px"
					src={
						"https://www.google.com/s2/favicons?sz=64&domain_url=yahoo.com"
					}
					rounded
				/>
				<FontAwesomeIcon
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						zIndex: 1,
					}}
					color="red"
					className="fa-stack the-wrapper icon-tag"
					icon={faTimesCircle}
				/>
			</div> */}

			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((label, i) => (
					<Step key={i}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div className={classes.mainStepperContainer}>
				<br />
				{activeStep === steps.length ? (
					<div>
						{publishedEventComponent()}
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
							<Button
								size="large"
								variant="contained"
								color="primary"
								onClick={handleSubmit(handleNext)}
								className={classes.nextButton}
								endIcon={<ArrowRightAltIcon fontSize="large" />}
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

export default MyStepper;
