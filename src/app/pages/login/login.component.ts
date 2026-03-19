import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { ActionCodeSettings } from '@angular/fire/auth';
import { APP_NAME } from '../../app.constants';
import { AuthService } from '../../core/service/firebase/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    /* ══════════════════════ TOKENS ══════════════════════ */
    :host {
      --c-bg:        #f8f9fc;
      --c-bg-alt:    #ffffff;
      --c-surface:   #ffffff;
      --c-border:    #e5e7ef;
      --c-text:      #111827;
      --c-text-muted:#6b7280;
      --c-primary:   #1a56db;
      --c-primary-dk:#1447c0;
      --c-mark:      #f0f4ff;
      --c-error:     #dc2626;
      --r-sm:        8px;
      --r-md:        12px;
      --r-lg:        20px;
      --shadow-lg:   0 12px 40px rgba(0,0,0,.1);
      --font-display:'Georgia', 'Times New Roman', serif;
      --font-body:   'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; }

    /* ══════════════════════ LAYOUT ══════════════════════ */
    .login-root {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }

    /* ══════════════════════ ASIDE ═══════════════════════ */
    .login-aside {
      background: var(--c-text);
      padding: 48px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    /* Subtle grid texture */
    .login-aside::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }
    /* Blue accent glow */
    .login-aside::after {
      content: '';
      position: absolute;
      top: -120px; left: -120px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(26,86,219,.25) 0%, transparent 70%);
      pointer-events: none;
    }
    .aside-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 48px;
    }

    .aside-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .logo-mark {
      width: 34px; height: 34px;
      border-radius: var(--r-sm);
      background: var(--c-primary);
      color: #fff;
      font-weight: 800;
      font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-text {
      font-weight: 700;
      font-size: 1.05rem;
      color: #fff;
    }

    .aside-copy { flex: 1; }
    .aside-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      font-weight: 700;
      line-height: 1.2;
      color: #fff;
      margin-bottom: 20px;
    }
    .aside-title em {
      font-style: italic;
      color: #93c5fd;
    }
    .aside-sub {
      color: rgba(255,255,255,.55);
      font-size: .95rem;
      line-height: 1.7;
      max-width: 360px;
    }

    .aside-proof {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .aside-proof li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: .88rem;
      color: rgba(255,255,255,.6);
    }
    .aside-proof strong { color: #fff; }
    .proof-icon {
      color: var(--c-primary);
      color: #60a5fa;
      flex-shrink: 0;
      font-size: .75rem;
      margin-top: 3px;
    }

    .aside-quote {
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: var(--r-md);
      padding: 20px 24px;
    }
    .aside-quote p {
      font-size: .9rem;
      font-style: italic;
      color: rgba(255,255,255,.8);
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .aside-quote footer {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .quote-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--c-primary);
      color: #fff;
      font-weight: 700;
      font-size: .85rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .aside-quote strong {
      display: block;
      font-size: .85rem;
      color: #fff;
    }
    .aside-quote span {
      font-size: .75rem;
      color: rgba(255,255,255,.4);
    }

    /* ══════════════════════ MAIN / CARD ═════════════════ */
    .login-main {
      background: var(--c-bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
      position: relative;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 40px;
      box-shadow: var(--shadow-lg);
    }

    /* ══════════════════════ CARD STATES ═════════════════ */
    .card-header { margin-bottom: 28px; }
    .card-title {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 6px;
    }
    .card-sub {
      font-size: .88rem;
      color: var(--c-text-muted);
    }

    /* Skeleton */
    .skeleton-group {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: var(--r-sm);
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .skeleton--title  { height: 28px; width: 60%; }
    .skeleton--btn    { height: 48px; }
    .skeleton--input  { height: 48px; }
    .skeleton--line   { height: 1px; flex: 1; }
    .skeleton--dot    { height: 14px; width: 80px; }
    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Email sent */
    .email-sent {
      text-align: center;
      padding: 8px 0;
    }
    .sent-icon {
      display: inline-flex;
      margin-bottom: 20px;
    }
    .email-sent .card-title { font-size: 1.3rem; margin-bottom: 12px; }
    .email-sent .card-sub {
      font-size: .9rem;
      line-height: 1.7;
      margin-bottom: 16px;
    }
    .email-sent strong { color: var(--c-primary); font-weight: 600; }
    .sent-hint {
      font-size: .8rem;
      color: var(--c-text-muted);
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: var(--r-sm);
      padding: 10px 14px;
      margin-bottom: 20px;
    }
    .link-btn {
      background: none;
      border: none;
      color: var(--c-primary);
      font-size: .88rem;
      font-weight: 500;
      cursor: pointer;
      transition: color .2s;
    }
    .link-btn:hover { color: var(--c-primary-dk); }

    /* ══════════════════════ FORM ════════════════════════ */
    .form-group { display: flex; flex-direction: column; gap: 20px; }

    .btn-google {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 20px;
      background: var(--c-surface);
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-md);
      font-size: .9rem;
      font-weight: 600;
      color: var(--c-text);
      cursor: pointer;
      transition: border-color .2s, box-shadow .2s, transform .2s;
    }
    .btn-google:hover {
      border-color: #4285F4;
      box-shadow: 0 0 0 3px rgba(66,133,244,.1);
      transform: translateY(-1px);
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: var(--c-border);
    }
    .divider-text {
      font-size: .78rem;
      color: var(--c-text-muted);
      white-space: nowrap;
    }

    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label {
      font-size: .82rem;
      font-weight: 600;
      color: var(--c-text);
      letter-spacing: .01em;
    }
    .field-input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-md);
      font-size: .92rem;
      color: var(--c-text);
      background: var(--c-bg);
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      font-family: var(--font-body);
    }
    .field-input::placeholder { color: #9ca3af; }
    .field-input:focus {
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px rgba(26,86,219,.1);
      background: #fff;
    }
    .field-input--error {
      border-color: var(--c-error);
      box-shadow: 0 0 0 3px rgba(220,38,38,.08);
    }
    .field-error {
      font-size: .78rem;
      color: var(--c-error);
    }

    .btn-submit {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      background: var(--c-primary);
      color: #fff;
      border: none;
      border-radius: var(--r-md);
      font-size: .95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background .2s, transform .2s, box-shadow .2s;
      font-family: var(--font-body);
    }
    .btn-submit:hover:not(:disabled) {
      background: var(--c-primary-dk);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(26,86,219,.3);
    }
    .btn-submit:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .form-note {
      font-size: .76rem;
      color: var(--c-text-muted);
      text-align: center;
      line-height: 1.6;
    }
    .form-note a {
      color: var(--c-primary);
      font-weight: 500;
      transition: color .2s;
    }
    .form-note a:hover { color: var(--c-primary-dk); }

    .send-error {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 10px 14px;
      background: #fff1f2;
      border: 1px solid #fca5a5;
      border-radius: var(--r-sm);
      font-size: .82rem;
      color: var(--c-error);
      margin-top: -4px;
    }

    /* ══════════════════════ BACK LINK ═══════════════════ */
    .back-link {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 24px;
      font-size: .82rem;
      color: var(--c-text-muted);
      transition: color .2s;
    }
    .back-link:hover { color: var(--c-primary); }

    /* ══════════════════════ RESPONSIVE ══════════════════ */
    @media (max-width: 768px) {
      .login-root {
        grid-template-columns: 1fr;
      }
      .login-aside {
        padding: 32px 24px;
        min-height: auto;
      }
      .aside-copy { flex: none; }
      .aside-quote { display: none; }
      .login-main {
        padding: 32px 20px;
      }
      .login-card {
        padding: 28px 24px;
      }
    }
  `]
})
export default class LoginComponent implements OnInit, OnDestroy {
  appName = APP_NAME;
  auth = inject(AuthService);
  loading = signal(true);
  emailSent = signal('');
  sendError = signal('');
  private router = inject(Router);
  private authSub!: Subscription;

  loginGoogle = async () => {
    try {
      this.loading.set(true);
      await this.auth.logInGoogle();
      this.loading.set(false);
    } catch (exception) {
      this.loading.set(false);
      console.error(exception);
      location.reload();
    }
  };

  async emailFormSubmit(form: NgForm) {
    const email = form.value.email;
    const actionCodeSettings: ActionCodeSettings = {
      url: `${location.origin}/login`,  // URL fixe — pas this.router.url
      handleCodeInApp: true,            // obligatoire pour le lien magique
    };

    try {
      await this.auth.sendAuthLink(email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      this.emailSent.set(email);
      form.reset();
    } catch (err: any) {
      console.error('[sendSignInLink]', err);
      // Affiche le code Firebase dans la console pour diagnostic
      // Codes fréquents : auth/invalid-continue-uri, auth/unauthorized-continue-uri
      this.sendError.set(this.friendlyError(err?.code));
    }
  }

  private friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/invalid-email':            'Adresse email invalide.',
      'auth/unauthorized-continue-uri':'Ce domaine n\'est pas autorisé dans Firebase.',
      'auth/invalid-continue-uri':     'L\'URL de retour est invalide.',
      'auth/missing-continue-uri':     'URL de retour manquante.',
      'auth/too-many-requests':        'Trop de tentatives. Réessayez dans quelques minutes.',
    };
    return map[code] ?? 'Une erreur est survenue. Vérifiez la console.';
  }

  resetState = () => this.emailSent.set('');

  ngOnInit(): void {
    this.authSub = this.auth.authState.subscribe((user: User | null) => {
      this.loading.set(false);
      if (this.router.url.includes('login?apiKey=')) {
        this.loading.set(true);
        this.auth.loginWithEmailLink();
      }
      if (user) {
        this.router.navigate(['/home/profil']);
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }
}