import { NgModule } from '@angular/core';
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';
import { ValidarCredencialesComponent } from './components/validar-credenciales/validar-credenciales.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResizeService } from '../utils/resize.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PrivateAppRoutingModule } from './private-app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../utils/auth.service';
import { AuthGuardService } from '../utils/auth-guard.service';
import { AuthInterceptor } from './utils/auth.interceptor';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    DashboardComponent,TwoFactorAuthComponent,
    ValidarCredencialesComponent
  ],
  imports: [
    CommonModule,
    PrivateAppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask(),
    ResizeService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class PrivateAppModule { }
