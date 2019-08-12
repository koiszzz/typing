import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CommonService} from '../../../common.service';
import {CodeGen} from '../code-gen.component';

@Component({
  selector: 'app-code-gen-edit',
  templateUrl: './code-gen-edit.component.html',
  styleUrls: ['./code-gen-edit.component.css']
})
export class CodeGenEditComponent implements OnInit {
  group: FormGroup;
  codeGen = '/auth/admin/codeGen/model';
  constructor(private fb: FormBuilder,
              private sb: MatSnackBar,
              private cs: CommonService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CodeGenEditComponent>) { }

  ngOnInit() {
    this.group = this.fb.group({
      tableName: new FormControl('', Validators.required),
      tableDesc: '',
      cells: this.fb.array([
      ])
    });
    if (this.data) {
      const tranData = this.data as CodeGen;
      if (tranData.cells) {
        tranData.cells.map(() => {
          this.addCell();
        });
      } else {
        this.addCell();
      }
      this.group.patchValue(tranData);
    } else {
      this.addCell();
    }
  }

  cellForm() {
    return this.fb.group({
      cell: new FormControl('', Validators.required),
      cellDesc: '',
      cellType: 'String',
      cellChild: new FormControl(''),
    });
  }

  addCell() {
    const array = this.group.get('cells') as FormArray;
    array.push(this.cellForm());
  }

  removeCell(index: number) {
    const array = this.group.get('cells') as FormArray;
    if (array.length > 1) {
      array.removeAt(index);
    }
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
      this.cs.postData(this.codeGen, post).subscribe();
      this.dialogRef.close(true);
    }
  }
}
