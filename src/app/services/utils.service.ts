import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  LoadingCtrl = inject(LoadingController);

  loading()
  {
    return this.LoadingCtrl.create({ spinner: 'crescent' });
  }

}
