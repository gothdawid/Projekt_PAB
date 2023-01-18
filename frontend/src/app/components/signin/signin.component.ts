import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'
import { catchError, take } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public login: number | undefined;
  public password: string = '';
  public loginError: string = '';
  public passwordError: string = '';
  public errorRequest: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
  }

  public onSubmit(): void {
    this.clearErrors();
    if (!this.validateForm(this.login, this.password)) {
      return;
    }
    debugger
    this.authService.login(Number(this.login), this.password)
      .pipe(take(1))
      .subscribe({ 
        next: (authenticated) => {
          if(authenticated) {
            this.router.navigate(['/']);
          } else {
            debugger
            this.errorRequest = 'Invalid login or password';
          }
        }
      });
  }

  private validateForm(login: number | undefined, password: string): boolean {
    let isValid: boolean = true;

    if (!this.login) {
      isValid = false;
      this.loginError = 'Login nie może być pusty';
    }

    if (!this.password) {
      isValid = false;
      this.passwordError = 'Hasło nie może być puste';
    }

    return isValid;
  }

  private clearErrors(): void {
    this.loginError = '';
    this.passwordError = '';
    this.errorRequest = '';
  }
}
