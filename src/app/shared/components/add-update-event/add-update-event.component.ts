import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-add-update-event',
  templateUrl: './add-update-event.component.html',
  styleUrls: ['./add-update-event.component.scss'],
})
export class AddUpdateEventComponent  implements OnInit {

form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Image: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    date: new FormControl('', [Validators.required]),
    location: new FormControl({ lat: 0, lng: 0 }, [Validators.required]), // Cambiado a objeto
    creatorId: new FormControl(''),
  });


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  toastController = inject(ToastController);

  
  user = {} as User;
  



  ngOnInit() {


    this.user = this.utilsSvc.getFromLocalStorage('user');

    this.form.controls['creatorId'].setValue(this.user.uid);
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.form.controls['location'].setValue(location);
  }
  
  // ================== takePicture ==================

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takeImage('imagen del evento')).dataUrl;
    this.form.controls.Image.setValue(dataUrl);
  }

  
  


  async submit() {
    if (this.form.valid) {

     // let path = `users/${this.user.uid}/events`;   
      let path = `events`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // === Subir la imagen y obtener la url ===
      let dataUrl = this.form.value.Image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.Image.setValue(imageUrl);

      delete this.form.value.id;

      

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {



        


        this.utilsSvc.dismisModal({success : true});
        

        this.utilsSvc.presentToast({ message: 'evento agregado exitosamente', duration: 1500, color: 'succes', position: 'middle', icon: 'checkmark-circle-outline' });

        

        
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({ message: error.message, duration: 2000, color: 'danger', position: 'middle', icon: 'alert-circle-outline' });

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
