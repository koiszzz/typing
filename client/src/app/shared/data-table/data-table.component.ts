import {Component, Input, OnInit, Type} from '@angular/core';
import {CommonService} from '../../main/common.service';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

export enum ColumnType {
  display = 0, operate = 1
}

export enum ActionEvent {
  getHttp = 0, postHttp = 1, deleteHttp = 2, openComponent = 3, jumpPage = 4
}

export class BtnAction {
  actionEvent: ActionEvent;
  actionName: string;
  key?: string | [string];
  url?: string;
  data?: string;
  component?: Type<any>;
  toUrl?: string;
}

export class TableData {
  dataUrl: string;
  dataQuery?: { [key: string]: string | [string] };
  actions: [BtnAction];
  columns: [{
    columnName: string,
    column: string,
    columnType: ColumnType,
    dataType: string,
    children?: [BtnAction]
  }];

  constructor(json: { [key: string]: any }) {
    Object.assign(this, json);
  }
}


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  providers: [CommonService],
})
export class DataTableComponent implements OnInit {
  @Input() tableData: TableData;
  pageInfo = {page: 0, pageSize: 15, pageNum: 0};
  data: any[];

  constructor(private cs: CommonService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    if (!this.tableData) {
      throw new Error('require a tableData');
    }
    this.refresh();
  }

  refresh() {
    const query = {};
    Object.assign(query, {
      page: this.pageInfo.page.toString(),
      pageSize: this.pageInfo.pageSize.toString()
    });
    Object.assign(query, this.tableData.dataQuery);
    this.cs.getData(this.tableData.dataUrl, query).subscribe((data: { data: any[], pageNum: number }) => {
      this.data = data.data;
      this.pageInfo.pageNum = data.pageNum;
    });
  }

  actionSwitch(action: BtnAction, rowNum?: number) {
    const post = {};
    if (rowNum !== undefined) {
      if (!action.key) {
        Object.assign(post, this.data[rowNum]);
      } else {
        if (typeof action.key === 'string') {
          post[action.key] = this.data[rowNum][action.key];
        } else { // array
          action.key.map(v => {
            post[v] = this.data[rowNum][v];
          });
        }
      }
    }
    if (action.data) {
      Object.assign(post, this.data);
    }
    switch (action.actionEvent) {
      case ActionEvent.getHttp:
        if (action.url) {
          this.getHttp(action.url, post);
        }
        break;
      case ActionEvent.postHttp:
        if (action.url) {
          this.postHttp(action.url, post);
        }
        break;
      case ActionEvent.deleteHttp:
        if (action.url) {
          this.deleteHttp(action.url, post);
        }
        break;
      case ActionEvent.openComponent:
        if (action.component) {
          this.openDialog(action.component, post);
        }
        break;
      case ActionEvent.jumpPage:
          const url = action.toUrl + '?' +
          Object.keys(post).map(v => {
            return v + '=' + post[v];
          }).join('&');
          this.router.navigateByUrl(url);
          break;
    }
  }

  getHttp(url: string, query?: { [key: string]: string | [string] }) {
    this.cs.getData(url, query).subscribe(data => {
      if (data) {
        this.refresh();
      }
    });
  }

  postHttp(url: string, body: { [key: string]: string | [string] }) {
    this.cs.postData(url, body).subscribe(data => {
      if (data) {
        this.refresh();
      }
    });
  }

  deleteHttp(url: string, query: { [key: string]: string | [string] }) {
    this.cs.deleteData(url, query).subscribe(data => {
      if (data) {
        this.refresh();
      }
    });
  }

  openDialog(component: Type<any>, data?: any) {
    const dialogRef = data ? this.dialog.open(component, {data}) : this.dialog.open(component);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.refresh();
      }
    });
  }
}
