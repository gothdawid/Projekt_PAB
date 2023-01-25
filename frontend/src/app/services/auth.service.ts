import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import jwt_decode from 'jwt-decode';
import { Store } from '@ngrx/store';
import { LoginState } from '../models/LoginState';
import { setTokenData } from '../stores/login.actions';
import { Observable, Subject } from 'rxjs';
import * as graphOprations from '../graphql-operations';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private service: ApiService, private loginStore: Store<LoginState>) { }

  public login(id: number, password: string): Observable<boolean> {
    const result = new Subject<boolean>();
    this.service.apollo.mutate({
      mutation: graphOprations.LOGIN,
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
        result.next(true);
        result.complete();
      },
      error: (err: any) => {
        console.log(err);
        result.next(false);
        result.complete();
      }
    });
    return result;
  }

  public checkLogin(): void {
    const token = localStorage.getItem('token');

    if(!token) {
      return;
    }

    const tokenData = jwt_decode(token) as any;

    const currentDate = new Date();
    const tokenExpiryDate = new Date(tokenData.exp * 1000);

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

  public logout(): void {
    this.loginStore.dispatch(setTokenData({ tokenData: null }));
    localStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    this.checkLogin();
    const token = localStorage.getItem('token');
    if(token) {
      return true;
    } else {
      return false;
    }
  }
}
