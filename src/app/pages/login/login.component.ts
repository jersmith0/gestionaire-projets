import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { APP_NAME, COMPANY_NAME } from '../../app.constants';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/service/firebase/auth.service';
import { LoginSkeletonComponent } from "./login-skeleton.component";
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, LoginSkeletonComponent],
  templateUrl:'./login.component.html',
  styles: `
.divider{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    
     mat-divider{
       width: 35%;
     }
  }
  
  `
})
export default class LoginComponent implements OnInit, OnDestroy{
 
appName = APP_NAME;
company = COMPANY_NAME;
date = new Date();
auth = inject(AuthService)
loading = signal(true);
authSub!: Subscription;
emailSent= signal('');
private router = inject(Router);
  loginGoogle =  async() => {
    try {
      this.loading.set(true);
      await this.auth.logInGoogle();
      this.loading.set(false);
    } catch (exception) {
      this.loading.set(false);
      location.reload();
      console.log(exception);
    }
  }

  emailFormSubmit(form: NgForm) {
    const email = form.value.email;

    const actionCodeSettings = {
      url: `${location.origin}${this.router.url}`,
      handleCodeInApp: true,
    };

    this.auth.sendAuthLink(email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
    this.emailSent.set(email);
    form.reset();
  }

  resetState = () => this.emailSent.set('');
   ngOnInit(): void {
    //regarder l'etat de l'utilisateur
    this.authSub = this.auth.authState.subscribe((user: User | null) => {
      this.loading.set(false);
 //On email redirection, initialize authentication
      if (this.router.url.includes('login?apiKey=')) {
        this.loading.set(true);
        this.auth.loginWithEmailLink();
      }
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

}
