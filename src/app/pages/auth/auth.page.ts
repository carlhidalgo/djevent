import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        console.log(res);
      })
    }
  }

}
