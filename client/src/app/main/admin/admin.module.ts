import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CodeGenEditComponent} from './code-gen/code-gen-edit/code-gen-edit.component';
import {ArticleEditComponent} from './article/article-edit/article-edit.component';
import {ExamEditComponent} from './exam-manager/exam-edit/exam-edit.component';
import {CodeGenComponent} from './code-gen/code-gen.component';
import {ArticleComponent} from './article/article.component';
import {ExamManagerComponent} from './exam-manager/exam-manager.component';
import {CalManageComponent} from './cal-manage/cal-manage.component';
import {MaterialModule} from '../../shared/material.module';
import {AdminRoutingModule} from './admin-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import { CalEditComponent } from './cal-manage/cal-edit/cal-edit.component';
import { GradeManageComponent } from './grade-manage/grade-manage.component';


@NgModule({
  declarations: [
    CodeGenComponent,
    ArticleComponent,
    ArticleEditComponent,
    CodeGenEditComponent,
    ExamManagerComponent,
    ExamEditComponent,
    CalManageComponent,
    CalEditComponent,
    GradeManageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    AdminRoutingModule,
  ],
  entryComponents: [
    CodeGenEditComponent,
    ArticleEditComponent,
    ExamEditComponent,
    CalEditComponent,
  ]
})
export class AdminModule {
}
