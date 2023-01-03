import { Injectable } from '@angular/core';
import { Apollo, ApolloBase } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apollo: ApolloBase
 
  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('backend')
  }
}
