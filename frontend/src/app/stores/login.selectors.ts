import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoginState } from "../models/LoginState";

const selectLoginState =
    createFeatureSelector<LoginState>('login');

export const getUserName = createSelector(
    selectLoginState,
    login => login.tokenData ? login.tokenData.firstName + ' ' + login.tokenData?.lastName : 'Zaloguj'
);
