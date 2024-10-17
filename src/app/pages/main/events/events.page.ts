import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  events: Event[] = [];



  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getEventsUser();
  }

  //obtener eventos
  getEventsUser() {
    let path = `events`;
    let user = this.user();
    
    let sub = this.firebaseSvc.getCollectionUser(path, user.uid).subscribe({
     next: (res: any) => {
       console.log(res);
       this.events = res;
       sub.unsubscribe();
       },
       error: (err: any) => {
         console.error('Error fetching events:', err);
       }
  

    });

}

}