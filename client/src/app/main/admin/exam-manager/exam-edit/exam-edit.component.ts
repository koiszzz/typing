import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CommonService} from '../../../common.service';
import {Article} from '../../article/article.component';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit {
  group: FormGroup;
  exam = '/auth/admin/exam/model';
  articlesUrl = '/auth/admin/article/models';
  articles: Article[];

  constructor(private fb: FormBuilder,
              private sb: MatSnackBar,
              private cs: CommonService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ExamEditComponent>) {
  }

  ngOnInit() {
    this.cs.getData(this.articlesUrl, {}).subscribe((data: { data: Article[], pageNum: number }) => {
      this.articles = data.data;
    });
    this.group = this.fb.group({
      name: new FormControl('', Validators.required),
      timeLength: new FormControl('', Validators.required),
      articleId: new FormControl('', Validators.required),
      articleName: '',
      articleType: '',
      cmId: '',
      cmName: '',
      limitIpStart: '',
      limitIpEnd: '',
    });
  }

  articleChange(v) {
    this.articles.map(s => {
      if (s.id === v) {
        this.group.patchValue({
          articleName: s.name,
          articleType: s.articleType,
          cmId: s.cmId,
          cmName: s.cmName,
        });
      }
    });
  }

  save() {
    if (!this.group.valid) {
      this.group.updateValueAndValidity();
      this.sb.open('表单未填写完整', '关闭', {
        duration: 2000
      });
      return;
    } else {
      const post = this.group.value;
      if (this.data) {
        post.id = this.data.id;
      }
      this.cs.postData(this.exam, post).subscribe();
      this.dialogRef.close(true);
    }
  }
}
