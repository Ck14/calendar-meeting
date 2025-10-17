import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConsultaParticipantesComponent } from './consulta-participantes.component';
import { ConsultaParticipantesService } from './consulta-participantes.service';
import { of } from 'rxjs';

describe('ConsultaParticipantesComponent', () => {
    let component: ConsultaParticipantesComponent;
    let fixture: ComponentFixture<ConsultaParticipantesComponent>;
    let service: ConsultaParticipantesService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConsultaParticipantesComponent],
            imports: [ReactiveFormsModule, HttpClientTestingModule],
            providers: [ConsultaParticipantesService]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConsultaParticipantesComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ConsultaParticipantesService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.formConsulta.get('token')?.value).toBe('');
        expect(component.participantes).toEqual([]);
        expect(component.meetingInfo).toBeNull();
        expect(component.isLoading).toBeFalsy();
    });

    it('should validate required token field', () => {
        const tokenControl = component.formConsulta.get('token');
        expect(tokenControl?.errors?.['required']).toBeTruthy();

        tokenControl?.setValue('test-token');
        expect(tokenControl?.errors).toBeNull();
    });

    it('should search participants when form is valid', () => {
        const mockResponse = {
            success: true,
            message: 'Participantes encontrados',
            meetingInfo: {
                id: 1,
                titulo: 'Test Meeting',
                descripcion: 'Test Description',
                horaInicio: '2024-01-01T10:00:00',
                horaFin: '2024-01-01T11:00:00',
                estado: 'ACTIVO'
            },
            participantes: [
                {
                    id: 1,
                    dpi: '1234567890123',
                    nombreCompleto: 'Test User',
                    puesto: 'Test Position',
                    institucion: 'Test Institution',
                    telefonoExtension: '12345678',
                    correo: 'test@test.com',
                    sexo: 'M',
                    rangoEdad: '25-35',
                    discapacidad: 'Ninguna',
                    pueblo: 'Test Pueblo',
                    comunidadLinguistica: 'Test Community',
                    fechaRegistro: '2024-01-01T09:00:00'
                }
            ]
        };

        spyOn(service, 'consultarParticipantes').and.returnValue(of(mockResponse));

        component.formConsulta.get('token')?.setValue('test-token');
        component.buscarParticipantes();

        expect(service.consultarParticipantes).toHaveBeenCalledWith('test-token');
        expect(component.participantes).toEqual(mockResponse.participantes);
        expect(component.meetingInfo).toEqual(mockResponse.meetingInfo);
        expect(component.hasSearched).toBeTruthy();
    });

    it('should clear form and results', () => {
        component.formConsulta.get('token')?.setValue('test-token');
        component.participantes = [{ id: 1, nombreCompleto: 'Test' }];
        component.meetingInfo = { id: 1, titulo: 'Test' };
        component.hasSearched = true;

        component.limpiarConsulta();

        expect(component.formConsulta.get('token')?.value).toBe('');
        expect(component.participantes).toEqual([]);
        expect(component.meetingInfo).toBeNull();
        expect(component.hasSearched).toBeFalsy();
    });

    it('should return error message for required field', () => {
        const tokenControl = component.formConsulta.get('token');
        tokenControl?.markAsTouched();

        const errorMessage = component.getErrorMessage('token');
        expect(errorMessage).toBe('Este campo es requerido');
    });

    it('should return error message for minlength field', () => {
        const tokenControl = component.formConsulta.get('token');
        tokenControl?.setValue('a');
        tokenControl?.markAsTouched();

        const errorMessage = component.getErrorMessage('token');
        expect(errorMessage).toBe('Mínimo 1 caracteres');
    });

    it('should track participants by id', () => {
        const participante = { id: 1, nombreCompleto: 'Test' };
        const result = component.trackByParticipante(0, participante);
        expect(result).toBe(1);
    });
});
