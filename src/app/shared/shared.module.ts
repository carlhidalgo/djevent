import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
