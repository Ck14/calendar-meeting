import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuarioInternoComponent } from './modal-usuario-interno.component';

describe('ModalUsuarioInternoComponent', () => {
  let component: ModalUsuarioInternoComponent;
  let fixture: ComponentFixture<ModalUsuarioInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUsuarioInternoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUsuarioInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
