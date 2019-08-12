import {
  AfterContentInit, AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {TypeRowComponent} from './type-row/type-row.component';
import {CountDownOptions, Grades} from './count-down/count-down.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../common.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoadingComponent} from './loading/loading.component';

class Candidate {
  id: string;
  name: string;
  no: string;
  instNo: string;
  instName: string;
  certNo: string;
  age: number;
  ip: string;
  examId: string;
  articleType: string;
  content: string;
  rowLength: number;
  rowData: [string];
  initTime: Date;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  consume?: number;
  grade?: number;
}

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('typing', {static: true}) typing: ElementRef;
  @ViewChildren(TypeRowComponent) rows: QueryList<TypeRowComponent>;
  grade: Grades;
  contents: {data: string, init: string}[] = [];
  cdOptions: CountDownOptions;
  candidate: Candidate;
  worker: Worker;

  constructor(private aRouter: ActivatedRoute,
              private cs: CommonService,
              private dialog: MatDialog,
              private sb: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    this.worker = new Worker('./exam.worker', {type: 'module'});
    // Create a new
    this.worker.onmessage = ({data}) => {
      this.updateInfo({
        id: this.candidate.id,
        rowData: data.rowData,
        consume: data.consume
      });
    };
    this.aRouter.data.subscribe((data: { candidate: any }) => {
      this.candidate = data.candidate as Candidate;
      if (!this.candidate.startTime) {
        const start = new Date();
        this.cdOptions = new CountDownOptions({
          initTime: data.candidate.duration,
          startTime: start.getTime(),
        });
        if (this.candidate.articleType === '汉字') {
          this.candidate.rowLength = Math.round((this.typing.nativeElement.offsetWidth - 200 - 80) / 16) - 1;
        } else {
          this.candidate.rowLength = Math.round((this.typing.nativeElement.offsetWidth - 200) / 10) - 1;
        }
        // 更新开始标志
        this.updateInfo({
          startTime: start,
          id: this.candidate.id,
          consume: 0,
          rowLength: this.candidate.rowLength,
          rowData: []
        });
      } else {
        this.cdOptions = new CountDownOptions({
          initTime: this.candidate.duration,
          startTime: new Date(this.candidate.startTime).getTime(),
        });
      }
      this.grade = new Grades({
        success: 0,
        error: 0,
        jump: 0,
        data: {},
      });
      for (let i = 0; i < Math.round(data.candidate.content.length / this.candidate.rowLength); i++) {
        this.contents.push({
          data: data.candidate.content.substr(i * this.candidate.rowLength, this.candidate.rowLength),
          init: this.candidate.rowData[i] ? this.candidate.rowData[i] : ''
        });
      }
    });
  }

  jumpRow(event) {
    if (!event) {
      return;
    }
    switch (event.type) {
      case 'next':
        if (event.index !== undefined && event.index < this.contents.length - 1) {
          this.rows.toArray()[event.index + 1].focusEle(event.value);
        } else {
          this.rows.toArray()[event.index].blurEle();
        }
        break;
      case 'back':
        if (event.index !== undefined && event.index >= 1) {
          this.rows.toArray()[event.index - 1].focusEle();
        }
    }
  }

  /**
   * 打字统计
   * @param event 数据包
   */
  dataAnalysis(event) {
    if (!event && event.index === undefined) {
      return;
    }
    this.grade.data[event.index] = event;
    this.grade.count();
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

  ngAfterViewInit(): void {
    if (this.rows && this.rows.length > 0) {
      this.rows.toArray()[0].focusEle();
    }
  }

  /**
   * 计数 每10秒触发1次
   * @param value 计数
   */
  count(value: any) {
    if (value < this.candidate.duration) {
      this.saveState(value);
    } else {
      this.finish(value);
    }
  }

  saveState(consume: number) {
    this.worker.postMessage({jsonRowData: this.grade.data, oriRowData: this.contents, consume});
  }

  finish(consume: number): void {
    const dialogRef = this.dialog.open(LoadingComponent, {disableClose: true, hasBackdrop: true});
    const rows = this.contents.map((v, i) => {
      return this.grade.data[i] ? this.grade.data[i].rowData : '';
    });
    this.cs.postData('/auth/candidate/finish', {
      id: this.candidate.id,
      rowData: rows,
      consume,
      finish: true,
      success: this.grade.success,
      error: this.grade.error,
      jump: this.grade.jump
    }, {
      showMessage: true
    }).subscribe(() => {
    }, () => {
      this.sb.open('提交成绩发生错误，请联系考官', '关闭');
    }, () => {
      setTimeout(() => {
        this.router.navigateByUrl('/main/grade');
        dialogRef.close();
      }, 1000);
    });
  }

  updateInfo(body: any) {
    this.cs.postData('/auth/candidate/update', body, {
      showMessage: false
    }).subscribe();
  }
}
