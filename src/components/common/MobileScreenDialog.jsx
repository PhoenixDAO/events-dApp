import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { setISODay } from "date-fns/esm";
import roundlogo from "../Images/roundlogo.svg";
import { Button } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiPaper-root": {
			borderRadius: "17px",
		},
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(2),
		top: "2%",
		color: "#000000",
        opacity:"60%",
		"&:focus": {
			outline: "none",
		},
	},
	displayBlockModal: {
		display: "block",
	},
	displayNoneModal: {
		display: "none !important",
	},
	modal: {
        display: "none",
		"@media (max-width: 600px)": {
            display: "block",
            letterSpacing:"1px",
			position: "fixed" /* Stay in place */,
			zIndex: "1000" /* Sit on top */,
			paddingTop: "40%" /* Location of the box */,
			left: "0",
			top: "0",
			width: "100%" /* Full width */,
			height: "100%" /* Full height */,
			overflow: "auto" /* Enable scroll if needed */,
			backgroundColor: "#ffffff" /* Fallback color */,
            padding:"40% 25px",
            overflow: "hidden",
            fontSize: '16px',
    lineHeight: '25px',
			// backgroundColor: 'rgba(0,0,0,0.4)', /* Black w/ opacity */
		},
	},

	Message: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
		background: "#FFFFFF",
		padding: "25px",
		textAlign: "center",
        position: "relative",
        borderRadius:"15px",
        boxShadow:"rgb(0 0 0 / 15%) 0px 5px 20px",
	},
	Heading: {
        fontSize:"22px",
		fontWeight: "bolder",
		padding: "30px 0px 0px 0px",
		fontFamily: "'Aeonik', sans-serif",
        borderRadius:"15px"
	},
	paragraph: {
		fontFamily: "'Aeonik', sans-serif",
        padding:"30px 40px 30px 40px",
        justifyContent:"center",
        color:"#4E4E55",
        fontWeight: "lighter",
	},
}));
const MobileScreenDialog = (props) => {
	const classes = useStyles();
	const [isOpen, setIsOpen] = useState(true);

	const handleCloseScreen = () => {
		setIsOpen(false);
	};

	return (
		<div
			id="myModal"
			className={`${classes.modal}  ${
				isOpen ? classes.displayBlockModal : classes.displayNoneModal
			}`}
		>
			<div className={`${classes.Message}`}>
				<div>
					<h2 className={classes.Heading}>
						<img
							src={roundlogo}
							className={classes.logo}
							alt="phnx logo"
						/>
						<span style={{  paddingLeft: "10px" }}>
							PhoenixDAO
						</span>
					</h2>
					<IconButton
						aria-label="close"
						className={classes.closeButton}
						onClick={handleCloseScreen}
					>
						<CloseIcon />
					</IconButton>
				</div>
				<div className={classes.paragraph}>
					<p>
						You may not enjoy the best user experience on mobile now
						as it's still being worked on, in the meantime use the
						web version for best experience
					</p>
				</div>
			</div>
		</div>
	);
};

export default MobileScreenDialog;
