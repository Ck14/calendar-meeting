import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDesactivadoComponent } from './formulario-desactivado.component';

describe('FormularioDesactivadoComponent', () => {
  let component: FormularioDesactivadoComponent;
  let fixture: ComponentFixture<FormularioDesactivadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioDesactivadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioDesactivadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
