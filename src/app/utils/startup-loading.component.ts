import { Component, OnInit } from '@angular/core';
import { StartupConfigurationService } from './startup-configuration.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-startup-loading',
    template: `
    <div class="startup-loading-container">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando configuración...</span>
        </div>
        <p class="mt-3">Cargando configuración de la aplicación...</p>
      </div>
    </div>
  `,
    styles: [`
    .startup-loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    
    .loading-spinner {
      text-align: center;
    }
    
    .loading-spinner p {
      color: #6c757d;
      font-size: 1.1rem;
    }
  `]
})
export class StartupLoadingComponent implements OnInit {

    constructor(
        private startupConfig: StartupConfigurationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Una vez que la configuración esté lista, redirigir a la ruta redirect
        this.startupConfig.waitForConfiguration().then(() => {
            this.router.navigate(['redirect']);
        });
    }
}
