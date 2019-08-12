import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

export class CountDownOptions {
  initTime: number;
  startTime: number;

  constructor(json) {
    Object.assign(this, json);
  }

}

export class Grades {
  success: number;
  error: number;
  jump: number;
  data: any;
  count() {
    let tS = 0;
    let tE = 0;
    let tJ = 0;
    Object.keys(this.data).map(key => {
      tS += this.data[key].success;
      tE += this.data[key].error;
      tJ += this.data[key].jump;
    });
    this.success = tS;
    this.error = tE;
    this.jump = tJ;
  }

  constructor(json) {
    Object.assign(this, json);
  }
}

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit, OnDestroy {
  @Input() options: CountDownOptions;
  @Input() grade: Grades;
  @Output() count = new EventEmitter();
  current: Date;
  countDown: any;
  rTime: number;
  constructor() { }

  ngOnInit() {
    this.current = new Date();
    this.rTime = this.options.initTime - Math.round((this.current.getTime() - this.options.startTime) / 1000);
    if (this.rTime <= 0) {
      this.count.emit(this.options.initTime);
      return;
    }
    this.countDown = setInterval(() => {
      if (this.rTime <= 1) {
        clearInterval(this.countDown);
      }
      this.rTime--;
      if (this.rTime % 10 === 0) {
        this.count.emit(this.options.initTime - this.rTime);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.countDown);
  }

  showTime() {
    const f = Math.floor(this.rTime / 60);
    const s = this.rTime % 60;
    return `${(f < 10) ? ('0' + f) : '' + f} : ${ s < 10 ? '0' + s : s}`;
  }

  showSpeed() {
    if (this.options.initTime - this.rTime <= 0) {
      return 0;
    }
    return Math.round((this.grade.success) / (this.options.initTime - this.rTime) * 60);
  }

  rightRate() {
    if (this.grade.success + this.grade.error <= 0) {
      return 0;
    }
    return Math.round(this.grade.success / (this.grade.success + this.grade.error) * 100);
  }

}
