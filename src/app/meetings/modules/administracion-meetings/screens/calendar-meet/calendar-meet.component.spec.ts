import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMeetComponent } from './calendar-meet.component';

describe('CalendarMeetComponent', () => {
  let component: CalendarMeetComponent;
  let fixture: ComponentFixture<CalendarMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarMeetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
