import { Component, OnInit } from '@angular/core';
import 'materialize-css';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  options = {
    menuWidth: 300, // Default is 240
    edge: 'left' // Choose the horizontal origin
  };
  constructor() { }

  ngOnInit(): void {

  }

}
