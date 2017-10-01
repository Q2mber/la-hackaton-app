import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {UserService} from "../core/user.service";
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {UploadDocumentPopupComponent} from "./upload-document-popup/upload-document-popup.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = []
  managers: any[] = []

  public items = [];

  constructor(private userService: UserService,
              public dialog: MdDialog) {
    console.log('DASHBOARD')
  }

  ngOnInit() {


    // this.userService.getUsers().then(data => {
    //   if (data.length) {
    //     this.users = data
    //   }else{
    //     this.userService.createUser({
    //       "$class": "io.devorchestra.kyc.User",
    //       "userId": "USER"+this.users.length,
    //       "verified": "false",
    //       "identity": "false",
    //       "address": "false"
    //     }).then(user=>{
    //       this.users.push(user)
    //     })
    //   }
    // })
    //
    // this.userService.getManagers().then(data => {
    //   if (data.length) {
    //     this.managers = data
    //   }else{
    //     this.userService.createManager({
    //       "$class": "io.devorchestra.kyc.Manager",
    //       "userId": "MANAGER"+this.managers.length,
    //     }).then(user=>{
    //       this.managers.push(user)
    //     })
    //   }
    // })
    //
    // this.userService.issueIdentity({
    //   "participant": "string",
    //   "userID": "string",
    //   "options": {}
    // })

    this.userService.getUsers().then(data => {
      this.users = _.filter(data, d => {
        return localStorage.getItem(d.userId);
      }).map(d => {
        d.secret = localStorage.getItem(d.userId)
        d.name = d.userId
        return d
      })
      console.log('this.users', this.users)
    })

    this.userService.getManagers().then(data => {
      this.managers = _.filter(data, d => {
        return localStorage.getItem(d.userId);
      }).map(d => {
        d.secret = localStorage.getItem(d.userId)
        d.name = d.userId
        return d
      })

    })

    if (!this.users.length) {
      this.addUser()
    }

    if (!this.managers.length) {

    }
  }

  uploadDocument(user) {
    let dialogRef = this.dialog.open(UploadDocumentPopupComponent, {
      width: '330px',
      data: {
        secret: user.secret,
        userId: user.userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addManager()
    });
  }


  addUser() {
    this.userService.createIdentity({
      class: "User",
      id: 'USER_' + Math.random().toString(36).substring(4),
      name: 'USER_' + Math.random().toString(36).substring(4)
    }).then(user => {
      localStorage.setItem(user.userId, user.secret);
      this.users.push(user)
    })
  }

  addManager() {
    this.userService.createIdentity({
      class: "Manager",
      id: 'MANAGER_' + Math.random().toString(36).substring(4),
      name: 'MANAGER_' + Math.random().toString(36).substring(4)
    }).then(manager => {
      localStorage.setItem(manager.userId, manager.secret);
      this.managers.push(manager)
    })
  }
}
