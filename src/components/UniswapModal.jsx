import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Autocomplete } from "@material-ui/lab";

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
                <i
                  className="fa fa-times fa-1x"
				  onClick={this.props.handleClose}
				  style={{display: "flex",
					justifyContent: "flex-end",
					padding: "7px",
					zIndex: "1",
				}}
                ></i>

				<iframe
					src="https://app.uniswap.org/#/swap?outputCurrency=0xfe1b6ABc39E46cEc54d275efB4b29B33be176c2A"
					height="660px"
					width="100%"
                    className="frame"
					style={{
						border: "0",
						margin: "0 auto",
						display: "block",
						maxWidth: "900px",
						overflow:"auto",
						marginTop:"-30px",
					}}
					id="myId"
				/>
			
	
		</Dialog>
		);
	}
}
export default UniswapModal;
