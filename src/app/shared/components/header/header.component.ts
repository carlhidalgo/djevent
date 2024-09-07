import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Cambiado a SCSS
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() backbutton!: string;

  constructor() { }

  ngOnInit() {}

}