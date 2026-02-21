import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../../core/service/firebase/firestore.service';
import { Timestamp } from '@angular/fire/firestore';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToolInfo, TOOLS } from '../../../../tools.constants';
import { SetProjectComponent } from '../set-project/set-project.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatRippleModule,
    RouterLink,
    MatIconModule,
  ],
  template: `
    <main class="p-6 min-h-[calc(100vh-64px)] ">
      @let user = user$ | async;
      @let projects = projects$ | async;

      <!-- État vide -->
      @if (!projects?.length) {
        <div class="flex flex-col items-center justify-center h-96 text-center text-slate-400">
          <span class="material-icons text-8xl text-violet-500/50 mb-6 animate-pulse">folder_off</span>
          <h3 class="text-2xl font-semibold text-slate-200 mb-3">
            Aucun projet pour le moment
          </h3>
          <p class="text-slate-500 mb-8 max-w-md">
            Commencez par créer votre premier projet pour organiser vos idées et collaborer efficacement.
          </p>
          <button 
            routerLink="/new-project" 
            class="px-8 py-4 bg-cyan text-white font-semibold rounded-xl hover:shadow-[0_0_25px_-5px] hover:shadow-violet-600/40 transition-all duration-300 transform hover:scale-105">
            <span class="material-icons mr-2 align-middle">add_circle</span>
            Créer un projet
          </button>
        </div>
      }

      <!-- Grille de projets -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16 lg:mt-20">
        @for (project of projects; track project.id) {
          <div 
            matRipple 
            class="group relative glass rounded-2xl overflow-hidden border border-slate-800/50 hover:border-violet-600/50 hover:shadow-2xl hover:shadow-violet-900/20 transition-all duration-300 cursor-pointer"
          >
            <!-- Boutons Modifier / Supprimer (visibles uniquement au propriétaire) -->
           <!-- Boutons Modifier / Supprimer -->
@if (user?.uid === project.uid) {
  <div class="absolute top-4 right-4 z-20 flex items-center gap-2 
              md:opacity-0 md:group-hover:opacity-100 
              opacity-100 transition-opacity duration-200">
    <!-- Modifier -->
    <button 
    (click)="onEditProject(project!)"
      mat-icon-button
      matTooltip="Modifier ce projet"
      class="text-slate-300 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
    >
      <mat-icon class="text-xl">edit</mat-icon>
    </button>

    <!-- Supprimer -->
    <button 
    (click)="onDeleteProject(project?.id!)" 
      mat-icon-button
      matTooltip="Supprimer ce projet"
      class="text-slate-300 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/40"
    >
      <mat-icon class="text-xl">delete</mat-icon>
    </button>
  </div>
}

            <!-- Badge propriétaire / contributeur -->
            <!-- <div class="absolute top-4 left-4 z-10">
              <span 
                class="px-3 py-1 text-xs font-semibold rounded-full shadow-md"
                [ngClass]="{
                  'bg-gradient-to-r from-violet-600 to-cyan-600 text-white': project.uid === user?.uid,
                  'bg-slate-700/80 text-slate-200': project.uid !== user?.uid
                }"
              >
                {{ project.uid === user?.uid ? 'Propriétaire' : 'Contributeur' }}
              </span>
            </div> -->

            <!-- Contenu -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-2">
                {{ project.title }}
              </h3>

              <p class="text-slate-400 text-sm line-clamp-3 mb-6">
                {{ project.description || 'Aucune description' }}
              </p>

              <!-- Outils utilisés -->
              @if (project.contributors?.length) {
                <div class="mt-4">
                  <h4 class="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    Outils utilisés
                  </h4>

                  <div class="flex flex-wrap gap-2">
                    @for (tool of project.contributors; track $index) {
                      @let toolInfo = getToolInfo(tool);
                      <span 
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-slate-800/70 border border-slate-700/50 text-slate-200 hover:bg-slate-700/70 hover:border-violet-600/50 transition-all duration-200 group">
                        <span class="material-icons text-base" [ngClass]="toolInfo.color">
                          {{ toolInfo.icon }}
                        </span>
                        {{ toolInfo.displayName || tool }}
                      </span>
                    }
                  </div>
                </div>
              } @else {
                <div class="mt-4 text-sm text-slate-500 italic flex items-center gap-2">
                  <span class="material-icons text-base">build</span>
                  Aucun outil spécifié
                </div>
              }

              <!-- Date -->
              <div class="mt-6 text-xs text-slate-600 flex items-center gap-2">
                <!-- <span class="material-icons text-base">calendar_today</span>
                <span>{{ formateDate(project.createdAt) | date:'dd MMM yyyy' }}</span> -->
                <a href="https://github.com/tonusername" target="_blank" rel="noopener noreferrer"
     class="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  </a>
              </div>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .glass {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
    }
  `]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  user$ = this.auth.user;
  projects$?: Observable<Project<Timestamp>[]>;
  userSub?: Subscription;

  formateDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      if (user) {
        this.projects$ = this.fs.getProjects(user) as Observable<Project<Timestamp>[]>;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  getToolInfo (toolName: string): ToolInfo {
    const lowerName = toolName.toLowerCase().trim();
    return (
      TOOLS.find(t => lowerName.includes(t.name)) || {
        name: lowerName,
        displayName: toolName,
        icon: 'build',
        color: 'text-violet-400',
      }
    );
  }

  onEditProject(project: Project<Timestamp>) {
    this.dialog.open(SetProjectComponent, { 
      width: "35rem",
      disableClose: true,
      data: project
   });
 }
 
 onDeleteProject(projectId: string) {
    this.fs.deleteData(this.fs.projectCol, projectId);
    const message = 'Projet suprimé avec succès';
    this.snackBar.open(message, '', { duration: 5000 });
  }

}