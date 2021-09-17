import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import GetGraphApi from "../config/getGraphApi";

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
import axios from "axios";
const useStyles = makeStyles((theme) => ({
	wrapper: {
		background: "#fff",
		paddingBottom: "100px",
		margin: "40px 0px",
		borderRadius: "8px",
	},
	imageContainer: {
		textAlign: "center",
		padding: "40px",
		width: "100%",
		"@media (max-width: 900px)": {
			padding: "20px",
		},
		"@media (max-width: 650px)": {
			padding: "10px",
		},
	},
	image: {
		borderRadius: "12px",
		width: "100%",
	},
	formWrapper: {
		width: "45%",
		"@media (max-width: 650px)": {
			width: "90%",
		},
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
			outline: "none",
		},
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
		color: "#f44336",
		marginTop: "10px",
	},
	textDiv: {
		height: "20px",
	},
	label: {
		color: "#73727D",
	},
}));

const ConfirmPurchase = (props) => {
	const classes = useStyles();
	const { handleSubmit, control, register } = useForm();
	const [eventId, setEventId] = useState(0);
	const [address, setAddress] = useState("");
	const [text, setText] = useState("");
	const [errorAddress, setErrorAddress] = useState(false);
	const [errorId, seterrorId] = useState(false);
	const [prevPath, setPrevPath] = useState(-1);
	const [eventlength, setLength] = useState(0);

	useEffect( () => {
		if (prevPath == -1) {
			props.executeScroll();
		}
		const loadGraphData = async () => {
			const graphURL = await GetGraphApi();
	
			let result = await axios({
				url: graphURL,
				method: "post",
				data: {
					query: `
			{
			  events(first:1000){
				eventId
			  }
			}
			`,
				},
			});
			console.log("result",result.data.data.events.length);
			setLength(result.data.data.events.length);
		}
		loadGraphData();
	}, []);
	
	const checkTickets = async () => {
		// const eventLength = await props.eventsContract.methods
		// 	.getEventsCount()
		// 	.call();


		const buyers = await generateBuyerArr(eventId);
		const isaddress = Web3.utils.isAddress(address);
		let error = parseInt(eventId) > parseInt(eventlength)
		if (error) {
			seterrorId(true);
			console.log("error", errorId);
		}
		if (!isaddress) {
			setErrorAddress(true);
		}
		if (isaddress && !error) {
			const isowner = buyers.find((element) => {
				return element.address.toLowerCase() == address.toLowerCase();
			});

			if (isowner) {
				setText(
					<p className={classes.message}>
						This address has a ticket to the event{" "}
					</p>
				);
			} else {
				setText(
					<p className={classes.message2}>
						This address has no ticket to the event.{" "}
					</p>
				);
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
								value={value}
								error={errorId || error}
								helperText={
									errorId
										? "This event doesn't exist"
										: error
											? error.message
											: null
								}
								// helperText={error ? error.message : null}
								onChange={(e) => {
									onChange(e);
									setText("");
									seterrorId(false);
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
									setErrorAddress(false);
									setText("");
									setAddress(e.target.value);
								}}
								error={errorAddress || error}
								helperText={
									errorAddress
										? "Invalid account address"
										: error
											? error.message
											: null
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
};

export default ConfirmPurchase;
