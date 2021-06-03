import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
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
					// src="https://app.uniswap.org/#/swap?outputCurrency=0xfe1b6ABc39E46cEc54d275efB4b29B33be176c2A"
					src="https://quickswap.exchange/#/swap?inputCurrency=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&outputCurrency=0x92c59f1cc9a322670cca29594e4d994d48bdfd36"
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
