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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    FlexLayoutModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,

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
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,

    FlexLayoutModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,

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