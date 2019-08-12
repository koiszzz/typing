import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-type-row',
  templateUrl: './type-row.component.html',
  styleUrls: ['./type-row.component.css']
})
export class TypeRowComponent implements OnInit {

  @Input() index: number;
  @Input() content: string;
  @Input() init: string;
  @Output() overload = new EventEmitter();
  @Output() analysis = new EventEmitter();
  @ViewChild('inputEle', {static: true}) inputEle: ElementRef;
  curInput = new FormControl('');
  showContent = [];

  constructor() { }

  ngOnInit() {
    this.showContent.push({content: this.content, style: ''});
    this.curInput.valueChanges.pipe(debounceTime(200)).subscribe(v => {
      const newShown = [];
      const data = {
        index: this.index,
        success: 0,
        error: 0,
        jump: 0,
        rowData: v.substr(0, this.content.length),
      };
      for (let i = 0 ; i < (v.length <= this.content.length ? v.length : this.content.length); i++) {
        let style = '';
        if (v[i] !== String.fromCharCode(32) && v[i] !== String.fromCharCode(12288)) {
          if (v[i] === this.content[i]) {
            style = 'success';
            data.success++;
          } else {
            style = 'error';
            data.error++;
          }
        } else {
          style = 'yellow';
          data.jump++;
        }
        newShown.push({
          content: this.content[i],
          style,
        });
      }
      if (v.length < this.content.length) {
        newShown.push({
          content: this.content.substr(v.length, this.content.length),
          style: ''
        });
      }
      this.showContent = newShown;
      if (v.length >= this.content.length) {
        this.inputEle.nativeElement.value = v.substr(0, this.content.length);
        this.overload.emit({type: 'next', value: v.substr(this.content.length, v.length), index: this.index});
      }
      this.analysis.emit(data);
    });
    if (this.init) {
      this.curInput.patchValue(this.init);
    }
  }

  focusEle(value?: string) {
    this.inputEle.nativeElement.focus();
    if (value) {
      this.curInput.patchValue(value);
    }
  }

  blurEle() {
    this.inputEle.nativeElement.blur();
  }

  replaceSpace(event) {
    event.target.value = event.target.value.replace(new RegExp(String.fromCharCode(32), 'g'), String.fromCharCode(12288));
  }

  back(event) {
    if (event.target.value.length === 0) {
      this.overload.emit({type: 'back', index: this.index});
    }
  }

}
