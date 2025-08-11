import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearMeetComponent } from './modal-crear-meet.component';

describe('ModalCrearMeetComponent', () => {
  let component: ModalCrearMeetComponent;
  let fixture: ComponentFixture<ModalCrearMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCrearMeetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
