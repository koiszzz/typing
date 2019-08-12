import { Component, OnInit } from '@angular/core';
import {ActionEvent, ColumnType, TableData} from '../../shared/data-table/data-table.component';
import {ArticleEditComponent} from '../admin/article/article-edit/article-edit.component';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  tableInfo: TableData;
  constructor() {
  }

  ngOnInit() {
    this.tableInfo = new TableData({
      dataUrl: '/auth/candidate/models',
      dataQuery: {
        finish: 'true',
        calState: '成功',
      },
      columns: [
        {columnName: '考试', column: 'examName', columnType: ColumnType.display},
        {columnName: '考生', column: 'name', columnType: ColumnType.display},
        {columnName: '正确字数', column: 'success', columnType: ColumnType.display},
        {columnName: '错误字数', column: 'error', columnType: ColumnType.display},
        {columnName: '正确率(%)', column: 'correctRate', columnType: ColumnType.display},
        {columnName: '成绩', column: 'grade', columnType: ColumnType.display},
      ],
    });
  }

}
