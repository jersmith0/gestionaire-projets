import { Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { APP_NAME, IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { ThemeMode, ThemeService } from '../../../core/service/utilities/theme.service';
import { StateService } from '../../../core/service/utilities/state.service';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { SetProjectComponent } from '../projects/set-project/set-project.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <nav class="toolbar">
      <div class="toolbar-inner">

        <!-- Left: burger + logo -->
        <div class="toolbar-left">
          @if (isMobile()) {
            <button class="icon-btn" (click)="toggleDrawer()" title="Menu">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          }
          <a class="toolbar-logo" [href]="'/'">
            <span class="logo-mark">P</span>
            <span class="logo-name">{{ appName }}</span>
          </a>
        </div>

        <!-- Right: actions + avatar -->
        <div class="toolbar-right">
          <!-- New project -->
          <button class="btn btn-primary" (click)="onNewProject()">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="btn-label">Nouveau projet</span>
          </button>

          <!-- Avatar + dropdown -->
          <div class="avatar-wrap" (click)="toggleProfile()" [class.avatar-wrap--open]="profileOpen()">
            <img
              [src]="(user$ | async)?.photoURL || 'assets/default-avatar.png'"
              alt="Profil"
              class="avatar-img"
            />
            <svg class="avatar-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Profile dropdown -->
          @if (profileOpen()) {
            <div class="dropdown" (click)="$event.stopPropagation()">
              <!-- User info -->
              <div class="dropdown-user">
                <img
                  [src]="(user$ | async)?.photoURL || 'assets/default-avatar.png'"
                  alt=""
                  class="dropdown-avatar"
                />
                <div class="dropdown-user-info">
                  <strong>{{ (user$ | async)?.displayName || 'Utilisateur' }}</strong>
                  <span>{{ (user$ | async)?.email }}</span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Theme -->
              <p class="dropdown-section-label">Apparence</p>
              <button class="dropdown-item" (click)="switchTheme('device-theme')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M7 1v12" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M7 13A6 6 0 017 1v12z" fill="currentColor" opacity=".2"/>
                </svg>
                Automatique
              </button>
              <button class="dropdown-item" (click)="switchTheme('light-theme')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                Clair
              </button>
              <button class="dropdown-item" (click)="switchTheme('dark-theme')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                </svg>
                Sombre
              </button>

              <div class="dropdown-divider"></div>

              <button class="dropdown-item dropdown-item--danger" (click)="logOut()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 10l3-3-3-3M12 7H5M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Déconnexion
              </button>
            </div>

            <!-- Backdrop to close -->
            <div class="dropdown-backdrop" (click)="profileOpen.set(false)"></div>
          }
        </div>

      </div>
    </nav>
  `,
  styles: [`
    :host {
      --c-bg:        #f8f9fc;
      --c-surface:   #ffffff;
      --c-border:    #e5e7ef;
      --c-text:      #111827;
      --c-text-muted:#6b7280;
      --c-primary:   #1a56db;
      --c-primary-dk:#1447c0;
      --c-mark:      #f0f4ff;
      --c-error:     #dc2626;
      --c-error-bg:  #fef2f2;
      --font-body: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      font-family: var(--font-body);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; color: inherit; }

    /* ── Toolbar ── */
    .toolbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 50;
      height: 64px;
      background: var(--c-surface);
      border-bottom: 1px solid var(--c-border);
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
    }
    .toolbar-inner {
      height: 100%;
      max-width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* ── Left ── */
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toolbar-logo {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .logo-mark {
      width: 32px; height: 32px;
      border-radius: 7px;
      background: var(--c-primary);
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--c-text);
    }

    /* ── Right ── */
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }

    /* ── Buttons ── */
    .icon-btn {
      width: 36px; height: 36px;
      border-radius: 8px;
      border: 1px solid var(--c-border);
      background: transparent;
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: background .15s, color .15s;
    }
    .icon-btn:hover {
      background: var(--c-bg);
      color: var(--c-text);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: .85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid transparent;
      transition: all .2s;
      white-space: nowrap;
    }
    .btn-primary {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }
    .btn-primary:hover {
      background: var(--c-primary-dk);
      border-color: var(--c-primary-dk);
      box-shadow: 0 4px 14px rgba(26,86,219,.25);
    }
    .btn-label {
      display: none;
    }
    @media (min-width: 560px) {
      .btn-label { display: inline; }
    }

    /* ── Avatar ── */
    .avatar-wrap {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px 3px 3px;
      border: 1.5px solid var(--c-border);
      border-radius: 100px;
      cursor: pointer;
      transition: border-color .2s;
    }
    .avatar-wrap:hover,
    .avatar-wrap--open { border-color: var(--c-primary); }
    .avatar-img {
      width: 28px; height: 28px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
    .avatar-chevron {
      color: var(--c-text-muted);
      transition: transform .2s;
    }
    .avatar-wrap--open .avatar-chevron { transform: rotate(180deg); }

    /* ── Dropdown ── */
    .dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 240px;
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.06);
      z-index: 200;
      overflow: hidden;
      animation: dropIn .15s cubic-bezier(.22,1,.36,1) forwards;
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: 199;
    }

    .dropdown-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
    }
    .dropdown-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .dropdown-user-info strong {
      display: block;
      font-size: .85rem;
      font-weight: 600;
      color: var(--c-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
    }
    .dropdown-user-info span {
      font-size: .75rem;
      color: var(--c-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
      display: block;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--c-border);
      margin: 4px 0;
    }
    .dropdown-section-label {
      font-size: .68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .09em;
      color: var(--c-text-muted);
      padding: 8px 16px 4px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 16px;
      font-size: .85rem;
      font-weight: 500;
      color: var(--c-text);
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background .15s;
    }
    .dropdown-item:hover { background: var(--c-bg); }
    .dropdown-item svg { color: var(--c-text-muted); flex-shrink: 0; }
    .dropdown-item--danger {
      color: var(--c-error);
    }
    .dropdown-item--danger:hover { background: var(--c-error-bg); }
    .dropdown-item--danger svg { color: var(--c-error); }
  `]
})
export class ToolbarComponent {
  appName = APP_NAME;
  medium = IS_MEDIUM;
  viewport = inject(WindowsObserverService).width;
  themeService = inject(ThemeService);
  state = inject(StateService);
  auth = inject(AuthService);
  fs = inject(FirestoreService);
  dialog = inject(MatDialog);
  router = inject(Router);

  user$ = this.auth.user;
  profileOpen = signal(false);
  isMobile = computed(() => this.viewport() < this.medium);

  toggleProfile() { this.profileOpen.update(v => !v); }

  switchTheme(theme: ThemeMode) {
    this.themeService.setTheme(theme);
    this.profileOpen.set(false);
  }

  toggleDrawer() {
    this.state.isToggleDrawer.update(v => !v);
  }

  async logOut() {
    this.profileOpen.set(false);
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  onNewProject() {
    this.dialog.open(SetProjectComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
    });
  }
}