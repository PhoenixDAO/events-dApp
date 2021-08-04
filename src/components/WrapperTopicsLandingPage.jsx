import React, { useEffect, useState } from "react";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import axios from "axios";
import TopicsLandingPage from "./TopicsLandingPage";
import topicsJson from "../config/topics.json";

const WrapperTopicsLandingPage = (props) => {
	const [loading, setLoading] = useState(true);
	const [Topic_Events, setTopicEvents] = useState([]);
	const [topic_copy, setTopicCopy] = useState([]);
	const [active_length, setActiveLength] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [eventObj, setEventObj] = useState({});

	useEffect(() => {
		loadBlockchain();
	}, []);

	const loadBlockchain = async () => {
		setLoading(true);
		setTopicEvents([]);
		setActiveLength(0);
		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
			  {
				eventsRemoveds {
				  id
				  eventId
				}
			  }
			  `,
			},
		});
		if (isActive) {
			console.log("this called", isActive);
			const event = await loadActiveEvents();
			console.log("EVENTS", event);
			let eventObj = {};
			if (event.length > 0) {
				for (let i = 0; i < event.length; i++) {
					let objHolder = eventObj[event[i].topic];
					if (objHolder) {
						objHolder.eventCount = objHolder.eventCount + 1;
					} else {
						eventObj[event[i].topic] = event[i];
						eventObj[event[i].topic].eventCount = 1;
						if (topicsJson[event[i].topic]) {
							eventObj[event[i].topic].image =
								topicsJson[event[i].topic].image;
							eventObj[event[i].topic].name =
								topicsJson[event[i].topic].name;
						} else {
							eventObj[event[i].topic].image = "/images/PhoenixDAO.png"
							eventObj[event[i].topic].name = "Some topic name"
						}
					}
				}
			}
			delete eventObj["topic name"];
			delete eventObj["musfira topic name"];
			delete eventObj["topic name free"];

			setEventObj(eventObj);
			console.log("eventObj", eventObj);
		} else {
			console.log("this called", isActive);
			loadPastEvents();
		}
	};

	//Get My Active Events on Blockchain
	const loadActiveEvents = async () => {
		setLoading(true);
		setTopicEvents([]);
		setActiveLength(0);
		// GRAPH BLOCK //
		try {
			const graphEvents = await axios({
				url: graphURL,
				method: "post",
				data: {
					query: `
				{
					events(orderBy:eventId orderDirection:asc) {
						id
						eventId
						owner
						name
						topic
						location
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						duration
						catTktQuantity
						catTktQuantitySold	
						categories
						prices
						eventRevenueInDollar
						eventRevenueInPhnx
					}
				  }
  	`,
				},
			});
			// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)
			if (!graphEvents.data || graphEvents.data.data == "undefined") {
				// console.log("GraphQL query -- graphEvents undefined")
				setLoading(false);
				setTopicEvents([]);
				setActiveLength(0);
				return [];
			} else {
				const dateTime = Date.now();
				const dateNow = Math.floor(dateTime / 1000);
				console.log("Data", graphEvents.data.data.events);
				let newsort = graphEvents.data.data.events
					.concat()
					.sort((a, b) => b.blockNumber - a.blockNumber);
				console.log("GraphQL query newsort", newsort);
				setLoading(false);
				setTopicEvents(newsort);
				setTopicCopy(newsort);
				setActiveLength(newsort.length);
				return newsort;
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	// Get My Past Events on Blockchain
	const loadPastEvents = async () => {
		// console.log("inLoadPastEvents")
		setLoading(true);
		setTopicEvents([]);
		setActiveLength(0);
		// GRAPH BLOCK //
		// console.log("GraphQL query before call",Date.now())

		await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
				{
					events(orderBy:eventId orderDirection:asc) {
						id
						eventId
						owner
						name
						topic
						location
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						duration
						catTktQuantity
						catTktQuantitySold	
						categories
						prices
						eventRevenueInDollar
						eventRevenueInPhnx
					}
				  }
		`,
			},
		})
			.then((graphEvents) => {
				// console.log("GraphQL query response",Date.now(),graphEvents.data.data.events)

				if (!graphEvents.data || graphEvents.data.data == "undefined") {
					// console.log("GraphQL query -- graphEvents undefined")
					setLoading(false);
					setTopicEvents([]);
					setActiveLength(0);
				} else {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					let newsort = graphEvents.data.data.events
						.concat()
						.sort((a, b) => b.blockNumber - a.blockNumber);
					// console.log("GraphQL query newsort",newsort)
					setLoading(false);
					setTopicEvents(newsort);
					setActiveLength(newsort.length);
					setTopicCopy(newsort);
				}
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	return (
		<TopicsLandingPage
			eventsContract={props.eventsContract}
			eventObj={eventObj}
		/>
	);
};

export default WrapperTopicsLandingPage;
