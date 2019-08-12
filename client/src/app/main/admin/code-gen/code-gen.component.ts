import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CommonService} from '../../common.service';
import {CodeGenEditComponent} from './code-gen-edit/code-gen-edit.component';
import {ActionEvent, ColumnType, TableData} from '../../../shared/data-table/data-table.component';

export class CodeGen {
  id: string;
  tableName: string;
  tableDesc: string;
  cells: [{
    cell: string,
    cellDesc: string,
    cellType: string,
    cellChild: any
  }];
  createTime: Date;
  creator: string;
}

@Component({
  selector: 'app-code-gen',
  templateUrl: './code-gen.component.html',
  styleUrls: ['./code-gen.component.css']
})
export class CodeGenComponent implements OnInit {
  tableInfo: TableData;

  codeGens = '/auth/admin/codeGen/models';
  codeGen = '/auth/admin/codeGen/model';
  genCode = '/auth/admin/codeGen/genCode';

  constructor() {
  }

  ngOnInit() {
    this.tableInfo = new TableData({
      dataUrl: this.codeGens,
      columns: [
        {columnName: '表名', column: 'tableName', columnType: ColumnType.display},
        {columnName: '描述', column: 'tableDesc', columnType: ColumnType.display},
        {columnName: '创建时间', column: 'createTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '创建人', column: 'creator', columnType: ColumnType.display},
        {
          columnName: '操作', columnType: ColumnType.operate,
          children: [
            {actionEvent: ActionEvent.openComponent, actionName: '修改', component: CodeGenEditComponent},
            {actionEvent: ActionEvent.deleteHttp, key: 'id', actionName: '删除', url: this.codeGen},
            {actionEvent: ActionEvent.postHttp, key: 'id', actionName: '生成代码', url: this.genCode},
          ]
        },
      ],
      actions: [
        {actionEvent: ActionEvent.openComponent, actionName: '新增', component: CodeGenEditComponent}
      ]
    });
  }

}
