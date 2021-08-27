import Web3 from "web3";
import {GLOBAL_NETWORK_ID,
    GLOBAL_NETWORK_ID_2,
    INFURA_URL_2,
    INFURA_URL,
    graphURLV2,
    graphURLV1} from "./const";
    
export default async function GetGraphApi(){
    let web3 = window.web3;
    let ethereum = window.ethereum;
    let graphURL="";
    try {
		if (window.ethereum && window.ethereum.isMetaMask) {
			web3 = new Web3(ethereum);
		} else if (typeof web3 !== "undefined") {
			web3 = new Web3(web3.currentProvider);
		} else {
			const network = await web3.eth.net.getId();
			let infura;
			if (network === GLOBAL_NETWORK_ID) {
                
				infura = INFURA_URL;


			} else if (network === GLOBAL_NETWORK_ID_2) {
				infura = INFURA_URL_2;
			}
			web3 = new Web3(new Web3.providers.HttpProvider(infura));
		}
		const networkId = await web3.eth.net.getId();
		console.log("This called getNetworkId", networkId);
		if (networkId === GLOBAL_NETWORK_ID) {
			graphURL =graphURLV1;
		} else if (networkId === GLOBAL_NETWORK_ID_2) {
            graphURL=graphURLV2;
		} else {
            graphURL=graphURLV1;

			console.log("network id not suported");
		}
	} catch (err) {
		console.log("err", err);
	}
    return graphURL;
}
