import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {DataService} from "../../core/data.service";
import {UserService} from "../../core/user.service";

@Component({
  selector: 'app-upload-document-popup',
  templateUrl: './upload-document-popup.component.html',
  styleUrls: ['./upload-document-popup.component.css']
})
export class UploadDocumentPopupComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  type: String;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<UploadDocumentPopupComponent>,
              private dataService: DataService,
              private userService: UserService) {
  }

  onNoClick(): void {

  }

  ngOnInit() {
  }

  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    console.log()
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("image", fileBrowser.files[0]);
      console.log(formData, fileBrowser.files[0])
      this.dataService.uploadFile(formData).then(data => {
        this.userService.uploadDocument({
          "$class": "io.devorchestra.kyc.Document",
          "documentId": 'DOCUMENT_' + Math.random().toString(36).substring(4),
          "hash": data.hash,
          "secret": data.secret,
          "owner": "resource:io.devorchestra.kyc.User#" + this.data.userId,
          "type": this.type.toUpperCase(),
          "status": "INPROGRESS"
        }).then(data => {
          this.dialogRef.close();
        })
      })
    }
  }

}
