import {SIGNIN_USER, SIGNUP_USER, CLEAR_USER, SET_LOADING} from './ActionTypes';
import axios from 'axios';
import {URL, loginRoute, signupRoute, verifyCNICRoute} from '../config/const';

export const login = (body) => async (dispatch) => {
  try {
    console.log('in Login', body);
    let response = await axios.post(`${URL}${loginRoute}`, body);
    console.log('response', response.data);

    await dispatch({
      type: SIGNIN_USER,
      payload: response.data.result,
    });
    return response.data.result;
  } catch (error) {
    console.log('error signin', error);
    if (error?.response?.data?.result) {
      console.log('error123 signin : ', error.response.data);
      return {error: error.response.data.result};
    }
  }
};

export const signup = (body) => async (dispatch) => {
  try {
    console.log('in authActions in function', body);
    let response = await axios.post(`${URL}${signupRoute}`, body);
    console.log('in authActions got response', response);

    await dispatch({
      type: SIGNUP_USER,
      payload: response.data.result,
    });

    return response.data.result;
  } catch (error) {
    if (error?.response?.data?.result) {
      console.log('error123 signin : ', error.response.data);
      return {error: error.response.data.result};
    }
  }
};

export const verifyCNIC = async (body) => {
  try {
    console.log('in authActions in verifyCNIC', body);
    let response = await axios.post(`${URL}${verifyCNICRoute}`, body);
    console.log('in authActions got response verifyCNIC', response);

    // await dispatch({
    //   type: VERIFY_CNIC,
    //   payload: response.data.result,
    // });

    return response.data;
  } catch (error) {
    if (error?.response?.data?.result) {
      console.log('error123 Route : ', error.response.data);
      return {error: error.response.data.result};
    }
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: CLEAR_USER,
  });
};

export const setLoading = (loading) => async (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: loading,
  });
};
