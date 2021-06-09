import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Divider,
} from "@material-ui/core";
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
}));

const MyStepper = () => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const steps = ["", "", "", ""];

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
			<div>
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
						{/* main div */}
						<div>{getStepContent(activeStep)}</div>

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
