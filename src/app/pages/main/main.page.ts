import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {
      title: 'inicio',
      url: 'home',
      icon: 'home-outline'
    },
    {
      title: 'perfil',
      url: 'profile',
      icon: 'person-outline'
    },
    
  ];

  ngOnInit() {
  }

}
