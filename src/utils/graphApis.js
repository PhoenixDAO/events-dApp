import GetGraphApi from "../config/getGraphApi";
let axios = require("axios");
let moment = require("moment");
let graphURL;
GetGraphApi().then((data) => {
	// Some task on success
	graphURL = data;
});
//  get buyer Array of event

async function getResult(eventId) {
	try {
		const graphURL = await GetGraphApi();
		// console.log("get ticket", graphURL);
		let result = await axios({
			url: graphURL,
			method: "post",
			data: {
				query: `
        {
          tickets(where:{eventId:${eventId}}){
            buyer
          }
        }
        `,
			},
		});
		console.log("hello 2 , ", result.data.data);
		return result.data.data.tickets;
	} catch (err) {
		// console.log("error while fetching tickets", err);
	}
}
export async function generateBuyerArr(eventId) {
	// console.log("generate buyer called", eventId);
	let buyersListJson = {};
	let ticketArr = await getResult(eventId);
	// console.log("ticketsArr", ticketArr);
	ticketArr.forEach((tktObj) => {
		// creating json
		if (buyersListJson[tktObj.buyer] == null) {
			buyersListJson[tktObj.buyer] = Number(0);
		}
		buyersListJson[tktObj.buyer] += Number(1);
	});
	let buyer = [];
	for (const [key, value] of Object.entries(buyersListJson)) {
		buyer.push({ address: key, count: value });
	}
	console.log("hello ", buyer);
	return buyer;
}
// get Ticket sold by location
async function ticketLocation(eventId) {
	let result = await axios({
		url: graphURL,
		method: "post",
		data: {
			query: `
        {
          tickets(where:{eventId:${eventId}}){
            boughtLocation
          }
        }
        `,
		},
	});
	return result.data.data.tickets;
}
// get sold tickets by location
export async function generateJSON(eventId) {
	let jsonData = {};
	let ticketArr = await ticketLocation(eventId);
	ticketArr.forEach((tktObj) => {
		if (jsonData[tktObj.boughtLocation] == null) {
			jsonData[tktObj.boughtLocation] = Number(0);
		}
		jsonData[tktObj.boughtLocation] += Number(1);
	});
	let ticketSold = [];
	for (const [key, value] of Object.entries(jsonData)) {
		ticketSold.push({ location: key, ticketSold: value });
	}
	return ticketSold;
	// returning the whole json data
	// return jsonData;
}
// generateJSON(10);
// generateBuyerArr(15);
// get user events name and id
export async function getEventName(owner) {
	let result = await axios({
		url: graphURL,
		method: "post",
		data: {
			query: `
            {
                events(where : {owner: "${owner}"})
                {
                eventId
                name
                }
              }`,
		},
	});
	return result.data.data.events;
}
export async function getTimeData(owner) {
	let result = await axios({
		url: graphURL,
		method: "post",
		data: {
			query: `
            {
                ownerDayDatas(where:{owner:"${owner}" } orderBy: startTimeStamp orderDirection:asc)
                {
                  eventId
                  startTimeStamp
                  soldTickets
                  totalPhnxRevenue
                  totalDollarRevenue
                }
              }`,
		},
	});
	let totalDollarRevenue = 0;
	const timeDataArr = result.data.data.ownerDayDatas;
	// if (timeDataArr.length === 0) {
	// 	timeDataArr.push({
	// 		startTimeStamp: Number(timestamp),
	// 		eventId: "0",
	// 		soldTickets: "0",
	// 		totalDollarRevenue: "0",
	// 		totalPhnxRevenue: "0",
	// 	});
	// 	return timeDataArr;
	// }
	timeDataArr.forEach((event) => {
		totalDollarRevenue += Number(event.totalDollarRevenue);
	});
	let newTimeDataArr = [];
	timeDataArr.forEach((timeData, i) => {
		newTimeDataArr.push(timeData);
		// const { startTimeStamp } = timeData;
		if (
			i + 1 < timeDataArr.length &&
			Number(timeData.startTimeStamp) + 86400 !=
				timeDataArr[i + 1].startTimeStamp
		) {
			// skip loop if the current and next startTimeStamp are same
			if (
				Number(timeDataArr[i].startTimeStamp) ==
				Number(timeDataArr[i + 1].startTimeStamp)
			) {
				return;
			}
			const todayTimeStamp = Number(moment().unix());
			if (
				Number(timeDataArr[i + 1].startTimeStamp) + 86400 <
				todayTimeStamp
			) {
				newTimeDataArr.push({
					startTimeStamp:
						Number(timeDataArr[i + 1].startTimeStamp) + 86400,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
			}
			// }
		}
	}, timeDataArr);
	let max = newTimeDataArr.length;
	for (let i = 0; i < max; i++) {
		if (i + 1 < max) {
			if (
				Number(newTimeDataArr[i].startTimeStamp) ===
				Number(newTimeDataArr[i + 1].startTimeStamp)
			) {
				continue;
			}
			if (
				Number(newTimeDataArr[i].startTimeStamp) + 86400 !==
				Number(newTimeDataArr[i + 1].startTimeStamp)
			) {
				const hldr = Number(newTimeDataArr[i].startTimeStamp) + 86400;
				newTimeDataArr.splice(i + 1, 0, {
					startTimeStamp: hldr,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
			}
		}
	}
	return newTimeDataArr;
}

export async function getTodayData(owner, timestamp) {
	let result = await axios({
		url: graphURL,
		method: "post",
		data: {
			query: `
            {
				ownerHourDatas(where:{owner:"${owner}" startTimeStamp_gte: ${timestamp} } orderBy:startTimeStamp orderDirection:asc)
                {
					eventId
					startTimeStamp
					soldTickets
					totalPhnxRevenue
					totalDollarRevenue
                }
              }`,
		},
	});
	const timeDataArr = result.data.data.ownerHourDatas;
	if (timeDataArr.length === 0) {
		timeDataArr.push({
			startTimeStamp: Number(timestamp),
			eventId: "0",
			soldTickets: "0",
			totalDollarRevenue: "0",
			totalPhnxRevenue: "0",
		});
		return timeDataArr;
	}
	let newTimeDataArr = [];
	let timeInterval = timestamp;
	let finalTimestamp = timestamp + 86400;
	timeDataArr.forEach((timeData, i) => {
		newTimeDataArr.push(timeData);
		// const { startTimeStamp } = timeData;
		if (timeInterval != newTimeDataArr[i].startTimeStamp) {
			newTimeDataArr.splice(i, 0, {
				startTimeStamp: timeInterval,
				eventId: "0",
				soldTickets: "0",
				totalDollarRevenue: "0",
				totalPhnxRevenue: "0",
			});
			timeInterval += 3600;
		}
		if (
			i + 1 < timeDataArr.length &&
			Number(timeData.startTimeStamp) + 3600 !=
				timeDataArr[i + 1].startTimeStamp
		) {
			// skip loop if the current and next startTimeStamp are same
			if (
				Number(timeDataArr[i].startTimeStamp) ==
				Number(timeDataArr[i + 1].startTimeStamp)
			) {
				return;
			}
			newTimeDataArr.push({
				startTimeStamp:
					Number(timeDataArr[i + 1].startTimeStamp) + 3600,
				eventId: "0",
				soldTickets: "0",
				totalDollarRevenue: "0",
				totalPhnxRevenue: "0",
			});
		}
	}, timeDataArr);
	let max = newTimeDataArr.length;
	for (let i = 0; i < max; i++) {
		if (i + 1 < max) {
			if (
				Number(newTimeDataArr[i].startTimeStamp) ===
				Number(newTimeDataArr[i + 1].startTimeStamp)
			) {
				continue;
			}
			if (
				Number(newTimeDataArr[i].startTimeStamp) + 3600 !==
				Number(newTimeDataArr[i + 1].startTimeStamp)
			) {
				const hldr = Number(newTimeDataArr[i].startTimeStamp) + 3600;
				newTimeDataArr.splice(i + 1, 0, {
					startTimeStamp: hldr,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
			}
		}
	}
	if (newTimeDataArr.length > 0) {
		let temp = timestamp;
		// let prevTimeStamp =newTimeDataArr[i].startTimeStamp
		// 	newTimeDataArr[newTimeDataArr.length - 1].startTimeStamp;
		// for (let i = newTimeDataArr.length; i > 0; i--) {
		// 	prevTimeStamp = prevTimeStamp - 3600;
		// }
		// for (let i = 0; i < newTimeDataArr.length; i++) {
		//     prevTimeStamp = prevTimeStamp+3600,
		// 	console.log(
		// 		"prevTimeStamp",
		// 		prevTimeStamp,
		// 		"newTimeDataArr",
		// 		newTimeDataArr[i].startTimeStamp
		// 	);
		// }
		for (let i = 0; i < newTimeDataArr.length; i++) {
			if (newTimeDataArr[i].startTimeStamp == temp) {
				temp += 3600;
				continue;
			} else {
				newTimeDataArr.push({
					startTimeStamp: temp,
					eventId: "0",
					soldTickets: "0",
					totalDollarRevenue: "0",
					totalPhnxRevenue: "0",
				});
				temp += 3600;
			}
			if (timestamp + 86400 == temp) {
				break;
			}
		}
	}
	return newTimeDataArr;
}
export async function getPhoenixDAOMarketValue(price) {
	let result = fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao&vs_currencies=usd&include_market_cap=true&include_24hr_change=ture&include_last_updated_at=ture"
	)
		.then((res) => res.json())
		.then((data) => {
			// console.log("data", (Web3.utils.fromWei(price) / data.phoenixdao.usd).toFixed(2));
			// return (Web3.utils.fromWei(price) / data.phoenixdao.usd).toFixed(2);
			return (price * data.phoenixdao.usd).toFixed(2);
		})
		.catch(console.log());
	return result;
}
// getTimeData("0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b");
// export async function getTimeData() {
// }
// timestamp()
// const getPhnxRevenue = async() => {
//     await axios({
//         url: graphURL,
//         method: 'post',
//         data: {
//             query: `{
//                 events(where : {owner: "${props.accounts.toLowerCase()}"}) {
//                     id
//                     token
//                     eventId
//                     owner
//                     name
//                     topic
//                     location
//                     ipfsHash
//                     tktLimited
//                     oneTimeBuy
//                     time
//                     onsite
//                     tktTotalQuantity
//                     tktTotalQuantitySold
//                     catTktQuantity
//                     catTktQuantitySold
//                     categories
//                     prices
//                     eventRevenueInDollar
//                     eventRevenueInPhnx
//                   }
//                   }`
//         }
//     }).then((graphEvents) => {
//         // console.log("GraphQL query response in analytics", Date.now(), graphEvents.data.data.events)
//         if (!graphEvents.data || graphEvents.data.data == "undefined") {
//             // console.log("GraphQL query -- graphEvents undefined")
//             this.setState({
//                 Events_Blockchain: [],
//                 // active_length: 0,
//                 event_copy: [],
//             });
//         } else {
//             // if (this._isMounted) {
//             const dateTime = Date.now();
//             const dateNow = Math.floor(dateTime / 1000);
//             this.setState({ loading: true });
//             let newsort = graphEvents.data.data.events
//                 .concat()
//                 .sort((a, b) => b.blockNumber - a.blockNumber)
//                 .filter((activeEvents) => activeEvents.time >= dateNow);
//             // console.log("GraphQL query newsort",newsort)
//             this.setState({
//                 Events_Blockchain: newsort,
//                 // active_length: newsort.length,
//                 event_copy: newsort,
//             });
//             this.setState({ loading: false });
//             // }
//         }
//     }).catch((err) => console.error(err));
//     dataset = [1, 2, 34, 0, 6, 7];
//     setGraphData(dataset);
// };
export async function getTickets(owner) {
	let result = await axios({
		url: graphURL,
		method: "post",
		data: {
			query: `
        {
          tickets(where:{buyer:"${owner}"}){
            eventId
          }
        }
        `,
		},
	});
	let array = result.data.data.tickets.map((e) => {
		return e.eventId;
	});
	return array;
}
