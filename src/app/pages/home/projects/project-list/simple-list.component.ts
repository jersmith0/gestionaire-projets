import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { Project } from '../../../../core/models/project.model';
import { AuthService } from '../../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../../core/service/firebase/firestore.service';
import { ToolInfo, TOOLS } from '../../../../tools.constants';
import { SetProjectComponent } from '../set-project/set-project.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    @let user = user$ | async;
    @let projects = projects$ | async;
    @let visible = showAll() ? projects : projects?.slice(0, 3);

    <div class="simple-list-root">

      <!-- ── Empty state ── -->
      @if (!projects?.length) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="18" fill="#f0f4ff"/>
              <path d="M10 26V14l8-6 8 6v12H10z" stroke="#1a56db" stroke-width="1.4" stroke-linejoin="round"/>
              <path d="M15 26v-5h6v5" stroke="#1a56db" stroke-width="1.4" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="empty-title">Aucun projet pour l'instant</p>
          <p class="empty-sub">Ajoutez des projets depuis votre tableau de bord.</p>
        </div>
      }

      <!-- ── Project grid (3 by default) ── -->
      @if (projects?.length) {
        <div class="projects-grid">
          @for (project of visible; track project.id) {
            <article class="project-card" [class.project-card--own]="user?.uid === project.uid">


              <!-- Body -->
              <div class="card-body">
                <div class="card-top">
                  <h3 class="card-title">{{ project.title }}</h3>
                  <p class="card-desc">{{ project.description || 'Aucune description fournie.' }}</p>
                </div>
                @if (project.contributors?.length) {
                  <div class="card-tools">
                    @for (tool of project.contributors; track $index) {
                      @let info = getToolInfo(tool);
                      <span class="tool-badge">
                        <span class="material-icons tool-icon">{{ info.icon }}</span>
                        {{ info.displayName || tool }}
                      </span>
                    }
                  </div>
                } @else {
                  <p class="no-tools">Aucun outil spécifié</p>
                }
              </div>

              <!-- Footer -->
              <div class="card-footer">
                <span class="ownership-badge" [class.ownership-badge--own]="user?.uid === project.uid">
                  {{ user?.uid === project.uid ? 'Mon projet' : 'Contributeur' }}
                </span>
                @if (project.createdAt) {
                  <span class="card-date">{{ formateDate(project.createdAt) | date:'dd MMM yyyy' }}</span>
                }
              </div>

            </article>
          }
        </div>

        <!-- ── Expand / collapse panel ── -->
        @if ((projects?.length || 0) > 3) {
          <div class="expand-section">
            <button class="btn-expand" (click)="toggleAll()">
              @if (!showAll()) {
                <span>Voir tous les projets</span>
                <span class="expand-count">+{{ (projects?.length || 0) - 3 }} autres</span>
                <svg class="expand-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              } @else {
                <span>Réduire</span>
                <svg class="expand-chevron expand-chevron--up" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 9l4-4 4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              }
            </button>
          </div>
        }
      }

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
      --c-primary-dk:#1447c0;
      --c-mark:      #f0f4ff;
      --c-error:     #dc2626;
      --c-error-bg:  #fef2f2;
      --r-md:  10px;
      --r-lg:  16px;
      --r-xl:  20px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
      --shadow-md: 0 4px 16px rgba(0,0,0,.08);
      --font-display: 'Georgia', 'Times New Roman', serif;
      --font-body: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--c-text);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; color: inherit; }

    .simple-list-root {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ── Empty ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 48px 24px;
      gap: 10px;
    }
    .empty-icon { margin-bottom: 4px; }
    .empty-title {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--c-text);
    }
    .empty-sub {
      font-size: .83rem;
      color: var(--c-text-muted);
    }

    /* ── Grid ── */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    /* ── Card ── */
    .project-card {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: border-color .2s, box-shadow .2s, transform .2s;
    }
    .project-card:hover {
      border-color: var(--c-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .project-card--own::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--c-primary);
      border-radius: var(--r-xl) var(--r-xl) 0 0;
    }

    /* Actions */
    .card-actions {
      position: absolute;
      top: 12px; right: 12px;
      display: flex;
      gap: 5px;
      opacity: 0;
      transition: opacity .2s;
      z-index: 10;
    }
    .project-card:hover .card-actions { opacity: 1; }
    .action-btn {
      width: 28px; height: 28px;
      border-radius: var(--r-md);
      border: 1px solid var(--c-border);
      background: var(--c-surface);
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: border-color .15s, color .15s, background .15s;
    }
    .action-btn:hover { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-mark); }
    .action-btn--danger:hover { border-color: var(--c-error); color: var(--c-error); background: var(--c-error-bg); }

    /* Body */
    .card-body {
      padding: 20px 20px 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .card-top { display: flex; flex-direction: column; gap: 6px; }
    .card-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--c-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding-right: 44px;
    }
    .card-desc {
      font-size: .8rem;
      color: var(--c-text-muted);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-tools { display: flex; flex-wrap: wrap; gap: 5px; }
    .tool-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 9px;
      background: var(--c-mark);
      border: 1px solid rgba(26,86,219,.12);
      border-radius: 100px;
      font-size: .72rem;
      font-weight: 600;
      color: var(--c-primary);
    }
    .tool-icon { font-size: .8rem; line-height: 1; }
    .no-tools { font-size: .76rem; color: var(--c-text-muted); font-style: italic; }

    /* Footer */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      border-top: 1px solid var(--c-border);
      background: var(--c-bg);
    }
    .ownership-badge {
      font-size: .68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--c-text-muted);
      padding: 2px 7px;
      border-radius: 100px;
      background: var(--c-border);
    }
    .ownership-badge--own {
      background: var(--c-mark);
      color: var(--c-primary);
      border: 1px solid rgba(26,86,219,.15);
    }
    .card-date { font-size: .72rem; color: var(--c-text-muted); }

    /* ── Expand section ── */
    .expand-section {
      display: flex;
      justify-content: center;
      padding: 20px 0 4px;
    }
    .btn-expand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 20px;
      border: 1.5px solid var(--c-border);
      border-radius: 100px;
      background: var(--c-surface);
      font-size: .83rem;
      font-weight: 600;
      color: var(--c-text-muted);
      cursor: pointer;
      font-family: inherit;
      transition: border-color .2s, color .2s, background .2s, box-shadow .2s;
    }
    .btn-expand:hover {
      border-color: var(--c-primary);
      color: var(--c-primary);
      background: var(--c-mark);
      box-shadow: 0 2px 10px rgba(26,86,219,.1);
    }
    .expand-count {
      font-size: .72rem;
      font-weight: 700;
      background: var(--c-mark);
      color: var(--c-primary);
      border: 1px solid rgba(26,86,219,.15);
      padding: 1px 7px;
      border-radius: 100px;
    }
    .expand-chevron {
      color: currentColor;
      transition: transform .25s cubic-bezier(.22,1,.36,1);
      flex-shrink: 0;
    }
    .expand-chevron--up { transform: rotate(180deg); }

    @media (max-width: 600px) {
      .projects-grid { grid-template-columns: 1fr; }
      .card-actions { opacity: 1; }
    }
  `]
})
export class SimpleListComponent implements OnInit, OnDestroy {
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

  user$ = this.auth.user;
  projects$?: Observable<Project<Timestamp>[]>;
  userSub?: Subscription;
  showAll = signal(false);

  formateDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);

  ngOnInit() {
    this.userSub = this.user$.subscribe(user => {
      if (user) {
        this.projects$ = this.fs.getProjects(user) as Observable<Project<Timestamp>[]>;
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  toggleAll() {
    this.showAll.update(v => !v);
  }

  getToolInfo(toolName: string): ToolInfo {
    const lower = toolName.toLowerCase().trim();
    return TOOLS.find(t => lower.includes(t.name)) ?? {
      name: lower,
      displayName: toolName,
      icon: 'build',
      color: 'text-primary',
    };
  }

  onEditProject(project: Project<Timestamp>) {
    this.dialog.open(SetProjectComponent, {
      width: '35rem',
      disableClose: true,
      data: project,
    });
  }

  onDeleteProject(projectId: string) {
    this.fs.deleteData(this.fs.projectCol, projectId);
  }
}