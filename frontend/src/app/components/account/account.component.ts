import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public account: any = {
    id: 21,
    firstName: 'Adam',
    lastName: 'Spadam',
    email: 'testowy@test.pl',
    avatar: 'http://i.stack.imgur.com/Dj7eP.jpg',
    group: '32',
    address: {
      id: 1,
      street: 'Szkolna 2',
      city: 'Zielona Góra'
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
