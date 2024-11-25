import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AppEvent } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() event: AppEvent;
  ratingForm: FormGroup;
  user: User;
  userRole: string | null = null;

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

      // Determinar a quién va dirigida la calificación
      let recipientId: string;
      if (this.user.role.toLowerCase() === 'dj') {
        recipientId = this.event.creatorId; // Calificación va al productor
      } else if (this.user.role.toLowerCase() === 'producer') {
        if (this.event.applicants.length > 0) {
          recipientId = this.event.applicants[0].userId; // Calificación va al primer DJ en la lista de applicants
        } else {
          console.error('No se encontró ningún DJ en la lista de applicants');
          return;
        }
      } else {
        console.error('Rol de usuario no reconocido');
        return;
      }

      try {
        // Agregar la calificación al destinatario correcto
        await this.firebaseSvc.addRating(recipientId, rating);
        console.log('Calificación enviada correctamente');
        this.utilsSvc.dismisModal({ success: true });
      } catch (error) {
        console.error('Error al enviar la calificación:', error);
      }
    }
  }
  
  async loadUserRole() {
    this.userRole = await this.utilsSvc.getUserRole();
  }
}