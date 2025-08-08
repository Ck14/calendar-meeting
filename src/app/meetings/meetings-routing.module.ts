import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../utils/auth-guard.service';
import { PrivateAppComponent } from '../layouts/private-app/private-app.component';
import { DashboardComponent } from '../private-app/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: "",
    component: PrivateAppComponent,
    children: [
      {
        path: "",
        redirectTo: "/admin/dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuardService],
        canLoad: [AuthGuardService],
        canActivateChild: [AuthGuardService],
      },
      {
        path: "usuarios-internos",
        loadChildren: () =>
          import("./modules/usuarios-internos/usuarios-internos.module").then(
            (m) => m.UsuariosInternosModule
          ),
      },
      {
        path: "administracion",
        loadChildren: () =>
          import("./modules/administracion-meetings/administracion-meetings.module").then(
            (m) => m.AdministracionMeetingsModule
          ),
      },

    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule { }
