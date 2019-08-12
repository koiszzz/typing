import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamManagerComponent } from './exam-manager.component';

describe('ExamManagerComponent', () => {
  let component: ExamManagerComponent;
  let fixture: ComponentFixture<ExamManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
