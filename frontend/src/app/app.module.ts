import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular'
import { HttpClientModule, HttpHeaders } from '@angular/common/http'
import { HttpLink } from 'apollo-angular/http'
import { InMemoryCache } from '@apollo/client/core'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from './stores/login.reducer';
import { LoadingIconComponent } from './components/loading-icon/loading-icon.component';
import { AccountComponent } from './components/account/account.component';
import { MessagesComponent } from './components/messages/messages.component';
import { GradesComponent } from './components/grades/grades.component';
import { TableComponent } from './components/table/table.component';
import { TableRowDirective } from './components/table/table-row.directive';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    TimetableComponent,
    LoadingIconComponent,
    AccountComponent,
    MessagesComponent,
    GradesComponent,
    TableComponent,
    TableRowDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
    HttpClientModule,
    StoreModule.forRoot({ 'login': loginReducer })
  ],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          backend: {
            // <-- This settings will be saved by name: backend
            cache: new InMemoryCache(),
            link: createLink(httpLink) 
          }
        }
      },
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function createLink(httpLink: HttpLink) {
  const jwtToken = localStorage.getItem('token'); 

  if (jwtToken) {
    const token = JSON.parse(jwtToken);
    return httpLink.create({
      // TODO: move to env file
      uri: 'http://localhost:4000',
      headers: new HttpHeaders().set('Authorization', `${token}`)
    })
  }

  return httpLink.create({
    // TODO: move to env file
    uri: 'http://localhost:4000'
  })
}