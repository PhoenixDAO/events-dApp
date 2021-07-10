let axios = require('axios');
async function getResult(eventId) {
    let result = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/nashaibakbar/eventcheck',
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

export async function generateJSON(eventId) {
    let jsonData = {};
    let ticketArr = await getResult(eventId);

    ticketArr.forEach((tktObj) => {
        if (jsonData[tktObj.boughtLocation] == null) {
            jsonData[tktObj.boughtLocation] = Number(0);
        }
        jsonData[tktObj.boughtLocation] += Number(1);
    });

    console.log(`event ${eventId} jsonData > `, jsonData);

    // returning the whole json data
    return jsonData;
}

generateJSON(10);