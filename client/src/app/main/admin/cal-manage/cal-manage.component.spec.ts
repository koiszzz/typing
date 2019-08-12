import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalManageComponent } from './cal-manage.component';

describe('CalManageComponent', () => {
  let component: CalManageComponent;
  let fixture: ComponentFixture<CalManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
