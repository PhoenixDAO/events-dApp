import {
	API_URL,
	REPORT_EVENT,
	GET_USER_DETAIL,
	UPDATE_USER_DETAIL,
	UPDATE_EVENT_VIEWS,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
	GET_MESSAGE,
	LOGIN_METAMASK,
	GET_USER_EXIST_DETAIL,
	TWEET,
} from "../config/const";
import axios from "axios";

export const getMessage = async () => {
	try {
		const result = await axios.get(`${API_URL}${GET_MESSAGE}`);
		return { result: result.data, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const loginWithMetaMask = async ({
	publicAddress,
	networkId,
	signature,
	message,
}) => {
	try {
		const result = await axios.post(`${API_URL}${LOGIN_METAMASK}`, {
			publicAddress,
			networkId,
			signature,
			message,
		});
		return { result: result.data, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const getUserDetails = async ({ address, networkId }) => {
	try {
		// console.log("serverAPI address and networkId",address,networkId)
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(
			`${API_URL}${GET_USER_DETAIL}`,
			{
				address,
				networkId,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		// console.log("serverAPI getUserDetails", result.data.result);
		return { result: result.data, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const getUser = async ({ address, networkId }) => {
	try {
		// console.log("serverAPI address and networkId",address,networkId)
		const result = await axios.get(
			`${API_URL}${GET_USER_EXIST_DETAIL}/${address}/${networkId}`
		);
		return { result: result.data, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const updateEventViews = async ({ address, networkId, eventId }) => {
	try {
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(`${API_URL}${UPDATE_EVENT_VIEWS}`, {
			address,
			networkId,
			eventId,
		});
		return { result: result.data.result, error: false };
	} catch (err) {
		// console.log("error occured in updateEventViews", err);
		return { error: true, message: err };
	}
};

export const addToFavourites = async ({ address, networkId, eventId }) => {
	try {
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(
			`${API_URL}${ADD_TO_FAVOURITES}`,
			{
				address,
				networkId,
				eventId,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return { result: result.data.result, error: false };
	} catch (err) {
		// console.log("error occured in addToFavourites", err);
		return { error: true, message: err };
	}
};
export const removeFromFavourites = async ({ address, networkId, eventId }) => {
	try {
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(
			`${API_URL}${REMOVE_FROM_FAVOURITES}`,
			{
				address,
				networkId,
				eventId,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		// console.log("serverAPI removeFromFavourites", result);
		return { result: result.data.result, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const updateUserDetails = async ({
	address,
	networkId,
	name,
	organizerDetails,
	avatarCustom,
	avatarNumber,
	avatar,
	alternateCurrency,
}) => {
	try {
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(
			`${API_URL}${UPDATE_USER_DETAIL}`,
			{
				address,
				networkId,
				name,
				organizerDetails,
				avatarCustom,
				avatarNumber,
				avatar,
				alternateCurrency,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return { result: result.data.result, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};

export const userTweet = async ({
	address,
	networkId,
	base64Image,
	message,
}) => {
	try {
		const token = localStorage.getItem("AUTH_TOKEN");
		const result = await axios.post(
			`${API_URL}${TWEET}`,
			{
				address,
				networkId,
				base64Image,
				message,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return { result: result.data.result, error: false };
	} catch (err) {
		return { error: true, message: err };
	}
};
