import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
	main: {
		paddingTop: "13px",
		paddingBottom: "13px",
		// height: 68,
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: "#FFFFFF",
		paddingLeft: 28,
		border: " 0.5px solid #E4E4E7",
		borderRadius: 8,
	},
	nearStyleBlack: {
		fontSize: 27,
		fontWeight: "400px",
		fontFamily: '"AeonikReg" ,sans-serif',
		color: "#4E4E55",
	},
	nearStyleBlue: {
		fontSize: 27,
		fontWeight: "500px",
		fontFamily: '"Aeonik" ,sans-serif',
		color: "#413AE2",
	},
}));

const NearToYou = ({ getCityName }) => {
	const classes = useStyles();
	const [cityName, setCityName] = useState("Unknown");
	const [stateName, setStateName] = useState("Unknown");
	const [permission, setPermission] = useState("");

	useEffect(() => {
		geoFindMe1();
	}, []);

	useEffect(() => {
		getCityName(cityName);
	}, [cityName]);

	async function success(pos) {
		// console.log("success", pos);
		var crd = pos.coords;
		if (crd) {
			let lat = crd.latitude;
			let lng = crd.longitude;
			let apikey = process.env.REACT_APP_HERE_API_KEY;
			const get = await axios.get(
				`https://places.ls.hereapi.com/places/v1/discover/search?at=${lat},${lng}&q=${lat},${lng}&apikey=${apikey}`
			);
			if (get.data) {
				const city = get.data.search.context.location.address.city;
				const state = get.data.search.context.location.address.country;
				setCityName(city ? city : "Unknown");
				setStateName(state ? state : "Unknown");
			}
		}
	}

	async function errors(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	const geoFindMe1 = async () => {
		try {
			if (!navigator.geolocation) {
				alert("Geolocation is not supported by your browser");
			} else {
				navigator.permissions
					.query({ name: "geolocation" })
					.then(async function (result) {
						setPermission(result.state);
						if (result.state === "granted") {
							// console.log(result.state);
							//If granted then you can directly call your function here
							navigator.geolocation.getCurrentPosition(
								success,
								errors
							);
						} else if (result.state === "prompt") {
							navigator.geolocation.getCurrentPosition(
								success,
								errors
							);
						} else if (result.state === "denied") {
							//If denied then you have to show instructions to enable location
							console.log("user denied");
						}
						result.onchange = function () {
							console.log("result.state", result.state);
						};
					});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<span>
			{permission === "denied" ? (
				<div className={classes.main}>
					<span>
						<span>
							We're are having trouble finding you. Check your{" "}
							<a
								target="_blank"
								href="https://support.google.com/chrome/answer/142065?hl=en"
							>
								location access.
							</a>
						</span>
					</span>
				</div>
			) : (
				<div className={classes.main}>
					<span>
						<span className={classes.nearStyleBlack}>
							Events within{" "}
						</span>
						<span className={classes.nearStyleBlue}>50 Miles </span>
						<span className={classes.nearStyleBlack}>of </span>
						<span className={classes.nearStyleBlue}>
							{cityName}, {stateName}
						</span>
					</span>
				</div>
			)}
			<br />
			<br />
		</span>
	);
};

export default NearToYou;
