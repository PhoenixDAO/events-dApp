import {SIGNIN_USER, SIGNUP_USER, CLEAR_USER, SET_LOADING} from './ActionTypes';

const initialState = {
  user: null,
  isloggedIn: false,
  token: null,
  userType: '',
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGNUP_USER:
      return {
        ...state,
        user: action.payload.userCreated,
        token: action.payload.token,
        isloggedIn: true,
        userType: action.payload.userCreated.userType,
        loading: false,
      };
    case SIGNIN_USER:
      console.log('action.payload', action.payload);
      return {
        ...state,
        user: action.payload.userExist,
        userType: action.payload.userType,
        token: action.payload.token,
        isloggedIn: true,
        loading: false,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
        isloggedIn: false,
        token: null,
        userType: undefined,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
