import React, { useState, useEffect } from "react";
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
import {
	Add as AddIcon,
	VisibilityOutlined as VisibilityOutlinedIcon,
} from "@material-ui/icons";
import GoldonBlue from "../Images/GoldonBlue.gif";
import phnxLogo from "../Images/phnx.png";
import dollarIcon from "../Images/dollar.png";
import eventTopics from "../../config/topics.json";
import altIcon from "../Images/altIcon.png";
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
import { useFormControls } from "./StepperFormControls";
import useStyles from "./StepperFormStyling";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import CustomTextField from "../common/CustomTextField";
import TicketCategory from "../common/TicketCategory";
import "./style.css";
var badWords = require("bad-words");

const MyStepper = ({
	handleCreateEvent,
	onFieldsChange,
	onStepsChange,
	activeStep,
	activeFlamingStep,
	history,
	progressText,
	shareUrl,
}) => {
	const classes = useStyles();

	const {
		values,
		errors,
		handleInputValue,
		handlePickerValue,
		handleGeoValues,
		handleImageInput,
		handleFormSubmit,
		formIsValid,
		stepperIsValid,
		addAnotherImage,
		handelRemoveImage,
		handleTicketCatogory,
		handleSaveTicketCatogory,
		handleRickTextValue,
		handleEventCategory,
		handleAddAnotherCategory,
		handleDeleteTicketCategory,
		handleEditTicketCategory,
		clearState,
	} = useFormControls();

	const {
		//1st_stepper
		eventName,
		eventOrganizer,
		eventTime,
		eventDate,
		eventStartTime,
		eventEndTime,
		eventStartDate,
		eventEndDate,
		//2nd_stepper
		eventType,
		eventTopic,
		eventLocation,
		eventLink,
		country,
		state,
		city,
		images,
		//3rd_stepper
		eventCategory,
		ticketIndex,
		restrictWallet,
		ticketCategories,
		isCompleted,
		//4th_stepper
		eventDescription,
		termsAndConditions,
	} = values;

	const steps = ["", "", "", ""];
	function getFlamingSteps() {
		return ["Uploading", "Confirming Transaction", "Publishing Event"];
	}
	const flamingSteps = getFlamingSteps();
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		onFieldsChange(values);
	}, [values]);

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

	const maxLengthCheckNumber = (e) => {
		e.target.value = Math.max(0, parseInt(e.target.value))
			.toString()
			.slice(0, 16);
	};

	const handleNextStep = () => {
		stepperIsValid(
			activeStep,
			() => {
				onStepsChange("inc");
			},
			() => handleCreateEvent(() => clearState(),values)
		);
	};

	//back button stepper
	const handleBack = () => {
		onStepsChange("dec");
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
							<CustomTextField
								id="event-name"
								name="eventName"
								fullWidth={true}
								label="EVENT NAME"
								value={eventName}
								handleInputValue={handleInputValue}
								errors={errors}
								maxLength={100}
							/>
							<br />
							<br />
							<CustomTextField
								id="event-organizer"
								name="eventOrganizer"
								fullWidth={true}
								label="EVENT ORGANIZER"
								value={eventOrganizer}
								handleInputValue={handleInputValue}
								errors={errors}
								maxLength={100}
							/>
							<br />
							<br />
							<FormControl component="fieldset">
								<RadioGroup
									row
									aria-label="eventTime"
									id="event-time-radio-btn"
									name="eventTime"
									className={classes.radioGroup}
									value={eventTime}
									onBlur={handleInputValue}
									onChange={handleInputValue}
									autoComplete="none"
									{...(errors["eventTime"] && {
										error: true,
										helperText: errors["eventTime"],
									})}
								>
									<FormControlLabel
										value="onedayevent"
										control={
											<Radio
												color="primary"
												icon={
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
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
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
												}
											/>
										}
										label="More than a day"
									/>
								</RadioGroup>
							</FormControl>

							<br />
							<br />

							{eventTime === "onedayevent" ? (
								<div>
									<div>
										<DatePicker
											label="DATE"
											id="event-date"
											name="eventDate"
											value={eventDate}
											errors={errors}
											handlePickerValue={
												handlePickerValue
											}
											fullWidth={true}
										/>
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
											<TimePicker
												label="START TIME"
												id="start-time-picker"
												name="eventStartTime"
												value={eventStartTime}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
												clearable={false}
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
											<TimePicker
												label="END TIME"
												id="end-time-picker"
												name="eventEndTime"
												value={eventEndTime}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
												clearable={true}
												helperText="Don't have an end time for the event? Leave this space blank."
											/>
										</Grid>
									</Grid>
								</div>
							) : (
								<div>
									<Grid container spacing={6}>
										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											lg={6}
										>
											<DatePicker
												label="START DATE"
												id="event-start-date-picker-inline"
												name="eventStartDate"
												value={eventStartDate}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
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
											<DatePicker
												label="END DATE"
												name="eventEndDate"
												id="event-end-date-picker-inline"
												value={eventEndDate}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
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
											<TimePicker
												label="FROM"
												id="event-start-time-picker"
												name="eventStartTime"
												value={eventStartTime}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
												clearable={false}
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
											<TimePicker
												label="TO"
												id="event-end-time-picker"
												name="eventEndTime"
												value={eventEndTime}
												errors={errors}
												handlePickerValue={
													handlePickerValue
												}
												fullWidth={true}
												clearable={true}
												helperText="Don't have an end time for the event? Leave this space blank."
											/>
										</Grid>
									</Grid>
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
								<RadioGroup
									row
									aria-label="eventType"
									className={classes.radioGroup}
									name="eventType"
									id="event-Type"
									value={eventType}
									onBlur={handleInputValue}
									onChange={handleInputValue}
									{...(errors["eventType"] && {
										error: true,
										helperText: errors["eventType"],
									})}
								>
									<FormControlLabel
										value="physical"
										control={
											<Radio
												color="primary"
												icon={
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
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
													<img src={uncheckedIcon} />
												}
												checkedIcon={
													<img src={checkedIcon} />
												}
											/>
										}
										label="Online Event"
									/>
								</RadioGroup>
							</FormControl>
							<br />
							{eventType === "physical" ? (
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
											<GeoLocation
												locationTitle="country"
												name="country"
												id="country"
												isCountry
												value={country}
												onChange={handleGeoValues}
												{...(errors["country"] && {
													error: true,
													helperText:
														errors["country"],
												})}
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
											<GeoLocation
												locationTitle="state"
												name="state"
												id="state"
												geoId={country.id}
												value={state}
												onChange={handleGeoValues}
												{...(errors["state"] && {
													error: true,
													helperText: errors["state"],
												})}
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
											<GeoLocation
												locationTitle="city"
												name="city"
												id="city"
												geoId={state.id}
												value={city}
												onChange={handleGeoValues}
												{...(errors["city"] && {
													error: true,
													helperText: errors["city"],
												})}
											/>
										</Grid>
									</Grid>
									<br />

									<CustomTextField
										id="event-location"
										name="eventLocation"
										fullWidth={true}
										label="EVENT LOCATION"
										value={eventLocation}
										handleInputValue={handleInputValue}
										errors={errors}
										maxLength={100}
									/>
								</div>
							) : (
								<div>
									<CustomTextField
										id="event-link"
										name="eventLink"
										fullWidth={true}
										label="EVENT LINK"
										value={eventLink}
										handleInputValue={handleInputValue}
										errors={errors}
										maxLength={1000}
									/>
								</div>
							)}

							{/* images selection */}
							{images.slice(0, 3).map((image, index) => {
								return (
									<div key={index}>
										<br />

										<label className={classes.label}>
											COVER IMAGE {index + 1}
										</label>
										<div style={{ position: "relative" }}>
											<TextField
												variant="outlined"
												id={`image${index}`}
												name={`image${index}`}
												fullWidth
												disabled
												value={image.name}
												placeholder="Select Image"
												{...(errors[
													`image${index}`
												] && {
													error: true,
													helperText:
														errors[`image${index}`],
												})}
												InputProps={{
													endAdornment: (
														<Button
															component="label"
															className={
																classes.imageSelectBtnStyle
															}
														>
															Browse
															<input
																type="file"
																hidden
																multiple={false}
																accept="image/*"
																onChange={(
																	e
																) => {
																	handleImageInput(
																		e,
																		index
																	);
																}}
															/>
														</Button>
													),
												}}
											/>

											{index === 0 ? (
												<p
													className={
														classes.imageMaxStyle
													}
												>
													Max: 3 Pictures. Not greater
													than 5MB (Recommended 1000px
													* 1000px)
												</p>
											) : (
												<button
													className={
														classes.deleteImageButton
													}
													disabled={index === 0}
													onClick={() => {
														handelRemoveImage(
															index
														);
													}}
												>
													x
												</button>
											)}
										</div>
									</div>
								);
							})}

							<br />

							<Button
								disabled={images.length >= 3 ? true : false}
								variant="outlined"
								fullWidth
								className={classes.addAnotherImageBtn}
								startIcon={<AddIcon fontSize="large" />}
								onClick={() => addAnotherImage()}
							>
								Add another Image
							</Button>

							<br />
							<br />

							<label className={classes.label}>TOPIC</label>
							<FormControl
								variant="outlined"
								fullWidth
								className={classes.formControl}
								error={!!errors["eventTopic"]}
							>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="event-topic"
									name="eventTopic"
									fullWidth
									displayEmpty
									className={classes.menuPaper}
									MenuProps={{
										classes: {
											paper: classes.menuPaper,
										},
									}}
									value={eventTopic}
									onBlur={handleInputValue}
									onChange={handleInputValue}
								>
									<MenuItem
										disabled
										value=""
										className={classes.menuItemStyle}
									>
										<em>Topic</em>
									</MenuItem>
									{Object.entries(eventTopics).map(
										(topic) => (
											<MenuItem
												key={topic[1].name}
												value={topic[1].slug}
												className={
													classes.menuItemStyle
												}
											>
												{topic[1].name}
											</MenuItem>
										)
									)}
								</Select>
								<FormHelperText>
									{errors["eventTopic"]}
								</FormHelperText>
							</FormControl>
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
							<FormControl
								variant="outlined"
								fullWidth
								// className={classes.formControl}
							>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="event-category"
									name="eventCategory"
									value={eventCategory}
									onChange={handleEventCategory}
									fullWidth
									className={classes.dropdownMenu}
								>
									<MenuItem value="free">Free Event</MenuItem>
									<MenuItem value="single">
										{`Paid (Single Ticket Type Event)`}
									</MenuItem>
									<MenuItem value="multiple">{`Paid (Multiple Ticket Type Event)`}</MenuItem>
								</Select>
							</FormControl>

							<br />
							<br />

							{/* conditonal rendering for event category - free - single_paid - multiple-paid */}
							<div>
								{eventCategory === "free" ? (
									<div>
										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<RadioGroup
												row
												aria-label="ticketAvailability"
												name="ticketAvailability"
												id="ticket-availability"
												value={
													ticketCategories[
														ticketIndex
													].ticketAvailability
												}
												className={classes.radioGroup}
												onChange={(event) => {
													handleTicketCatogory(
														event,
														ticketIndex
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
										</FormControl>
										{ticketCategories[ticketIndex]
											.ticketAvailability ===
										"unlimited" ? null : (
											<div>
												<CustomTextField
													type="number"
													id="no-of-tickets"
													name="noOfTickets"
													fullWidth={true}
													maxLength={16}
													label="NUMBER OF TICKETS"
													value={
														ticketCategories[
															ticketIndex
														].noOfTickets
													}
													handleInputValue={(
														event
													) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													errors={errors}
													onKeyDown={
														formatInputNoOfTickets
													}
													onInput={
														maxLengthCheckNumber
													}
												/>
											</div>
										)}
									</div>
								) : eventCategory === "single" ? (
									<div>
										<br />

										<InputLabel htmlFor="input-with-icon-adornment">
											<label className={classes.label}>
												TICKET PRICE
											</label>
										</InputLabel>
										<div
											className={
												classes.ticketPriceContainer
											}
										>
											<span>
												<TextField
													className={classes.margin}
													onKeyDown={
														formatInputDollarPrice
													}
													id="dollar-price"
													name="dollarPrice"
													type="number"
													variant="outlined"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Button
																	component="label"
																	className={
																		classes.dollarIconBtnStyle
																	}
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
													}}
													value={
														ticketCategories[
															ticketIndex
														].dollarPrice
													}
													onChange={(event) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													onBlur={(event) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													{...(errors[
														"dollarPrice"
													] && {
														error: true,
														helperText:
															errors[
																"dollarPrice"
															],
													})}
												/>
											</span>

											<div
												className={classes.altIconStyle}
											>
												<img
													src={altIcon}
													alt="alt icon"
													className={classes.altImage}
												/>
											</div>

											<span>
												<TextField
													className={classes.margin}
													id="phnx-price"
													name="phnxPrice"
													onKeyDown={
														formatInputDollarPrice
													}
													type="number"
													variant="outlined"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Button
																	component="label"
																	className={
																		classes.phnxLogoBtnStyle
																	}
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
														inputProps: {
															min: 1,
														},
													}}
													value={
														ticketCategories[
															ticketIndex
														].phnxPrice
													}
													onChange={(event) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													onBlur={(event) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													{...(errors[
														"phnxPrice"
													] && {
														error: true,
														helperText:
															errors["phnxPrice"],
													})}
												/>
											</span>
										</div>

										<br />

										<FormControl component="fieldset">
											<label className={classes.label}>
												TICKET AVAILABILITY
											</label>
											<RadioGroup
												row
												aria-label="ticketAvailability"
												name="ticketAvailability"
												id="ticket-availability"
												value={
													ticketCategories[
														ticketIndex
													].ticketAvailability
												}
												className={classes.radioGroup}
												onChange={(event) => {
													handleTicketCatogory(
														event,
														ticketIndex
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
										</FormControl>
										{ticketCategories[ticketIndex]
											.ticketAvailability ===
										"unlimited" ? null : (
											<div>
												<CustomTextField
													type="number"
													id="no-of-tickets"
													name="noOfTickets"
													fullWidth={true}
													maxLength={16}
													label="NUMBER OF TICKETS"
													value={
														ticketCategories[
															ticketIndex
														].noOfTickets
													}
													handleInputValue={(
														event
													) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													errors={errors}
													onKeyDown={
														formatInputNoOfTickets
													}
													onInput={
														maxLengthCheckNumber
													}
												/>
											</div>
										)}
									</div>
								) : (
									<div>
										{/*paid multiple - ticket category box*/}
										{ticketCategories &&
											ticketCategories.length &&
											ticketCategories.map(
												(cat, index) => {
													if (!cat.isShown)
														return null;
													return (
														<TicketCategory
															key={index}
															cat={cat}
															index={index}
															handleDeleteTicketCategory={
																handleDeleteTicketCategory
															}
															handleEditTicketCategory={
																handleEditTicketCategory
															}
														/>
													);
												}
											)}

										{/* for adding new category */}
										{!isCompleted &&
										ticketCategories[ticketIndex] ? (
											<div>
												<CustomTextField
													id="ticket-name"
													name="ticketName"
													fullWidth
													label="TICKET NAME"
													maxLength={100}
													value={
														ticketCategories[
															ticketIndex
														].ticketName
													}
													handleInputValue={(
														event
													) => {
														handleTicketCatogory(
															event,
															ticketIndex
														);
													}}
													errors={errors}
												/>

												<br />
												<br />
												<br />
												<InputLabel htmlFor="input-with-icon-adornment">
													<label
														className={
															classes.label
														}
													>
														TICKET PRICE
													</label>
												</InputLabel>
												<div
													className={
														classes.ticketPriceContainer
													}
												>
													<span>
														<TextField
															className={
																classes.margin
															}
															onKeyDown={
																formatInputDollarPrice
															}
															id="dollar-price"
															name="dollarPrice"
															type="number"
															variant="outlined"
															InputProps={{
																inputProps: {
																	min: 1,
																},

																startAdornment:
																	(
																		<InputAdornment position="start">
																			<Button
																				component="label"
																				className={
																					classes.dollarIconBtnStyle
																				}
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
																// inputProps: {
																// 	min: 0,
																// },
															}}
															value={
																ticketCategories[
																	ticketIndex
																].dollarPrice
															}
															onChange={(
																event
															) => {
																handleTicketCatogory(
																	event,
																	ticketIndex
																);
															}}
															onBlur={(event) => {
																handleTicketCatogory(
																	event,
																	ticketIndex
																);
															}}
															{...(errors[
																"dollarPrice"
															] && {
																error: true,
																helperText:
																	errors[
																		"dollarPrice"
																	],
															})}
														/>
													</span>
													<div
														className={
															classes.altIconStyle
														}
													>
														<img
															src={altIcon}
															alt="alt icon"
															className={
																classes.altImage
															}
														/>
													</div>

													<span>
														<TextField
															className={`${classes.margin}`}
															id="phnx-price"
															name="phnxPrice"
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
																				className={
																					classes.phnxLogoBtnStyle
																				}
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
																inputProps: {
																	min: 1,
																},
															}}
															value={
																ticketCategories[
																	ticketIndex
																].phnxPrice
															}
															onChange={(
																event
															) => {
																handleTicketCatogory(
																	event,
																	ticketIndex
																);
															}}
															onBlur={(event) => {
																handleTicketCatogory(
																	event,
																	ticketIndex
																);
															}}
															{...(errors[
																"phnxPrice"
															] && {
																error: true,
																helperText:
																	errors[
																		"phnxPrice"
																	],
															})}
														/>
													</span>
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
													<RadioGroup
														row
														aria-label="ticketAvailability"
														name="ticketAvailability"
														id="ticket-availability"
														value={
															ticketCategories[
																ticketIndex
															].ticketAvailability
														}
														className={
															classes.radioGroup
														}
														onChange={(event) => {
															handleTicketCatogory(
																event,
																ticketIndex
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
												</FormControl>

												{ticketCategories[ticketIndex]
													.ticketAvailability ===
												"unlimited" ? null : (
													<div>
														<CustomTextField
															type="number"
															id="no-of-tickets"
															name="noOfTickets"
															fullWidth={true}
															maxLength={16}
															label="NUMBER OF TICKETS"
															value={
																ticketCategories[
																	ticketIndex
																].noOfTickets
															}
															handleInputValue={(
																event
															) => {
																handleTicketCatogory(
																	event,
																	ticketIndex
																);
															}}
															errors={errors}
															onKeyDown={
																formatInputNoOfTickets
															}
															onInput={
																maxLengthCheckNumber
															}
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
													onClick={() => {
														handleSaveTicketCatogory(
															ticketIndex
														);
													}}
												>
													Save
												</Button>
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
													onClick={() => {
														handleAddAnotherCategory();
													}}
												>
													Add another Ticket Category
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
							<br />
							<FormControlLabel
								control={
									<Checkbox
										icon={<img src={uncheckedIcon} />}
										checkedIcon={<img src={checkedIcon} />}
										checked={!!restrictWallet}
										onChange={(e) => {
											handlePickerValue({
												name: "restrictWallet",
												value: !restrictWallet,
											});
										}}
										name="restrictWallet"
										id="restrict-wallet"
										color="primary"
									/>
								}
								label={
									<span
										className={classes.restrictWalletLabel}
									>
										Restrict Wallet Address to one Ticket
									</span>
								}
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
							<FormControl
								error={
									errors["eventDescription"] ? true : false
								}
								component="fieldset"
								className={classes.formControlDesc}
							>
								<BodyTextEditor
									value={eventDescription}
									setValue={handleRickTextValue}
									readOnly={false}
									name="eventDescription"
									id="event-description"
								/>
								<FormHelperText style={{ alignSelf: "end" }}>
									{errors["eventDescription"]}
								</FormHelperText>
							</FormControl>

							<br />
							<br />

							<FormControl
								required
								error={
									errors["termsAndConditions"] ? true : false
								}
								component="fieldset"
							>
								<FormControlLabel
									control={
										<Checkbox
											icon={<img src={uncheckedIcon} />}
											checkedIcon={
												<img src={checkedIcon} />
											}
											checked={!!termsAndConditions}
											onChange={(e) => {
												handlePickerValue({
													name: "termsAndConditions",
													value: !termsAndConditions,
												});
											}}
											name="termsAndConditions"
											id="terms-and-conditions"
											color="primary"
										/>
									}
									label={
										<span className={classes.termsLabel}>
											By creating an event, I agree to the{" "}
											<a
												target="_blank"
												href="/terms-and-conditions"
											>
												policies and terms of use
											</a>
											.
										</span>
									}
								/>
								<FormHelperText>
									{errors["termsAndConditions"]}
								</FormHelperText>
							</FormControl>
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
				activeFlamingStep >= 3 ? classes.publishedRoot : classes.root
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
					activeFlamingStep >= 3
						? classes.mainStepperContainerForPublishPage
						: classes.mainStepperContainer
				}
			>
				<br />
				{activeStep === steps.length ? (
					<div>
						{activeFlamingStep >= flamingSteps.length ? (
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
									Hurray! Event Published
								</p>
								<p>
									Notice: Your event will be displayed in
									10-15 minutes{" "}
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
								onClick={handleNextStep}
								disabled={!formIsValid(activeStep)}
								className={`${classes.nextButton} ${
									activeStep === steps.length - 1 &&
									classes.publishButton
								}`}
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
										<img
											src={publishIcon}
											className={classes.publishIcon}
											atl="publish"
										/>
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
			{activeFlamingStep >= 3 && (
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
