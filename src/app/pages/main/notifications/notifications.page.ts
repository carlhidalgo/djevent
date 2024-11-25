import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Notification } from 'src/app/models/notification.model';
import { AppEvent } from 'src/app/models/event.model';
import { RatingComponent } from 'src/app/shared/components/rating/rating.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];
  user: any;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getNotifications();
  }

  async rateEvent(notification: Notification) {
    await this.utilsSvc.presentModal({
      component: RatingComponent,
      cssClass: 'rating-modal',
      componentProps: { notification }
    });

    this.getNotifications(); // Actualizar la lista de notificaciones cuando se cierre el modal
  }

  getNotifications() {
    const path = `users/${this.user.uid}/notifications`;
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (notifications: Notification[]) => {
        this.notifications = notifications;
        this.utilsSvc.saveInLocalStorage('notifications', notifications); // Guardar en local
        this.triggerDailyNotifications(notifications);
      },
      error: (err: any) => {
        console.error('Error fetching notifications:', err);
      }
    });
  }

  triggerDailyNotifications(notifications: Notification[]) {
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
}