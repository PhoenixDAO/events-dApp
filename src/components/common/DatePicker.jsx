import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { InputLabel } from "@material-ui/core";

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
	dateHelperText: {
		fontSize: 14,
		fontWeight: 400,
		color: "#73727D",
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const DatePicker = ({
	label,
	id,
	name,
	value,
	errors,
	handlePickerValue,
	fullWidth,
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
				<KeyboardDatePicker
					fullWidth={fullWidth}
					disableToolbar
					variant="inline"
					format="dd-MM-yyyy"
					margin="normal"
					id={id}
					name={name}
					KeyboardButtonProps={{
						"aria-label": "change date",
					}}
					// InputProps={{
					// 	readOnly: true,
					// }}
					FormHelperTextProps={{
						classes: {
							root: classes.dateHelperText,
						},
					}}
					inputVariant="outlined"
					autoOk={true}
					disablePast
					placeholder="DD-MM-YYYY"
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
					{...(errors[name] && {
						error: true,
						helperText: errors[name],
					})}
				/>
			</span>
		</MuiPickersUtilsProvider>
	);
};

export default DatePicker;
