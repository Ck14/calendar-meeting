import { NgModule } from '@angular/core';
import { PrivateAppComponent } from '../layouts/private-app/private-app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../utils/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PrivateAppComponent,
    children: [
      {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
        canLoad: [AuthGuardService],
        canActivateChild: [AuthGuardService]
      },
      {
        path: 'seguridad',
        loadChildren: () => import('./modules/seguridad/seguridad.module').then(m => m.SeguridadModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateAppRoutingModule { }
