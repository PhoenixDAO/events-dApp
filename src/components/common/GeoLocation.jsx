import React, { useEffect, useState, useRef } from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

import Geonames from "geonames.js";
import PropTypes from "prop-types";

const geonames = new Geonames({
	username: "thalesandrade",
	lan: "en",
	encoding: "JSON",
});

const useStyles = makeStyles((theme) => ({
	formControl: {
		minWidth: "100%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	label: {
		color: "#999999",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
	},
}));

export default function GeoLocation(props) {
	const classes = useStyles();
	const { locationTitle, geoId, onChange, isCountry, error, value } = props;
	const [options, setOptions] = useState([]);
	const [currentItem, setCurrentItem] = useState("");
	const [labelWidth, setLabelWidth] = useState(0);

	useEffect(() => {
		// setLabelWidth(inputLabel.current.offsetWidth);
	}, []);

	useEffect(() => {
		try {
			const data = async () => {
				(await isCountry)
					? geonames.countryInfo({}).then((res) => {
							// console.log(res);
							setOptions(res.geonames);
					  })
					: geonames.children({ geonameId: geoId }).then((res) => {
							if (res.totalResultsCount) setOptions(res.geonames);
					  });
			};
			data();
		} catch (err) {
			console.error(err);
		}
	}, [geoId, isCountry]);

	// const inputLabel = useRef(null);

	const handleChange = (e) => {
		const { myValue, value } = e.currentTarget.dataset;
		console.log(myValue, value);
		// setCurrentItem(value);
		onChange({ name: myValue, id: value });
	};

	const handleClick = (event) => {
		const { myValue } = event.currentTarget.dataset;
		console.log(myValue.geonameId); // --> 123
	};

	return (
		<FormControl
			variant="outlined"
			className={classes.formControl}
			error={!!error}
		>
			{/* <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
				{locationTitle}
			</InputLabel> */}

			<label className={classes.label}>{locationTitle}</label>

			<Select
				// labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				// value={currentItem}
				value={value.id ? value.id : ""}
				onChange={handleChange}
				// labelWidth={labelWidth}
				displayEmpty
				defaultValue=""
			>
				<MenuItem
					disabled
					value=""
					style={{
						fontFamily: "'Aeonik', sans-serif",
						color: "#73727D",
					}}
				>
					<em>{`Select ${locationTitle}`}</em>
				</MenuItem>
				{options.map((v, index) => (
					<MenuItem
						key={index}
						data-my-value={isCountry ? v.countryName : v.name}
						value={v.geonameId}
						style={{
							fontFamily: "'Aeonik', sans-serif",
						}}
					>
						{isCountry ? v.countryName : v.name}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{error ? error.message : null}</FormHelperText>
		</FormControl>
	);
}

GeoLocation.propTypes = {
	locationTitle: PropTypes.string,
	geoId: PropTypes.node,
	isCountry: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

GeoLocation.defaultProps = {
	onChange: undefined,
};
