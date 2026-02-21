import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { IS_MEDIUM } from '../../../app.constants';
import { WindowsObserverService } from '../../../core/service/utilities/windows-observer.service';
import { StateService } from '../../../core/service/utilities/state.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-[calc(100vh-64px)] bg-slate-950">
      <!-- Sidebar -->
      <aside 
        class="fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950/95 backdrop-blur-lg border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out md:translate-x-0"
        [class.-translate-x-full]="!isOpen()"
      >
        <div class="p-6 flex flex-col h-full">
          <!-- Liens -->
          <div class="space-y-1.5 flex-1">
            <!-- Mon profil -->
              <a 
              routerLink="/profil"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">person</span>
              <span class="font-medium">Mon profil</span>
            </a>
            <a 
              routerLink="/profil"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">person</span>
              <span class="font-medium">Mon profil</span>
            </a>

            <!-- Projets -->
            <a 
              routerLink="/Projets"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">folder</span>
              <span class="font-medium">Projets</span>
            </a>

            <!-- Prévisualiser -->
            <a 
              routerLink="/visual"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">visibility</span>
              <span class="font-medium">Prévisualiser</span>
            </a>

            <!-- Contributeurs -->
            <a 
              routerLink="/contributors"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">group</span>
              <span class="font-medium">Contributeurs</span>
            </a>

            <!-- Objectifs -->
            <a 
              routerLink="/goals"
              routerLinkActive="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 text-white font-semibold border-l-4 border-violet-500"
              (click)="closeOnMobile()"
              class="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-violet-400 transition-all duration-200 group"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">task_alt</span>
              <span class="font-medium">Objectifs</span>
            </a>
          </div>

          <!-- Bas de sidebar -->
         
        </div>
      </aside>

      <!-- Contenu principal -->
      <main class="flex-1 overflow-auto bg-gradient-to-b from-slate-950 to-slate-900">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [] // Plus besoin de styles ici
})
export class SideNavComponent {
  medium = IS_MEDIUM;
  viewport = inject(WindowsObserverService).width;
  state = inject(StateService);

  isOpen = computed(() => this.viewport() >= this.medium || this.state.isToggleDrawer());

  closeOnMobile() {
    if (this.viewport() < this.medium) {
      this.state.isToggleDrawer.set(false);
    }
  }
}