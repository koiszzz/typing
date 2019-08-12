import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  routers = [
    {name: '用户信息', url: './userEdit'},
    {name: '考试', url: './part'},
    {name: '成绩查询', url: './grade'},
    {name: '文章管理', url: './admin/article'},
    {name: '考试管理', url: './admin/examManage'},
    {name: '成绩管理', url: './admin/gradeManage'},
    {name: '计算方法管理', url: './admin/calManage'},
    {name: '代码生成', url: './admin/codeGen'},
  ];
  constructor() { }

  ngOnInit() {
  }

}
