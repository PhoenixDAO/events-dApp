import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { FormControl, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Send } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import { useForm, Controller } from "react-hook-form";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiPaper-root": {
			width: "100%",
		},
		"& .MuiTypography-body1": {
			fontFamily: "AeonikReg",
		},
		"& .MuiButton-label": {
			fontFamily: "Aeonik",
			textTransform: "capitalize",
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
		textAlign: "center",
		fontSize: "17px",
		color: "#4E4E55",
	},
	SocialMediaDiv: {
		margin: "30px 0px 20px",
	},
	UrlField: {
		width: "100%",
		margin: "0px auto",
	},
	share: {
		color: "#4E4E55",
		textAlign: "center",
		marginBottom: "60px",
	},
	copyButton: {
		"&:focus": {
			outline: "none",
		},
	},
	ethereum: {
		fontSize: "14px",
		color: "#73727D",
	},
	send: {
		marginLeft: "13px",
		fontWeight: 700,
		width: "100%",
		height: "45px",
		backgroundColor: "#413AE2",
		[theme.breakpoints.down("xs")]: {
			marginLeft: "0px",
			marginTop: "20px",
			width: "160px",
			"&:focus": {
				outline: "none",
			},
		},
	},
}));
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
		"&:focus": {
			outline: "none",
		},
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;

	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="div">{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			)}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: "20px 40px",
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		// padding: theme.spacing(1),
		padding: "20px",
	},
}))(MuiDialogActions);

export default function sendTicket({
	handleClose,
	open,
	eventTitle,
	sendTicket2,
	eventId,
}) {
	const [address, setAddress] = useState("");
	const classes = useStyles();
	const { handleSubmit, control, register } = useForm();
	const [errorAddress, setErrorAddress] = useState(false);

	const accountChange = (event) => {
		setAddress(event.target.value);
	};
	const send = () => {
		const isaddress = Web3.utils.isAddress(address);
		if (!isaddress) {
			setErrorAddress(true);
		}
		else {
			sendTicket2(address, eventId);
			handleClose();
		}
	};
	return (
		<div>
			<Dialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				className={classes.root}
				TransitionComponent={Transition}
			>
				<DialogTitle
					id="customized-dialog-title"
					className={classes.header}
					onClose={handleClose}
				>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<img
							src={roundlogo}
							className={classes.logo}
							alt="phnx logo"
						/>
						<span style={{ fontSize: "20px" }}>PhoenixDAO</span>
					</div>
					<h2
						className={classes.sharelink}
						style={{ textAlign: "center" }}
					>
						Send Ticket
					</h2>

					<Typography gutterBottom className={classes.eventTitle}>
						{eventTitle}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<h5 className={classes.ethereum}>WALLET ADDRESS</h5>

					<FormControl
						variant="outlined"
						lg={12}
						className={classes.UrlField}
					>
						<Controller
							name="eventOrganizer"
							control={control}
							defaultValue=""
							render={({
								field: { onChange, value },
								fieldState: { error },
							}) => (
								<TextField
									id="outlined-helperText"
									label=""
									value={address}
									variant="outlined"
									error={errorAddress || error}
									helperText={
										errorAddress
											? "Invalid account address"
											: error
											? error.message
											: null
									}
									onChange={(e) => {
										onChange(e);
										accountChange(e);
									}}
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
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						color="primary"
						style={{ marginRight: "10px" }}
						className={classes.send}
						onClick={send}
					>
						<Send
							style={{ marginRight: "7px", fontSize: "19px" }}
						/>
						Send Ticket
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
