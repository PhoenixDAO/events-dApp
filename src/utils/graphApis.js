import { graphURL } from "../config/const";
import Web3 from "web3";
let axios = require('axios');
let moment = require('moment');
//  get buyer Array of event
async function getResult(eventId) {
    let result = await axios({
        url: graphURL,
        method: 'post',
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
    return result.data.data.tickets;
}

export async function generateBuyerArr(eventId) {
    let buyersListJson = {};
    let ticketArr = await getResult(eventId);
    console.log("buyer list", ticketArr);
    ticketArr.forEach((tktObj) => {
        // creating json
        if (buyersListJson[tktObj.buyer] == null) {
            buyersListJson[tktObj.buyer] = Number(0);
        }
        buyersListJson[tktObj.buyer] += Number(1);
    });

    let buyer = []
    for (const [key, value] of Object.entries(buyersListJson)) {
        buyer.push({ address: key, count: value })
    }
    return buyer;
}
// get Ticket sold by location
async function ticketLocation(eventId) {
    let result = await axios({
        url: graphURL,
        method: 'post',
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

    // console.log(`event ${eventId} jsonData > `, jsonData);
    let ticketSold = []
    for (const [key, value] of Object.entries(jsonData)) {
        ticketSold.push({ location: key, ticketSold: value })
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
        method: 'post',
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
        method: 'post',
        data: {
            query: `
            {
                ownerDayDatas(where:{owner:"${owner}" } orderBy:dayStartTimeStamp orderDirection:asc)
                {
                  eventId
                  dayStartTimeStamp
                  soldTicketsInDay
                  totalPhnxRevenueInDay
                  totalDollarRevenueInDay
                }
              }`
        }
    })
    let totalDollarRevenue = 0;
    result.data.data.ownerDayDatas.forEach((event) => {
        console.log(
            "event", event
        )
        totalDollarRevenue += Number(event.totalDollarRevenueInDay);
    });
    // console.log("total dollar revenue", totalDollarRevenue);
    return result.data.data.ownerDayDatas
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
        }).catch(console.log());
    return result;

}
// getTimeData("0xA7aD7aAB0A61ebDCA059F438d4C0F3928D99c69b");

// export async function getTimeData() {
//     console.log("time", moment().subtract(1, 'days').calendar()); // Last Wednesday at 2:20 PM

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
//                     duration
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