import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

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

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event.url;
            
    })
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //cerrar sesion

  singOut() {
    this.firebaseSvc.signOut();
  }

}
