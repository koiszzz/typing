import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CommonService} from '../../../common.service';
import {CalMethod} from '../../cal-manage/cal-manage.component';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {
  group: FormGroup;
  article = '/auth/admin/article/model';
  calMethods: CalMethod[];
  constructor(private fb: FormBuilder,
              private sb: MatSnackBar,
              private cs: CommonService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ArticleEditComponent>) { }

  ngOnInit() {
    this.cs.getData('/auth/admin/calMethod/models', {isDeleted: '否', isUsed: '是'}).subscribe(
      (data: {data: CalMethod[], pageNum: number}) => {
        this.calMethods = data.data;
      }
    );
    this.group = this.fb.group({
      name: '',
      content: '',
      articleType: '',
      cmId: '',
      cmName: ''
    });
    if (this.data) {
      this.group.patchValue(this.data);
    }
  }

  submit() {
    if (!this.group.valid) {
      this.sb.open('请完善表单', '关闭', {duration: 2000});
    }
    const post = this.group.value;
    if (this.data) {
      Object.assign(post, {id: this.data.id});
    }
    this.cs.postData(this.article, this.group.value).subscribe(data => {
      if (data) {
        this.dialogRef.close(true);
      }
    });
  }

  OptionChange(v) {
    this.calMethods.map(s => {
      if (s.id === v) {
        this.group.patchValue({cmName: s.name});
      }
    });
  }
}
