import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AdministracionMeetingsRoutingModule } from './administracion-meetings-routing.module';
import { CreacionMeetingComponent } from './creacion-meeting/creacion-meeting.component';


@NgModule({
  declarations: [
    CreacionMeetingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdministracionMeetingsRoutingModule,
    FullCalendarModule
  ]
})
export class AdministracionMeetingsModule { }
