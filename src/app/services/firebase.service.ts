import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, getAuth ,createUserWithEmailAndPassword,updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc,addDoc,collection} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL} from "firebase/storage";


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  updateDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data, { merge: true });
  }


  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  //////////////////////////// Autenticacion ////////////////////////////


  getAuth() {
    return getAuth();
  }

  // acceder
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // cerrar sesion
  signOut() {
     getAuth().signOut();
     localStorage.removeItem('user');
      this.utilsSvc.routerlink('/auth');
  }

  // registrar
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // actualizar perfil
  updateProfile(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // enviar correo de recuperacion
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //////////////////////////// Firestore(baseDatos) ////////////////////////////
  ///

  //  setear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  
  }

  // obtener documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  
  }

  // agregar documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  
  }


  //////////////////////////// Storage ////////////////////////////

  // subir imagen
  async uploadImage(Path: string, dataUrl: string) {
    return uploadString(ref(getStorage(), Path), dataUrl, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(), Path)); 
  
  
      }  
    )
 
  }

}
