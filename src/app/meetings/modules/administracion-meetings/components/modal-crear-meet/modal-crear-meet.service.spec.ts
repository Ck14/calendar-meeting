import { TestBed } from '@angular/core/testing';

import { ModalCrearMeetService } from './modal-crear-meet.service';

describe('ModalCrearMeetService', () => {
  let service: ModalCrearMeetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCrearMeetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
