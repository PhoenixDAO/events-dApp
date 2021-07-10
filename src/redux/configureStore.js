import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import authReducer from './userReducer';

export const combinedReducers = combineReducers({
    userDetails: authReducer,
  })

export default combinedReducers;
