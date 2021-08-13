import React from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	textField: {
		margin: theme.spacing(1),
		color: "#C1C1C1",
		// "@media screen and (max-width: 1500px) and (min-width: 1300px)": {
		// 	left: "7%",
		// },
		// "@media screen and (min-width: 1500px) ": {
		// 	left: "12%",
		// },
	},
	textFieldMargin: {
		left: "0",
	},
	input: {
		maxHeight: 44,
		// maxWidth: 233,
	},
}));

const SearchBar = ({ connect }) => {
	const classes = useStyles();
	return (
		<TextField
			className={clsx(
				classes.textField,
				connect && classes.textFieldMargin
			)}
			id="input-with-icon-textfield"
			variant="outlined"
			placeholder="Search for events"
			size="medium"
			InputProps={{
				className: classes.input,
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon style={{ color: "#C1C1C1" }} />
					</InputAdornment>
				),
			}}
		/>
	);
};

export default SearchBar;
