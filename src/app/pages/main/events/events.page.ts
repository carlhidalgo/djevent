import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getEvents();
  }

  //obtener eventos
  getEvents() {
    let path = `events`;
    
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
     next: (res: any) => {
       console.log(res);
       sub.unsubscribe();
       },
       error: (err: any) => {
         console.error('Error fetching events:', err);
       }
  

    });

}

}