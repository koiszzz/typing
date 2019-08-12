import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeManageComponent } from './grade-manage.component';

describe('GradeManageComponent', () => {
  let component: GradeManageComponent;
  let fixture: ComponentFixture<GradeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
