import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 60,
    height: 46,
    display: 'flex',
  },
  switchBase: {
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
    "&.MuiSwitch-switchBase":{
        top: "6px",
    left: "8px",
    }
  },
  thumb: {
    width: 16,
    height: 16,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 35,
    opacity: 1,
    backgroundColor: "#FFC700"
  },
  checked: {
    backgroundColor: theme.palette.common.white,

  },
}))(Switch);

export default function ThemeSwitch() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(!checked);
  };

  return (
     
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <AntSwitch checked={checked} onChange={handleChange} name="checkedC" />
          </Grid>
          <Grid item style={{fontSize:"18px"}}>{checked ? "Ashes":"Fire"}</Grid>
        </Grid>
      </Typography>
  );
}
