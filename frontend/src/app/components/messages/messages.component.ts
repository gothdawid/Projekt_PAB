import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { QueryRef } from 'apollo-angular';
import { take } from 'rxjs';
import { LoginState } from 'src/app/models/LoginState';
import { Message } from 'src/app/models/Message';
import { ApiService } from 'src/app/services/api.service';
import { getTokenData } from 'src/app/stores/login.selectors';
import * as graphOperations from '../../graphql-operations';
import { EmptyObject } from 'apollo-angular/build/types';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public loading: boolean = true;
  public allMessages: Message[] = [];
  public messages: Message[] = [];
  public textMessage: string = '';
  public getTokenData$ = this.store.select(getTokenData);
  private _users: any[] = [];
  public users: any[] = [];
  public currentUser: any;
  public queryMessages?: QueryRef<any, EmptyObject> | undefined;
  public phrase: string = '';

  constructor(private apiService: ApiService, private store: Store<LoginState>) { }

  public ngOnInit(): void {
    this.apiService.apollo.watchQuery<any>({ query: graphOperations.GET_ALL_USERS })
      .valueChanges.subscribe(({ data }) => {
        this._users = data.allUsers.map((u: { id: any; first_name: any; last_name: any; }) => ({
          id: u.id,
          firstName: u.first_name,
          lastName: u.last_name
        }));
        this.users = [...this._users];
        this.currentUser = this.users.find(() => true);
        this.queryMessages = this.apiService.apollo.watchQuery<any>({ query: graphOperations.GET_ALL_MY_MESSAGES });

        this.queryMessages.valueChanges.subscribe(({ data }) => {
          this.allMessages = data.getAllMyMessages.map((m: { id: any; receiver_id: any; sender_id: any; text: any; Receiver: { first_name: any; last_name: any; isTeacher: any; }; createdAt: any; updatedAt: any; }) => ({
            id: m.id,
            receiverId: m.receiver_id,
            senderId: m.sender_id,
            text: m.text,
            receiver: {
              firstName: m.Receiver.first_name,
              lastName: m.Receiver.last_name,
              isTeacher: m.Receiver.isTeacher
            },
            createdAt: m.createdAt,
            updatedAt: m.updatedAt
          }));
          this.getMessages();
          this.loading = false;
        });
      });
  }

  public changeUser(userId: number): void {
    this.currentUser = this.users.find(u => u.id === userId) ?? this.currentUser;
    this.getMessages();
  }

  public sendMessage(): void {
    if (!this.textMessage) {
      // show info?
      return;
    }

    this.apiService.apollo.mutate({ 
      mutation: graphOperations.SEND_MESSAGE,
        variables: {
          receiver_id: this.currentUser.id,
          text: this.textMessage 
        }
     }).pipe(take(1))
     .subscribe({
      next: (_: any) => {
        this.textMessage = '';
        this.getAllMessages();
      },
      error: (err: any) => {
        console.log(err);
      }});    
  }

  public searchForUser(): void {
    if (!this.phrase) {
      this.users =  [...this._users];
    }

    const phraseLower = this.phrase.toLowerCase();
    this.users = this._users.filter(u => u.firstName.toLowerCase().startsWith(phraseLower) ||
                                         u.lastName.toLowerCase().startsWith(phraseLower));
  }

  private getMessages(): void {
    this.messages = this.allMessages.filter(m => m.receiverId === this.currentUser?.id);
  }

  private getAllMessages(): void {
    this.queryMessages?.refetch();
  }
}
