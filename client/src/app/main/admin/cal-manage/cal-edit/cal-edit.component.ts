import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CommonService} from '../../../common.service';

@Component({
  selector: 'app-cal-edit',
  templateUrl: './cal-edit.component.html',
  styleUrls: ['./cal-edit.component.css']
})
export class CalEditComponent implements OnInit {
  group: FormGroup;
  model = '/auth/admin/calMethod/model';
  constructor(private fb: FormBuilder,
              private sb: MatSnackBar,
              private cs: CommonService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CalEditComponent>) { }

  ngOnInit() {
    this.group = this.fb.group({
      name: '',
      method: '// 请参照这个写计算规则\n' +
        'if (age >= 40) {grade = (success / duration / 60 - 45) + 60;} else {grade = (success / duration / 60 -40) + 60;}\n' +
        'grade = Math.round(grade,2);\n' +
        'if (grade > 100) { grade = 100 }\n' +
        'if (grade < 0) { grade = 0 }'
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
    this.cs.postData(this.model, this.group.value).subscribe(data => {
      if (data) {
        this.dialogRef.close(true);
      }
    });
  }

  test() {
    if (this.group.get('method').value.length <= 0) {
      this.sb.open('请输入计算规则', '关闭');
      return;
    }
    this.cs.postData('/auth/admin/calMethod/test', {method: this.group.get('method').value}, {showMessage: true}).subscribe();
  }
}
