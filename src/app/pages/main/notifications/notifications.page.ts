import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AppEvent } from 'src/app/models/event.model';
import { RatingComponent } from 'src/app/shared/components/rating/rating.component';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);
  notificationSvc = inject(NotificationService);

  notifications: any[] = [];
  selectedNotification: any;

  constructor() { }

  ngOnInit() {
    this.setupNotificationListener();
    this.notificationSvc.initFCM();
    this.getNotifications();
  }

  async setupNotificationListener() {
    LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
      const eventId = notification.notification.extra.eventId;
      const eventDoc = await this.firebaseSvc.getDocument(`events/${eventId}`);
      if (eventDoc) {
        const event = this.convertToAppEvent(eventDoc);
        this.rateEvent(event);
      }
    });
  }

  convertToAppEvent(docData: any): AppEvent {
    return {
      target: docData.target,
      id: docData.id,
      name: docData.name,
      creatorId: docData.creatorId,
      Image: docData.Image,
      description: docData.description,
      date: docData.date,
      location: docData.location,
      applicants: docData.applicants,
      acepted: docData.acepted,
      confirmed: docData.confirmed,
    };
  }

  async rateEvent(event: AppEvent) {
    await this.utilsSvc.presentModal({
      component: RatingComponent,
      cssClass: 'rating-modal',
      componentProps: { event }
    });

    this.getNotifications(); // Actualizar la lista de notificaciones cuando se cierre el modal
  }

  getNotifications() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const path = `users/${user.uid}/notifications`;
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (notifications: any[]) => {
        this.notifications = notifications;
        this.triggerDailyNotifications(notifications);
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
      }
    });
  }

  triggerDailyNotifications(notifications: any[]) {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const todayNotifications = notifications.filter(notification => notification.timestamp.split('T')[0] === today);

    if (todayNotifications.length > 0) {
      LocalNotifications.schedule({
        notifications: [
          {
            title: 'Notificaciones del Día',
            body: `Tienes ${todayNotifications.length} notificaciones para hoy.`,
            id: new Date().getTime(),
            schedule: { at: new Date(new Date().getTime() + 5000) }, // Programar para 5 segundos después
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: { todayNotifications }
          }
        ]
      });
    }
  }


  openNotificationModal(notification: any) {
    this.selectedNotification = notification;
    // Abre el modal de notificación
  }

  closeNotificationModal() {
    this.selectedNotification = null;
    // Cierra el modal de notificación
  }
}