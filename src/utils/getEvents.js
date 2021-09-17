import { useState, useEffect } from "react";
import { API_URL, REPORT_EVENT, graphURL } from "../config/const";
import axios from "axios";
import GetGraphApi, { getNetworkId } from "../config/getGraphApi";

export const getEvents = (props, context) => {
	const [Deleted_Events, setDeleted_Events] = useState([]);
	const [MyEvents, setMyEvents] = useState([]);
	const [active_length, setActive_length] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hideEvent, setHideEvent] = useState([]);
	const [_isMounted, set_isMounted] = useState(props._isMounted);
	useEffect(() => {
		if (_isMounted) {
			filterHideEvent();
			loadBockchain();
		}
		return () => {
			set_isMounted(false);
		};
	}, [MyEvents]);
	const filterHideEvent = async () => {
		try {
			const networkId = await getNetworkId();
			const get = await axios.get(
				`${API_URL}${REPORT_EVENT}/${networkId}`
			);
			if (get.data.result.length != 0) {
				setHideEvent(get.data.result);
			}

			return;
		} catch (error) {
			// console.log("check error", error);
		}
	};
	const loadBockchain = async () => {
		if (_isMounted) {
			// if (this._isMounted) {

			// Graph BLOCK
			// await axios({
			//     url: graphURL,
			//     method: 'post',
			//     data: {
			//         query: `
			//   {
			//     eventsRemoveds {
			//       id
			//       eventId
			//     }
			//   }
			//   `
			//     }
			// }).then((graphDeletedEvents) => {

			//     if (!graphDeletedEvents.data || !graphDeletedEvents.data.data == 'undefined') {
			//         setDeleted_Events([]);
			//     } else {
			//         setDeleted_Events(graphDeletedEvents.data.data.eventsRemoveds)
			//     }
			// }).catch((err) => {
			//     console.error("graph error here", err);
			//     setDeleted_Events([]);
			//     setLoading(false);
			// })

			//Listen For My Newly Created Events
			console.log("account", props.revenueCategory);
			let graphURL = await GetGraphApi();
			await axios({
				url: graphURL,
				method: "post",
				data: {
					query: `{
                        events(where : {owner: "${props.accounts}"} orderBy:${props.revenueCategory} orderDirection: desc first:5) {
							id
							token
							eventId
							owner
							name
							topic
							location
							ipfsHash
							tktLimited
							oneTimeBuy
							time
							onsite
							tktTotalQuantity
							tktTotalQuantitySold
							catTktQuantity
							catTktQuantitySold	
							categories
							prices
							eventRevenueInDollar
							eventRevenueInPhnx
						  }
              }`,
				},
			})
				.then((graphEvents) => {
					// console.log("GraphQL query response in getEvents.js", graphEvents.data.data)
					if (
						!graphEvents.data ||
						graphEvents.data.data == "undefined"
					) {
						// console.log("GraphQL query -- graphEvents undefined")
						setLoading(false);
						setActive_length(0);
					} else {
						if (props._isMounted) {
							const dateTime = Date.now();
							const dateNow = Math.floor(dateTime / 1000);
							let userEvents = graphEvents.data.data.events;
							if (userEvents) {
								let newsort = userEvents
									.concat()
									.sort(
										(a, b) => b.blockNumber - a.blockNumber
									);

								setMyEvents(newsort);
								setActive_length(newsort.length);
							}
							setLoading(false);
						}
					}
				})
				.catch((err) => {
					setLoading(false);
					console.error("graph some error", err);
				});
			set_isMounted(false);
		}
		let filteredDeletedReported = [];
		let filteredDeleted = [];
		let skip = false;
		let skip2 = false;
		// console.log("GraphQL query newsort", MyEvents, "deleted", Deleted_Events);

		for (let i = 0; i < MyEvents.length; i++) {
			for (let j = 0; j < Deleted_Events.length; j++) {
				if (MyEvents[i].eventId == Deleted_Events[j].eventId) {
					skip = true;
					skip2 = true;
				}
			}
			if (!skip) {
				for (let j = 0; j < hideEvent.length; j++) {
					if (MyEvents[i].eventId == hideEvent[j].id) {
						skip = true;
					}
				}
			}
			if (!skip2) {
				filteredDeleted.push(MyEvents[i]);
			}
			if (!skip) {
				filteredDeletedReported.push(MyEvents[i]);
			}
			skip = false;
			skip2 = false;
		}
		// console.log("filtered", filteredDeletedReported, filteredDeleted)
		setMyEvents(filteredDeletedReported);
	};
	return MyEvents;
};
