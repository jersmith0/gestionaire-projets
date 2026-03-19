import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-project-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    <main class="projects-root">
      @let user = user$ | async;
      @let projects = projects$ | async;

       <br>
       <br>
      <!-- ── Page header ── -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Mes projets</h1>
          <p class="page-sub">{{ projects?.length || 0 }} projet{{ (projects?.length || 0) > 1 ? 's' : '' }} dans votre portfolio</p>
        </div>
      </div>

      <!-- ── Empty state ── -->
      @if (!projects?.length) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="20" fill="#f0f4ff"/>
              <path d="M12 28V16l8-6 8 6v12H12z" stroke="#1a56db" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M17 28v-6h6v6" stroke="#1a56db" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="empty-title">Aucun projet pour l'instant</h3>
          <p class="empty-sub">
            Créez votre premier projet pour enrichir votre portfolio et montrer votre travail aux recruteurs.
          </p>
          <a routerLink="/new-project" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Créer mon premier projet
          </a>
        </div>
      }

      <!-- ── Project grid ── -->
      @if (projects?.length) {
        <div class="projects-grid">
          @for (project of projects; track project.id) {
            <article class="project-card" [class.project-card--own]="user?.uid === project.uid">

              <!-- Actions (own projects) -->
              @if (user?.uid === project.uid) {
                <div class="card-actions">
                  <button
                    class="action-btn"
                    title="Modifier"
                    (click)="onEditProject(project)">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    class="action-btn action-btn--danger"
                    title="Supprimer"
                    (click)="onDeleteProject(project.id!)">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Card body -->
              <div class="card-body">
                <div class="card-top">
                  <h3 class="card-title">{{ project.title }}</h3>
                  <p class="card-desc">
                    {{ project.description || 'Aucune description fournie.' }}
                  </p>
                </div>

                <!-- Tools -->
                @if (project.contributors?.length) {
                  <div class="card-tools">
                    @for (tool of project.contributors; track $index) {
                      @let info = getToolInfo(tool);
                      <span class="tool-badge">
                        <span class="tool-icon material-icons">{{ info.icon }}</span>
                        {{ info.displayName || tool }}
                      </span>
                    }
                  </div>
                } @else {
                  <p class="no-tools">Aucun outil spécifié</p>
                }
              </div>

              <!-- Card footer -->
              <div class="card-footer">
                <span class="ownership-badge" [class.ownership-badge--own]="user?.uid === project.uid">
                  {{ user?.uid === project.uid ? 'Mon projet' : 'Contributeur' }}
                </span>
                @if (project.createdAt) {
                  <span class="card-date">
                    {{ formateDate(project.createdAt) | date:'dd MMM yyyy' }}
                  </span>
                }
              </div>

            </article>
          }
        </div>
      }

    </main>
  `,
  styles: [`
    /* ══════════════════ TOKENS ══════════════════════ */
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
      background: var(--c-bg);
      min-height: 100vh;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; color: inherit; }

    /* ══════════════════ ROOT ════════════════════════ */
    .projects-root {
      max-width: 1120px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }

    /* ══════════════════ PAGE HEADER ═════════════════ */
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 40px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--c-border);
      flex-wrap: wrap;
    }
    .page-title {
      font-family: var(--font-display);
      font-size: 1.9rem;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 4px;
    }
    .page-sub {
      font-size: .85rem;
      color: var(--c-text-muted);
    }

    /* ══════════════════ BUTTONS ═════════════════════ */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 10px 18px;
      border-radius: var(--r-md);
      font-size: .88rem;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid transparent;
      transition: all .2s ease;
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
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(26,86,219,.28);
    }

    /* ══════════════════ EMPTY STATE ═════════════════ */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 24px;
      max-width: 440px;
      margin: 0 auto;
    }
    .empty-icon {
      margin-bottom: 20px;
    }
    .empty-title {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 10px;
    }
    .empty-sub {
      font-size: .88rem;
      color: var(--c-text-muted);
      line-height: 1.7;
      margin-bottom: 28px;
    }

    /* ══════════════════ GRID ════════════════════════ */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    /* ══════════════════ CARD ════════════════════════ */
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
    /* Accent top bar on own projects */
    .project-card--own::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--c-primary);
      border-radius: var(--r-xl) var(--r-xl) 0 0;
    }

    /* ── Card actions ── */
    .card-actions {
      position: absolute;
      top: 14px; right: 14px;
      display: flex;
      gap: 6px;
      opacity: 0;
      transition: opacity .2s;
      z-index: 10;
    }
    .project-card:hover .card-actions { opacity: 1; }

    .action-btn {
      width: 30px; height: 30px;
      border-radius: var(--r-md);
      border: 1px solid var(--c-border);
      background: var(--c-surface);
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: border-color .15s, color .15s, background .15s;
      box-shadow: var(--shadow-sm);
    }
    .action-btn:hover {
      border-color: var(--c-primary);
      color: var(--c-primary);
      background: var(--c-mark);
    }
    .action-btn--danger:hover {
      border-color: var(--c-error);
      color: var(--c-error);
      background: var(--c-error-bg);
    }

    /* ── Card body ── */
    .card-body {
      padding: 24px 24px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .card-top { display: flex; flex-direction: column; gap: 8px; }
    .card-title {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--c-text);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding-right: 48px; /* avoid overlap with actions */
    }
    .card-desc {
      font-size: .83rem;
      color: var(--c-text-muted);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* ── Tools ── */
    .card-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tool-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      background: var(--c-mark);
      border: 1px solid rgba(26,86,219,.12);
      border-radius: 100px;
      font-size: .74rem;
      font-weight: 600;
      color: var(--c-primary);
    }
    .tool-icon {
      font-size: .85rem;
      line-height: 1;
    }
    .no-tools {
      font-size: .78rem;
      color: var(--c-text-muted);
      font-style: italic;
    }

    /* ── Card footer ── */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      border-top: 1px solid var(--c-border);
      background: var(--c-bg);
    }
    .ownership-badge {
      font-size: .72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--c-text-muted);
      padding: 2px 8px;
      border-radius: 100px;
      background: var(--c-border);
    }
    .ownership-badge--own {
      background: var(--c-mark);
      color: var(--c-primary);
      border: 1px solid rgba(26,86,219,.15);
    }
    .card-date {
      font-size: .75rem;
      color: var(--c-text-muted);
    }

    /* ══════════════════ RESPONSIVE ══════════════════ */
    @media (max-width: 600px) {
      .projects-root { padding: 24px 16px 60px; }
      .page-header { flex-direction: column; align-items: flex-start; }
      .projects-grid { grid-template-columns: 1fr; }
      .card-actions { opacity: 1; } /* always visible on mobile */
    }
  `]
})
export class ProjectListComponent implements OnInit, OnDestroy {
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

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

  ngOnDestroy() {
    this.userSub?.unsubscribe();
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