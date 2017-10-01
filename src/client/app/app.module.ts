import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app.routing.module';
import { LayoutModule } from './layout/layout.module';
import { SettingsModule } from './settings/settings.module';
import {UploadDocumentPopupComponent} from "./dashboard/upload-document-popup/upload-document-popup.component";
import { SharedModule } from './shared/shared.module';
@NgModule({
  declarations: [
    AppComponent,
    UploadDocumentPopupComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    AuthModule,
    SettingsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[
    UploadDocumentPopupComponent
  ]
})
export class AppModule { }
