import "date-fns";
import React, { useState } from "react";
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
import EditIcon from "@material-ui/icons/Edit";
import MUIRichTextEditor from "mui-rte";
import RichTextEditor from "react-rte";
import flameGIF from "../Images/flame.gif";
import clsx from "clsx";
import PropTypes from "prop-types";
import Check from "@material-ui/icons/Check";

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

const MyStepper = () => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const steps = ["", "", "", ""];
	const [value, setValue] = useState("onedayevent");
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [type, setType] = useState("physical");
	const [topic, setTopic] = useState("music");
	const [category, setCategory] = useState("free");
	const [availability, setAvailability] = useState("unlimited");
	const [richValue, setRichValue] = useState(
		RichTextEditor.createEmptyValue()
	);

	//flaming stepper
	const [activeFlamingStep, setActiveFlamingStep] = useState(0);
	const flamingSteps = getFlamingSteps();

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

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	//first stepper date setter
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	//event type handle
	const handleType = (event) => {
		setType(event.target.value);
	};

	//next button steeper
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
		// console.log("rich value", value);
		setRichValue(value);
	};

	const stepperComponent1 = () => {
		return (
			<div>
				<h3 className={classes.title}>Event Datails</h3>
				<Divider light />
				<br />
				<label>EVENT NAME</label>
				<TextField
					id="outlined-basic"
					// label="Event Name"
					fullWidth
					variant="outlined"
				/>
				<br />
				<br />
				<label>EVENT ORGANIZER</label>
				<TextField
					id="outlined-basic"
					// label="Event Organizer"
					fullWidth
					variant="outlined"
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
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<div>
								<KeyboardDatePicker
									fullWidth
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="DATE"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
									inputVariant="outlined"
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
									<KeyboardTimePicker
										margin="normal"
										id="time-picker"
										label="START TIME"
										value={selectedDate}
										onChange={handleDateChange}
										KeyboardButtonProps={{
											"aria-label": "change time",
										}}
										inputVariant="outlined"
									/>
								</div>
								<div>
									<KeyboardTimePicker
										margin="normal"
										id="time-picker"
										label="END TIME"
										value={selectedDate}
										onChange={handleDateChange}
										KeyboardButtonProps={{
											"aria-label": "change time",
										}}
										inputVariant="outlined"
									/>
								</div>
							</div>
						</MuiPickersUtilsProvider>
					</div>
				) : (
					<div>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="START DATE"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
									inputVariant="outlined"
								/>

								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="END DATE"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
									inputVariant="outlined"
								/>
							</div>

							<br />

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<KeyboardTimePicker
									margin="normal"
									id="time-picker"
									label="TO"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change time",
									}}
									inputVariant="outlined"
								/>

								<KeyboardTimePicker
									margin="normal"
									id="time-picker"
									label="FROM"
									value={selectedDate}
									onChange={handleDateChange}
									KeyboardButtonProps={{
										"aria-label": "change time",
									}}
									inputVariant="outlined"
								/>
							</div>
						</MuiPickersUtilsProvider>
					</div>
				)}
			</div>
		);
	};

	const stepperComponent2 = () => {
		return (
			<div>
				<h3 className={classes.title}>Event Datails</h3>
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
						<TextField
							id="outlined-basic"
							// label="Event Location"
							fullWidth
							variant="outlined"
						/>
					</div>
				) : (
					<div>
						<label>EVENT LINK</label>
						<TextField
							id="outlined-basic"
							// label="Event LInk"
							fullWidth
							variant="outlined"
						/>
					</div>
				)}
				<br />
				<label>COVER IMAGE</label>
				<TextField
					variant="outlined"
					fullWidth
					disabled
					InputProps={{
						endAdornment: (
							<Button component="label">
								Browse
								<input type="file" hidden />
							</Button>
						),
					}}
				/>
				<br />
				<br />
				<Button
					variant="outlined"
					fullWidth
					className={classes.addAnotherImageBtn}
					startIcon={<AddIcon fontSize="large" />}
				>
					Add another Image
				</Button>

				<br />
				<br />
				<label>TOPIC</label>
				<FormControl
					variant="outlined"
					fullWidth
					// className={classes.formControl}
				>
					<Select
						labelId="demo-simple-select-outlined-label"
						id="demo-simple-select-outlined"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						// label="Age"
						fullWidth
					>
						{eventTopics.map((topic) => (
							<MenuItem key={topic.name} value={topic.slug}>
								{topic.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		);
	};

	const stepperComponent3 = () => {
		return (
			<div>
				<h3 className={classes.title}>Tickets</h3>
				<Divider light />
				<br />
				<label>CATEGORY</label>
				<FormControl
					variant="outlined"
					fullWidth
					// className={classes.formControl}
				>
					<Select
						labelId="demo-simple-select-outlined-label"
						id="demo-simple-select-outlined"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						// label="Age"
						fullWidth
					>
						{/* <MenuItem value="">
							<em>None</em>
						</MenuItem> */}
						<MenuItem value="free">Free Event</MenuItem>
						<MenuItem value="single">
							{`Paid (Single Ticket Type Event)`}
						</MenuItem>
						<MenuItem value="multiple">{`Paid (Multiple Ticket Type Event)`}</MenuItem>
					</Select>
				</FormControl>

				<br />
				<br />

				{/* conditonal rendering for event category -free -single_paid -multiple-paid */}
				<div>
					{category === "free" ? (
						<div>
							<FormControl component="fieldset">
								<label>TICKET AVAILABILITY</label>
								<RadioGroup
									row
									aria-label="ticketAvailability"
									name="ticketAvailability"
									value={availability}
									onChange={(e) =>
										setAvailability(e.target.value)
									}
								>
									<FormControlLabel
										value="unlimited"
										control={<Radio color="primary" />}
										label="Unlimited Tickets"
									/>
									<FormControlLabel
										value="limited"
										control={<Radio color="primary" />}
										label="Limited Tickets"
									/>
								</RadioGroup>
							</FormControl>

							{availability === "unlimited" ? null : (
								<div>
									<label>NUMBER OF TICKETS</label>
									<TextField
										type="number"
										id="outlined-basic"
										// label="Event Organizer"
										fullWidth
										variant="outlined"
									/>
								</div>
							)}

							<br />

							<FormControlLabel
								control={
									<Checkbox
										// checked={state.checkedB}
										// onChange={handleChange}
										name="checkedB"
										color="primary"
									/>
								}
								label="Restrict Wallet Address to one Ticket"
							/>
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
								<TextField
									className={classes.margin}
									id="input-with-icon-textfield"
									// label="TextField"
									type="number"
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AttachMoneyIcon
													style={{ color: "#413AE2" }}
												/>
											</InputAdornment>
										),
									}}
								/>
								<SyncAltIcon
									fontSize="large"
									style={{ color: "#413AE2" }}
								/>
								<TextField
									className={classes.margin}
									id="input-with-icon-textfield"
									// label="TextField"
									type="number"
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AttachMoneyIcon
													style={{ color: "#413AE2" }}
												/>
											</InputAdornment>
										),
									}}
								/>
							</div>

							<br />

							<FormControl component="fieldset">
								<label>TICKET AVAILABILITY</label>
								<RadioGroup
									row
									aria-label="ticketAvailability"
									name="ticketAvailability"
									value={availability}
									onChange={(e) =>
										setAvailability(e.target.value)
									}
								>
									<FormControlLabel
										value="unlimited"
										control={<Radio color="primary" />}
										label="Unlimited Tickets"
									/>
									<FormControlLabel
										value="limited"
										control={<Radio color="primary" />}
										label="Limited Tickets"
									/>
								</RadioGroup>
							</FormControl>
							{availability === "unlimited" ? null : (
								<div>
									<label>NUMBER OF TICKETS</label>
									<TextField
										type="number"
										id="outlined-basic"
										// label="Event Organizer"
										fullWidth
										variant="outlined"
									/>
								</div>
							)}
							<br />
							<FormControlLabel
								control={
									<Checkbox
										// checked={state.checkedB}
										// onChange={handleChange}
										name="checkedB"
										color="primary"
									/>
								}
								label="Restrict Wallet Address to one Ticket"
							/>
						</div>
					) : (
						<div>
							{/* ticket category box */}
							<div>
								<Grid container spacing={2}>
									<Grid
										style={{
											backgroundColor: "goldenrod",
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
										<Grid item direction="column">
											<h4>Bronze Ticket</h4>
											<h6>Unlimited Tickets</h6>
										</Grid>

										<Grid item direction="column">
											<h2>$300</h2>
											<h6>3000PHNX</h6>
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
											<EditIcon fontSize="large" />
										</Grid>

										<Grid item>
											<DeleteForeverOutlinedIcon fontSize="large" />
										</Grid>
									</Grid>
								</Grid>
							</div>

							<br />

							{/* ticket name */}
							<label>TICKET NAME</label>
							<TextField
								id="outlined-basic"
								// label="Event Organizer"
								fullWidth
								variant="outlined"
							/>

							<br />
							<br />

							<label>TICKET PRICE</label>
							<br />

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<TextField
									className={classes.margin}
									id="input-with-icon-textfield"
									// label="TextField"
									type="number"
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AttachMoneyIcon
													style={{ color: "#413AE2" }}
												/>
											</InputAdornment>
										),
									}}
								/>
								<SyncAltIcon
									fontSize="large"
									style={{ color: "#413AE2" }}
								/>
								<TextField
									className={classes.margin}
									id="input-with-icon-textfield"
									// label="TextField"
									type="number"
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AttachMoneyIcon
													style={{ color: "#413AE2" }}
												/>
											</InputAdornment>
										),
									}}
								/>
							</div>

							<br />

							<FormControl component="fieldset">
								<label>TICKET AVAILABILITY</label>
								<RadioGroup
									row
									aria-label="ticketAvailability"
									name="ticketAvailability"
									value={availability}
									onChange={(e) =>
										setAvailability(e.target.value)
									}
								>
									<FormControlLabel
										value="unlimited"
										control={<Radio color="primary" />}
										label="Unlimited Tickets"
									/>
									<FormControlLabel
										value="limited"
										control={<Radio color="primary" />}
										label="Limited Tickets"
									/>
								</RadioGroup>
							</FormControl>
							{availability === "unlimited" ? null : (
								<div>
									<label>NUMBER OF TICKETS</label>
									<TextField
										type="number"
										id="outlined-basic"
										// label="Event Organizer"
										fullWidth
										variant="outlined"
									/>
								</div>
							)}

							<br />

							{/* save button */}
							<Button
								color="primary"
								variant="outlined"
								fullWidth
								className={classes.addAnotherImageBtn}
							>
								Save
							</Button>

							<br />
							<br />

							<Button
								variant="outlined"
								fullWidth
								className={classes.addAnotherImageBtn}
								startIcon={<AddIcon fontSize="large" />}
							>
								Add another Ticket Category
							</Button>

							<br />
							<br />

							<FormControlLabel
								control={
									<Checkbox
										// checked={state.checkedB}
										// onChange={handleChange}
										name="checkedB"
										color="primary"
									/>
								}
								label="Restrict Wallet Address to one Ticket"
							/>
						</div>
					)}
				</div>
			</div>
		);
	};

	const stepperComponent4 = () => {
		return (
			<div>
				<h3 className={classes.title}>Event Descritions</h3>
				<Divider light />
				<br />
				<label>EVENT DESCRIPTION</label>
				<br />
				<RichTextEditor
					className={classes.editor}
					// editorClassName={}
					value={richValue}
					onChange={onChangeRichText}
					// toolbarConfig={toolbarConfig}
				/>
				<br />
				<FormControlLabel
					control={
						<Checkbox
							// checked={state.checkedB}
							// onChange={handleChange}
							name="checkedB"
							color="primary"
						/>
					}
					label="By creating an event, I agree to the policies and terms of use."
				/>
			</div>
		);
	};

	const stepperDefault = () => {
		return (
			<div>
				<p>Unknown stepIndex</p>
			</div>
		);
	};

	function getStepContent(stepIndex) {
		switch (stepIndex) {
			case 0:
				return stepperComponent1();
			case 1:
				return stepperComponent2();
			case 2:
				return stepperComponent3();
			case 3:
				return stepperComponent4();
			default:
				return stepperDefault();
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
				<img src={flameGIF} width={154} height={188} alt="flaming..." />
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
								onClick={handleNext}
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
