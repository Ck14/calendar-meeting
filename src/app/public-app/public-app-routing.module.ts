import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormularioParticipanteComponent } from './formulario-participante/formulario-participante.component';
import { ConsultaParticipantesComponent } from './consulta-participantes/consulta-participantes.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'checkin',
    component: FormularioParticipanteComponent
  },
  {
    path: 'consulta-participantes',
    component: ConsultaParticipantesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicAppRoutingModule { }
