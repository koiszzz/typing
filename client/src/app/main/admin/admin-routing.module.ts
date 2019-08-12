import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CodeGenComponent} from './code-gen/code-gen.component';
import {ArticleComponent} from './article/article.component';
import {ExamManagerComponent} from './exam-manager/exam-manager.component';
import {CalManageComponent} from './cal-manage/cal-manage.component';
import {GradeManageComponent} from './grade-manage/grade-manage.component';

const routes: Routes = [
  {path: 'codeGen', component: CodeGenComponent},
  {path: 'article', component: ArticleComponent},
  {path: 'examManage', component: ExamManagerComponent},
  {path: 'calManage', component: CalManageComponent},
  {path: 'gradeManage', component: GradeManageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
