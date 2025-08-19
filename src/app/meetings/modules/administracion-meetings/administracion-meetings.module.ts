import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AdministracionMeetingsRoutingModule } from './administracion-meetings-routing.module';
import { ModalCrearMeetComponent } from './components/modal-crear-meet/modal-crear-meet.component';
import { ModalEditarMeetComponent } from './components/modal-editar-meet/modal-editar-meet.component';
import { CalendarMeetComponent } from './screens/calendar-meet/calendar-meet.component';
import { CampoErroresComponent } from './components/campo-errores/campo-errores.component';


@NgModule({
  declarations: [
    CalendarMeetComponent,
    ModalCrearMeetComponent,
    ModalEditarMeetComponent,
    CampoErroresComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdministracionMeetingsRoutingModule,
    FullCalendarModule,
    ModalModule.forRoot()
  ]
})
export class AdministracionMeetingsModule { }
