import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreacionMeetingComponent } from './creacion-meeting/creacion-meeting.component';
import { AuthGuardService } from 'src/app/utils/auth-guard.service';

const routes: Routes = [
  {
    path: "",
    component: CreacionMeetingComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionMeetingsRoutingModule { }
