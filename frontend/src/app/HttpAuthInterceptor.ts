import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('token');
    debugger
    if (jwtToken) {
        const token = JSON.parse(jwtToken);
        return next.handle(httpRequest.clone({ setHeaders: { 'Authorization': token } }));
    }

    return next.handle(httpRequest);
  }
}