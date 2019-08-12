import {Component, OnInit} from '@angular/core';
import {ActionEvent, ColumnType, TableData} from '../../../shared/data-table/data-table.component';
import {ArticleEditComponent} from './article-edit/article-edit.component';

export class Article {
  id: string;
  name: string;
  content: string;
  articleType: string;
  cmId: string;
  cmName: string;
  creator: string;
  createTime: Date;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  tableInfo: TableData;
  articles = '/auth/admin/article/models';
  article = '/auth/admin/article/model';

  constructor() {
  }

  ngOnInit() {
    this.tableInfo = new TableData({
      dataUrl: this.articles,
      columns: [
        {columnName: '文章名称', column: 'name', columnType: ColumnType.display},
        {columnName: '文章类型', column: 'articleType', columnType: ColumnType.display},
        {columnName: '关联计算规则', column: 'cmName', columnType: ColumnType.display},
        {columnName: '上传时间', column: 'createTime', columnType: ColumnType.display, dataType: 'date'},
        {columnName: '创建人', column: 'creator', columnType: ColumnType.display},
        {
          columnName: '操作', columnType: ColumnType.operate,
          children: [
            {actionEvent: ActionEvent.openComponent, actionName: '修改', component: ArticleEditComponent},
            {actionEvent: ActionEvent.deleteHttp, key: 'id', actionName: '删除', url: this.article},
          ]
        },
      ],
      actions: [
        {actionEvent: ActionEvent.openComponent, actionName: '新增', component: ArticleEditComponent}
      ]
    });
  }
}
