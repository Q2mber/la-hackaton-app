import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { IRegisterUser } from '../shared/interfaces';
import {Http} from "@angular/http";

@Injectable()
export class DataService {
  public signUpData: IRegisterUser;
  public signUpData$: BehaviorSubject<any> = new BehaviorSubject<any>(''); // ???

  constructor(private http: Http) {
    console.log('DataService works');
  }

  public setSignUpData(signUpData: IRegisterUser): void {
    this.signUpData = signUpData;
    this.signUpData$.next(signUpData);
  }

  public getSignUpData(): Observable<IRegisterUser> {
    return this.signUpData$.asObservable();
  }

  uploadFile(data): Promise<any> {
    return this.http.post(`/api/file/upload`, data)
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
