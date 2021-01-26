import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="standard" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    opacity:"1 !important",
    zIndex:"999999999999999 !important",
  
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    "&.MuiSnackbar-anchorOriginTopCenter":{
      zIndex:"99999999 !important"
          },
  },
    "&.MuiSnackbar-root":{
      zIndex:"99999999 !important"
          },
}));
    
export default function CustomizedSnackbars(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} anchorOrigin={{ vertical:'top', horizontal:"center" }}  autoHideDuration={4000} onClose={()=>props.handleClose()}>
        <Alert  severity="error">
        {props.message}
        </Alert>
      </Snackbar>

    </div>
  );
}