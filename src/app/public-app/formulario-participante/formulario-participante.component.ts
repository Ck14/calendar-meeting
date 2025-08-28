import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioParticipanteService } from './formulario-participante.service';
import { forkJoin } from 'rxjs';
import { ComunidadLinguistica, Discapacidad, Pueblo, RangoEdad } from 'src/app/interfaces/meetings/catalogoModelo';

@Component({
    selector: 'app-formulario-participante',
    templateUrl: './formulario-participante.component.html',
    styleUrls: ['./formulario-participante.component.css']
})
export class FormularioParticipanteComponent implements OnInit {
    formParticipante: FormGroup;
    llaveFormulario: string = '';

    // Opciones para los selects
    opcionesSexo = [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
    ];


    public rangosEdad: RangoEdad[] = [];
    public comunidadesLinguisticas: ComunidadLinguistica[] = [];
    public discapacidades: Discapacidad[] = [];
    public pueblos: Pueblo[] = [];




    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private formularioParticipanteService: FormularioParticipanteService
    ) {
        this.formParticipante = this.fb.group({
            dpi: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
            nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
            puesto: ['', [Validators.required]],
            institucion: ['', [Validators.required]],
            telefonoExtension: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            sexo: ['', [Validators.required]],
            rangoEdad: ['', [Validators.required]],
            discapacidad: ['', [Validators.required]],
            pueblo: ['', [Validators.required]],
            comunidadLinguistica: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        // Obtener la llave del formulario desde los query params
        this.route.queryParams.subscribe(params => {
            this.llaveFormulario = params['llave'] || '';
            console.log('Llave del formulario:', this.llaveFormulario);
        });
        this.obtenerCatalogos();
    }

    obtenerCatalogos(): void {
        let categorias = this.formularioParticipanteService.obtenerRangosEdad();
        let comunidadesLinguisticas = this.formularioParticipanteService.obtenerComunidadLinguistica();
        let discapacidades = this.formularioParticipanteService.obtenerDiscapacidad();
        let pueblos = this.formularioParticipanteService.obtenerPueblo();


        forkJoin([categorias, comunidadesLinguisticas, discapacidades, pueblos]).subscribe({
            next: (result) => {
                console.log('result', result);
                this.rangosEdad = result[0];
                this.comunidadesLinguisticas = result[1];
                this.discapacidades = result[2];
                this.pueblos = result[3];
            },
            error: (error) => { },
            complete() { },
        });

    }




    onSubmit(): void {
        if (this.formParticipante.valid) {
            console.log('Formulario válido:', this.formParticipante.value);
            console.log('Llave del formulario:', this.llaveFormulario);

            // Aquí puedes enviar los datos al backend
            // const datos = {
            //   llaveFormulario: this.llaveFormulario,
            //   ...this.formParticipante.value
            // };

            // Ejemplo de envío
            // this.enviarDatos(datos);
        } else {
            this.marcarCamposInvalidos();
        }
    }

    marcarCamposInvalidos(): void {
        Object.keys(this.formParticipante.controls).forEach(key => {
            const control = this.formParticipante.get(key);
            if (control?.invalid) {
                control.markAsTouched();
            }
        });
    }

    getErrorMessage(controlName: string): string {
        const control = this.formParticipante.get(controlName);
        if (control?.errors && control.touched) {
            if (control.errors['required']) {
                return 'Este campo es requerido';
            }
            if (control.errors['email']) {
                return 'Ingrese un correo electrónico válido';
            }
            if (control.errors['pattern']) {
                return 'Formato inválido';
            }
            if (control.errors['minlength']) {
                return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
            }
        }
        return '';
    }
}
