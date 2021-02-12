import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class UniswapModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.open,
		};
	}

	render() {
		console.log("hereeeeeee");
		return (
			<Dialog
				open={this.props.open}
				TransitionComponent={Transition}
				keepMounted
				onClose={this.props.handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				style={{ maxWidth: "100%" }}
			>
				<iframe
					src="https://app.uniswap.org/#/swap?outputCurrency=0x38A2fDc11f526Ddd5a607C1F251C065f40fBF2f7"
					height="660px"
					width="100%"
                    className="frame"
					style={{
						border: "0",
						margin: "0 auto",
						display: "block",
						maxWidth: "900px",
						minWidth: "450px",
					}}
					id="myId"
				/>
			</Dialog>
		);
	}
}
export default UniswapModal;
