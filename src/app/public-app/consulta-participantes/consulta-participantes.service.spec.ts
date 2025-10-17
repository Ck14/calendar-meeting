import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultaParticipantesService } from './consulta-participantes.service';
import { environment } from '../../../environments/environment';

describe('ConsultaParticipantesService', () => {
    let service: ConsultaParticipantesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ConsultaParticipantesService]
        });
        service = TestBed.inject(ConsultaParticipantesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should consult participants by token', () => {
        const mockToken = 'test-token';
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

        service.consultarParticipantes(mockToken).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.urlSistema}meetings/participantes/consulta`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ token: mockToken });
        req.flush(mockResponse);
    });
});
