import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { InputLabel } from "@material-ui/core";
import { AccessTime } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	label: {
		color: "#73727D",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
	inputLabel: {
		marginBottom: "-7px",
	},
	timeAndDate: {
		width: "100%",
	},
	timeHelperText: {
		fontSize: 14,
		fontWeight: 400,
		color: "#73727D",
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const TimePicker = ({
	label,
	id,
	name,
	value,
	errors,
	handlePickerValue,
	fullWidth,
	clearable,
	helperText,
}) => {
	const classes = useStyles();

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<span>
				<InputLabel
					className={classes.inputLabel}
					htmlFor="input-with-icon-adornment"
				>
					<label className={classes.label}>{label}</label>
				</InputLabel>
				<KeyboardTimePicker
					className={classes.timeAndDate}
					keyboardIcon={<AccessTime />}
					margin="normal"
					id={id}
					name={name}
					placeholder="00:00 AM"
					KeyboardButtonProps={{
						"aria-label": "change time",
					}}
					// InputProps={{
					// 	readOnly: true,
					// }}
					fullwidth={fullWidth}
					inputVariant="outlined"
					variant="inline"
					autoOk={true}
					clearable={clearable}
					FormHelperTextProps={{
						classes: {
							root: classes.timeHelperText,
						},
					}}
					value={value}
					// onBlur={(e) => {
					// 	handlePickerValue({
					// 		name,
					// 		value: e,
					// 	});
					// }}
					onChange={(e) => {
						handlePickerValue({
							name,
							value: e,
						});
					}}
					helperText={helperText}
					{...(errors[name] && {
						error: true,
						helperText: errors[name],
					})}
				/>
			</span>
		</MuiPickersUtilsProvider>
	);
};

export default TimePicker;
