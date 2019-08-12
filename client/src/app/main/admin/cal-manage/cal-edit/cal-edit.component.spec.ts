import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalEditComponent } from './cal-edit.component';

describe('CalEditComponent', () => {
  let component: CalEditComponent;
  let fixture: ComponentFixture<CalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
