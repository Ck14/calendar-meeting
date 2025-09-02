import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrivateAppComponent } from "./layouts/private-app/private-app.component";
import { NotFoundComponent } from "./layouts/not-found/not-found.component";
import { PageBadGatewayComponent } from "./layouts/page-bad-gateway/page-bad-gateway.component";
import { environment } from "src/environments/environment";
import { RedirectionComponent } from "./redirection/redirection.component";
import { RedirectToComponent } from "./redirect-to/redirect-to.component";
import { TwoFactorAuthComponent } from "./private-app/components/two-factor-auth/two-factor-auth.component";
import { AuthGuardService } from "./utils/auth-guard.service";
import { StartupConfigurationGuard } from "./utils/startup-configuration.guard";
import { StartupLoadingComponent } from "./utils/startup-loading.component";
import { PageNotFoundComponent } from "./layouts/page-not-found/page-not-found.component";
import { PageErrorComponent } from "./layouts/page-error/page-error.component";
import { PublicAppComponent } from "./layouts/public-app/public-app.component";
import { FormularioDesactivadoComponent } from './layouts/formulario-desactivado/formulario-desactivado.component';
import { FormularioVencidoComponent } from "./layouts/formulario-vencido/formulario-vencido.component";
import { RegistroExitosoComponent } from "./layouts/registro-exitoso/registro-exitoso.component";
import { UsuarioYaRegistradoComponent } from "./layouts/usuario-ya-registrado/usuario-ya-registrado.component";

const routes: Routes = [
  {
    path: "",
    component: StartupLoadingComponent,
  },
  {
    path: "redirect",
    component: RedirectToComponent,
    canActivate: [StartupConfigurationGuard],
  },
  {
    path: "login",
    component: RedirectionComponent,
    resolve: { url: "externalUrlRedirectResolver" },
    data: { externalUrl: environment.ssoLogin },
  },
  {
    path: "meetings",
    loadChildren: () =>
      import("./meetings/meetings.module").then(
        (m) => m.MeetingsModule
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./private-app/private-app.module").then(
        (m) => m.PrivateAppModule
      ),
  },
  {
    path: "public",
    loadChildren: () =>
      import("./public-app/public-app.module").then(
        (m) => m.PublicAppModule
      ),
  },
  {
    path: "off-line",
    component: PageBadGatewayComponent,
    //component: FormularioDesactivadoComponent,
    //component: FormularioVencidoComponent,
  },
  {
    path: "two-factor-auth",
    component: TwoFactorAuthComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService],
    canActivateChild: [AuthGuardService],
  },
  {
    path: "not-found",
    component: PageNotFoundComponent,
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
  {
    path: "404",
    component: PageErrorComponent,
  },

  {
    path: "**",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
