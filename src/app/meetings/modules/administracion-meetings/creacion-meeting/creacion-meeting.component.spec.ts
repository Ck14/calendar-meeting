import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionMeetingComponent } from './creacion-meeting.component';

describe('CreacionMeetingComponent', () => {
  let component: CreacionMeetingComponent;
  let fixture: ComponentFixture<CreacionMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
