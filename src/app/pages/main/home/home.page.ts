import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateEventComponent } from 'src/app/shared/components/add-update-event/add-update-event.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firevaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }
  


  // ================== agrega los eventos ==================


 

  addUpdateEvent() {
    this.utilsSvc.presentModal({
      component: AddUpdateEventComponent,
      cssClass: 'add-update-modal'
    });
  }


}
