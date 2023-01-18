import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { GradesComponent } from './components/grades/grades.component';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SigninComponent } from './components/signin/signin.component';
import { TimetableComponent } from './components/timetable/timetable.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sign-in", component: SigninComponent},
  { path: "timetable", component: TimetableComponent},
  { path: "grades", component: GradesComponent},
  { path: "messages", component: MessagesComponent},
  { path: "account", component: AccountComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
