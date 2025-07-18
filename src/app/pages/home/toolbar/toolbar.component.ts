import { Component, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import { APP_NAME, IS_MEDIUM } from '../../../app.constants';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { ThemeMode, ThemeService } from '../../../core/service/utilities/theme.service';
import { StateService } from '../../../core/service/utilities/state.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,MatTooltipModule,MatMenuModule,MatDividerModule,MatBadgeModule,AsyncPipe, CommonModule],
  template: `
    <mat-toolbar>
      <div class="left-container">
        @if(viewport() <= meduim){
           <button mat-icon-button matTooltip="Menu" (click)="toggleDrawer()">
        <mat-icon>
          menu
        </mat-icon>
       </button>
        }
        <span><b>{{appName}}</b></span>
      </div>
      <div  class="avatar-container">


      <button mat-icon-button matTooltip="Notification" [matMenuTriggerFor]="notifMenu">
        <mat-icon [matBadge]="unreadCount > 0 ? unreadCount : null" matBadgeColor="warn" matBadgeOverlap="false">
          notifications
        </mat-icon>
      </button>

     <mat-menu #notifMenu="matMenu">
  <ng-container *ngIf="notifications.length > 0; else noNotif">
    <div *ngFor="let notif of notifications" style="display:flex;align-items:center;">
      <button mat-menu-item (click)="markAsRead(notif)" [disabled]="notif.read" style="flex:1;text-align:left;">
        <mat-icon [color]="notif.read ? '' : 'warn'">notification_important</mat-icon>
        <span [style.opacity]="notif.read ? 0.6 : 1">{{ notif.message }}</span>
        <span *ngIf="notif.read" style="font-size:0.8em; color:gray; margin-left:8px;">(lu)</span>
      </button>
      <button mat-icon-button matTooltip="Supprimer" (click)="deleteNotification(notif)" style="margin-left:0.2rem;">
        <mat-icon color="warn">delete</mat-icon>
      </button>
    </div>
  </ng-container>
  <ng-template #noNotif>
    <span style="padding: 1rem; display: block; color: gray;">Aucune notification</span>
  </ng-template>
</mat-menu>

       <img
        [src]=" (User$|async)?.photoURL ??   'assets/avatar.png'"
        alt="Avatar profil" 
        width="32"
        height="32"
        matTooltip="Profil"
        [matMenuTriggerFor]="menu"
        >
      </div>

      <mat-menu #menu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="themeMenu">
          <mat-icon>imagesearch_roller</mat-icon>
          <span>Theme</span>
        </button>

        <mat-divider />

        <button mat-menu-item >
          <mat-icon>logout</mat-icon>
          <span (click)="logOut()">Déconnexion</span>
        </button>
      </mat-menu>

      <mat-menu #themeMenu="matMenu">
        <button mat-menu-item (click)="swithTheme('device-theme')">
          <mat-icon>brightness_6</mat-icon>
          Appareil
        </button>
        <button mat-menu-item (click)="swithTheme('light-theme')">
           <mat-icon>wb_sunny</mat-icon>
          Claire
        </button>
        <button mat-menu-item (click)="swithTheme('dark-theme')">
           <mat-icon>bedtime</mat-icon>
          Sombre
        </button>
      </mat-menu>
    </mat-toolbar>
        <mat-divider />


    

  `,
  styles: `
  mat-toolbar{
    display: flex;
    justify-content: space-between;
    align-items: center;

  .left-container, .avatar-container{
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  }
  img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: lightgray;
    cursor: pointer;
    transition: 250ms;

    &:hover{
      transform: scale(0.98);
    }
  }`
})
export class ToolbarComponent {
  appName = APP_NAME;
  meduim = IS_MEDIUM;
  viewport = inject(WindowsObserverService).width
  ts = inject(ThemeService);
  state= inject(StateService);
  auth= inject(AuthService);
  fs = inject(FirestoreService);
  snackBar = inject(MatSnackBar);
  User$=this.auth.user;
  router = inject(Router);
  unreadCount = 0;
  notifications: any[] = [];
  ngOnInit() {
    this.User$.subscribe(user => {
      if (user?.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        this.fs.getNotificationsForUser(normalizedEmail).subscribe((notifs: any[]) => {
          this.notifications = notifs;
          this.unreadCount = notifs.filter(n => !n.read).length;
          // Affiche une snackbar pour chaque notification non lue
          notifs.filter(n => !n.read).forEach(n => {
            this.snackBar.open(n.message, '', { duration: 6000 });
          });
        });
      }
    });
  }

  swithTheme = (theme:ThemeMode) => this.ts.setTheme(theme);
  toggleDrawer = () => this.state.isToggleDrawer.update((value) => !value);

  async logOut (){
    await this.auth.logout();
    this.router.navigate(['login']);
  }

  markAsRead(notif: any) {
    if (!notif.read) {
      this.fs.setNotification({ ...notif, read: true });
    }
  }

  deleteNotification(notif: any) {
    if (notif && notif.id) {
      this.fs.deleteData('notifications', notif.id).then(() => {
        this.notifications = this.notifications.filter(n => n.id !== notif.id);
      });
    }
  }


}
