import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { APP_NAME, IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { ThemeMode, ThemeService } from '../../../core/service/utilities/theme.service';
import { StateService } from '../../../core/service/utilities/state.service';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { SetProjectComponent } from '../projects/set-project/set-project.component';
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatMenuModule, MatIconModule, MatDividerModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div class="h-16 px-4 md:px-6 flex items-center justify-between">
        <!-- Gauche : Burger + Logo -->
        <div class="flex items-center gap-4">
          @if (viewport() <= medium) {
            <button 
              (click)="toggleDrawer()"
              class="p-2 -ml-2 rounded-full hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <span class="material-icons text-slate-300 text-2xl">menu</span>
            </button>
          }

        <div class="flex justify-center items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-violet-600  flex items-center justify-center text-white font-bold text-2xl">
            P
          </div>
          <h1 class="text-3xl font-extrabold b bg-clip-text text-white">
            {{ appName }}
          </h1>
        </div>
        </div>

        <!-- Droite : Nouveau projet + Notifications + Avatar -->
        <div class="flex items-center gap-3 md:gap-6">
          <!-- Nouveau projet -->
          <button 
            (click)="onNewProject()"
            class="hidden sm:flex items-center gap-2 px-5 py-2 bg-violet-600 text-white font-medium rounded-lg" style="cursor: pointer;"
          >
            <span class="material-icons text-lg">add_circle</span>
            Nouveau projet
          </button>

          <!-- Version mobile : icône seule -->
          <button 
            (click)="onNewProject()"
            class="sm:hidden p-2 rounded-full hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <span class="material-icons text-slate-300 text-2xl">add_circle</span>
          </button>

          <!-- Notifications -->
          <!-- <button 
            class="relative p-2 rounded-full hover:bg-slate-800/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            [matMenuTriggerFor]="notifMenu"
          >
            <span class="material-icons text-slate-300 text-2xl group-hover:text-violet-400 transition-colors">
              notifications
            </span>
            @if (unreadCount > 0) {
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                {{ unreadCount }}
              </span>
            }
          </button> -->

          <mat-menu #notifMenu="matMenu" xPosition="before">
            <div class="w-80 max-h-96 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl">
              @if (notifications.length > 0) {
                @for (notif of notifications; track notif.id) {
                  <div 
                    class="flex items-center px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    (click)="markAsRead(notif)"
                  >
                    <span class="material-icons mr-3" [class.text-violet-400]="!notif.read" [class.text-slate-500]="notif.read">
                      notification_important
                    </span>
                    <div class="flex-1">
                      <p class="text-slate-200 text-sm" [class.opacity-60]="notif.read">
                        {{ notif.message }}
                      </p>
                      @if (notif.read) {
                        <span class="text-xs text-slate-500">(lu)</span>
                      }
                    </div>
                    <button 
                      mat-icon-button 
                      (click)="deleteNotification(notif); $event.stopPropagation()"
                      class="text-slate-400 hover:text-red-400"
                    >
                      <span class="material-icons text-lg">delete</span>
                    </button>
                  </div>
                }
              } @else {
                <div class="p-6 text-center text-slate-500">
                  Aucune notification
                </div>
              }
            </div>
          </mat-menu>

          <!-- Avatar -->
          <div 
            class="relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-violet-500/40 rounded-full"
            [matMenuTriggerFor]="profileMenu"
          >
            <img 
              [src]="(user$ | async)?.photoURL ?? 'assets/avatar.png'"
              alt="Profil"
              class="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-violet-500 transition-all duration-300 shadow-md"
            >
          </div>

          <mat-menu #profileMenu="matMenu">
            <div class="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl w-64 overflow-hidden">
              <div class="p-4 border-b border-slate-800/50">
                <p class="text-slate-200 font-medium truncate">
                  {{ (user$ | async)?.displayName || 'Utilisateur' }}
                </p>
                <p class="text-sm text-slate-400 truncate">
                  {{ (user$ | async)?.email }}
                </p>
              </div>

              <button mat-menu-item (click)="switchTheme('device-theme')">
                <span class="material-icons mr-3 text-violet-400">brightness_6</span>
                <span>Appareil</span>
              </button>
              <button mat-menu-item (click)="switchTheme('light-theme')">
                <span class="material-icons mr-3 text-violet-400">wb_sunny</span>
                <span>Clair</span>
              </button>
              <button mat-menu-item (click)="switchTheme('dark-theme')">
                <span class="material-icons mr-3 text-violet-400">bedtime</span>
                <span>Sombre</span>
              </button>

              <mat-divider class="border-slate-700" />

              <button 
                mat-menu-item 
                (click)="logOut()"
                class="flex items-center gap-3 px-4 py-3 hover:bg-red-900/30 text-red-300"
              >
                <span class="material-icons">logout</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </mat-menu>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .glass {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
    }
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
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  router = inject(Router);

  user$ = this.auth.user;
  unreadCount = 0;
  notifications: any[] = [];

  // ngOnInit() {
  //   this.user$.subscribe(user => {
  //     if (user?.email) {
  //       const email = user.email.trim().toLowerCase();
  //       this.fs.getNotificationsForUser(email).subscribe(notifs => {
  //         this.notifications = notifs;
  //         this.unreadCount = notifs.filter(n => !n.read).length;

  //         notifs.filter(n => !n.read).forEach(n => {
  //           this.snackBar.open(n.message, 'OK', { duration: 6000 });
  //         });
  //       });
  //     }
  //   });
  // }

  switchTheme(theme: ThemeMode) {
    this.themeService.setTheme(theme);
  }

  toggleDrawer() {
    this.state.isToggleDrawer.update(v => !v);
  }

  async logOut() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  markAsRead(notif: any) {
    if (!notif.read) {
      this.fs.setNotification({ ...notif, read: true });
    }
  }

  deleteNotification(notif: any) {
    if (notif?.id) {
      this.fs.deleteData('notifications', notif.id).then(() => {
        this.notifications = this.notifications.filter(n => n.id !== notif.id);
      });
    }
  }

  onNewProject() {
    this.dialog.open(SetProjectComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: ['glass-dialog', 'bg-slate-950/90', 'backdrop-blur-lg', 'border', 'border-slate-700/50', 'rounded-2xl', 'shadow-2xl'],
      autoFocus: false
    });
  }
}