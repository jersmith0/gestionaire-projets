import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { StateService } from '../../../core/service/utilities/state.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-root">

      <!-- Sidebar -->
      <aside class="sidebar" [class.sidebar--open]="isOpen()">

        <!-- Nav links -->
        
        <nav class="sidebar-nav">
           <a
            class="nav-link">
            <span class="nav-icon">
            </span>
          </a>
           
          <a
            routerLink="/home/profil"
            routerLinkActive="nav-link--active"
            (click)="closeOnMobile()"
            class="nav-link">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/>
                <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label">Mon profil</span>
          </a>

          <a
            routerLink="/home/Projets"
            routerLinkActive="nav-link--active"
            (click)="closeOnMobile()"
            class="nav-link">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="4" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
                <path d="M1 7h14" stroke="currentColor" stroke-width="1.4"/>
                <path d="M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4" stroke="currentColor" stroke-width="1.4"/>
              </svg>
            </span>
            <span class="nav-label">Projets</span>
          </a>

          <a class="nav-link nav-link--disabled">
            <span class="nav-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.54 11.54l1.41 1.41M11.54 4.46l1.41-1.41M3.05 12.95l1.42-1.42" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="nav-label">Paramètres</span>
          </a>
        </nav>

        <!-- Deconnexion -->

         <button class="dropdown-item dropdown-item--danger" (click)="logOut()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 10l3-3-3-3M12 7H5M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Déconnexion
              </button>
      </aside>

      <!-- Overlay mobile -->
      @if (isOpen() && isMobile()) {
        <div class="sidebar-overlay" (click)="closeOnMobile()"></div>
      }

      <!-- Main content -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host {
      --c-bg:        #f8f9fc;
      --c-surface:   #ffffff;
      --c-border:    #e5e7ef;
      --c-text:      #111827;
      --c-text-muted:#6b7280;
      --c-primary:   #1a56db;
      --c-mark:      #f0f4ff;
      --sidebar-w:   220px;
      --font-body: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      font-family: var(--font-body);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; color: inherit; }

    .layout-root {
      display: flex;
      height: calc(100vh - 64px);
      background: var(--c-bg);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 16px;
      font-size: .85rem;
      font-weight: 500;
      color: rgb(250, 115, 115);
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background .15s;
    }
    .dropdown-item:hover { background: var(--c-bg); }
    .dropdown-item svg { color: var(--c-text-muted); flex-shrink: 0; }
    .dropdown-item--danger {
      color: red;
    }
    .dropdown-item--danger:hover { background:rgba(250, 140, 140, 0.75); }
    .dropdown-item--danger svg { color: red; }

    /* ── Sidebar ── */
    .sidebar {
      width: var(--sidebar-w);
      flex-shrink: 0;
      background: var(--c-surface);
      border-right: 1px solid var(--c-border);
      display: flex;
      flex-direction: column;
      padding: 24px 12px;
      position: fixed;
      top: 64px;
      bottom: 0;
      left: 0;
      z-index: 40;
      transform: translateX(-100%);
      transition: transform .25s cubic-bezier(.4,0,.2,1);
    }
    .sidebar--open {
      transform: translateX(0);
    }

    @media (min-width: 768px) {
      .sidebar {
        position: static;
        transform: none;
        top: auto;
        bottom: auto;
      }
    }

    .sidebar-overlay {
      position: fixed;
      inset: 0;
      z-index: 39;
      background: rgba(0,0,0,.3);
      backdrop-filter: blur(2px);
    }

    /* ── Nav ── */
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: .875rem;
      font-weight: 500;
      color: var(--c-text-muted);
      cursor: pointer;
      transition: background .15s, color .15s;
      position: relative;
    }
    .nav-link:hover {
      background: var(--c-bg);
      color: var(--c-text);
    }
    .nav-link--active {
      background: var(--c-mark) !important;
      color: var(--c-primary) !important;
      font-weight: 600;
    }
    .nav-link--active .nav-icon {
      color: var(--c-primary);
    }
    .nav-link--disabled {
      opacity: .5;
      cursor: default;
      pointer-events: none;
    }
    .nav-icon {
      width: 32px; height: 32px;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: inherit;
    }
    .nav-label { flex: 1; }
    .nav-soon {
      font-size: .68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--c-text-muted);
      background: var(--c-border);
      padding: 2px 6px;
      border-radius: 100px;
    }

    /* ── Sidebar footer ── */
    .sidebar-footer {
      border-top: 1px solid var(--c-border);
      padding-top: 12px;
      text-align: center;
    }
    .sidebar-version {
      font-size: .72rem;
      color: var(--c-text-muted);
      letter-spacing: .06em;
    }

    /* ── Main ── */
    .main-content {
      flex: 1;
      overflow: auto;
      background: var(--c-bg);
      min-width: 0;
    }

    @media (min-width: 768px) {
      .layout-root { margin-left: 0; }
    }
  `]
})
export class SideNavComponent {
  medium = IS_MEDIUM;
  viewport = inject(WindowsObserverService).width;
  state = inject(StateService);

    auth = inject(AuthService);
    fs = inject(FirestoreService);
    dialog = inject(MatDialog);
    router = inject(Router);
  
    user$ = this.auth.user;
    profileOpen = signal(false);
    isMobile = computed(() => this.viewport() < this.medium);

  isOpen = computed(() => this.viewport() >= this.medium || this.state.isToggleDrawer());

  closeOnMobile() {
    if (this.viewport() < this.medium) {
      this.state.isToggleDrawer.set(false);
    }
  }

  async logOut() {
    this.profileOpen.set(false);
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}