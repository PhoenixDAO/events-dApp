import React, { useState, useEffect } from "react";
import {
	generateJSON,
	getEventName,
	getTimeData,
	getTodayData,
} from "../../utils/graphApis";
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
		props.executeScroll();
	}, []);

	const loadApis = async () => {
		const eventName = await getEventName("0xC63bff977d249606836063e832C96c184b75958C");
		setEventName(eventName);
		if (eventName.length != 0) {
			const tickets = await generateJSON(eventName[0].eventId);
			setTicketSales(tickets);
		}
		const blockChainTickets = await props.eventsContract.methods
			.ticketsOf("0xC63bff977d249606836063e832C96c184b75958C")
			.call();
		setTicketBought(blockChainTickets.length);
		// const timeData = await getTimeData("0xC63bff977d249606836063e832C96c184b75958C");
		const createdDate = moment().minutes(0).seconds(0).unix();
		const todayData = await getTodayData(
			"0xC63bff977d249606836063e832C96c184b75958C",
			Number(createdDate - 86400)
		);
		setTodayGraphData(todayData);
		const timeData = await getTimeData("0xC63bff977d249606836063e832C96c184b75958C");
		setGraphData(timeData);
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
		/>
	);
};

AnalyticsWrapper.contextTypes = {
	drizzle: PropTypes.object,
};
const mapStateToProps = (state) => {
	return {
		accounts: state.accounts[0],
		networkId: state.web3.networkId,
	};
};

const AppContainer = drizzleConnect(AnalyticsWrapper, mapStateToProps);
export default AppContainer;