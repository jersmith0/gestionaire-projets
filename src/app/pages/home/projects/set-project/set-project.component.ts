import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { User } from '@angular/fire/auth';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../../core/service/firebase/firestore.service';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-set-project',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <div class="dialog-root">

      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-header-text">
          <h2 class="dialog-title">
            {{ project ? 'Modifier le projet' : 'Nouveau projet' }}
          </h2>
          <p class="dialog-sub">
            {{ project ? 'Mettez à jour les informations de votre projet.' : 'Ajoutez un projet à votre portfolio.' }}
          </p>
        </div>
        <button class="close-btn" (click)="close()" title="Fermer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="dialog-body">
        <form [formGroup]="projectForm" novalidate>

          <!-- Title -->
          <div class="field" [class.field--error]="projectForm.controls.title.invalid && projectForm.controls.title.touched">
            <div class="field-header">
              <label class="field-label" for="proj-title">Nom du projet <span class="required">*</span></label>
              <span class="char-count">{{ projectForm.controls.title.value.length }} / 50</span>
            </div>
            <input
              id="proj-title"
              type="text"
              formControlName="title"
              maxlength="50"
              placeholder="Ex : App de gestion de tâches"
              class="field-input"
            />
            @if (projectForm.controls.title.hasError('required') && projectForm.controls.title.touched) {
              <p class="field-error">Le titre est obligatoire.</p>
            }
          </div>

          <!-- Description -->
          <div class="field" [class.field--error]="projectForm.controls.description.invalid && projectForm.controls.description.touched">
            <div class="field-header">
              <label class="field-label" for="proj-desc">Description <span class="required">*</span></label>
              <span class="char-count">{{ projectForm.controls.description.value.length }} / 500</span>
            </div>
            <textarea
              id="proj-desc"
              formControlName="description"
              maxlength="500"
              rows="4"
              placeholder="Décrivez votre projet, son objectif, les technologies utilisées..."
              class="field-input field-textarea"
            ></textarea>
            @if (projectForm.controls.description.hasError('required') && projectForm.controls.description.touched) {
              <p class="field-error">La description est obligatoire.</p>
            }
          </div>

          <!-- Skills / Tools -->
          <div class="field-group">
            <div class="field-group-header">
              <div>
                <p class="field-group-title">
                  <span class="section-icon">⚡</span>
                  Outils & Frameworks
                </p>
                <p class="field-group-sub">Technologies utilisées dans ce projet</p>
              </div>
              <!-- <span class="skills-count">{{ projectForm.controls.contributors.controls.length }} / 5</span> -->
            </div>

            <div formArrayName="contributors" class="skills-list">
              @for (control of projectForm.controls.contributors.controls; track $index) {
                <div class="skill-row">
                  <span class="skill-num">{{ $index + 1 }}</span>
                  <input
                    type="text"
                    [formControlName]="$index"
                    placeholder="Ex : React, TypeScript, Figma..."
                    class="field-input"
                  />
                  @if ($index > 0) {
                    <button
                      type="button"
                      class="btn-remove"
                      (click)="removeContributorControl($index)"
                      title="Supprimer">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                    </button>
                  }
                </div>
              }
            </div>

            @if (projectForm.controls.contributors.controls.length < 5) {
              <button type="button" class="btn-add-skill" (click)="addContributorControl()">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Ajouter un outil
              </button>
            }
          </div>

        </form>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button class="btn btn-ghost" (click)="close()">Annuler</button>
        @let user = USER$ | async;
        <button
          class="btn btn-primary"
          [disabled]="projectForm.invalid"
          (click)="onSubmit(user)">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l4 4 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ project ? 'Enregistrer les modifications' : 'Créer le projet' }}
        </button>
      </div>

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
      --r-md: 10px;
      --r-lg: 14px;
      --font-body: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--c-text);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Shell ── */
    .dialog-root {
      background: var(--c-surface);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      width: 100%;
    }

    /* ── Header ── */
    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 24px 18px;
      border-bottom: 1px solid var(--c-border);
      flex-shrink: 0;
    }
    .dialog-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 3px;
      font-family: 'Georgia', serif;
    }
    .dialog-sub {
      font-size: .78rem;
      color: var(--c-text-muted);
    }
    .close-btn {
      width: 28px; height: 28px;
      border-radius: 7px;
      border: 1px solid var(--c-border);
      background: transparent;
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: border-color .15s, color .15s, background .15s;
    }
    .close-btn:hover {
      border-color: var(--c-error);
      color: var(--c-error);
      background: var(--c-error-bg);
    }

    /* ── Body ── */
    .dialog-body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ── Fields ── */
    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .field-label {
      font-size: .78rem;
      font-weight: 600;
      color: var(--c-text);
    }
    .required { color: var(--c-primary); margin-left: 2px; }
    .char-count {
      font-size: .7rem;
      color: var(--c-text-muted);
    }
    .field-input {
      width: 100%;
      padding: 9px 12px;
      background: var(--c-bg);
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-md);
      font-size: .875rem;
      color: var(--c-text);
      font-family: inherit;
      outline: none;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }
    .field-input::placeholder { color: #9ca3af; }
    .field-input:focus {
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px rgba(26,86,219,.1);
      background: #fff;
    }
    .field-textarea {
      resize: vertical;
      min-height: 96px;
      line-height: 1.65;
    }
    .field--error .field-input {
      border-color: var(--c-error);
      background: var(--c-error-bg);
    }
    .field--error .field-input:focus {
      box-shadow: 0 0 0 3px rgba(220,38,38,.1);
    }
    .field-error {
      font-size: .73rem;
      color: var(--c-error);
    }

    /* ── Field group ── */
    .field-group {
      padding: 16px;
      background: var(--c-bg);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .field-group-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .field-group-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: .82rem;
      font-weight: 700;
      color: var(--c-text);
    }
    .section-icon { font-size: .85rem; }
    .field-group-sub {
      font-size: .72rem;
      color: var(--c-text-muted);
      margin-top: 2px;
    }
    .skills-count {
      font-size: .7rem;
      font-weight: 700;
      color: var(--c-primary);
      background: var(--c-mark);
      border: 1px solid rgba(26,86,219,.15);
      padding: 2px 8px;
      border-radius: 100px;
      flex-shrink: 0;
    }
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .skill-row {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .skill-num {
      width: 20px; height: 20px;
      border-radius: 50%;
      background: var(--c-mark);
      border: 1px solid rgba(26,86,219,.2);
      color: var(--c-primary);
      font-size: .65rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .btn-remove {
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 1px solid var(--c-border);
      background: transparent;
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: border-color .15s, color .15s, background .15s;
    }
    .btn-remove:hover {
      border-color: var(--c-error);
      color: var(--c-error);
      background: var(--c-error-bg);
    }
    .btn-add-skill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border: 1.5px dashed var(--c-border);
      border-radius: var(--r-md);
      background: transparent;
      color: var(--c-text-muted);
      font-size: .78rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: border-color .2s, color .2s, background .2s;
      align-self: flex-start;
    }
    .btn-add-skill:hover {
      border-color: var(--c-primary);
      color: var(--c-primary);
      background: var(--c-mark);
    }

    /* ── Footer ── */
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 9px;
      padding: 14px 24px;
      border-top: 1px solid var(--c-border);
      background: var(--c-bg);
      flex-shrink: 0;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      border-radius: var(--r-md);
      font-size: .85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid transparent;
      font-family: inherit;
      transition: all .2s ease;
      white-space: nowrap;
    }
    .btn-ghost {
      background: transparent;
      color: var(--c-text-muted);
      border-color: var(--c-border);
    }
    .btn-ghost:hover {
      background: var(--c-surface);
      color: var(--c-text);
    }
    .btn-primary {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }
    .btn-primary:hover:not(:disabled) {
      background: var(--c-primary-dk);
      border-color: var(--c-primary-dk);
      box-shadow: 0 4px 14px rgba(26,86,219,.25);
    }
    .btn-primary:disabled {
      opacity: .45;
      cursor: not-allowed;
    }
  `]
})
export class SetProjectComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private dialogRef = inject(MatDialogRef<SetProjectComponent>);
  private fs = inject(FirestoreService);
  readonly project = inject<Project<FieldValue> | undefined>(MAT_DIALOG_DATA);

  USER$ = this.auth.user;

  projectForm = this.fb.nonNullable.group({
    title:        ['', [Validators.required]],
    description:  ['', [Validators.required]],
    contributors: this.fb.array([this.buildControl()]),
  });

  ngOnInit() {
    while (this.projectForm.controls.contributors.length > 0) {
      this.projectForm.controls.contributors.removeAt(0);
    }

    if (this.project) {
      this.projectForm.patchValue({
        title:       this.project.title || '',
        description: this.project.description || '',
      });
      const contributors = this.project.contributors || [];
      if (contributors.length > 0) {
        contributors.forEach(name => {
          if (name?.trim()) this.addContributorControl(name.trim());
        });
      } else {
        this.addContributorControl();
      }
    } else {
      this.addContributorControl();
    }
  }

  buildControl(name = '') {
    return this.fb.nonNullable.control(name, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]);
  }

  addContributorControl(name = '') {
    this.projectForm.controls.contributors.push(this.buildControl(name));
  }

  removeContributorControl(index: number) {
    this.projectForm.controls.contributors.removeAt(index);
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(user: User | null) {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const col = this.fs.projectCol;
    const projectId = this.project?.id ?? this.fs.createDocId(col);

    const project: Project<FieldValue> = {
      id: projectId,
      uid: user?.uid!,
      createdAt: this.project ? this.project.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.projectForm.getRawValue(),
    };

    this.fs.setProject(project);

    if (!this.project) {
      const raw: string[] = this.projectForm.getRawValue().contributors || [];
      const userEmail = (user?.email || '').trim().toLowerCase();
      raw
        .map(e => (e || '').trim().toLowerCase())
        .filter(e => e && e !== userEmail)
        .forEach(email => {
          this.fs.setNotification({
            id: this.fs.createDocId(this.fs.notificationCol),
            to: email,
            message: `Vous avez été ajouté comme contributeur au projet : ${project.title}`,
            projectId: project.id,
            createdAt: serverTimestamp(),
            read: false,
          });
        });
    }

    this.dialogRef.close();
  }
}