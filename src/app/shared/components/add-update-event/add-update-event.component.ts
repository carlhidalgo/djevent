import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AppEvent } from 'src/app/models/event.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastController } from '@ionic/angular'; 

@Component({
  selector: 'app-add-update-event',
  templateUrl: './add-update-event.component.html',
  styleUrls: ['./add-update-event.component.scss'],
})
export class AddUpdateEventComponent  implements OnInit {

  @Input() event: AppEvent 
  
  
  @ViewChild('addressInput') addressInput!: ElementRef; // Elemento de referencia al campo de dirección

  mapCenter: google.maps.LatLngLiteral = { lat: -33.0, lng: -71.0 }; // Coordenadas iniciales
  
  events: AppEvent[] = [];
  address: string = '';
  geocoder: any;
  autocomplete: any; // Instancia del autocompletado de Google Places

form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    date: new FormControl(new Date().toISOString(), [Validators.required]),
    location: new FormControl({ lat: 0, lng: 0 }, [Validators.required]), // Cambiado a objeto
    creatorId: new FormControl('', [Validators.required]),
  });


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  toastController = inject(ToastController);

  isEditMode: boolean = false;
  
  user = {} as User;
  charCount = 0;

  constructor(    
    private fb: FormBuilder,
  ) { }
  

  ngOnInit() {
    this.geocoder = new google.maps.Geocoder();
    this.user = this.utilsSvc.getFromLocalStorage('user');

    // Establecer el creador del evento
    this.form.controls['creatorId'].setValue(this.user.uid);

    // Determinar si estás editando un evento existente
    this.isEditMode = !!this.event;

    // Configurar el formulario con valores existentes o predeterminados
    this.form = this.fb.group({
      id: [this.event ? this.event.id : ''],
      name: [this.event ? this.event.name : '', [Validators.required, Validators.minLength(6)]],
      description: [this.event ? this.event.description : '', Validators.required],
      date: [
        this.event && this.event.date 
          ? this.event.date 
          : new Date().toISOString(), // Usar una fecha válida predeterminada si no hay valor
        Validators.required,
      ],
      Image: [this.event ? this.event.Image : ''],
      location: [
        this.event ? this.event.location : { lat: 0, lng: 0 }, 
        Validators.required,
      ],
      creatorId: [this.user.uid, Validators.required],
    });

    this.updateCharCount();
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    this.form.controls['location'].setValue(location);
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
      const dateValue = this.form.controls['date'].value;

      // Validar que el campo 'date' tenga un formato válido
      if (!dateValue || isNaN(Date.parse(dateValue))) {
        this.utilsSvc.presentToast({
          message: 'Por favor, ingrese una fecha válida.',
          duration: 2000,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
        return; // Detener el envío si la fecha no es válida
      }

      if (this.event) {
        this.updateEvent();
      } else {
        this.createEvent();
      }
    }
  }


  // ================== Crear evento ==================
  async createEvent() {
    

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

  // ================== Actualizar un evento ==================
  async updateEvent() {
    

     // let path = `users/${this.user.uid}/events`;   
      let path = `events/${this.event.id}`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // === Subir la imagen y obtener la url ===
      if (this.form.value.Image !== this.event.Image) {
        let dataUrl = this.form.value.Image;
        let imagePath = await this.firebaseSvc.getFilePath(this.event.Image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.Image.setValue(imageUrl);
      }
      

      

      

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {



        


        this.utilsSvc.dismisModal({success : true});
        

        this.utilsSvc.presentToast({ message: 'evento actualizado exitosamente', duration: 1500, color: 'succes', position: 'middle', icon: 'checkmark-circle-outline' });

        

        
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({ message: error.message, duration: 2000, color: 'danger', position: 'middle', icon: 'alert-circle-outline' });

      }).finally(() => {
        loading.dismiss();
      })
    
  }

  // ================== Eliminar evento ==================
  async deleteEvent(event: AppEvent) {
    

    // let path = `users/${this.user.uid}/events`;   
     let path = `events/${event.id}`;
  
     const loading = await this.utilsSvc.loading();
     await loading.present();
  
  
     let imagePath = await this.firebaseSvc.getFilePath(event.Image);
      await this.firebaseSvc.deletefile(imagePath);
     
  
     this.firebaseSvc.deleteDocument(path).then(async res => {
  
  
  
       this.events = this.events.filter(e => e.id !== event.id);
  
  
  
  
       this.utilsSvc.presentToast({ message: 'evento eliminado exitosamente', duration: 1500, color: 'succes', position: 'middle', icon: 'checkmark-circle-outline' });
  
       
  
       
     }).catch(error => {
       console.log(error);
       this.utilsSvc.presentToast({ message: error.message, duration: 2000, color: 'danger', position: 'middle', icon: 'alert-circle-outline' });
  
     }).finally(() => {
       loading.dismiss();
     })
   
  }

}
