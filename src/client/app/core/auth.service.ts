import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject, Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private isLoggedIn: boolean = false;
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: Http) {}

  setIsLoggedIn(loggedIn: boolean): void {
    this.isLoggedIn = loggedIn;
    this.isLoggedIn$.next(loggedIn);
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  registerNewUser(body): Promise<any> {
    return this.http.post(`/api/auth/register`, body)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  sendConfirmationEmailAgain(signUpData): Promise<any> {
    return this.http.post(`/api/auth/reConfirm`, signUpData)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  recoverPassword(email): Promise<any> {
    return this.http.post(`/api/auth/recovery`, email)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  setNewPassword(password): Promise<any> {
    return this.http.post(`/api/auth/resetPassword`, password)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  signIn(signInData): Promise<any> {
    return this.http.post(`/api/auth/login`, signInData)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  signOut(): Promise<any> {
    return this.http.post(`/api/auth/logOut`, null)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  isAuth(): Promise<any> {
    return this.http.get(`/api/auth/isAuth`, null)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  private sendResponse(response: any): Promise<any> {
    return Promise.resolve(JSON.parse(response._body));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred (AuthService): ', error);
    return Promise.reject(error.message || error._body || error);
  }
}
