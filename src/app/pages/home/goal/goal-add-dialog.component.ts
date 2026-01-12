import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { Goal } from '../../../core/models/Goal.model';
import { AuthService } from '../../../core/service/firebase/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <mat-icon>flag</mat-icon>
          </div>
          <div>
            <h2 class="dialog-title">Créer un objectif</h2>
            <p class="dialog-subtitle">Définissez un nouvel OKR ou KPI pour votre projet</p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <mat-dialog-content class="dialog-content">
        <div class="form-section">
          <!-- Type de Goal -->
          <div class="type-selector">
            <button 
              type="button"
              class="type-btn"
              [class.active]="type === 'OKR'"
              (click)="type = 'OKR'"
            >
              <mat-icon>emoji_events</mat-icon>
              <div class="type-info">
                <span class="type-name">OKR</span>
                <span class="type-desc">Objectif & Résultats Clés</span>
              </div>
            </button>

            <button 
              type="button"
              class="type-btn"
              [class.active]="type === 'KPI'"
              (click)="type = 'KPI'"
            >
              <mat-icon>analytics</mat-icon>
              <div class="type-info">
                <span class="type-name">KPI</span>
                <span class="type-desc">Indicateur de Performance</span>
              </div>
            </button>
          </div>

          <!-- Titre -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titre de l'objectif</mat-label>
            <input 
              matInput 
              [(ngModel)]="title" 
              placeholder="Ex: Augmenter les ventes de 20%"
              required
            >
            <mat-icon matPrefix>title</mat-icon>
            <mat-hint>Soyez clair et mesurable</mat-hint>
          </mat-form-field>

          <!-- Description -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optionnel)</mat-label>
            <textarea 
              matInput 
              [(ngModel)]="description"
              rows="3"
              placeholder="Détails supplémentaires sur cet objectif..."
            ></textarea>
            <mat-icon matPrefix>description</mat-icon>
          </mat-form-field>

          <div class="form-row">
            <!-- Date limite -->
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Date d'échéance</mat-label>
              <input 
                matInput 
                [matDatepicker]="picker" 
                [(ngModel)]="dueDate"
                [min]="minDate"
                required
              >
              <mat-icon matPrefix>event</mat-icon>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <!-- Statut initial -->
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Statut</mat-label>
              <mat-select [(ngModel)]="status">
                <mat-option value="active">
                  <div class="status-option">
                    <mat-icon class="status-icon active">play_circle</mat-icon>
                    <span>En cours</span>
                  </div>
                </mat-option>
                <mat-option value="paused">
                  <div class="status-option">
                    <mat-icon class="status-icon paused">pause_circle</mat-icon>
                    <span>En pause</span>
                  </div>
                </mat-option>
              </mat-select>
              <mat-icon matPrefix>change_circle</mat-icon>
            </mat-form-field>
          </div>

          <!-- Info supplémentaires pour KPI -->
          @if (type === 'KPI') {
            <div class="kpi-section">
              <div class="section-label">
                <mat-icon>trending_up</mat-icon>
                <span>Métriques KPI</span>
              </div>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Valeur cible</mat-label>
                  <input 
                    matInput 
                    type="number" 
                    [(ngModel)]="targetValue"
                    placeholder="100"
                  >
                  <mat-icon matPrefix>flag</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Unité</mat-label>
                  <mat-select [(ngModel)]="unit">
                    <mat-option value="%">Pourcentage (%)</mat-option>
                    <mat-option value="€">Euro (€)</mat-option>
                    <mat-option value="#">Nombre (#)</mat-option>
                    <mat-option value="h">Heures (h)</mat-option>
                    <mat-option value="j">Jours (j)</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>straighten</mat-icon>
                </mat-form-field>
              </div>
            </div>
          }

          <!-- Priorité -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Priorité</mat-label>
            <mat-select [(ngModel)]="priority">
              <mat-option value="low">
                <div class="priority-option">
                  <span class="priority-badge low"></span>
                  <span>Basse</span>
                </div>
              </mat-option>
              <mat-option value="medium">
                <div class="priority-option">
                  <span class="priority-badge medium"></span>
                  <span>Moyenne</span>
                </div>
              </mat-option>
              <mat-option value="high">
                <div class="priority-option">
                  <span class="priority-badge high"></span>
                  <span>Haute</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>priority_high</mat-icon>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <!-- Actions -->
      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button mat-dialog-close class="cancel-btn">
          <mat-icon>close</mat-icon>
          Annuler
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="save()" 
          [disabled]="!isValid()"
          class="save-btn"
        >
          <mat-icon>check</mat-icon>
          Créer l'objectif
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
    }

    /* ===== HEADER ===== */
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.75rem 2rem 1.5rem;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-content {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background: #f3f4f6;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-wrapper mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: #6366f1;
    }

    .dialog-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
    }

    .dialog-subtitle {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 400;
    }

    .close-btn {
      color: #6b7280 !important;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #111827 !important;
    }

    /* ===== CONTENT ===== */
    .dialog-content {
      padding: 2rem !important;
      flex: 1;
      overflow-y: auto;
      background: #ffffff;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ===== TYPE SELECTOR ===== */
    .type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .type-btn {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .type-btn:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }

    .type-btn.active {
      border-color: #6366f1;
      background: #f5f7ff;
    }

    .type-btn mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #6366f1;
    }

    .type-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.125rem;
    }

    .type-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: #111827;
    }

    .type-desc {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 400;
    }

    /* ===== FORM FIELDS ===== */
    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .flex-1 {
      flex: 1;
    }

    ::ng-deep .mat-mdc-form-field {
      margin-bottom: 0 !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background: #f9fafb !important;
      border-radius: 8px !important;
    }

    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: transparent !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #e5e7eb !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
      border-color: #6366f1 !important;
      border-width: 2px !important;
    }

    ::ng-deep .mat-mdc-form-field .mat-mdc-floating-label {
      color: #6b7280 !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      color: #6366f1 !important;
    }

    ::ng-deep .mat-mdc-form-field .mat-mdc-form-field-icon-prefix mat-icon {
      color: #9ca3af;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-icon-prefix mat-icon {
      color: #6366f1;
    }

    ::ng-deep .mat-mdc-input-element {
      color: #111827 !important;
      font-weight: 500;
    }

    ::ng-deep .mat-mdc-input-element::placeholder {
      color: #9ca3af !important;
      font-weight: 400;
    }

    ::ng-deep textarea.mat-mdc-input-element {
      color: #111827 !important;
      font-weight: 400;
    }

    ::ng-deep .mat-mdc-select-value {
      color: #111827 !important;
      font-weight: 500;
    }

    /* ===== KPI SECTION ===== */
    .kpi-section {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #7c3aed;
      font-size: 0.875rem;
    }

    .section-label mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* ===== STATUS & PRIORITY OPTIONS ===== */
    .status-option,
    .priority-option {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .status-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .status-icon.active {
      color: #10b981;
    }

    .status-icon.paused {
      color: #f59e0b;
    }

    .priority-badge {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .priority-badge.low {
      background: #10b981;
    }

    .priority-badge.medium {
      background: #f59e0b;
    }

    .priority-badge.high {
      background: #ef4444;
    }

    /* ===== ACTIONS ===== */
    .dialog-actions {
      padding: 1.25rem 2rem !important;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      background: #f9fafb;
    }

    .cancel-btn {
      padding: 0 1.5rem !important;
      height: 40px !important;
      border-color: #d1d5db !important;
      color: #6b7280 !important;
      font-weight: 500 !important;
    }

    .cancel-btn:hover {
      background: #f3f4f6 !important;
      border-color: #9ca3af !important;
    }

    .save-btn {
      padding: 0 1.75rem !important;
      height: 40px !important;
      background: #6366f1 !important;
      color: white !important;
      font-weight: 500 !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .save-btn:hover:not(:disabled) {
      background: #4f46e5 !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .save-btn:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed;
    }

    .save-btn mat-icon,
    .cancel-btn mat-icon {
      margin-right: 0.375rem;
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    /* ===== SCROLLBAR ===== */
    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f3f4f6;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 600px) {
      .type-selector {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .dialog-header {
        padding: 1.25rem 1.5rem 1rem;
      }

      .dialog-content {
        padding: 1.5rem !important;
      }

      .dialog-actions {
        padding: 1rem 1.5rem !important;
        flex-direction: column-reverse;
      }

      .cancel-btn,
      .save-btn {
        width: 100%;
      }

      .dialog-title {
        font-size: 1.25rem;
      }

      .icon-wrapper {
        width: 40px;
        height: 40px;
      }

      .icon-wrapper mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  `]
})
export class GoalAddDialogComponent {
  // Champs de base
  title = '';
  description = '';
  type: 'OKR' | 'KPI' = 'OKR';
  dueDate: Date | null = null;
  status: 'active' | 'paused' = 'active';
  priority: 'low' | 'medium' | 'high' = 'medium';
  
  // Champs KPI
  targetValue: number | null = null;
  unit = '%';
  
  // Date minimum (aujourd'hui)
  minDate = new Date();

  private dialogRef = inject(MatDialogRef<GoalAddDialogComponent>);
  private service = inject(FirestoreService);
  private authService = inject(AuthService);
  private data = inject(MAT_DIALOG_DATA);

  isValid(): boolean {
    return this.title.trim().length > 0 && this.dueDate !== null;
  }

  async save() {
    if (!this.isValid()) return;

    const currentUser = await this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.uid) {
      console.error('❌ Utilisateur non connecté');
      return;
    }

    const goal: Partial<Goal> = {
      uid: currentUser.uid,
      projectId: this.data.projectId,
      title: this.title.trim(),
      description: this.description.trim() || undefined,
      type: this.type,
      status: this.status,
      progress: 0,
      linkedTasks: [],
      dueDate: this.dueDate!,
      priority: this.priority
    };

    if (this.type === 'KPI') {
      goal.targetValue = this.targetValue !== null ? this.targetValue : undefined;
      goal.currentValue = 0;
      goal.unit = this.unit;
    }

    try {
      const goalId = await this.service.addGoal(this.data.projectId, goal);
      console.log('✅ Goal créé avec ID:', goalId);
      this.dialogRef.close({ success: true, goalId });
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      this.dialogRef.close({ success: false });
    }
  }
}