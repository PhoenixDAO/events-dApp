import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function PhoenixDAOLoader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={60}/>
    </div>
  );
}

export default PhoenixDAOLoader;
