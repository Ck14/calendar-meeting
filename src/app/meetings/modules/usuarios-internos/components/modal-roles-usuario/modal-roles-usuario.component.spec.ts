import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRolesUsuarioComponent } from './modal-roles-usuario.component';

describe('ModalRolesUsuarioComponent', () => {
  let component: ModalRolesUsuarioComponent;
  let fixture: ComponentFixture<ModalRolesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRolesUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRolesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
