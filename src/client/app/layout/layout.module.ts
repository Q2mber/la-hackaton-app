import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ShellComponent,
    HeaderComponent,
    SidenavComponent,
    DashboardComponent,
  ],
  entryComponents: []
})
export class LayoutModule { }
