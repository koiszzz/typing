import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {ExamComponent} from './exam/exam.component';
import {ExamResolveService} from './exam/exam-resolve.service';
import {UserInfoEditorComponent} from './user-info-editor/user-info-editor.component';
import {ParticipateComponent} from './participate/participate.component';
import {GradeComponent} from './grade/grade.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'part', component: ParticipateComponent},
  {path: 'exam', component: ExamComponent, resolve: {candidate: ExamResolveService}},
  {path: 'userEdit', component: UserInfoEditorComponent},
  {path: 'grade', component: GradeComponent},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
