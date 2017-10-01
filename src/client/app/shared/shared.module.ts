import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';


import 'hammerjs';
import {FlexLayoutModule} from '@angular/flex-layout'
import { MaterialModule, MdNativeDateModule } from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdMenuModule, MdButtonModule, MdToolbarModule, MdCardModule, MdSidenavModule, MdInputModule, MdSelectModule,
  MdTabsModule, MdRadioModule,MdDialogModule}               from '@angular/material';
import { BrowserXhr, HttpModule } from '@angular/http';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    FlexLayoutModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    NgProgressModule,

    MdMenuModule,
    MdButtonModule,
    MdToolbarModule,
    MdCardModule,
    MdSidenavModule,
    MdInputModule,
    MdSelectModule,
    MdTabsModule,
    MdRadioModule,
    MdDialogModule
  ],
  providers: [
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,

    FlexLayoutModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    HttpModule,
    NgProgressModule,

    MdMenuModule,
    MdButtonModule,
    MdToolbarModule,
    MdCardModule,
    MdSidenavModule,
    MdInputModule,
    MdDialogModule
  ]
})
export class SharedModule {
}
