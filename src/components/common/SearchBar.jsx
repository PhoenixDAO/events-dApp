import React from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	textField: {
		// margin: theme.spacing(1),
		"@media (min-width: 470px)":{
			marginBottom: theme.spacing(1),
			marginTop: "8px",
		},
		"@media (max-width: 450px)":{
			marginTop:"5px",
			width: "100%",
		},
		marginRight: theme.spacing(1),
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
		maxHeight: 43,
		// maxWidth: 233,
	},
}));

const SearchBar = (props) => {
	const classes = useStyles();
	return (
		<TextField
			className={clsx(
				classes.textField,
				props.connect && classes.textFieldMargin
			)}
			id="input-with-icon-textfield"
			value={props.search}
			variant="outlined"
			placeholder="Search for events"
			size="medium"
			onChange={(e) => props.handleSearch(e.target.value)}
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
