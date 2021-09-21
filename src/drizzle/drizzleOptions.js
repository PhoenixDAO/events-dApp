import OpenEvents from "../config/OpenEvents.json";
import StableToken from "../config/StableToken.json";
import { INFURA_URL } from "../config/const.js";
import Web3 from "web3";


const options = {
	web3: {
		customProvider: new Web3(INFURA_URL),
	},

	contracts: [
		OpenEvents,
		// StableToken
	],

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

export default options;