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
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
    
export default function CustomizedSnackbars(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} anchorOrigin={{ vertical:'top', horizontal:"center" }}  autoHideDuration={4000} onClose={()=>props.handleClose()}>
        <Alert  severity="error">
        {props.message}{typeof InstallTrigger !== 'undefined'? <a target="_blank" style={{textAlign:"center"}} href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"> [LINK]</a> : <a target="_blank" style={{textAlign:"center"}} href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"> [LINK]</a>}
        </Alert>
      </Snackbar>

    </div>
  );
}