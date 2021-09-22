import React, { Component } from 'react';

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

class ApprovalModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open:this.props.open
        }
    }
    
    render() {
     return(
        <Dialog
        open={this.props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
    >
        <DialogTitle id="alert-dialog-slide-title">
            {`Allow PhoenixDAO Events Marketplace to spend your PHNX?`}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            {`Do you trust this site? By granting this permission, you’re allowing PhoenixDAO Events Marketplace to withdraw your PHNX and automate transactions for you.`}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
                Disagree
            </Button>
            <Button onClick={this.props.giveApproval} color="primary">
                Agree & Approve
            </Button>
        </DialogActions>
    </Dialog>
     )
    }
}
export default ApprovalModal;