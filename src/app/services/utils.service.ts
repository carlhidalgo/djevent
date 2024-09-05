import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  LoadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  

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


}
