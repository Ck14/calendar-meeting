import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormularioParticipanteComponent } from './formulario-participante/formulario-participante.component';
import { ConsultaParticipantesComponent } from './consulta-participantes/consulta-participantes.component';
import { FormularioDesactivadoComponent } from '../layouts/formulario-desactivado/formulario-desactivado.component';
import { FormularioVencidoComponent } from '../layouts/formulario-vencido/formulario-vencido.component';
import { RegistroExitosoComponent } from '../layouts/registro-exitoso/registro-exitoso.component';
import { UsuarioYaRegistradoComponent } from '../layouts/usuario-ya-registrado/usuario-ya-registrado.component';

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
  },
  {
    path: "formulario-desactivado",
    component: FormularioDesactivadoComponent,
  },
  {
    path: "formulario-vencido",
    component: FormularioVencidoComponent,
  },
  {
    path: "registro-exitoso",
    component: RegistroExitosoComponent,
  },
  {
    path: "registrado",
    component: UsuarioYaRegistradoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicAppRoutingModule { }
