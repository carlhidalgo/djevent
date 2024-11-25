import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Notification } from 'src/app/models/notification.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() notification: Notification;
  ratingForm: FormGroup;
  user: User;
  userRole: string | null = null;


  form = new FormGroup({
  
  });

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.ratingForm = this.fb.group({
      rating: [0, Validators.required]
    });
  }

  async submitRating() {
    if (this.ratingForm.valid) {
      const rating = this.ratingForm.value.rating;

      // Calificación va al productor usando creatorId de la notificación
      const recipientId = this.notification.creatorId;

      console.log('Recipient ID:', recipientId); // Verificar el recipientId en la consola

      if (!recipientId) {
        console.error('Recipient ID is undefined');
        return;
      }

      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Obtener el documento del usuario
        const userDoc = await this.firebaseSvc.getDocument(`users/${recipientId}`);
        if (userDoc) {
          const ratings = userDoc['ratings'] || [];
          ratings.push(rating);
          const averageRating = this.firebaseSvc.calculateAverageRating(ratings);

          // Actualizar solo los campos ratings y rating
          await this.firebaseSvc.updateDocument(`users/${recipientId}`, { ratings, rating: averageRating });
          console.log('Calificación enviada correctamente');
        } else {
          console.error('User document does not exist:', recipientId);
        }

        this.utilsSvc.dismisModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Calificación enviada correctamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      } catch (error) {
        console.error('Error al enviar la calificación:', error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
  
  async loadUserRole() {
    this.userRole = await this.utilsSvc.getUserRole();
  }
}