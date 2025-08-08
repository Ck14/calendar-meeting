import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaCreacionComponent } from './bandeja-creacion.component';

describe('BandejaCreacionComponent', () => {
  let component: BandejaCreacionComponent;
  let fixture: ComponentFixture<BandejaCreacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaCreacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandejaCreacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
