import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PublicAppRoutingModule } from './public-app-routing.module';
import { HomeComponent } from './home/home.component';
import { FormularioParticipanteComponent } from './formulario-participante/formulario-participante.component';
import { ConsultaParticipantesComponent } from './consulta-participantes/consulta-participantes.component';
import { ComponentesHtmlModule } from '../componentes-html/componentes-html.module';


@NgModule({
  declarations: [
    HomeComponent,
    FormularioParticipanteComponent,
    ConsultaParticipantesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicAppRoutingModule,
    ComponentesHtmlModule
  ]
})
export class PublicAppModule { }
