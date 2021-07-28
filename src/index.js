import React from "react";
import ReactDOM from "react-dom";
import { DrizzleProvider } from "drizzle-react";
import App from "./components/App";
import Web3 from "web3";
import OpenEvents from "./config/OpenEvents.json";
// import {Open_events_Address} from './config/OpenEvents'
// import StableToken from "./config/StableToken.json";
import { INFURA_URL, INFURA_WEB_URL } from "./config/const.js";
//revamp
// import { Drizzle } from "@drizzle/store";
// import { drizzleReactHooks } from "@drizzle/react-plugin";
import {
	createMuiTheme,
	ThemeProvider,
	makeStyles,
} from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

// var web3s = new Web3(window.ethereum);
const options = {
	web3: {
		customProvider: new Web3(INFURA_URL),
		fallback: {
			type: "ws",
			url: INFURA_WEB_URL,
		},
	},

	contracts: [OpenEvents],
	// contracts : [{
	// 	contractName: 'OpenEvents',
	// 	web3Contract: new web3s.eth.Contract(OpenEvents.abi, Open_events_Address, {data: OpenEvents.deployedBytecode }) // An instance of a Web3 contract
	//   }],

	events: {
		OpenEvents: ["CreatedEvent", "SoldTicket"],
	},
	polls: {
		blocks: 2500,
	},

	transactions: {
		txHash: {},
	},
};

const theme = createMuiTheme({
	palette: {
		// primary: {
		// 	main: "#00F",
		// },
		background: {
			default: "#FBFBFE",
		},
	},
	overrides: {
		MuiButton: {
			"&:hover, &:focus ": {
				outline: "none",
			},
		},
		MuiIconButton: {
			outline: "none",
		},
	},
});

// setup drizzle
// const drizzle = new Drizzle(options);
// const { DrizzleProvider } = drizzleReactHooks;

// const account_login = localStorage.getItem("account");
// let appPassword = localStorage.getItem("app_password");
// if (
// 	!account_login ||
// 	!appPassword ||
// 	appPassword != process.env.REACT_APP_PASSWORD
// ) {
// 	appPassword = prompt("App password");
// 	localStorage.setItem("app_password", appPassword);
// }
// if (appPassword == process.env.REACT_APP_PASSWORD) {
// const account_login = localStorage.getItem("account");
// let appPassword = localStorage.getItem("app_password");
// if (
// 	!account_login ||
// 	!appPassword ||
// 	appPassword != process.env.REACT_APP_PASSWORD
// ) {
// 	appPassword = prompt("App password");
// 	localStorage.setItem("app_password", appPassword);
// }
// if (appPassword == process.env.REACT_APP_PASSWORD) {

ReactDOM.render(
	<DrizzleProvider options={options}>
		<App />
	</DrizzleProvider>,
	document.getElementById("root")
);
// } else {
// 	alert("Wrong password");
// }
// }
