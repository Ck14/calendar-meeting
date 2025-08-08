import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsuariosInternosRoutingModule } from "./usuarios-internos-routing.module";
import { BandejaCreacionComponent } from "./bandeja-creacion/bandeja-creacion.component";
import { ModalRolesUsuarioComponent } from "./components/modal-roles-usuario/modal-roles-usuario.component";
import { ModalUsuarioInternoComponent } from "./components/modal-usuario-interno/modal-usuario-interno.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { NgxPaginationModule } from "ngx-pagination";
import { ModalActualizarCorreoComponent } from "./components/modal-actualizar-correo/modal-actualizar-correo.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    BandejaCreacionComponent,
    ModalRolesUsuarioComponent,
    ModalUsuarioInternoComponent,
    ModalActualizarCorreoComponent,
  ],
  imports: [
    CommonModule,
    UsuariosInternosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BsDropdownModule.forRoot(),
    SharedModule,
    TooltipModule.forRoot(),
  ],
})
export class UsuariosInternosModule { }
