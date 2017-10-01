import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShellComponent} from './layout/shell/shell.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsComponent} from './settings/settings.component';
import {AuthGuard} from './auth-guard.service'

const routes: Routes = [
  {
    path: 'app',
    component: ShellComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule {
}
