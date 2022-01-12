import axios from "axios";
import Web3 from "web3";
import { TokensListRinkbey } from "../config/const";
import { Open_events_Address } from "../config/OpenEvents";
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

const initTokenContract = async (tokenAddress) => {
	const web3 = new Web3(window.ethereum);
	let idx = 0;
	let tokenAbi = TokensListRinkbey.map((v, i) => {
		if (tokenAddress.toLowerCase() == v.address.toLowerCase()) {
			idx = i;
			return v.abi;
		}
	});
	console.log("arguments at initTokenContract", tokenAbi[idx], tokenAddress);
	try {
		const TOKEN = await new web3.eth.Contract(tokenAbi[idx], tokenAddress);
		console.log("init contract TOKEN =>", TOKEN);
		return TOKEN;
	} catch (err) {
		console.log("Err in contract init =>", err);
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
