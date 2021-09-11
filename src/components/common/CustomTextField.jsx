import React from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	label: {
		color: "#73727D",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
}));

const CustomTextField = ({
	id,
	name,
	fullWidth,
	value,
	handleInputValue,
	errors,
	label,
}) => {
	const classes = useStyles();

	return (
		<span>
			<label className={classes.label}>{label}</label>
			<TextField
				id={id}
				name={name}
				fullWidth={fullWidth}
				variant="outlined"
				inputProps={{ maxLength: 100 }}
				value={value}
				onBlur={handleInputValue}
				onChange={handleInputValue}
				{...(errors[name] && {
					error: true,
					helperText: errors[name],
				})}
			/>
		</span>
	);
};

export default CustomTextField;
