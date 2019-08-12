import { Component, OnInit } from '@angular/core';
import {ActionEvent, ColumnType, TableData} from '../../shared/data-table/data-table.component';
import {ExamEditComponent} from '../admin/exam-manager/exam-edit/exam-edit.component';
import {CommonService} from '../common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.css']
})
export class ParticipateComponent implements OnInit {

  tableInfo: TableData;
  exams = '/auth/candidate/exams';
  constructor(private cs: CommonService,
              private router: Router) { }

  ngOnInit() {
    this.cs.getData('/auth/user/ext', {}).subscribe(
      data => {
        if (!data) {
          this.router.navigateByUrl('/main/userEdit');
        }
      }
    );
    this.tableInfo = new TableData({
      dataUrl: this.exams,
      columns: [
        {columnName: '名称', column: 'name', columnType: ColumnType.display},
        {columnName: '文章', column: 'articleName', columnType: ColumnType.display},
        {columnName: '开始时间', column: 'startTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '考试时长（秒）', column: 'timeLength', columnType: ColumnType.display},
        {
          columnName: '操作', columnType: ColumnType.operate,
          children: [
            {actionEvent: ActionEvent.jumpPage, key: 'id', actionName: '参加考试', toUrl: '/main/exam'},
          ]
        },
      ],
    });
  }

}
