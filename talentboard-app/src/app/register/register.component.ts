import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/user.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
    });
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/app']);
      }, err => console.log(err)
      );
  }

  tryRegister(value) {
    this.authService.doRegister(value).then(val => {
      this.authService.doLogin(value);
    });
    this.authService.doLogin(value);
    const res = firebase.auth().currentUser;
    res.updateProfile({
      displayName: value.username,
      photoURL: res.photoURL
    }).then(res_2 => {
      this.router.navigate(['/app']);
    });
  }
}
