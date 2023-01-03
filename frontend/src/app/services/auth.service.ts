import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular'
import { ApiService } from './api.service';
import jwt_decode from 'jwt-decode';
import { Store } from '@ngrx/store';
import { LoginState } from '../models/LoginState';
import { setTokenData } from '../stores/login.actions';

const LOGIN = gql`
  mutation login($id: Int!, $password: String!) {
    login(input: { id: $id, password: $password }) {
      token,
      user {
        id, 
        first_name,
        last_name,
        address,
        city,
        group_id,
        isTeacher
      }
    }
  }`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private service: ApiService, private loginStore: Store<LoginState>) { }

  public login(id: number, password: string): void {
    this.service.apollo.mutate({
      mutation: LOGIN,
        variables: {
          id: id, password: password
        }
    })
    .subscribe({
      next: (payload: any) => {
        localStorage.setItem('token', JSON.stringify((payload.data as any).login.token));
        const tokenData = jwt_decode((payload.data as any).login.token) as any;
        this.loginStore.dispatch(setTokenData({
          tokenData: {
            firstName: tokenData.name,
            lastName: tokenData.last_name,
            tokenExpire: tokenData.exp,
            userId: tokenData.userId
          }
        }));
      },
      error: (err: any) => console.log(err)
    });
  }

  public checkLogin(): void {
    const token = localStorage.getItem('token');

    if(!token) {
      return;
    }

    const tokenData = jwt_decode(token) as any;

    const currentDate = new Date();
    const tokenExpiryDate = new Date(tokenData.exp * 1000);

    debugger
    if (currentDate > tokenExpiryDate) {
      localStorage.removeItem('token');  
      return;
    }

    this.loginStore.dispatch(setTokenData({
      tokenData: {
        firstName: tokenData.name,
        lastName: tokenData.last_name,
        tokenExpire: tokenData.exp,
        userId: tokenData.userId
      }
    }));
  }
}
