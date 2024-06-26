import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'edziennik';

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
      this.authService.checkLogin();
  }
}
