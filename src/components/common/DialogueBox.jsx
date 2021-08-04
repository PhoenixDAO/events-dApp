import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiPaper-root":{
			borderRadius: "17px",
		}
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(2),
		top: theme.spacing(2),
		color: "#000000",
		"&:focus": {
			outline: "none"
		}
	},
}));
const DialogueBox = (props) => {
	const classes = useStyles();
	
	return (
		<Dialog
			open={props.open}
			TransitionComponent={Transition}
			keepMounted
			onClose={props.handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			maxWidth={props.maxWidth}
			fullWidth={true}
			className={classes.root}
		>
			<DialogTitle id="alert-dialog-slide-title">
				{props.heading}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClose}>
					<CloseIcon />
				</IconButton>

			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					{props.children}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default DialogueBox;
