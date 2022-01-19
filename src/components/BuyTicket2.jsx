import React, { Component, useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { pricingFormatter } from "../utils/pricingSuffix";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import roundlogo from "./Images/roundlogo.svg";
import {
	CircularProgress,
	Grid,
	IconButton,
	Typography,
} from "@material-ui/core";

var moment = require("moment");
const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiPaper-root": {
			width: "100%",
		},
		textAlign: "center",
		"& .MuiTypography-body1": {
			fontFamily: "AeonikReg",
		},
		"& .MuiButton-label": {
			fontFamily: "Aeonik",
			textTransform: "capitalize",
		},
	},
	bannerImage: {
		paddingInline: "50px",
	},
	buyTicketModal: {
		"& .MuiDialog-paper": {
			boxShadow: "0px 10px 20px 10px rgba(0, 0, 0, 0.1)",
			borderRadius: "20px",
			"@media (min-width:500px)": {
				padding: "20px",
			},
		},
	},
	header: {
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		marginTop: 40,
		fontWeight: "700",
		fontSize: "17px",
		"& .MuiTypography-h6": {
			fontFamily: "AeonikReg",
			fontSize: "20px",
			fontWeight: 700,
			textAlign: "center",
		},
	},
	sharelink: {
		fontWeight: "900",
		color: "#413AE2",
		padding: "9px 0px 3px",
	},
	logo: {
		width: "22px",
		height: "22px",
		marginRight: "7px",
		marginBottom: "4px",
	},
	eventTitle: {
		fontWeight: "700",
		fontSize: "20px",
		color: "#1E1E22",
		textAlign: "initial",
		fontFamily: "AeonikReg",
	},

	send: {
		// marginLeft: "13px",
		fontWeight: 700,
		width: "100%",
		height: "45px",
		borderRadius: "8px",
		backgroundColor: "#413AE2",
		fontSize: "0.875rem",
		"@media (max-width:400px)": {
			fontSize: "0.635rem",
		},
		[theme.breakpoints.down("xs")]: {
			marginLeft: "0px",
			marginTop: "20px",
			width: "160px",
			"&:focus": {
				outline: "none",
			},
		},
	},

	bottomPadding: {
		paddingBottom: "60px !important",
	},
	cancel: {
		fontWeight: 700,
		width: "100%",
		height: "45px",
		color: "#F43C3C",
		backgroundColor: "white",
		border: "1px solid #F43C3C",
		boxShadow: "none",
		outline: "#F43C3C",
		[theme.breakpoints.down("xs")]: {
			marginLeft: "0px",
			marginTop: "20px",
			width: "160px",
		},
		"&:focus": {
			outline: "none",
		},
		"&:hover": {
			backgroundColor: "white",
		},
	},
	eventHolder: {
		border: "1px solid #E4E4E7",
		borderRadius: "12px",
	},
	eventImage: {
		width: "100%",
		height: "88px",
		objectFit: "cover",
		borderBottomLeftRadius: "12px",
		borderTopLeftRadius: "12px",
		"@media (max-width: 600px)": {
			height: "100%",
			borderTopRightRadius: "12px",
			borderBottomRightRadius: "12px",
			maxHeight: "250px",
		},
	},

	dateMarginBottom: {
		marginBottom: "0px !important",
	},
	details: {
		justifyContent: "space-between",
		"@media (min-width: 600px)": {
			display: "flex",
		},
		width: "100%",
	},

	seeTicket: {
		textTransform: "initial",
		fontWeight: "600",
		background: "#413AE2",
		padding: "8px 35px",
		paddingInline: "40px",
		[theme.breakpoints.down("xs")]: {
			paddingInline: "20px",
		},
		width: "100%",
		border: "1px solid #413AE2",
	},
	link: {
		width: "100%",
		display: "flex",
	},
	image: {
		margin: "15px 43px 50px 0px",
		borderRadius: "10px",
		width: "100%",
	},
	TicketPurchase: {
		fontWeight: "900",
		color: "#413AE2",
		padding: "12px 0px 0px",
	},
	eventinfo: {
		fontSize: "22px",
		marginTop: "-10px",
		fontWeight: "700",
		wordBreak: "break-word",
	},
	PhnxPrice: {
		fontSize: "16px",
		fontWeight: "700",
		color: "#413AE2",
		fontFamily: "Aeonik",
	},
	gridPadding: {
		paddingInline: "15px",
		alignSelf: "center",
	},
	priceAlignment: {
		"@media (min-width: 600px)": {
			textAlign: "end",
			display: "flex",
			justifyContent: "right",
		},
	},
	contentOverflow: {
		overflow: "visible",
	},
	lineSpacing: {
		paddingTop: "15px",
	},
	subHeading: {
		fontWeight: "500",
		fontSize: "15px",
		color: "#73727D",
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: "#4E4E55",
		"&:focus": {
			outline: "none",
		},
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
		"&:focus": {
			outline: "none",
		},
	},
	eventImageHeight: {
		height: "88px !important",
	},
});

const ApprovalModal = (props) => {
	const classes = useStyles();
	const [open, setOpen] = useState(props.open);
	useEffect(() => {
		console.log("props.selectedToken.image", props.selectedToken);
	}, [props]);
	return (
		<Dialog
			open={props.open}
			TransitionComponent={Transition}
			keepMounted
			onClose={props.handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			className={classes.buyTicketModal}
		>
			<IconButton
				aria-label="close"
				className={classes.closeButton}
				onClick={props.handleClose}
			>
				<CloseIcon />
			</IconButton>
			<div>
				<DialogTitle
					id="customized-dialog-title"
					className={classes.header}
				>
					<img
						src={roundlogo}
						className={classes.logo}
						alt="phnx logo"
					/>
					<span style={{ fontSize: "20px" }}>PhoenixDAO</span>
					<Typography
						gutterBottom
						className={`${classes.eventTitle} ${classes.lineSpacing}`}
						style={{
							color: "#73727D",
							fontWeight: "700",
							textAlign: "center",
							lineHeight: "20px",
							color: "#413AE2",
							fontSize: "32px",
						}}
					>
						Buy Ticket
					</Typography>
					<Typography
						className={`${classes.lineSpacing} ${classes.subHeading}`}
					>
						You're about to purchase this ticket
					</Typography>
				</DialogTitle>
				<DialogContent className={classes.contentOverflow}>
					<div className={classes.eventHolder}>
						<Grid className={classes.details}>
							<Grid lg={2} xl={2} md={2} sm={2} xs={12}>
								<img
									src={props.image}
									alt={props.eventTitle}
									className={classes.eventImage}
								/>
							</Grid>
							<Grid
								xs={12}
								lg={7}
								xl={7}
								md={7}
								sm={7}
								className={classes.gridPadding}
							>
								<div>
									<Typography
										gutterBottom
										className={`${classes.eventTitle} text-truncate`}
									>
										{props.eventTitle}
									</Typography>
									<Typography
										style={{
											color: "#73727D",
											fontSize: "17px",
											textAlign: "start",
										}}
									>
										{!props.eventTime
											? `Date`
											: props.eventTime === "onedayevent"
											? moment(props.eventDate).format(
													"Do MMM, YYYY"
											  )
											: `
                ${moment(props.eventStartDate).format("Do MMM")}
                -
                ${moment(props.eventEndDate).format("Do MMM, YYYY")}
                `}
										,{" "}
										{!props.eventStartTime
											? `Time`
											: !props.eventEndTime
											? moment(props.eventStartTime)
													.utcOffset(0)
													.local()
													.format("LT")
											: `${moment(props.eventStartTime)
													.utcOffset(0)
													.local()
													.format("LT")} - ${moment(
													props.eventEndTime
											  )
													.utcOffset(0)
													.local()
													.format("LT")}`}{" "}
										Local
									</Typography>
								</div>
							</Grid>
							<Grid
								xs={12}
								lg={3}
								xl={3}
								md={3}
								sm={3}
								className={classes.gridPadding}
							>
								<div className={classes.priceAlignment}>
									{" "}
									<img
										src={
											props.selectedToken &&
											props.selectedToken.image
										}
										className={classes.logo}
										alt="token logo"
									/>
									<div className={classes.eventinfo}>
										<span
											className={classes.PhnxPrice}
											title={props.phnx_price}
										>
											{pricingFormatter(
												props.phnx_price,
												"PHNX"
											)}
										</span>
										<div
											style={{
												color: "#56555D",
												fontSize: "14px",
											}}
											title={props.dollar_price}
										>
											{/* {dollar_price} */}
											{pricingFormatter(
												props.dollar_price,
												"$"
											)}
										</div>
									</div>
								</div>
							</Grid>
						</Grid>
					</div>
				</DialogContent>
				<DialogActions className={classes.bottomPadding}>
					<Grid
						item
						style={{
							// paddingBottom: "60px",
							paddingLeft: "8px",
							paddingRight: "8px",
							width: "100%",
						}}
						direction="row"
					>
						<Button
							variant="contained"
							color="primary"
							style={{ marginTop: "10px", width: "100%" }}
							className={classes.send}
							onClick={props.giveApproval}
							disabled={
								props.loadingApprove ||
								props.allow != 0 ||
								props.allow == null
							}
						>
							{props.loadingApprove ? (
								<CircularProgress
									style={{
										color: "white",
										width: "15px",
										height: "15px",
									}}
								/>
							) : (
								"Allow the PhoenixDao Events marketplace to use your token"
							)}
						</Button>
						<Button
							variant="contained"
							color="primary"
							style={{ marginTop: "20px", width: "100%" }}
							className={classes.send}
							disabled={
								props.loadingPurchase ||
								props.allow == 0 ||
								props.allow == null
							}
							onClick={props.inquire}
							// onClick={buyTicket}
						>
							{props.loadingPurchase ? (
								<CircularProgress
									style={{
										color: "white",
										width: "15px",
										height: "15px",
									}}
								/>
							) : (
								<div>
									<ShoppingCartOutlined
										style={{ marginRight: "10px" }}
									/>
									{props.buttonText &&
									props.buttonText == " Get Ticket"
										? props.buttonText
										: "Purchase Ticket"}
								</div>
							)}
						</Button>
					</Grid>
				</DialogActions>
			</div>
		</Dialog>
	);
};
export default ApprovalModal;
