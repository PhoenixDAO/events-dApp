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
