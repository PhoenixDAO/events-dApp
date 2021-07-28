import React, { useState, useEffect } from "react";
import {
	generateJSON,
	getEventName,
	getTimeData,
	getTodayData,
	getPhoenixDAOMarketValue,
} from "../utils/graphApis";
import Analytics from "./Analytics";
import PropTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";
import moment from "moment";

const AnalyticsWrapper = (props) => {
	const [eventName, setEventName] = useState([]);
	const [TicketSales, setTicketSales] = useState([]);
	const [ticketBought, setTicketBought] = useState(0);
	const [graphData, setGraphData] = useState([]);
	const [todayGraphData, setTodayGraphData] = useState([]);
	useEffect(() => {
		loadApis();
	}, []);
	const loadApis = async () => {
		const eventName = await getEventName(props.accounts);
		setEventName(eventName);
		if (eventName.length != 0) {
			const tickets = await generateJSON(eventName[0].eventId);
			setTicketSales(tickets);
		}
		const blockChainTickets = await props.eventsContract.methods
			.ticketsOf(props.accounts)
			.call();
		setTicketBought(blockChainTickets.length);
		// const timeData = await getTimeData(props.accounts);
        const todayData = await getTodayData(
			"0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b",
			Number(moment().unix() - 86400)
		);
		console.log("time stamp--- ", moment().unix());
		console.log("todayData", todayData);
		setTodayGraphData(todayData);
        
		const timeData = await getTimeData(
			"0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b"
		);
		console.log("timeData", timeData);
		setGraphData(timeData);
		console.log("timestamp", Number(moment().unix()));
	};

	const handleEvent = async (event) => {
		const tickets = await generateJSON(Number(event.target.value));
		setTicketSales(tickets);
	};

	return (
		<Analytics
			eventName={eventName}
			TicketSales={TicketSales}
			ticketBought={ticketBought}
			graphData={graphData}
			todayGraphData={todayGraphData}
			handleEvent={handleEvent}
			// NumbergraphData={props.NumbergraphData}
		/>
	);
};

// export default AnalyticsWrapper

AnalyticsWrapper.contextTypes = {
	drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {
	return {
		// contracts: state.contracts,
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(AnalyticsWrapper, mapStateToProps);
export default AppContainer;
