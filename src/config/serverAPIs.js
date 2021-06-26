import {
	API_URL,
	REPORT_EVENT,
	graphURL,
	GET_USER_DETAIL,
	UPDATE_EVENT_VIEWS,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
} from "../config/const";
import axios from "axios";

export const getUserDetails = async ( address, networkId ) => {
	const result = await axios.post(`${API_URL}${GET_USER_DETAIL}`, {
		address,
		networkId,
	});
	// console.log("serverAPI getUserDetails", result);
	return result.data;
};

export const updateEventViews = async ({ address, networkId, eventId }) => {
	const result = await axios.post(`${API_URL}${UPDATE_EVENT_VIEWS}`, {
		address,
		networkId,
		eventId,
	});
	// console.log("serverAPI updateEventViews", result);
	return result;
};

export const addToFavourites = async ({ address, networkId, eventId }) => {
	const result = await axios.post(`${API_URL}${ADD_TO_FAVOURITES}`, {
		address,
		networkId,
		eventId,
	});
	// console.log("serverAPI addToFavourites", result);
	return result;
};

export const removeFromFavourites = async ({ address, networkId, eventId }) => {
	const result = await axios.post(`${API_URL}${REMOVE_FROM_FAVOURITES}`, {
		address,
		networkId,
		eventId,
	});
	// console.log("serverAPI removeFromFavourites", result);
	return result;
};
