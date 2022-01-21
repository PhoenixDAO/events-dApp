import axios from "axios";
import Web3 from "web3";
// import { TokensListRinkbey } from "../config/const";
import {
	Open_events_Address,
	Open_events_Address_2,
	Open_events_ABI,
} from "../config/OpenEvents";
import { GLOBAL_NETWORK_ID } from "../config/const.js";
// import { toast } from "react-toastify";
// import Notify from "../components/common/Notify";
// import { RinkbeyNetworkArray } from "../config/const";
import {
	PhnxPriceApiCoingecko,
	EthPriceApiCoingecko,
	MaticPriceApiCoingecko,
	UsdtPriceApiCoingecko,
	WethtPriceApiCoingecko,
	UsdcPriceApiCoingecko,
} from "../config/const";
import { ERC20_ABI } from "./tokenABIs/ERC20TokenAbi";

export const GetPhnxPrice = () => {
	return axios.get(PhnxPriceApiCoingecko);
};
export const GetEthPrice = () => {
	return axios.get(EthPriceApiCoingecko);
};
export const GetMaticPrice = () => {
	return axios.get(MaticPriceApiCoingecko);
};
export const GetUsdtPrice = () => {
	return axios.get(UsdtPriceApiCoingecko);
};
export const GetUsdcPrice = () => {
	return axios.get(UsdcPriceApiCoingecko);
};
export const GetWethPrice = () => {
	return axios.get(WethtPriceApiCoingecko);
};

// for dynamic apis
export const GetTokenDetailApi = (tokenId) => {
	return axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}`);
};

// {"weth":{"usd":3225.41},"unipilot":{"usd":7.13},"phoenixdao":{"usd":0.04331988}} Data format of GetTokenPrices
// API => https://api.coingecko.com/api/v3/simple/price?ids=phoenixdao%2Cunipilot%2Cweth&vs_currencies=usd

export const GetTokenPrices2 = async (netId) => {
	let tokensListContract = await GetWhiteListedToken(netId);
	console.log("token address +++", tokensListContract);
	let newTokensList = [];
	tokensListContract.map(async (v, i) => {
		let coingeckoData = await GetTokenDetailApi(v[2]);
		console.log("coingeckoImage oooo", coingeckoData);
		newTokensList.push({
			displayName: coingeckoData.data.name,
			tokenName: v[2],
			chainId: v[1],
			image: coingeckoData.data.image.small,
			tokenAddress: v[0],
			usdPrice: coingeckoData.data.market_data.current_price.usd,
		});
	});
	// if(netId == 1 || netId == 4)
	// {
	// 	tokensListContract.push([...tokensListContract,{chainId: "1"
	// 	displayName: "Eth"
	// 	image: "https://assets.coingecko.com/coins/images/11523/small/Token_Icon.png?1618447147"
	// 	tokenAddress: ""
	// 	tokenName: "ethereum"
	// 	usdPrice: 0.04173026}])
	// }
	console.log("token address +++ newTokensList ++>>> ", newTokensList);
	if (tokensListContract && newTokensList) {
		return newTokensList;
	} else {
		return;
	}
};

export const Increment2Percent = (originalPrice) => {
	console.log("originalPrice =>", originalPrice);
	let twoPercent = (2 * originalPrice) / 100;
	let incrementedValue = Number(originalPrice) + Number(twoPercent);
	console.log("incrementedValue =>", incrementedValue);
	return incrementedValue;
};

// const contractAddressProviders = async () => {
// 	let eventAddress = "";
// 	let phoenixAddress = "";
// 	const networkId = await this.getNetworkId();
// 	if (networkId === GLOBAL_NETWORK_ID) {
// 		eventAddress = Open_events_Address;
// 		phoenixAddress = PhoenixDAO_Mainnet_Token_Address;
// 	} else if (networkId === GLOBAL_NETWORK_ID_2) {
// 		eventAddress = Open_events_Address_2;
// 		phoenixAddress = PhoenixDAO_Testnet_Token_Address_2;
// 	} else {
// 		this.setState({ openNetworkSnackbar: true });
// 		console.log("Wrong network address | not supported");
// 	}
// 	return { eventAddress, phoenixAddress };
// };

export const GetWhiteListedToken = async (netId) => {
	const web3 = new Web3(window.ethereum);
	const EventsContract = await new web3.eth.Contract(
		Open_events_ABI,
		netId == GLOBAL_NETWORK_ID ? Open_events_Address : Open_events_Address_2
	);
	console.log("EventsContract ==>>>", EventsContract);
	const TokenList = await EventsContract.methods
		.getWhiteListedTokensList()
		.call();
	if (netId == 1 || netId == 4) {
		TokenList.push([
			"0x0000000000000000000000000000000000000000",
			"1",
			"ethereum",
		]);
	}
	console.log("WhiteListTokensss ++>>", TokenList, netId);
	return TokenList;
};

export const initTokenContract = async (tokenAddress) => {
	if (tokenAddress) {
		const web3 = new Web3(window.ethereum);
		// let idx = 0;
		// let tokenAbi = TokensListRinkbey.map((v, i) => {
		// 	if (tokenAddress.toLowerCase() == v.address.toLowerCase()) {
		// 		idx = i;
		// 		return v.abi;
		// 	}
		// });
		// console.log(
		// 	"arguments at initTokenContract",
		// 	tokenAbi[idx],
		// 	tokenAddress
		// );
		try {
			const TOKEN = await new web3.eth.Contract(
				// tokenAbi[idx],
				ERC20_ABI,
				tokenAddress
			);
			console.log("init contract TOKEN =>", TOKEN);
			return TOKEN;
		} catch (err) {
			console.log("Err in contract init =>", err);
		}
	}
};
// Open_events_Address
export const CheckTokenAllowance = async (account, tokenAddress) => {
	if (account && tokenAddress) {
		console.log("this.props.eventsAddress +> 2", Open_events_Address);
		console.log("account, tokenAddress ==>>> ", account, tokenAddress);
		try {
			const Contract = await initTokenContract(
				tokenAddress.toLowerCase()
			);
			const allowance = await Contract.methods
				// .allowance(account.toLowerCase(), tokenAddress.toLowerCase())
				.allowance(account.toLowerCase(), Open_events_Address)
				.call();
			console.log("allowance CheckTokenAllowance =>> ", allowance);
			return allowance;
		} catch (err) {
			console.log("Err at CheckTokenAllowance =>> ", err);
		}
	}
};

export const GiveAllowance = async (account, tokenAddress) => {
	if (account && tokenAddress) {
		const Contract = await initTokenContract(tokenAddress);
		let balance = await Contract.methods.totalSupply().call();
		// let approval = Contract.methods.approve(account, balance);
		let approval = Contract.methods.approve(Open_events_Address, balance);
		return approval;
	}
	// let balance = await this.props.phnxContract.methods
	// 	.totalSupply()
	// 	.call();
	// this.setState({
	// 	approve: this.props.phnxContract.methods.approve(
	// 		this.props.eventsAddress,
	// 		balance
	// 	),
	// });
};

export const base64ToBlob = (url) => {
	let b64Data = url.slice(22);
	let contentType = url.slice(5, 14);

	const b64toBlob = (b64Data, contentType, sliceSize = 512) => {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];
		for (
			let offset = 0;
			offset < byteCharacters.length;
			offset += sliceSize
		) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: contentType });
		return blob;
	};
	const blob = b64toBlob(b64Data, contentType);
	const blobUrl = URL.createObjectURL(blob);

	// window.location = blobUrl;
	// console.log(
	// 	"window.location = blobUrl =>>",
	// 	(window.location = blobUrl)
	// );
	// if ((window.location = blobUrl)) {
	console.log("blobUrl ==>>", blobUrl);
	return blobUrl;
	// }
};
