import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from 'src/app/utils/auth-guard.service';
import { CalendarMeetComponent } from './screens/calendar-meet/calendar-meet.component';

const routes: Routes = [
  {
    path: "",
    component: CalendarMeetComponent,
    //canActivate: [AuthGuardService],
    //canLoad: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionMeetingsRoutingModule { }
