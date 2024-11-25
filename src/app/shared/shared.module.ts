import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AddUpdateEventComponent } from './components/add-update-event/add-update-event.component';
import { MapComponent } from './components/map/map.component';
import { RatingComponent } from './components/rating/rating.component';



@NgModule({
  declarations: [
      HeaderComponent,
      CustomInputComponent,
      LogoComponent,
      AddUpdateEventComponent,
      MapComponent,
      RatingComponent

    ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    MapComponent,
    AddUpdateEventComponent,
    RatingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
