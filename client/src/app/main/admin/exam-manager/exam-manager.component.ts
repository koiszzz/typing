import {Component, OnInit} from '@angular/core';
import {ActionEvent, ColumnType, TableData} from '../../../shared/data-table/data-table.component';
import {ExamEditComponent} from './exam-edit/exam-edit.component';

@Component({
  selector: 'app-exam-manager',
  templateUrl: './exam-manager.component.html',
  styleUrls: ['./exam-manager.component.css']
})
export class ExamManagerComponent implements OnInit {

  tableInfo: TableData;
  exams = '/auth/admin/exam/models';
  exam = '/auth/admin/exam/model';
  start = '/auth/admin/exam/start';
  end = '/auth/admin/exam/end';
  constructor() { }

  ngOnInit() {
    this.tableInfo = new TableData({
      dataUrl: this.exams,
      columns: [
        {columnName: '名称', column: 'name', columnType: ColumnType.display},
        {columnName: '文章', column: 'articleName', columnType: ColumnType.display},
        {columnName: 'IP限制', column: 'limitIp', columnType: ColumnType.display},
        {columnName: '开始时间', column: 'startTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '结束时间', column: 'endTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '状态', column: 'status', columnType: ColumnType.display},
        {
          columnName: '操作', columnType: ColumnType.operate,
          children: [
            {actionEvent: ActionEvent.deleteHttp, key: 'id', actionName: '删除', url: this.exam},
            {actionEvent: ActionEvent.postHttp, key: 'id', actionName: '开始', url: this.start},
            {actionEvent: ActionEvent.postHttp, key: 'id', actionName: '停止', url: this.end},
          ]
        },
      ],
      actions: [
        {actionEvent: ActionEvent.openComponent, actionName: '新增', component: ExamEditComponent}
      ]
    });
  }

}
