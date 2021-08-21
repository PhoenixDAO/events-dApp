import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";
import { ShoppingCartOutlined, Cancel } from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
var moment = require("moment");

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root":
    {
      width: "100%",
    },
    textAlign: "center",
    "& .MuiTypography-body1":{
      fontFamily: "AeonikReg",
    },
    "& .MuiButton-label":{
      fontFamily: 'Aeonik',
      textTransform: "capitalize",
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
    fontFamily:"AeonikReg"

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
  cancel: {
    marginLeft: "13px",
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
      outline: "none"
    },
    "&:hover": {
      backgroundColor: "white"
    }
  },
  eventHolder: {
    display: "flex",
    border: "1px solid #E4E4E7",
    borderRadius: "12px",

  },
  eventImage: {
    width: "86px",
    height: "86px",
    objectFit: "cover",
    borderBottomLeftRadius: "12px",
    borderTopLeftRadius: "12px"

  },

  details: {
    justifyContent: "space-between",
    padding: "9px 15px",
    display: "flex",
    width: "100%"
  },

  seeTicket:{
		margin: theme.spacing(1),
		textTransform: "initial",
		fontWeight: "600",
		background: "#413AE2",
		padding: "8px 35px",
		paddingInline: "40px",
		[theme.breakpoints.down("xs")]: {
			paddingInline: "20px",
		},
    width:"100%",
    		border: "1px solid #413AE2",
  },
  link:{
    width:"97%",
    display:"flex",
    paddingRight:"13px"
  },
  image: {
    margin: "15px 43px 50px",
    borderRadius: "10px",
  },
  TicketPurchase:{
    fontWeight: "900",
    color: "#413AE2",
    padding: "12px 0px 0px",
  }
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
    padding: theme.spacing(1),
    padding: "18px"
  },

}))(MuiDialogActions);


export default function BuyTicket({ handleClose, open, eventTitle, image, eventTime, eventStartDate, eventEndDate,eventDate,date, time, price, buy, buttonText, purchased }) {
  
  const classes = useStyles();
  const buyTicket = () => {
    buy();
    // handleClose();
    handleClose();

  }
  console.log("purchased", purchased);
  return (
    <div >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" TransitionComponent={Transition} open={open} className={classes.root} >
        <DialogTitle id="customized-dialog-title" className={classes.header} onClose={handleClose} >
          <img src={roundlogo} className={classes.logo} alt="phnx logo" />
          <span style={{fontSize:"20px"}}>PhoenixDAO</span>
          {    purchased ? 
          <h2 className={classes.TicketPurchase}>
            Ticket Purchase Successful
          </h2>:
          <h2 className={classes.sharelink}>{buttonText}</h2>
}
          <Typography gutterBottom className={classes.eventTitle} style={{ color: "#73727D", fontWeight: "500" }}>
         {purchased? null: "You’re about to purchase this ticket"}
          </Typography>

        </DialogTitle>
        <DialogContent>
          <div className={classes.eventHolder}>
            <img src={image} alt={eventTitle} className={classes.eventImage} />
            <Grid className={classes.details}>

              <div >
                <Typography gutterBottom className={classes.eventTitle}>
                  {eventTitle}
                </Typography>
                <Typography gutterBottom style={{ color: "#73727D", fontSize: "17px" }} >
                {!eventTime
									? `Date`
									: eventTime === "onedayevent"
									? moment(eventDate).format("Do MMM, YYYY")
									: `
							${moment(eventStartDate).format("Do MMM")}
							-
							${moment(eventEndDate).format("Do MMM, YYYY")}
							`},{time}
                </Typography>
              </div>
              <div style={{ textAlign: "end" }}>
                {price}
              </div>
            </Grid>

          </div>

        </DialogContent>
        <DialogActions>
          {purchased ? 
          <Link to="/mytickets/1" className={classes.link}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              className={classes.seeTicket}
            > See Ticket</Button></Link> :
            (<Grid item style={{display:"contents"}}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
                className={classes.cancel}
                onClick={handleClose}
              >
                <Cancel style={{ marginRight: "7px", fontSize: "19px" }} />
                Cancel Purchase
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
                className={classes.send}

                onClick={buyTicket}
              >
                <ShoppingCartOutlined style={{ marginRight: "10px" }} />
                {buttonText}
              </Button>
              </Grid>)}
        </DialogActions>
        {
          purchased ?
          <img src="/images/travala.svg" className={classes.image} />
          :null
        }
      </Dialog>
    </div>
  );
}

