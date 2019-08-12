import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-router-button',
  templateUrl: './router-button.component.html',
  styleUrls: ['./router-button.component.css']
})
export class RouterButtonComponent implements OnInit {
  colors = [
    '#3f51b5',
    '#42a5f5',
    '#66bb6a',
    '#388e3c',
    '#ffa726',
    '#f4511e',
    '#ff1744',
    '#e91e63',
    '#7b1fa2',
  ];
  color: string;
  @Input() routerInfo: { name: string, url: string };

  constructor() {
  }

  ngOnInit() {
    const rad = Math.floor(Math.random() * this.colors.length);
    this.color = this.colors[rad];
  }

}
