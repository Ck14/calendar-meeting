import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormularioParticipanteComponent } from './formulario-participante.component';

describe('FormularioParticipanteComponent', () => {
    let component: FormularioParticipanteComponent;
    let fixture: ComponentFixture<FormularioParticipanteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormularioParticipanteComponent],
            imports: [ReactiveFormsModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ llave: 'LSXMO6T4VD' })
                    }
                }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormularioParticipanteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.formParticipante).toBeDefined();
        expect(component.formParticipante.get('dpi')?.value).toBe('');
        expect(component.formParticipante.get('nombreCompleto')?.value).toBe('');
    });

    it('should load query param llave', () => {
        expect(component.llaveFormulario).toBe('LSXMO6T4VD');
    });

    it('should validate DPI format', () => {
        const dpiControl = component.formParticipante.get('dpi');
        dpiControl?.setValue('1234567890123');
        expect(dpiControl?.valid).toBe(true);

        dpiControl?.setValue('123');
        expect(dpiControl?.valid).toBe(false);
    });

    it('should validate email format', () => {
        const emailControl = component.formParticipante.get('correo');
        emailControl?.setValue('test@example.com');
        expect(emailControl?.valid).toBe(true);

        emailControl?.setValue('invalid-email');
        expect(emailControl?.valid).toBe(false);
    });

    it('should mark form as invalid when required fields are empty', () => {
        expect(component.formParticipante.valid).toBe(false);
    });

    it('should mark form as valid when all required fields are filled', () => {
        component.formParticipante.patchValue({
            dpi: '1234567890123',
            nombreCompleto: 'Juan Pérez',
            puesto: 'Analista',
            institucion: 'MINFIN',
            cargoPuesto: 'Analista Senior',
            telefonoExtension: '1234',
            correo: 'juan@example.com',
            sexo: 'M',
            rangoEdad: '26-35',
            idioma: 'espanol',
            discapacidad: 'ninguna',
            pueblo: 'mestizo',
            comunidadLinguistica: 'espanol'
        });

        expect(component.formParticipante.valid).toBe(true);
    });
});
