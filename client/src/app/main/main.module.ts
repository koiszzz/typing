import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ExamComponent} from './exam/exam.component';
import {TypeRowComponent} from './exam/type-row/type-row.component';
import {CountDownComponent} from './exam/count-down/count-down.component';
import {ExamResolveService} from './exam/exam-resolve.service';
import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from './main.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UserInfoComponent} from './user-info/user-info.component';
import {RouterButtonComponent} from './router-button/router-button.component';
import {UserInfoEditorComponent} from './user-info-editor/user-info-editor.component';
import {CommonService} from './common.service';
import {ParticipateComponent} from './participate/participate.component';
import {MaterialModule} from '../shared/material.module';
import {GradeComponent} from './grade/grade.component';
import {LoadingComponent} from './exam/loading/loading.component';


@NgModule({
  declarations: [
    MainComponent,
    ExamComponent,
    TypeRowComponent,
    CountDownComponent,
    UserInfoComponent,
    RouterButtonComponent,
    UserInfoEditorComponent,
    ParticipateComponent,
    GradeComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    ExamResolveService,
    CommonService,
    DatePipe,
  ],
  entryComponents: [
    LoadingComponent
  ]
})
export class MainModule { }
