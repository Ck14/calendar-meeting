import { TestBed } from '@angular/core/testing';

import { FormularioParticipanteService } from './formulario-participante.service';

describe('FormularioParticipanteService', () => {
  let service: FormularioParticipanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularioParticipanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
