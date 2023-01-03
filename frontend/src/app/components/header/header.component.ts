import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { LoginState } from 'src/app/models/LoginState';
import * as LoginSelector from '../../stores/login.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public time = new Date();
  public showHeader = true;
  public getUserName$ = this.store.select(LoginSelector.getUserName);
  private routerUnsubscribe = new Subject<void>();

  constructor(private router: Router, private store: Store<LoginState>) { }

  ngOnDestroy(): void {
    this.routerUnsubscribe.next();
    this.routerUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.router.events
              .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.routerUnsubscribe))
              .subscribe(location => this.excludeHeader(location));
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  private excludeHeader(location: any) {
    if (location.url === '/sign-in') {
      this.showHeader = false;
    }
    this.showHeader = true;
  }
}
