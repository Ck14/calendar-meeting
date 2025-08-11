import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarMeetComponent } from './modal-editar-meet.component';

describe('ModalEditarMeetComponent', () => {
  let component: ModalEditarMeetComponent;
  let fixture: ComponentFixture<ModalEditarMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarMeetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
