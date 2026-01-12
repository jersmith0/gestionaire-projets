import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { StateService } from '../../../core/service/utilities/state.service';


@Component({
  selector: 'app-side-nav',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    RouterLinkActive,
    ],
  template: `
    <mat-drawer-container autosize style="height: calc(100vh - 65px);"> 
      <mat-drawer  opened [mode]="viewPort() >= isMedium? 'side': 'over'"    [opened]="viewPort() >= isMedium || isToggleDrawer()">
        <a routerLink="/projects" mat-menu-item routerLinkActive="active-link" (click)="toggleDrawer()"><mat-icon>dataset</mat-icon> Projets</a>
        <a routerLink="/contributors" mat-menu-item routerLinkActive="active-link" (click)="toggleDrawer()"><mat-icon>group</mat-icon>Contributeurs</a>
        <a routerLink="/goals" mat-menu-item routerLinkActive="active-link" (click)="toggleDrawer()"><mat-icon>task_alt</mat-icon> Objectifs</a>

      </mat-drawer>
      <mat-drawer-content>  
        <router-outlet/>
      </mat-drawer-content>

    </mat-drawer-container> 
  `,
  styles: `
  

    mat-drawer{
      width: 220px;
      border-right: 1px solid var(--mat-sys-outline-variant); 
      border-radius: 0%;
    }
    .active-link{
    background: var(--mat-sys-outline-variant)
  }
  `,
})
export class SideNavComponent {

  isMedium = IS_MEDIUM
  viewPort = inject(WindowsObserverService).width;
  state = inject(StateService);
  isToggleDrawer = computed(()=> this.state.isToggleDrawer());
  toggleDrawer = () => this.state.isToggleDrawer.update((value) => !value);

}
