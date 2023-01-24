import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginState } from 'src/app/models/LoginState';
import { getUserName } from 'src/app/stores/login.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public getUserName$ = this.store.select(getUserName);

  constructor(private store: Store<LoginState>) {
  }

  ngOnInit(): void {
  }

}
