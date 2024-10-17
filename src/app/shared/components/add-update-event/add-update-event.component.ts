import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
  
  @ViewChild('addressInput') addressInput!: ElementRef; // Elemento de referencia al campo de dirección

  mapCenter: google.maps.LatLngLiteral = { lat: -33.0, lng: -71.0 }; // Coordenadas iniciales

  address: string = '';
  geocoder: any;
  autocomplete: any; // Instancia del autocompletado de Google Places

form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    date: new FormControl(new Date().toISOString(), [Validators.required]),
    address: new FormControl('', ), 
    location: new FormControl({ lat: 0, lng: 0 }, [Validators.required]), // Cambiado a objeto
    creatorId: new FormControl(''),
  });


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  toastController = inject(ToastController);

  
  user = {} as User;
  charCount = 0;



  ngOnInit() {

    this.geocoder = new google.maps.Geocoder();

    this.user = this.utilsSvc.getFromLocalStorage('user');

    this.form.controls['creatorId'].setValue(this.user.uid);

    this.updateCharCount(); // Inicializar el contador de caracteres
    this.initAutocomplete(); // Inicializar el autocompletado de direcciones
  }
  
  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.form.controls['location'].setValue(location);
  }

  // Método para manejar cuando el usuario cambia manualmente la dirección
  handleAddressChange(event: any) {
    const address = event.detail.value;
    if (address) {
      this.geocoder.geocode({ address: address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          this.form.controls['location'].setValue({ lat: location.lat(), lng: location.lng() });
          this.mapCenter = { lat: location.lat(), lng: location.lng() }; // Actualiza el mapa
        } else {
          console.error('Error al geocodificar la dirección: ', status);
        }
      });
    }
  }

  initAutocomplete() {
    // Configurar el autocompletado
    this.autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        types: ['geocode'], // Solo autocompletar direcciones
        componentRestrictions: { country: 'cl' }, // Limitar a Chile (si es necesario)
      }
    );

    // Evento cuando se selecciona una sugerencia de dirección
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        // Actualizar coordenadas y dirección en el formulario
        const location = place.geometry.location;
        this.form.controls['location'].setValue({ lat: location.lat(), lng: location.lng() });
        this.mapCenter = { lat: location.lat(), lng: location.lng() };
      } 
    });
  }

  updateCharCount() {
    this.charCount = this.form.controls['description'].value.length;
  }
  
  // ================== Tomar una imagen ==================

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
