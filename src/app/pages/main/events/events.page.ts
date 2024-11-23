import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AppEvent } from 'src/app/models/event.model';
import { AddUpdateEventComponent } from 'src/app/shared/components/add-update-event/add-update-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {


  userRole: string | null = null;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  events: AppEvent[] = [];
  postulatedEvents: AppEvent[] = [];


  ngOnInit() {
    this.loadUserRole();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async loadUserRole() {
    this.userRole = await this.utilsSvc.getUserRole();
  }
  ionViewWillEnter() {
    this.loadUserRole();
    this.getEventsUser();
    this.getPostulatedEvents();
  }

  async addUpdateEvent(event?: AppEvent) {
    await this.utilsSvc.presentModal({
      component: AddUpdateEventComponent,
      cssClass: 'add-update-modal',
      componentProps: { event }
    });
    
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

  //obtener eventos postulados

getPostulatedEvents() {
  let path = `users/${this.user().uid}/eventspostulate`;
  let user = this.user();
  
  let sub = this.firebaseSvc.getCollectionData(path, user.uid).subscribe({
   next: (res: any) => {
     console.log(res);
     this.postulatedEvents = res;
     sub.unsubscribe();
     console.log(this.postulatedEvents);
     },
     error: (err: any) => {
       console.error('Error fetching events:', err);
     }


  });

}


}