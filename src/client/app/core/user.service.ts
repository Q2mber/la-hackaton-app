import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject, Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  public currentUsername: string = null;
  public currentUsername$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: Http) {
    console.log('UserService works');
  }

  setCurrentUsername(username: string): void {
    this.currentUsername = username;
    this.currentUsername$.next(username);
  }

  getCurrentUsername(): Observable<string> {
    return this.currentUsername$.asObservable();
  }

  getUser(userRequestData?): Promise<any> {
    console.log('"getUser" in "UserService" starts working');
    return this.http.get(`/api/getUser`, userRequestData)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  createUser(data): Promise<any> {
    return this.http.post(`/api/io.devorchestra.kyc.User`, data)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  getUsers(): Promise<any> {
    return this.http.get(`/api/io.devorchestra.kyc.User`)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  createManager(data): Promise<any> {
    return this.http.post(`/api/io.devorchestra.kyc.Manager`, data)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  getManagers(): Promise<any> {
    return this.http.get(`/api/io.devorchestra.kyc.Manager`)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  issueIdentity(data): Promise<any> {
    return this.http.post(`/api/system/identities/issue`, data)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  getIdentities(): Promise<any> {
    return this.http.get(`/api/system/identities`)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  getDocuments(data): Promise<any> {
    return this.http.post(`/api/io.devorchestra.kyc.Document/list`,data)
      .toPromise()
      .then(this.sendResponse)
      .catch(this.handleError);
  }

  createIdentity(data): Promise<any> {
    let user;
    return (() => {
      if (data.class == 'User') {
        user = {
          "$class": "io.devorchestra.kyc.User",
          "userId": data.id,
          "verified": "false",
          "identity": "false",
          "address": "false"
        }
        return this.createUser(user)
      } else {
        return this.createManager({
          "$class": "io.devorchestra.kyc.Manager",
          "userId": data.id
        })
      }
    })().then((d: any) => {
      user = d;
      user.identity = d.id;
      return this.issueIdentity({
        "participant": "resource:io.devorchestra.kyc." + data.class + '#' + data.id,
        "userID": data.id,
        "options": {}
      })
    }).then(i => {
      user.secret = i.userSecret;
      return user;
    })
  }


  uploadDocument(data): Promise<any> {
    return this.http.post(`api/io.devorchestra.kyc.Document`, data)
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
