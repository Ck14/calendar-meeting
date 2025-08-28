import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

    opcionesRangoEdad = [
        { value: '18-25', label: '18-25 años' },
        { value: '26-35', label: '26-35 años' },
        { value: '36-45', label: '36-45 años' },
        { value: '46-55', label: '46-55 años' },
        { value: '56-65', label: '56-65 años' },
        { value: '65+', label: 'Más de 65 años' }
    ];

    opcionesIdioma = [
        { value: 'espanol', label: 'Español' },
        { value: 'ingles', label: 'Inglés' },
        { value: 'frances', label: 'Francés' },
        { value: 'aleman', label: 'Alemán' },
        { value: 'italiano', label: 'Italiano' },
        { value: 'portugues', label: 'Portugués' },
        { value: 'otro', label: 'Otro' }
    ];

    opcionesDiscapacidad = [
        { value: 'ninguna', label: 'Ninguna' },
        { value: 'visual', label: 'Visual' },
        { value: 'auditiva', label: 'Auditiva' },
        { value: 'motora', label: 'Motora' },
        { value: 'intelectual', label: 'Intelectual' },
        { value: 'psicosocial', label: 'Psicosocial' },
        { value: 'otra', label: 'Otra' }
    ];

    opcionesPueblo = [
        { value: 'maya', label: 'Maya' },
        { value: 'garifuna', label: 'Garífuna' },
        { value: 'xinca', label: 'Xinca' },
        { value: 'mestizo', label: 'Mestizo' },
        { value: 'ladino', label: 'Ladino' },
        { value: 'otro', label: 'Otro' }
    ];

    opcionesComunidadLinguistica = [
        { value: 'kiche', label: 'K\'iche\'' },
        { value: 'qeqchi', label: 'Q\'eqchi\'' },
        { value: 'kaqchikel', label: 'Kaqchikel' },
        { value: 'mam', label: 'Mam' },
        { value: 'qanjobal', label: 'Q\'anjob\'al' },
        { value: 'poqomchi', label: 'Poqomchi\'' },
        { value: 'tzutujil', label: 'Tz\'utujil' },
        { value: 'achí', label: 'Achí' },
        { value: 'ixil', label: 'Ixil' },
        { value: 'chuj', label: 'Chuj' },
        { value: 'popti', label: 'Popti' },
        { value: 'chorti', label: 'Ch\'orti\'' },
        { value: 'akateko', label: 'Akateko' },
        { value: 'uspanteko', label: 'Uspanteko' },
        { value: 'sipakapense', label: 'Sipakapense' },
        { value: 'sakapulteko', label: 'Sakapulteko' },
        { value: 'awakateko', label: 'Awakateko' },
        { value: 'chaltiteko', label: 'Chaltiteko' },
        { value: 'mocho', label: 'Mocho' },
        { value: 'tektiteko', label: 'Tektiteko' },
        { value: 'espanol', label: 'Español' },
        { value: 'otro', label: 'Otro' }
    ];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.formParticipante = this.fb.group({
            dpi: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
            nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
            puesto: ['', [Validators.required]],
            institucion: ['', [Validators.required]],
            cargoPuesto: ['', [Validators.required]],
            telefonoExtension: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            sexo: ['', [Validators.required]],
            rangoEdad: ['', [Validators.required]],
            idioma: ['', [Validators.required]],
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
