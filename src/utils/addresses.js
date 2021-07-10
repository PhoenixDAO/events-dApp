let axios = require('axios');
async function getResult(eventId) {
    let result = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/nashaibakbar/eventcheck',
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
        // console.log(`event ${eventId} buyersListJson > `, buyersListJson);
    for (const [key, value] of Object.entries(buyersListJson)) {
        buyer.push({ address: key, count: value })
    }
    // console.log("buyer temp", temp)
    // returning json file
    return buyer;
}

generateBuyerArr(15);