import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { FormControl, TextField, InputAdornment, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Send } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";
import { ShoppingCartOutlined, Cancel } from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root":
    {
      width: "100%",
    },
    textAlign: "center",
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
    fontWeight: "700",
    fontSize: "20px",
    color: "#1E1E22",
    textAlign: "initial",

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
    width: "80px",
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
    padding: "20px"
  },

}))(MuiDialogActions);

export default function BuyTicket({ handleClose, open, eventTitle, image, date, time, price, buy }) {
  const [address, setAddress] = useState("");
  const classes = useStyles();
  const buyTicket = () => {
    buy();
    // handleClose();
    handleClose();

  }
  return (
    <div >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" TransitionComponent={Transition} open={open} className={classes.root} >
        <DialogTitle id="customized-dialog-title" className={classes.header} onClose={handleClose} >
          <img src={roundlogo} className={classes.logo} alt="phnx logo" />
          PhoenixDAO
          <h2 className={classes.sharelink}>
            Buy Ticket
          </h2>
          <Typography gutterBottom className={classes.eventTitle} style={{ color: "#73727D", fontWeight: "500" }}>
            You’re about to purchase this ticket
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
                  {date},{time}
                </Typography>
              </div>
              <div>
                {price}
              </div>
            </Grid>

          </div>

        </DialogContent>
        <DialogActions>
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
            Get Ticket									</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

