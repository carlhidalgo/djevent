import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  darkMode: boolean = false;

 toggleTheme() {
  this.darkMode = !this.darkMode;
  document.body.classList.toggle('dark', this.darkMode);
  localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false');
}

  ngOnInit() {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', this.darkMode); 
  }

copyEmail() {
  const user = this.user();
  const email = user.email;
  navigator.clipboard.writeText(email).then(() => {
    this.utilsSvc.presentToast({
      message: 'Email copied successfully',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    });
  }).catch(error => {
    console.log(error);
    this.utilsSvc.presentToast({
      message: 'Failed to copy email',
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    });
  });
}
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }


  signOut() {
    this.firebaseSvc.signOut(); // Llama al método de cierre de sesión en tu servicio de Firebase
  }

  // ================== takePicture ==================

  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;
  
    
  
    const dataUrl = (await this.utilsSvc.takeImage('Imagen de Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
  
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {
       
      this.utilsSvc.saveInLocalStorage('user', user); 
      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // ================== updateProfile ==================
}