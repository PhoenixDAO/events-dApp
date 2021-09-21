import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Link } from "react-router-dom";
import { pricingFormatter } from "../../utils/pricingSuffix";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";
import { ShoppingCartOutlined, Cancel } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
var moment = require("moment");

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiPaper-root": {
			width: "100%",
		},
		textAlign: "center",
		"& .MuiTypography-body1": {
			fontFamily: "AeonikReg",
		},
		"& .MuiButton-label": {
			fontFamily: "Aeonik",
			textTransform: "capitalize",
		},
	},
	bannerImage: {
		paddingInline: "50px",
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
		fontFamily: "AeonikReg",
	},

	// send: {
	//   marginLeft: "13px",
	//   fontWeight: 700,
	//   width: "100%",
	//   height: "45px",
	//   backgroundColor: "#413AE2",
	//   [theme.breakpoints.down("xs")]: {
	//     marginLeft: "0px",
	//     marginTop: "20px",
	//     width: "160px",
	//     "&:focus": {
	//       outline: "none"
	//     }
	//   }

	// },

	send: {
		// marginLeft: "13px",
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
	// cancel: {
	//   marginLeft: "13px",
	//   fontWeight: 700,
	//   width: "100%",
	//   height: "45px",
	//   color: "#F43C3C",
	//   backgroundColor: "white",
	//   border: "1px solid #F43C3C",
	//   boxShadow: "none",
	//   outline: "#F43C3C",
	//   [theme.breakpoints.down("xs")]: {
	//     marginLeft: "0px",
	//     marginTop: "20px",
	//     width: "160px",

	//   },
	//   "&:focus": {
	//     outline: "none"
	//   },
	//   "&:hover": {
	//     backgroundColor: "white"
	//   }
	// },
	bottomPadding: {
		paddingBottom: "60px !important",
	},
	cancel: {
		// marginLeft: "13px",
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
			outline: "none",
		},
		"&:hover": {
			backgroundColor: "white",
		},
	},
	eventHolder: {
		border: "1px solid #E4E4E7",
		borderRadius: "12px",
	},
	eventImage: {
		width: "100%",
		height: "88px",
		objectFit: "cover",
		borderBottomLeftRadius: "12px",
		borderTopLeftRadius: "12px",
		"@media (max-width: 600px)": {
			height: "100%",
			borderTopRightRadius: "12px",
			borderBottomRightRadius: "12px",
			maxHeight: "250px",
		},
	},

	dateMarginBottom: {
		marginBottom: "0px !important",
	},
	details: {
		justifyContent: "space-between",
		// padding: "9px 15px",
		"@media (min-width: 600px)": {
			display: "flex",
		},
		width: "100%",
	},

	seeTicket: {
		// margin: theme.spacing(1),
		textTransform: "initial",
		fontWeight: "600",
		background: "#413AE2",
		padding: "8px 35px",
		paddingInline: "40px",
		[theme.breakpoints.down("xs")]: {
			paddingInline: "20px",
		},
		width: "100%",
		border: "1px solid #413AE2",
	},
	link: {
		width: "100%",
		display: "flex",
		// paddingRight: "13px"
	},
	image: {
		margin: "15px 43px 50px 0px",
		borderRadius: "10px",
		width: "100%",
	},
	TicketPurchase: {
		fontWeight: "900",
		color: "#413AE2",
		padding: "12px 0px 0px",
	},
	eventinfo: {
		fontSize: "22px",
		marginTop: "-10px",
		fontWeight: "700",
		wordBreak: "break-word",
	},
	PhnxPrice: {
		fontSize: "16px",
		fontWeight: "700",
		color: "#413AE2",
		fontFamily: "Aeonik",
	},
	gridPadding: {
		paddingInline: "15px",
		alignSelf: "center",
	},
	priceAlignment: {
		"@media (min-width: 600px)": {
			textAlign: "end",
		},
	},
	contentOverflow: {
		overflow: "visible",
	},
}));
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const styles = (theme) => ({
	// root: {
	//   margin: 0,
	//   padding: theme.spacing(2),
	// },
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
		"&:focus": {
			outline: "none",
		},
	},
	eventImageHeight: {
		height: "88px !important",
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
		// padding: "20px 40px",
		padding: "20px 50px",
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		// padding: theme.spacing(1),
		// padding: "18px"
		padding: "20px 50px 20px 50px",
	},
}))(MuiDialogActions);

export default function BuyTicket({ handleClose, open, eventTitle, image, eventTime, eventStartDate, eventEndDate, eventDate, date, time, phnx_price,dollar_price, buy, buttonText, purchased }) {

  const classes = useStyles();
  const buyTicket = () => {
    buy();
    handleClose();

  }
  return (
    <div >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" TransitionComponent={Transition} open={open} className={classes.root} >
        <DialogTitle id="customized-dialog-title" className={classes.header} onClose={handleClose} >
          <img src={roundlogo} className={classes.logo} alt="phnx logo" />
          <span style={{ fontSize: "20px" }}>PhoenixDAO</span>
          {purchased ?
            <h2 className={classes.TicketPurchase}>
              Ticket Purchase Successful
            </h2> :
            <h2 className={classes.sharelink}>{buttonText}</h2>
          }
          <Typography gutterBottom className={classes.eventTitle} style={{ color: "#73727D", fontWeight: "500" }}>
            {purchased ? null : "You’re about to purchase this ticket"}
          </Typography>

        </DialogTitle>
        <DialogContent className={classes.contentOverflow}>
          <div className={classes.eventHolder}>
            <Grid className={classes.details}>
            
            <Grid lg={2} xl={2} md={2} sm={2} xs={12}>
              <img src={image} alt={eventTitle} className={classes.eventImage} />
            </Grid>
              <Grid xs={12} lg={7} xl={7} md={7} sm={7}  className={classes.gridPadding}>
                <div>
                  <Typography gutterBottom className={`${classes.eventTitle} text-truncate`}>
                    {eventTitle}
                  </Typography>
                  <Typography style={{ color: "#73727D", fontSize: "17px",textAlign: "start"}} >
                    {!eventTime
                      ? `Date`
                      : eventTime === "onedayevent"
                        ? moment(eventDate).format("Do MMM, YYYY")
                        : `
                ${moment(eventStartDate).format("Do MMM")}
                -
                ${moment(eventEndDate).format("Do MMM, YYYY")}
                `},{" "}
                
               {moment(time,"hh:mm A", false).utcOffset(0).format("hh:mma z")}
                  </Typography>
                </div>
                </Grid>
                <Grid  xs={12} lg={3} xl={3} md={3} sm={3} className={classes.gridPadding}>
                <div className={classes.priceAlignment}>
                  <div className={classes.eventinfo}>
                    <span className={classes.PhnxPrice} title={phnx_price}>
                      {pricingFormatter(phnx_price, "PHNX")}
                    </span>
                    <div style={{ color: "#56555D", fontSize: "14px" }} title={dollar_price}>
                      {/* {dollar_price} */}
                      {pricingFormatter(dollar_price, "$")}
                    </div>
                  </div>
                </div>
                </Grid>

            </Grid>

          </div>

        </DialogContent>
        <DialogActions className={(purchased)?"":classes.bottomPadding}>
          {purchased ?
            <Link to="/mytickets/1" className={classes.link}>
              <Button
                variant="contained"
                color="primary"
                // style={{ marginRight: "10px" }}
                className={classes.seeTicket}
                onClick={handleClose}
              > See Ticket</Button></Link> :
            (<Grid item style={{ display: "contents", paddingBottom:
            '60px' }}>
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
                style={{ marginLeft: "10px" }}
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
          <div className={classes.bannerImage}>
          <a href="https://www.travala.com/?ref=phoenixdao" target="_blank">
            <img src="/images/travalla.jpg" className={classes.image} />
            </a>
          </div>
            : null
        }
      </Dialog>
    </div>
  );
}
