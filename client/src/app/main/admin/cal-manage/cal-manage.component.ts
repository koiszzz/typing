import {Component, OnInit} from '@angular/core';
import {ActionEvent, ColumnType, TableData} from '../../../shared/data-table/data-table.component';
import {CalEditComponent} from './cal-edit/cal-edit.component';

export class CalMethod {
  id: string;
  name: string;
  method: string;
  isUsed: string;
  isDeleted: string;
  createTime: Date;
  creator: string;
}

@Component({
  selector: 'app-cal-manage',
  templateUrl: './cal-manage.component.html',
  styleUrls: ['./cal-manage.component.css']
})
export class CalManageComponent implements OnInit {

  tableInfo: TableData;
  models = '/auth/admin/calMethod/models';
  model = '/auth/admin/calMethod/model';

  constructor() {
  }

  ngOnInit() {
    this.tableInfo = new TableData({
      dataUrl: this.models,
      dataQuery: {isDeleted: '否'},
      columns: [
        {columnName: '规则名称', column: 'name', columnType: ColumnType.display},
        {columnName: '创建日期', column: 'createTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '创建人', column: 'creator', columnType: ColumnType.display},
        {columnName: '是否启用', column: 'isUsed', columnType: ColumnType.display},
        {
          columnName: '操作', columnType: ColumnType.operate,
          children: [
            {actionEvent: ActionEvent.openComponent, actionName: '修改', component: CalEditComponent},
            {actionEvent: ActionEvent.postHttp, key: 'id', actionName: '启用', url: '/auth/admin/calMethod/use'},
            {actionEvent: ActionEvent.deleteHttp, key: 'id', actionName: '删除', url: this.model},
          ]
        },
      ],
      actions: [
        {actionEvent: ActionEvent.openComponent, actionName: '新增', component: CalEditComponent}
      ]
    });
  }
}
