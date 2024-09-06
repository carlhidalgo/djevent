import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  LoadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  

  // ================== loading ==================

  loading()
  {
    return this.LoadingCtrl.create({ spinner: 'crescent' });

  }

  // ================== toast ==================

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // ================== enruta a cualquier pagina disp ==================

  routerlink(url: string) {
    return this.router.navigateByUrl(url);
  
  }

  // ================== guarda un elemento en localstorage ==================

  saveInLocalStorage(key: string, value: any) {

  return localStorage.setItem(key, JSON.stringify(value));
  }

  // ================== obtiene un elemento de localstorage ==================

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  } 

}
