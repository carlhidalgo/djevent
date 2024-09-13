import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import * as L from 'leaflet';

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
    description: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),

  });


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  

  private map: L.Map;
  private marker: L.Marker;


  ngOnInit() {


    this.user = this.utilsSvc.getFromLocalStorage('user');

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/images/leaflet/marker-icon.png',
      shadowUrl: 'assets/images/leaflet/marker-shadow.png',
    });


    this.initMap();
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.form.controls['location'].setValue(`${location.lat}, ${location.lng}`);
  }
  
  // ================== takePicture ==================

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('imagen del evento')).dataUrl;
    this.form.controls.Image.setValue(dataUrl);
  }

  private initMap(): void {
    this.map = L.map('map').setView([-33.4489, -70.6693], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      
    }).addTo(this.map);

    this.marker = L.marker([51.505, -0.09], {
      draggable: true
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.form.controls.location.setValue(`${position.lat}, ${position.lng}`);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.form.controls.location.setValue(`${e.latlng.lat}, ${e.latlng.lng}`);
    });
  }

  


  async submit() {
    if (this.form.valid) {

      let path = `users/${this.user.uid}/events`;   


      const loading = await this.utilsSvc.loading();
      await loading.present();

      // === Subir la imagen y obtener la url ===
      let dataUrl = this.form.value.Image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.Image.setValue(dataUrl);

      delete this.form.value.id;

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.utilsSvc.presentToast({ message: 'evento agregado exitosamente', duration: 1500, color: 'succes', position: 'middle', icon: 'checkmark-circle-outline' });

        this.utilsSvc.dismisModal({success : true});
        

        
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({ message: error.message, duration: 2000, color: 'danger', position: 'middle', icon: 'alert-circle-outline' });

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
