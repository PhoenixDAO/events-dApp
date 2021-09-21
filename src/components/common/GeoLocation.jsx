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
		maxWidth: "100%",
		"& .MuiSelect-outlined.MuiSelect-outlined": {
			"@media (max-width: 1375px) and (min-width:1280px)": {
				paddingLeft: "10px !important",
				paddingRight: "20px !important",
			},
		},
		// "@media (max-width: 1375px) and (min-width:1280px)":{
		// 	minWidth:"80%"
		// },
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	label: {
		color: "#73727D",
		fontSize: 15,
		fontWeight: 500,
		fontFamily: "'Aeonik', sans-serif",
		textTransform: "uppercase",
	},
	selectLocationPadding: {
		paddingLeft: "0px !important",
		paddingRight: "0px !important",
	},
}));

export default function GeoLocation(props) {
	const classes = useStyles();
	const {
		locationTitle,
		geoId,
		onChange,
		isCountry,
		error,
		value,
		id,
		name,
	} = props;
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
							setOptions(res.geonames);
					  })
					: geonames.children({ geonameId: geoId }).then((res) => {
							if (res.totalResultsCount){
								setOptions(res.geonames);
							}
							else{
								setOptions([])
							}
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
		// setCurrentItem(value);
		onChange({ name: name, value: { name: myValue, id: value } });
	};

	const handleClick = (event) => {
		const { myValue } = event.currentTarget.dataset;
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
				id={id}
				name={name}
				// value={currentItem}
				value={value.id ? value.id : ""}
				onChange={handleChange}
				// labelWidth={labelWidth}
				displayEmpty
				defaultValue=""
				className={classes.selectLocationPadding}
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
