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
    this.updateDashboard()
  }

  updateDashboard(){
    Promise.all([
      //Load users
      this.userService.getUsers().then(data => {
        this.users = _.filter(data, d => {
          return localStorage.getItem(d.userId);
        }).map((d, i) => {
          d.secret = localStorage.getItem(d.userId)
          d.name = d.userId
          return d
        })

        if (!this.users.length) {
          this.addUser()
        }
      }),
      //Load managers
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
    ]).then(d => {
      const allUsers = this.users.concat(this.managers)


      // peer returns MVCC_READ_CONFLICT on Promise.all
      var p = Promise.resolve();
      for (let i = 0; i < allUsers.length; i++) {
        p = p.then(() => {
          return this.userService.getDocuments({
            userId: allUsers[i].userId,
            userSecret: allUsers[i].secret,
          }).then(documents => {
            if (allUsers[i].userId.indexOf('USER') > -1) {
              _.find(this.users, u => {
                return u.userId == allUsers[i].userId
              }).documents = documents
            }

            if (allUsers[i].userId.indexOf('MANAGER') > -1) {
              _.find(this.managers, u => {
                return u.userId == allUsers[i].userId
              }).documents = documents
            }
          })
        });
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
      this.updateDashboard()
    });
  }


  processDocument(manager, i) {
    this.userService.processDocument({
      userSecret: manager.secret,
      userId: manager.userId,
      document: {
        $class: manager.documents[i].$class,
        documentId: manager.documents[i].documentId,
        hash: manager.documents[i].hash,
        owner: manager.documents[i].owner,
        secret: manager.documents[i].secret,
        status: manager.documents[i].status,
        type: manager.documents[i].type
      },
      status: manager.documents[i].selectedStatus
    }).then(data => {
      manager.documents[i].status = manager.documents[i].newStatus;
      this.updateDashboard()
    })
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
