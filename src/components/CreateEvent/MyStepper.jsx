import "date-fns";
import React, { useState } from "react";
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
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

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
}));

const MyStepper = () => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const steps = ["", "", "", ""];
	const [value, setValue] = useState("onedayevent");
	const [selectedDate, setSelectedDate] = React.useState(new Date());

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
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
							<div
								style={{
									display: "flex",
									justifyContent: "space-evenly",
								}}
							>
								<div>
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
								</div>
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
							</div>

							<br />

							<div
								style={{
									display: "flex",
									justifyContent: "space-evenly",
								}}
							>
								<div>
									<KeyboardDatePicker
										disabled
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
								<div>
									<KeyboardTimePicker
										disabled
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
					<div>More than a day</div>
				)}
			</div>
		);
	};

	const stepperComponent2 = () => {
		return (
			<div>
				<h3 className={classes.title}>Event Datails</h3>
				<Divider light />
			</div>
		);
	};

	const stepperComponent3 = () => {
		return (
			<div>
				<h3 className={classes.title}>Tickets</h3>
				<Divider light />
			</div>
		);
	};

	const stepperComponent4 = () => {
		return (
			<div>
				<h3 className={classes.title}>Event Descritions</h3>
				<Divider light />
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

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div className={classes.mainStepperContainer}>
				<br />
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed
						</Typography>
						<Button onClick={handleReset}>Reset</Button>
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
