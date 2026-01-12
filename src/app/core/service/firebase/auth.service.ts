import { inject, Injectable } from '@angular/core';
import { Auth, 
    authState,
    user,
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    sendSignInLinkToEmail,
    ActionCodeSettings, 
    isSignInWithEmailLink, 
    signInWithEmailLink, 
    User} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  authState = authState(this.auth);
  user = user(this.auth);
  logInGoogle = () => signInWithPopup(this.auth, new GoogleAuthProvider());
  sendAuthLink(email: string, acs: ActionCodeSettings) {
    return sendSignInLinkToEmail(this.auth, email, acs);
  }

  
  loginWithEmailLink() {
    if (isSignInWithEmailLink(this.auth, location.href)) {
      let email = localStorage.getItem('emailForSignIn');

      if (!email) {
        email = prompt('Veuillez fournir votre e-mail pour la confirmation');
      }

      signInWithEmailLink(this.auth, email!, location.href);
    }
  }
  
  logout = () => signOut(this.auth);




async getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = this.auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
}
}
