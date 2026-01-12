// src/app/pages/home/goal/goal.component.ts — AVEC STATUTS
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { Goal } from '../../../core/models/Goal.model';
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
],
  template: `
    <div class="goals-container">
      <div class="goals-header">
        <div class="header-badge">
          <mat-icon>trending_up</mat-icon>
          <span>Objectifs Stratégiques</span>
        </div>
        <h1 class="header-title">Mes Objectifs</h1>
      </div>

      <div class="goals-flow">
        @for (goal of allGoals; track goal.id) {
          <div class="goal-card" [attr.data-type]="goal.type" [attr.data-status]="goal.status">
            <div class="card-header">
              <!-- Badge de statut -->
              <div class="status-badge" [attr.data-status]="goal.status">
                <mat-icon class="status-icon">{{ getStatusIcon(goal.status) }}</mat-icon>
                <span>{{ getStatusLabel(goal.status) }}</span>
              </div>

              <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-btn">
                <mat-icon>more_horiz</mat-icon>
              </button>
            </div>

            <div class="card-type">
              <mat-icon class="type-icon">{{ getTypeIcon(goal.type) }}</mat-icon>
              <span class="type-label">{{ goal.type }}</span>
            </div>

            <h3 class="goal-title">{{ goal.title }}</h3>

            <!-- Informations Projet et Tâches -->
            <div class="goal-links">
              <div class="link-item project-link">
                <mat-icon>folder_open</mat-icon>
                <div class="link-content">
                  <span class="link-label">Projet</span>
                  <span class="link-value">{{ getProjectName(goal.projectId) }}</span>
                </div>
              </div>

              @if (goal.linkedTasks && goal.linkedTasks.length > 0) {
                <div class="link-item tasks-link">
                  <mat-icon>task</mat-icon>
                  <div class="link-content">
                    <span class="link-label">Tâches liées</span>
                    <div class="tasks-list">
                      @for (taskId of goal.linkedTasks.slice(0, 3); track taskId) {
                        <span class="task-name">{{ getTaskName(taskId) }}</span>
                      }
                      @if (goal.linkedTasks.length > 3) {
                        <span class="task-more">+{{ goal.linkedTasks.length - 3 }} autre(s)</span>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Compteur de tâches -->
            <div class="goal-tasks-count">
              <span class="count-number">{{ goal.linkedTasks.length }}</span>
              <span class="count-label">tâche(s) liée(s)</span>
            </div>

            <div class="goal-meta">
              <div class="meta-item">
                <mat-icon>event</mat-icon>
                <span>{{ convertTimestampToDate(goal.dueDate) | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <mat-menu #menu="matMenu">
              <button mat-menu-item>
                <mat-icon>visibility</mat-icon>
                <span>Voir le détail</span>
              </button>
              <button mat-menu-item>
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item>
                <mat-icon>link</mat-icon>
                <span>Lier des tâches</span>
              </button>
              <mat-divider></mat-divider>
              
              <!-- Sous-menu pour changer le statut -->
              <button mat-menu-item [matMenuTriggerFor]="statusMenu">
                <mat-icon>change_circle</mat-icon>
                <span>Changer le statut</span>
              </button>
              
              <mat-divider></mat-divider>
              <button mat-menu-item class="delete-item">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
              </button>
            </mat-menu>

            <!-- Sous-menu des statuts -->
            <mat-menu #statusMenu="matMenu">
              <button mat-menu-item (click)="changeStatus(goal, 'active')">
                <mat-icon class="text-green-500">play_circle</mat-icon>
                <span>En cours</span>
              </button>
              <button mat-menu-item (click)="changeStatus(goal, 'paused')">
                <mat-icon class="text-amber-500">pause_circle</mat-icon>
                <span>En pause</span>
              </button>
              <button mat-menu-item (click)="changeStatus(goal, 'completed')">
                <mat-icon class="text-blue-500">check_circle</mat-icon>
                <span>Terminé</span>
              </button>
              <button mat-menu-item (click)="changeStatus(goal, 'archived')">
                <mat-icon class="text-gray-500">archive</mat-icon>
                <span>Archivé</span>
              </button>
            </mat-menu>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">
              <mat-icon>flag</mat-icon>
            </div>
            <h3>Aucun objectif</h3>
            <p>Créez vos premiers OKRs ou KPIs pour commencer</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .goals-container {
      min-height: 100vh;
      background: #121316;
      padding: 3rem 2rem;
    }

    .goals-header {
      max-width: 1400px;
      margin: 0 auto 3rem;
      text-align: center;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .header-badge mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .header-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }

    .goals-flow {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: flex-start;
      justify-content: center;
    }

    .goal-card {
      width: 280px;
      background: #1a1d23;
      border-radius: 20px;
      border: 1px solid #2a2d35;
      padding: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      cursor: pointer;
    }

    .goal-card:hover {
      transform: translateY(-8px);
      border-color: #3a3d45;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    /* Bordures colorées selon le statut */
    .goal-card[data-status="active"] {
      border-left: 4px solid #10b981;
    }

    .goal-card[data-status="paused"] {
      border-left: 4px solid #f59e0b;
    }

    .goal-card[data-status="completed"] {
      border-left: 4px solid #3b82f6;
      opacity: 0.8;
    }

    .goal-card[data-status="archived"] {
      border-left: 4px solid #6b7280;
      opacity: 0.6;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    /* Badge de statut */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge[data-status="active"] {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-badge[data-status="paused"] {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-badge[data-status="completed"] {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .status-badge[data-status="archived"] {
      background: rgba(107, 114, 128, 0.15);
      color: #9ca3af;
      border: 1px solid rgba(107, 114, 128, 0.3);
    }

    .status-icon {
      font-size: 0.9rem !important;
      width: 0.9rem !important;
      height: 0.9rem !important;
    }

    .menu-btn {
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      background-color: transparent !important;
      border: none;
      cursor: pointer;
      color: #9ca3af !important;
    }

    .menu-btn:hover {
      color: #fff !important;
    }

    .card-type {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #10b981;
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 1rem;
    }

    .goal-card[data-type="KPI"] .card-type {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }

    .type-icon {
      font-size: 1rem !important;
      width: 1rem !important;
      height: 1rem !important;
    }

    .goal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.8rem;
    }

    /* Informations Projet et Tâches */
    .goal-links {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .link-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .link-item:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 0.5rem;
      padding-bottom: 1rem;
    }

    .link-item mat-icon {
      color: #10b981;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      margin-top: 0.15rem;
    }

    .tasks-link mat-icon {
      color: #3b82f6;
    }

    .link-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .link-label {
      font-size: 0.7rem;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .link-value {
      font-size: 0.9rem;
      color: #fff;
      font-weight: 600;
      line-height: 1.3;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .task-name {
      font-size: 0.85rem;
      color: #e5e7eb;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      line-height: 1.4;
    }

    .task-name::before {
      content: '•';
      color: #3b82f6;
      font-weight: bold;
      font-size: 1rem;
    }

    .task-more {
      font-size: 0.75rem;
      color: #9ca3af;
      font-weight: 600;
      font-style: italic;
      margin-top: 0.25rem;
    }

    span {
      color: #fff;
    }

    .goal-progress {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .progress-circle {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .progress-circle svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-bg {
      fill: none;
      stroke: #2a2d35;
      stroke-width: 8;
    }

    .progress-fill {
      fill: none;
      stroke: #3a3d45;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
    }

    .progress-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-value mat-icon {
      color: #10b981;
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .goal-tasks-count {
      text-align: center;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .goal-tasks-count mat-icon {
      color: #10b981;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .count-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: #10b981;
      line-height: 1;
    }

    .count-label {
      font-size: 0.875rem;
      color: #9ca3af;
      font-weight: 500;
    }

    .goal-meta {
      display: flex;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #2a2d35;
    }

    .meta-item {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #9ca3af;
      font-weight: 500;
    }

    .meta-item mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #6b7280;
    }

    .delete-item {
      color: #ef4444 !important;
    }

    .empty-state {
      width: 100%;
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 30px;
      border: 2px dashed rgba(255, 255, 255, 0.1);
    }

    .empty-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-icon mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .empty-state h3 {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0 0 1rem;
    }

    .empty-state p {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.6);
      max-width: 400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .goals-flow {
        justify-content: center;
      }

      .goal-card {
        width: 100%;
        max-width: 320px;
      }

      .header-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class GoalsComponent implements OnInit {
  allGoals: Goal[] = [];
  projectsMap: Map<string, string> = new Map(); // projectId -> projectName
  tasksMap: Map<string, string> = new Map(); // taskId -> taskName

  private service = inject(FirestoreService);

  ngOnInit() {
    this.loadAllGoals();
    this.loadProjects();
    this.loadTasks();
  }

  private loadAllGoals() {
    this.service.getAllGoals().subscribe(goals => {
      this.allGoals = goals;
    });
  }

  private loadProjects() {
    this.service.getAllProjects().subscribe(projects => {
      projects.forEach(project => {
        this.projectsMap.set(project.id, project.title);
      });
    });
  }

  private loadTasks() {
    this.service.getAllTasks().subscribe(tasks => {
      tasks.forEach(task => {
        this.tasksMap.set(task.id, task.title);
      });
    });
  }

  getProjectName(projectId: string): string {
    return this.projectsMap.get(projectId) || 'Projet inconnu';
  }

  getTaskName(taskId: string): string {
    return this.tasksMap.get(taskId) || 'Tâche inconnue';
  }

  getTypeIcon(type: string): string {
    return type === 'OKR' ? 'emoji_events' : 'analytics';
  }

  getStatusIcon(status: string): string {
    const icons = {
      'active': 'play_circle',
      'paused': 'pause_circle',
      'completed': 'check_circle',
      'archived': 'archive'
    };
    return icons[status as keyof typeof icons] || 'play_circle';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'active': 'En cours',
      'paused': 'En pause',
      'completed': 'Terminé',
      'archived': 'Archivé'
    };
    return labels[status as keyof typeof labels] || 'En cours';
  }

  changeStatus(goal: Goal, newStatus: string) {
    // Mettre à jour le statut dans Firestore
    this.service.updateGoalStatus(goal.id, newStatus).then(() => {
      console.log(`✅ Statut du goal "${goal.title}" changé en "${newStatus}"`);
    }).catch(error => {
      console.error('❌ Erreur lors du changement de statut:', error);
    });
  }

  convertTimestampToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (timestamp.toDate) return timestamp.toDate();
    return new Date(timestamp.seconds * 1000);
  }
}