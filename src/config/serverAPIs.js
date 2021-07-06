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


export const getUserDetails = async({ address, networkId }) => {
    try {
        // console.log("serverAPI address and networkId",address,networkId)
        const result = await axios.post(`${API_URL}${GET_USER_DETAIL}`, {
            address,
            networkId,
        });
        // console.log("serverAPI getUserDetails", result.data.result);
        return { result: result.data, error: false };
    } catch (err) {
        console.log("serverAPI error occured in getUserDetails", err);
        return { error: true, message: err };
    }
};

export const updateEventViews = async({ address, networkId, eventId }) => {
    try {
        // console.log("updateEventViews",address,networkId,eventId)
        const result = await axios.post(`${API_URL}${UPDATE_EVENT_VIEWS}`, {
            address,
            networkId,
            eventId,
        });
        console.log("serverAPI updateEventViews", result);
        return { result: result.data.result, error: false };
    } catch (err) {
        console.log("error occured in updateEventViews", err);
        return { error: true, message: err };
    }
};

export const addToFavourites = async({ address, networkId, eventId }) => {
    try {
        const result = await axios.post(`${API_URL}${ADD_TO_FAVOURITES}`, {
            address,
            networkId,
            eventId,
        });
        // console.log("serverAPI addToFavourites", result);
        return { result: result.data.result, error: false };
    } catch (err) {
        console.log("error occured in addToFavourites", err);
        return { error: true, message: err };
    }
};

export const removeFromFavourites = async({ address, networkId, eventId }) => {
    try {
        const result = await axios.post(`${API_URL}${REMOVE_FROM_FAVOURITES}`, {
            address,
            networkId,
            eventId,
        });
        // console.log("serverAPI removeFromFavourites", result);
        return { result: result.data.result, error: false };
    } catch (err) {
        console.log("error occured in removeFromFavourites", err);
        return { error: true, message: err };
    }
};