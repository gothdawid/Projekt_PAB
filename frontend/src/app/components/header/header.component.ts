import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public time = new Date();
  public showHeader = true;
  private routerUnsubscribe = new Subject<void>();

  constructor(private router: Router) { }

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
  }
}
