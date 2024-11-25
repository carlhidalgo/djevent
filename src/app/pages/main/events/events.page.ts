import { firstValueFrom } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AppEvent } from 'src/app/models/event.model';
import { AddUpdateEventComponent } from 'src/app/shared/components/add-update-event/add-update-event.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {


  userRole: string | null = null;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  notificationSvc = inject(NotificationService);

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
    let user = this.utilsSvc.getFromLocalStorage('user');
    
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
        this.checkAndSaveNotifications(res);
        sub.unsubscribe();
      },
      error: (err: any) => {
        console.error('Error fetching events:', err);
      }
    });
  }



  checkAndSaveNotifications(events: AppEvent[]) {
    const currentTime = new Date().getTime();
    events.forEach(event => {
      const eventTime = new Date(event.date).getTime();
      if (eventTime < currentTime) {
        this.saveNotification(event);
      }
    });
  }

  async saveNotification(event: AppEvent) {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const path = `users/${user.uid}/notifications`;
    console.log('Fetching existing notifications from path:', path);
    const existingNotifications = await firstValueFrom(this.firebaseSvc.getCollectionData(path));
    console.log('Existing notifications:', existingNotifications);
    const notificationExists = existingNotifications.some((notification: any) => notification.eventId === event.id);

    if (!notificationExists) {
      const notification = {
        title: 'Evento Finalizado',
        body: `El evento ${event.name} ha terminado. Por favor, califica.`,
        eventId: event.id,
        creatorId: event.creatorId,
        timestamp: new Date().toISOString()
      };
      await this.firebaseSvc.addDocument(path, notification);
      console.log('Notificación guardada:', notification);
    } else {
      console.log('Notificación ya existe para el evento:', event.id);
    }
  }
scheduleNotifications(events: AppEvent[]) {
  events.forEach(event => {
    this.notificationSvc.scheduleEventNotification(event);
  });
}

}