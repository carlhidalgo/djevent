import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }


  signOut() {
    this.firebaseSvc.signOut(); // Llama al método de cierre de sesión en tu servicio de Firebase
  }

  // ================== takePicture ==================

  async takePicture() {

    let user = this.user();

    const dataUrl = (await this.utilsSvc.takePicture('imagen del eperfil')).dataUrl;

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(dataUrl, imagePath);


  }

}