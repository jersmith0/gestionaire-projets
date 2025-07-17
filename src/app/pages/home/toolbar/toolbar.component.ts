import { Component, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
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
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,MatTooltipModule,MatMenuModule,MatDividerModule,AsyncPipe],
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
       <button mat-icon-button matTooltip="Notification">
        <mat-icon>
          notifications
        </mat-icon>
       </button>

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
  auth= inject(AuthService)
  User$=this.auth.user;
  router = inject(Router)

  swithTheme = (theme:ThemeMode) => this.ts.setTheme(theme);
  toggleDrawer = () => this.state.isToggleDrawer.update((value) => !value);

  async logOut (){
    await this.auth.logout();
    this.router.navigate(['login']);
  }


}
