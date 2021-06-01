import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { FormControl, TextField, InputAdornment, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import roundlogo from "../Images/roundlogo.svg";
import { makeStyles } from "@material-ui/core/styles";
import SocialMedia from './SocialMedia';
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles((theme) => ({

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
    paddingTop: "12px",
  },
  logo: {
    width: "22px",
    height: "22px",
    marginRight: "7px"
  },
  eventUrl: {
    textAlign: "center",
    fontSize: "14px",
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
      <Typography variant="h6">{children}</Typography>
      {console.log("onclose",onClose)}
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

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//     padding: "20px"
//   },

// }))(MuiDialogActions);

export default function ShareModal({ handleClose,open, titleURL }) {

  const [isCopied, setIsCopied] = useState(false);

  const classes = useStyles();
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  let URL = "events.phoenixdao.io" + titleURL
  return (
    <div>
      {console.log("props", open)}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" className={classes.header} onClose={handleClose}>
          <img src={roundlogo} className={classes.logo} alt="phnx logo" />
  PhoenixDAO
  <h2 className={classes.sharelink}>
            Share Event Link
  </h2>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom className={classes.eventUrl}>
            Event Url

          </Typography>
          <FormControl variant="outlined" lg={12} className={classes.UrlField}>

            <TextField
              id="outlined-helperText"
              label=""
              value={URL}
              defaultValue={URL}
              variant="outlined"
              // endAdornment={<InputAdornment position="end">    <i class="far fa-copy"></i>    </InputAdornment>}

              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" >
                    <CopyToClipboard text={URL} onCopy={onCopyText}>

                      <IconButton
                        className={classes.copyButton}
                        aria-label="copy text"
                      >
                        <span style={isCopied ? { fontSize: "14px" } : { color: "#413AE2" }}>{isCopied ? "Copied!" : <i class="far fa-copy fa-md"></i>
                        }</span>

                      </IconButton>
                    </CopyToClipboard>

                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <Grid lg={12} className={classes.SocialMediaDiv}>
            <SocialMedia />
          </Grid>
          <h5 className={classes.share}>Share on Social Media</h5>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

