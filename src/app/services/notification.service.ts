import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppEvent } from 'src/app/models/event.model';

import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Component, OnInit } from '@angular/core';

import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  async init() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      alert('Push received: ' + JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    });
  }

  async scheduleEventNotification(event: AppEvent) {
    // Calcula el tiempo de notificación: 1 hora después de la fecha del evento
    const eventTime = new Date(event.date).getTime();
    const notificationTime = new Date(eventTime + (60 * 60 * 1000)); // 1 hora después

    // Convertir event.id a un número usando una función hash simple
    const notificationId = this.hashCode(event.id);

    const notification = {
      title: 'Evento Finalizado',
      body: `El evento ${event.name} ha terminado. Por favor, califica al DJ y al productor.`,
      id: notificationId,
      schedule: { at: notificationTime },
      sound: null,
      attachments: null,
      actionTypeId: '',
      extra: { eventId: event.id }
    };

    console.log('Programando notificación:', notification);

    await LocalNotifications.schedule({
      notifications: [notification]
    });

    console.log('Notificación programada con éxito');

    // Guardar la notificación en localStorage
    this.saveNotification(notification);
  }

  // Función hash simple para convertir una cadena en un número
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  private saveNotification(notification: any) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    console.log('Notificación guardada en localStorage:', notification);
  }


  getNotifications(): any[] {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  }

  async initFCM() {
    await FirebaseMessaging.requestPermissions();
    await FirebaseMessaging.getToken();

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      // Manejar la notificación recibida
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed: ', notification);
      // Manejar la acción de la notificación
    });
  }
}