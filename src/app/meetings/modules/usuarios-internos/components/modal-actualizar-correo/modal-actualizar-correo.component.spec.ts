import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActualizarCorreoComponent } from './modal-actualizar-correo.component';

describe('ModalActualizarCorreoComponent', () => {
  let component: ModalActualizarCorreoComponent;
  let fixture: ComponentFixture<ModalActualizarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalActualizarCorreoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalActualizarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
