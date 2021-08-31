import React, { useEffect, useState } from "react";
import axios from "axios";
import TopicsLandingPage from "./TopicsLandingPage";
import topicsJson from "../config/topics.json";
import GetGraphApi from "../config/getGraphApi";

const WrapperTopicsLandingPage = (props) => {
	const [loading, setLoading] = useState(true);
	const [Topic_Events, setTopicEvents] = useState([]);
	const [topic_copy, setTopicCopy] = useState([]);
	const [active_length, setActiveLength] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [eventObj, setEventObj] = useState({});
	const [eventObjCopy, setEventObjCopy] = useState({});

	useEffect(() => {
		loadBlockchain();
	}, []);

	const loadBlockchain = async () => {
		const graphURL = await GetGraphApi();
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
			if (event && event.length > 0) {
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
							eventObj[event[i].topic].image =
								"/images/PhoenixDAO.png";
							eventObj[event[i].topic].name = "Some topic name";
						}
					}
				}
			}
			// delete eventObj["topic name"];
			// delete eventObj["musfira topic name"];
			// delete eventObj["topic name free"];

			setEventObj(eventObj);
			setEventObjCopy(eventObj);
			console.log("eventObj", eventObj);
			console.log("This is object array", Object.keys(eventObj));
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
		const dateTime = Date.now();
		const dateNow = Math.floor(dateTime / 1000);
		const graphURL = await GetGraphApi();
		try {
			const graphEvents = await axios({
				url: graphURL,
				method: "post",
				data: {
					query: `
				{
					events( where:{time_gte: "${dateNow}"} orderBy:time orderDirection:desc) {
						id
						eventId
						owner
						name
						topic
						location
						city
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						onsite
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
				setTimeout(() => {
					setLoading(false);
				}, 2000);
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
				setTimeout(() => {
					setLoading(false);
				}, 2000);
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
		const graphURL = await GetGraphApi();

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
						city
						ipfsHash
						tktLimited
						tktTotalQuantity
						tktTotalQuantitySold
						oneTimeBuy
						token
						time
						onsite
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
					setTimeout(() => {
						setLoading(false);
					}, 2000);
					setTopicEvents([]);
					setActiveLength(0);
				} else {
					const dateTime = Date.now();
					const dateNow = Math.floor(dateTime / 1000);
					let newsort = graphEvents.data.data.events
						.concat()
						.sort((a, b) => b.blockNumber - a.blockNumber);
					// console.log("GraphQL query newsort",newsort)
					setTimeout(() => {
						setLoading(false);
					}, 2000);
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
	const updateSearch = (value) => {
		let filteredTopics = eventObjCopy;
		try {
			if (value !== "") {
				console.log("if called in updated search");
				filteredTopics = Object.keys(eventObjCopy).filter((event) => {
					return (
						eventObjCopy[event].name
							.toLowerCase()
							.search(value.toLowerCase()) !== -1
					);
				});
				let eventObjHldr = {};
				if (filteredTopics.length > 0) {
					for (let i = 0; i < filteredTopics.length; i++) {
						eventObjHldr[filteredTopics[i]] =
						eventObjCopy[filteredTopics[i]];
					}
				}
				setEventObj(eventObjHldr);
			} else {
				console.log("else called in update search");
				console.log("eventObj", eventObj);
				setEventObj(eventObjCopy);
			}
		} catch (e) {
			console.log(e);
		}
		console.log("valuee", value);
		console.log("filteredTopics", filteredTopics);
	};
	return (
		<TopicsLandingPage
			eventsContract={props.eventsContract}
			eventObj={eventObj}
			loading={loading}
			topicEvents={Topic_Events}
			handleSearch={updateSearch}
		/>
	);
};

export default WrapperTopicsLandingPage;
