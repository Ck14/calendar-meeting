import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-campo-errores',
    templateUrl: './campo-errores.component.html',
    styleUrls: ['./campo-errores.component.css']
})
export class CampoErroresComponent {

    @Input() control: AbstractControl | null = null;

    /**
     * Verifica si el control tiene un error específico
     */
    hasError(errorType: string): boolean {
        return this.control?.hasError(errorType) || false;
    }

    /**
     * Verifica si el control está en estado inválido y ha sido tocado o modificado
     */
    shouldShowErrors(): boolean {
        return !!(this.control?.invalid && (this.control?.dirty || this.control?.touched));
    }
}
