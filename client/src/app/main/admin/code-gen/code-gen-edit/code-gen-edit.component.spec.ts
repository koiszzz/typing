import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeGenEditComponent } from './code-gen-edit.component';

describe('CodeGenEditComponent', () => {
  let component: CodeGenEditComponent;
  let fixture: ComponentFixture<CodeGenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeGenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeGenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
