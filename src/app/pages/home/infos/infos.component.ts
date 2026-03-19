import { Component, inject, input, output, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Infos } from '../../../core/models/infos.model';
import { DataService } from '../../../core/service/firebase/data.service';

@Component({
  selector: 'app-profile-infos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-card">

      <!-- ── Header ── -->
      <div class="card-header">
        <div class="header-inner">
          <div class="header-text">
            <br>
            <br>
            <h2 class="card-title">Mon profil</h2>
            <p class="card-sub">Ces informations seront visibles sur votre portfolio public.</p>
          </div>
          <div class="progress-indicator">
            <div class="progress-step" [class.active]="true">
              <span>1</span> Informations
            </div>
            <div class="progress-line"></div>
            <div class="progress-step">
              <span>2</span> Prévisualisation
            </div>
          </div>
        </div>
      </div>

      <!-- ── Form body ── -->
      <div class="card-body">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" novalidate>

          <!-- Section : Identité -->
          <section class="form-section">
            <div class="section-label">
              <span class="section-icon">👤</span>
              Identité
            </div>
            <div class="fields-row">
              <!-- Nom -->
              <div class="field" [class.field--error]="nom?.invalid && nom?.touched">
                <label class="field-label" for="nom">Nom <span class="required">*</span></label>
                <input
                  id="nom"
                  type="text"
                  formControlName="nom"
                  placeholder="Votre nom"
                  class="field-input"
                  [value]="DataService.Donneenom()"
                  (input)="DataService.Donneenom.set($any($event.target).value)"
                />
                @if (nom?.hasError('required') && nom?.touched) {
                  <p class="field-error">Le nom est obligatoire.</p>
                }
                @if (nom?.hasError('minlength') && nom?.touched) {
                  <p class="field-error">Minimum 2 caractères.</p>
                }
              </div>

              <!-- Prénom -->
              <div class="field" [class.field--error]="prenom?.invalid && prenom?.touched">
                <label class="field-label" for="prenom">Prénom <span class="required">*</span></label>
                <input
                  id="prenom"
                  type="text"
                  formControlName="prenom"
                  placeholder="Votre prenom"
                  class="field-input"
                  [value]="DataService.Donneeprenom()"
                  (input)="DataService.Donneeprenom.set($any($event.target).value)"
                />
                @if (prenom?.hasError('required') && prenom?.touched) {
                  <p class="field-error">Le prénom est obligatoire.</p>
                }
                @if (prenom?.hasError('minlength') && prenom?.touched) {
                  <p class="field-error">Minimum 2 caractères.</p>
                }
              </div>
            </div>
          </section>

          <!-- Section : Titre -->
          <section class="form-section">
            <div class="section-label">
              <span class="section-icon">💼</span>
              Titre professionnel
            </div>
            <div class="field" [class.field--error]="titre?.invalid && titre?.touched">
              <label class="field-label" for="titre">Titre <span class="required">*</span></label>
              <input
                id="titre"
                type="text"
                formControlName="titre"
                placeholder="Ex : Développeur Full-Stack · Designer UI/UX"
                class="field-input"
                [value]="DataService.Donneetitre()"
                (input)="DataService.Donneetitre.set($any($event.target).value)"
              />
              <p class="field-hint">Affiché en tête de votre portfolio public.</p>
              @if (titre?.hasError('required') && titre?.touched) {
                <p class="field-error">Le titre est obligatoire.</p>
              }
            </div>
          </section>

          <!-- Section : Bio -->
          <section class="form-section">
            <div class="section-label">
              <span class="section-icon">📝</span>
              Biographie
            </div>
            <div class="field">
              <label class="field-label" for="bio">À propos de vous</label>
              <textarea
                id="bio"
                formControlName="bio"
                rows="5"
                placeholder="Parlez de vous, de votre parcours, de ce qui vous passionne..."
                class="field-input field-textarea"
                [value]="DataService.Donneebio()"
                (input)="DataService.Donneebio.set($any($event.target).value)"
              ></textarea>
            </div>
          </section>

          <!-- Section : GitHub -->
          <section class="form-section">
            <div class="section-label">
              <span class="section-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </span>
              GitHub
            </div>
            <div class="field">
              <label class="field-label" for="github">Lien GitHub</label>
              <div class="input-prefix-group">
                <span class="input-prefix">github.com/</span>
                <input
                  id="github"
                  type="text"
                  formControlName="github"
                  placeholder="votre-username"
                  class="field-input input-with-prefix"
                  [value]="DataService.Donneeurl()"
                  (input)="DataService.Donneeurl.set($any($event.target).value)"
                />
              </div>
            </div>
          </section>

          <!-- Section : Compétences -->
          <section class="form-section">
            <div class="section-label-row">
              <div class="section-label">
                <span class="section-icon">⚡</span>
                Outils & Frameworks
              </div>
              <!-- <span class="skills-count">{{ profileForm.controls.skills.controls.length }} / 5</span> -->
            </div>

            <div formArrayName="skills" class="skills-list">
              @for (control of profileForm.controls.skills.controls; track $index) {
                <div class="skill-row">
                  <div class="skill-number">{{ $index + 1 }}</div>
                  <input
                    type="text"
                    [formControlName]="$index"
                    placeholder="Ex : React, TypeScript, Figma..."
                    class="field-input"
                    [value]="DataService.Donneeskills()"
                    (input)="DataService.Donneeskills.set($any($event.target).value)"
                  />
                  @if ($index > 0) {
                    <button
                      type="button"
                      class="btn-remove"
                      (click)="removeContributorControl($index)"
                      title="Supprimer">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>
                  }
                </div>
              }
            </div>

            @if (profileForm.controls.skills.controls.length < 5) {
              <button type="button" class="btn-add-skill" (click)="addContributorControl()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Ajouter un outil
              </button>
            }
          </section>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" (click)="onCancel()">
              Annuler
            </button>
            <a
              routerLink="/visual"
              class="btn btn-primary"
              [class.btn-disabled]="profileForm.invalid || profileForm.pristine">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C4.5 3 1.5 8 1.5 8S4.5 13 8 13s6.5-5 6.5-5S11.5 3 8 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/>
              </svg>
              Prévisualiser mon portfolio
            </a>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    /* ══════════════════ TOKENS ══════════════════════ */
    :host {
      --c-bg:        #f8f9fc;
      --c-surface:   #ffffff;
      --c-border:    #e5e7ef;
      --c-border-focus: #1a56db;
      --c-text:      #111827;
      --c-text-muted:#6b7280;
      --c-primary:   #1a56db;
      --c-primary-dk:#1447c0;
      --c-mark:      #f0f4ff;
      --c-error:     #dc2626;
      --c-error-bg:  #fef2f2;
      --r-sm:  6px;
      --r-md:  10px;
      --r-lg:  16px;
      --r-xl:  24px;
      --shadow: 0 1px 3px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.06);
      --font-display: 'Georgia', 'Times New Roman', serif;
      --font-body: 'system-ui', -apple-system, 'Segoe UI', sans-serif;
      display: block;
      width: 100%;
      font-family: var(--font-body);
      font-size: 15px;
      line-height: 1.6;
      color: var(--c-text);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    button, input, textarea { font-family: inherit; font-size: inherit; }

    /* ══════════════════ CARD ════════════════════════ */
    .profile-card {
      background: transparent;
      overflow: hidden;
      max-width: 800px;
      margin: 0 auto;
    }

    /* ══════════════════ HEADER ══════════════════════ */
    .card-header {
      padding: 32px 40px 28px;
      border-bottom: 1px solid var(--c-border);
      background: var(--c-bg);
    }
    .header-inner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }
    .card-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 4px;
    }
    .card-sub {
      font-size: .88rem;
      color: var(--c-text-muted);
    }

    /* Progress indicator */
    .progress-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .progress-step {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: .75rem;
      font-weight: 600;
      color: var(--c-text-muted);
    }
    .progress-step span {
      width: 20px; height: 20px;
      border-radius: 50%;
      background: var(--c-border);
      color: var(--c-text-muted);
      font-size: .7rem;
      display: flex; align-items: center; justify-content: center;
    }
    .progress-step.active {
      color: var(--c-primary);
    }
    .progress-step.active span {
      background: var(--c-primary);
      color: #fff;
    }
    .progress-line {
      width: 32px;
      height: 1px;
      background: var(--c-border);
    }

    /* ══════════════════ BODY ════════════════════════ */
    .card-body {
      padding: 36px 40px 40px;
    }

    /* ══════════════════ SECTIONS ════════════════════ */
    .form-section {
      margin-bottom: 36px;
      padding-bottom: 36px;
      border-bottom: 1px solid var(--c-border);
    }
    .form-section:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--c-text-muted);
      margin-bottom: 16px;
    }
    .section-icon {
      font-size: .9rem;
      display: flex;
      align-items: center;
    }
    .section-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-label-row .section-label { margin-bottom: 0; }
    .skills-count {
      font-size: .75rem;
      font-weight: 600;
      color: var(--c-primary);
      background: var(--c-mark);
      padding: 2px 10px;
      border-radius: 100px;
      border: 1px solid rgba(26,86,219,.15);
    }

    /* ══════════════════ FIELDS ROW ══════════════════ */
    .fields-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* ══════════════════ FIELD ═══════════════════════ */
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: .8rem;
      font-weight: 600;
      color: var(--c-text);
      letter-spacing: .01em;
    }
    .required { color: #dc2626; margin-left: 2px; }
    .field-hint {
      font-size: .76rem;
      color: var(--c-text-muted);
    }
    .field-error {
      font-size: .76rem;
      color: var(--c-error);
    }

    .field-input {
      width: 100%;
      padding: 10px 14px;
      background: var(--c-bg);
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-md);
      color: var(--c-text);
      font-size: .92rem;
      outline: none;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }
    .field-input::placeholder { color: #9ca3af; }
    .field-input:focus {
      border-color: var(--c-border-focus);
      box-shadow: 0 0 0 3px rgba(26,86,219,.1);
      background: #fff;
    }
    .field-textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.7;
    }
    .field--error .field-input {
      border-color: var(--c-error);
      background: var(--c-error-bg);
    }
    .field--error .field-input:focus {
      box-shadow: 0 0 0 3px rgba(220,38,38,.1);
    }

    /* ══════════════════ GITHUB PREFIX ═══════════════ */
    .input-prefix-group {
      display: flex;
      align-items: stretch;
    }
    .input-prefix {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: var(--c-border);
      border: 1.5px solid var(--c-border);
      border-right: none;
      border-radius: var(--r-md) 0 0 var(--r-md);
      font-size: .82rem;
      color: var(--c-text-muted);
      white-space: nowrap;
      font-weight: 500;
    }
    .input-with-prefix {
      border-radius: 0 var(--r-md) var(--r-md) 0;
    }

    /* ══════════════════ SKILLS ══════════════════════ */
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 12px;
    }
    .skill-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .skill-number {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: var(--c-mark);
      border: 1px solid rgba(26,86,219,.2);
      color: var(--c-primary);
      font-size: .72rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .btn-remove {
      width: 30px; height: 30px;
      border-radius: 50%;
      border: 1.5px solid var(--c-border);
      background: transparent;
      color: var(--c-text-muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: border-color .2s, color .2s, background .2s;
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
      padding: 8px 14px;
      border: 1.5px dashed var(--c-border);
      border-radius: var(--r-md);
      background: transparent;
      color: var(--c-text-muted);
      font-size: .82rem;
      font-weight: 500;
      cursor: pointer;
      transition: border-color .2s, color .2s, background .2s;
    }
    .btn-add-skill:hover {
      border-color: var(--c-primary);
      color: var(--c-primary);
      background: var(--c-mark);
    }

    /* ══════════════════ ACTIONS ═════════════════════ */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 28px;
      border-top: 1px solid var(--c-border);
      margin-top: 32px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border-radius: var(--r-md);
      font-size: .9rem;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid transparent;
      transition: all .2s ease;
      text-decoration: none;
    }
    .btn-ghost {
      background: transparent;
      color: var(--c-text-muted);
      border-color: var(--c-border);
    }
    .btn-ghost:hover {
      background: var(--c-bg);
      color: var(--c-text);
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
    .btn-disabled {
      opacity: .45;
      pointer-events: none;
    }

    /* ══════════════════ RESPONSIVE ══════════════════ */
    @media (max-width: 640px) {
      .card-header, .card-body { padding: 24px 20px; }
      .fields-row { grid-template-columns: 1fr; }
      .progress-indicator { display: none; }
      .header-inner { flex-direction: column; }
    }
  `]
})
export class InfosComponent implements OnChanges {
  private fb = inject(FormBuilder);
  DataService = inject(DataService);
  infos = input<Infos | null>(null);
  save = output<Infos>();

  profileForm = this.fb.nonNullable.group({
    nom:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    github: [''],
    titre:  ['', [Validators.required, Validators.maxLength(100)]],
    bio:    [''],
    skills: this.fb.array([this.buildSkillControl()]),
  });

  get nom()    { return this.profileForm.get('nom'); }
  get prenom() { return this.profileForm.get('prenom'); }
  get github() { return this.profileForm.get('github'); }
  get titre()  { return this.profileForm.get('titre'); }
  get bio()    { return this.profileForm.get('bio'); }

  ngOnChanges() {
    if (this.infos()) {
      this.profileForm.patchValue({
        nom:    this.infos()!.nom,
        prenom: this.infos()!.prenom,
        github: this.infos()!.github || '',
        titre:  this.infos()!.titre,
        bio:    this.infos()!.bio || '',
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const v = this.profileForm.getRawValue();
    const updated: Infos = {
      ...this.infos()!,
      nom:    v.nom.trim(),
      prenom: v.prenom.trim(),
      titre:  v.titre.trim(),
      bio:    v.bio.trim() || undefined,
    };
    this.save.emit(updated);
  }

  onCancel() { this.profileForm.reset(); }

  buildSkillControl(name = '') {
    return this.fb.nonNullable.control(name, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]);
  }

  addContributorControl(name = '') {
    this.profileForm.controls.skills.push(this.buildSkillControl(name));
  }

  removeContributorControl(index: number) {
    this.profileForm.controls.skills.removeAt(index);
  }
}