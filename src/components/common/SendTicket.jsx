import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { FormControl, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Send } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root":
    {
      width: "100%",
    }
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
    padding: "12px 0px",
  },
  logo: {
    width: "22px",
    height: "22px",
    marginRight: "7px"
  },
  eventTitle: {
    textAlign: "center",
    fontSize: "17px",
    color: "#4E4E55"
  },
  SocialMediaDiv: {
    margin: "30px 0px 20px",
  },
  UrlField: {
    width: "100%",
    margin: "0px auto"
  },
  share: {
    color: "#4E4E55",
    textAlign: "center",
    marginBottom: "60px"
  },
  copyButton: {
    "&:focus": {
      outline: "none"
    }
  },
  ethereum: {
    fontSize: "14px",
    color: "#73727D"
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
        outline: "none"
      }
    }

  },



}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    "&:focus": {
      outline: "none"
    }
  },

});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="div">{children}</Typography>
      {console.log("onclose", onClose)}
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>}
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
    padding: "20px"
  },

}))(MuiDialogActions);

export default function sendTicket({ handleClose, open, eventTitle, sendTicket2, eventId }) {
  const [address, setAddress] = useState("");
  const classes = useStyles();

  const accountChange = (event) => {
    setAddress(event.target.value);
    console.log("address", address);
  }
  const send = () => {

    console.log("props", sendTicket2)
    handleClose();
    sendTicket2(address, eventId);
  }
  return (
    <div >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className={classes.root} >
        <DialogTitle id="customized-dialog-title" className={classes.header} onClose={handleClose} >
          <img src={roundlogo} className={classes.logo} alt="phnx logo" />
  PhoenixDAO
  <h2 className={classes.sharelink}>
            Send Ticket
  </h2>

          <Typography gutterBottom className={classes.eventTitle}>
            {eventTitle}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <h5 className={classes.ethereum}>ETHEREUM ADDRESS</h5>

          <FormControl variant="outlined" lg={12} className={classes.UrlField}>

            <TextField
              id="outlined-helperText"
              label=""
              onChange={accountChange}
              value={address}
              variant="outlined"
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
            <Send style={{ marginRight: "7px", fontSize: "19px" }} />
										Send Ticket
									</Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}

