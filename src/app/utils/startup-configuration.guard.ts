import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StartupConfigurationService } from './startup-configuration.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StartupConfigurationGuard implements CanActivate {

    constructor(
        private startupConfig: StartupConfigurationService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        // Si ya está listo, permitir acceso inmediatamente
        if (this.startupConfig.isReady()) {
            return of(true);
        }

        // Esperar a que la configuración esté lista
        return this.startupConfig.isConfigurationLoaded$.pipe(
            map(loaded => {
                if (loaded) {
                    return true;
                }
                return false;
            }),
            catchError(() => {
                // En caso de error, redirigir a off-line
                this.router.navigate(['off-line']);
                return of(false);
            })
        );
    }
}
