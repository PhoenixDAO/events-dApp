import React, { useState } from "react";
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
import { generateBuyerArr } from "../utils/graphApis";
import Web3 from "web3";
const useStyles = makeStyles((theme) => ({
	wrapper: {
		background: "#fff",
		paddingBottom: "100px",
		margin: "40px 0px",
		borderRadius: "8px"
	},
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
		width: "100%"
	},
	formWrapper: {
		width: "45%",
		margin: "0 auto",
		"& .MuiOutlinedInput-input": {
			padding: "12px",
		},
	},
	confirmBtn: {
		padding: "10px",
		textTransform: "capitalize",
		fontWeight: "500",
		fontSize: "16px",
		background: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
		"& :focus": {
			outline: "none"
		}
	},
	title: {
		color: "#413AE2",
		fontFamily: "'Aeonik', sans-serif",
	},
	text: {
		fontFamily: "'Aeonik', sans-serif",
	},
	message: {
		fontFamily: "Aeonik",
		color: "green",
		marginTop: "10px",
	},
	message2: {
		fontFamily: "Aeonik",
		color: "red",
		marginTop: "10px",
	},
	textDiv: {
		height: "20px"
	},
	label: {
		color: "#73727D",
	}
}));

const ConfirmPurchase = () => {
	const classes = useStyles();
	const { handleSubmit, control, register } = useForm();
	const [eventId, setEventId] = useState();
	const [address, setAddress] = useState("");
	const [text, setText] = useState("");
	const [errorAddress, setErrorAddress] = useState(false);

	const checkTickets = async () => {
		const buyers = await generateBuyerArr(eventId);
		const isaddress = Web3.utils.isAddress(address);
		if (!isaddress) {
			setErrorAddress(true);
		}
		else {
			const isowner = buyers.find(element => {
				return element.address.toLowerCase() == address.toLowerCase()
			});

			if (isowner) {
				setText(<p className={classes.message}>
					This address has a ticket to the event		</p>)
			}
			else {
				setText(<p className={classes.message2}>
					This address has no ticket to the event.		</p>)
			}
		}

	};



	return (
		<div>
			<Header
				title="Confirm Purchase"
				page="confirm-purchase"
				phnxButton="true"
			/>
			<div className={classes.wrapper}>
				<Grid container className={classes.gridContainer}>
					<div className={classes.imageContainer}>
						<img
							className={classes.image}
							src={"/images/accountDetails.jpg"}
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
								id="event-id"
								fullWidth
								type="number"
								variant="outlined"
								value={eventId}
								error={!!error}
								helperText={error ? error.message : null}
								onChange={(e) => {
									onChange(e);
									setText("");
									setEventId(e.target.value);
								}}
							// inputProps={{ pattern: "[0-9]{1,15}" }}
							/>
						)}
						rules={{
							required: "Please enter event Id.",

							maxLength: {
								value: 300,
								message: "Event Id too long.",
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
								onChange={(e) => {
									onChange(e);
									setText("");
									setAddress(e.target.value);
								}}
								error={errorAddress || error}
								helperText={
									errorAddress
										? "Invalid account address" 
										: error? error.message :null
								}
							/>
						)}
						rules={{
							required: "Please enter account address.",
							minLength: {
								value: 3,
								message: "Invalid Address",
							},
							maxLength: {
								value: 43,
								message: "Invalid address",
							},
						}}
					/>
					<div className={classes.textDiv}>{text}</div>
					<br />
					<Button
						color="primary"
						variant="contained"
						fullWidth
						type="submit"
						className={classes.confirmBtn}
						onClick={handleSubmit(checkTickets)}
					>
						Confirm Purchase
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmPurchase;
