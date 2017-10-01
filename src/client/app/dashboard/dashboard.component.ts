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
    this.userService.getUsers().then(data => {
      this.users = _.filter(data, d => {
        return localStorage.getItem(d.userId);
      }).map((d, i) => {
        d.secret = localStorage.getItem(d.userId)
        d.name = d.userId
        return d
      })
      // peer returns MVCC_READ_CONFLICT on Promise.all
      var p = Promise.resolve();
      for (let i = 0; i < this.users.length; i++) {
        p = p.then(() => {
          return this.userService.getDocuments({
            userId: this.users[i].userId,
            userSecret: this.users[i].secret,
          }).then(documents => {
            this.users[i].documents = documents;
          })
        });
      }
      console.log(this.users)
      if (!this.users.length) {
        this.addUser()
      }
    })

    this.userService.getManagers().then(data => {
      this.managers = _.filter(data, d => {
        return localStorage.getItem(d.userId);
      }).map(d => {
        d.secret = localStorage.getItem(d.userId)
        d.name = d.userId
        return d
      })

      if (!this.managers.length) {
        this.addManager()
      }
    })


  }

  uploadDocument(user, i) {
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
