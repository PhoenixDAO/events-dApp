import React from "react";
import ReactDOM from "react-dom";
import { DrizzleProvider } from "drizzle-react";
import App from "./components/App";
import Web3 from "web3";
import OpenEvents from "./config/OpenEvents.json";
import StableToken from "./config/StableToken.json";

const options = {
	web3: {
		customProvider: new Web3(
			"https://rinkeby.infura.io/v3/98ae0677533f424ca639d5abb8ead4e7"
		),
	},

	contracts: [OpenEvents, StableToken],

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

const account_login = localStorage.getItem("account");
let appPassword = localStorage.getItem("app_password");
if (
	!account_login ||
	!appPassword ||
	appPassword != process.env.REACT_APP_PASSWORD
) {
	appPassword = prompt("App password");
	localStorage.setItem("app_password", appPassword);
}
if (appPassword == process.env.REACT_APP_PASSWORD) {
	ReactDOM.render(
		<DrizzleProvider options={options}>
			<App />
		</DrizzleProvider>,
		document.getElementById("root")
	);
} else {
	console.log("Wrong password");
}
