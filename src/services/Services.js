import axios from "axios";
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
