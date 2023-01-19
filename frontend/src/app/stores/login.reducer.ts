import { createReducer, on, State } from '@ngrx/store';
import { LoginState } from '../models/LoginState';
import { setTokenData } from './login.actions';

export const initialState: LoginState = {
  tokenData: null
};

export const loginReducer = createReducer(
  initialState,
  on(setTokenData, (state, action) => {
    return {
      ...state,
      tokenData: action.tokenData
    };
  })
);