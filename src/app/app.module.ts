import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ======= firebase ========//
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment'; // Asegúrate de que la ruta sea correcta

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule al array de imports
    AngularFireModule.initializeApp(environment.firebaseConfig) // Inicializa Firebase con la configuración del entorno
  ],
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
 