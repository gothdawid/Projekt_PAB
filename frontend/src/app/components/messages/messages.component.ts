import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Message } from 'src/app/models/Message';
import { ApiService } from 'src/app/services/api.service';
import * as graphOperations from '../../graphql-operations';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  public loading: boolean = true;
  public messages: Message[] = [];
  public textMessage: string = '';

  constructor(private apiService: ApiService) { }

  public ngOnInit(): void {
    this.apiService.apollo.watchQuery<any>({ query: graphOperations.GET_ALL_MY_MESSAGES })
      .valueChanges.subscribe(({ data }) => {
        debugger
        this.messages = data.getAllMyMessages.map((m: { id: any; receiver_id: any; sender_id: any; text: any; Receiver: { first_name: any; last_name: any; isTeacher: any; }; createdAt: any; updatedAt: any; }) => ({
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
        this.loading = false;
      });
  }

  public sendMessage(): void {
    if (!this.textMessage) {
      // show info?
      return;
    }

    this.apiService.apollo.mutate({ 
      mutation: graphOperations.SEND_MESSAGE,
        variables: {
          receiver_id: 21,
          text: this.textMessage 
        }
     }).pipe(take(1))
     .subscribe({
      next: (_: any) => {
        this.textMessage = '';
      },
      error: (err: any) => {
        console.log(err);
      }});
  }
}
