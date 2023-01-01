import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { TimetableComponent } from './components/timetable/timetable.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "sign-in", component: SigninComponent},
  { path: "timetable", component: TimetableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
