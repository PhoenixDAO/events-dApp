import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
	Button,
	Typography,
	Divider,
	TextField,
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
import { useForm, Controller } from "react-hook-form";
import Header from "./common/Header";

const useStyles = makeStyles((theme) => ({
	imageContainer: {
		textAlign: "center",
		padding: "40px",
		width: "100%",
		"@media (max-width: 900px)": {
			padding: "20px",
		},
	},
	image: {
		borderRadius: "12px",
		width: "90%",
	},
	formWrapper: {
		width: "60%",
		margin: "0 auto",
	},
	confirmBtn: {
		padding: "13px",
		textTransform: "capitalize",
		fontWeight: "500",
		fontSize: "16px",
		background: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	title: {
		color: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	text: {
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const ConfirmPurchase = () => {
    const classes = useStyles();
    const { handleSubmit, control, register } = useForm();

	return (
		<div>
			<Header title="Confirm Purchase" page="confirm-purchase" phnxButton="true" />
			<div className={classes.wrapper}>
				<Grid container className={classes.gridContainer}>
					<div className={classes.imageContainer}>
						<img
							className={classes.image}
							src={"/images/Frame-223.svg"}
						/>
					</div>
				</Grid>
				<div className={classes.formWrapper}>
					<h3 className={classes.title}>Confirm Purchase</h3>
					<Typography variant="p" className={classes.text}>
						Check if an address has purchased a ticket to this event
					</Typography>
					<br />
					<br />
					<br />
					<label className={classes.label}>EVENT ID</label>
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
								helperText={error ? error.message : null}
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
					<label className={classes.label}>WALLET ADDRESS</label>
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
								helperText={error ? error.message : null}
							/>
						)}
						rules={{
							required: "Please enter event organizer name.",
							minLength: {
								value: 3,
								message:
									"Event organizer name should contain at least 3 characters.",
							},
							maxLength: {
								value: 300,
								message: "Event organizer name too long.",
							},
						}}
					/>
					<br />
					<br />
					<Button
						color="primary"
						variant="contained"
						fullWidth
						type="submit"
						className={classes.confirmBtn}
					>
						Confirm Purchase
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmPurchase;
