import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, getAuth ,createUserWithEmailAndPassword,updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  //////////////////////////// Autenticacion ////////////////////////////


  getAuth() {
    return getAuth();
  }

  // acceder
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
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

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  
  }

}
