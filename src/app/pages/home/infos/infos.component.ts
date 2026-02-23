import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Infos } from '../../../core/models/infos.model';
import { DataService } from '../../../core/service/firebase/data.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile-infos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="w-full bg-slate-950/75 backdrop-blur-lg rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-6 md:py-8 border-b border-slate-800/50 text-center">
       <div class="pt-8 md:pt-12 lg:pt-16">  <!-- ← espace en haut (progressif selon écran) -->
  <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent text-center">
    Mon profil
  </h2>
</div>
        <p class="mt-3 text-slate-400 text-lg">
          Ces informations seront visibles sur votre profil public.
        </p>
      </div>

      <!-- Formulaire pleine largeur -->
      <div class="p-6 md:p-10">
        <form [formGroup]="profileForm"  class="space-y-8 max-w-4xl mx-auto">
          <!-- Nom + Prénom côte à côte sur desktop -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nom -->
            <mat-form-field appearance="outline" class="w-full" floatLabel="always">
              <input 
              [ngModel]="DataService.Donneenom()"
              (ngModelChange)="DataService.Donneenom.set($event)"
                matInput 
                formControlName="nom"
                placeholder="Votre nom "
                required
                class="text-white text-lg py-3"
              />
              <mat-icon matPrefix class="text-violet-400 mr-3">person</mat-icon>
              @if (nom?.hasError('required') && nom?.touched) {
                <mat-error class="text-red-400">Le nom est obligatoire</mat-error>
              }
              @if (nom?.hasError('minlength') && nom?.touched) {
                <mat-error class="text-red-400">Minimum 2 caractères</mat-error>
              }
            </mat-form-field>

            <!-- Prénom -->
            <mat-form-field appearance="outline" class="w-full" floatLabel="always">
              <input 
              [ngModel]="DataService.Donneeprenom()"
              (ngModelChange)="DataService.Donneeprenom.set($event)"
                matInput 
                formControlName="prenom"
                placeholder="Votre prénom"
                required
                class="text-white text-lg py-3"
              />
              <mat-icon matPrefix class="text-violet-400 mr-3">person_outline</mat-icon>
              @if (prenom?.hasError('required') && prenom?.touched) {
                <mat-error class="text-red-400">Le prénom est obligatoire</mat-error>
              }
              @if (prenom?.hasError('minlength') && prenom?.touched) {
                <mat-error class="text-red-400">Minimum 2 caractères</mat-error>
              }
            </mat-form-field>
             <mat-form-field appearance="outline" class="w-full" floatLabel="always" >
              <input 
              [ngModel]="DataService.Donneeurl()"
              (ngModelChange)="DataService.Donneeurl.set($event)"
                matInput 
                formControlName="github"
                placeholder="LIen github"
                required
                class="text-white text-lg py-3"
              />
            </mat-form-field>

       <div formArrayName="skills" class="space-y-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <!-- <span class="material-icons text-violet-400">group_add</span> -->
          Outils/frameworks maitrises
        </h4>
        <span class="text-sm text-slate-500">
          {{ profileForm.controls.skills.controls.length }} / 5
        </span>
      </div>

      @let contributorControls = profileForm.controls.skills.controls;
      @for (control of contributorControls; track $index) {
        <div class="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 ">
          <mat-form-field appearance="outline" class="w-full" floatLabel="always">
            <input 
                [ngModel]="DataService.Donneeskills()"
              (ngModelChange)="DataService.Donneeskills.set($event)"
              matInput 
              type="text" 
              placeholder="Ex: React"
              [formControlName]="$index"
              class="text-white"
            />
            <!-- @if (control.hasError('email') && control.touched) {
              <mat-error class="text-red-400">Email invalide</mat-error>
            }
            @if (control.hasError('required') && control.touched) {
              <mat-error class="text-red-400">Email requis</mat-error>
            } -->
          </mat-form-field>

          @if ($index > 0) {
            <button 
              mat-icon-button 
              color="warn" 
              (click)="removeContributorControl($index)"
              matTooltip="Supprimer"
              class="hover:bg-red-900/30 transition-colors">
              <mat-icon>delete</mat-icon>
            </button>
          }
        </div>
      }

      @if (contributorControls.length < 5) {
        <div class="text-right">
          <button 
            mat-stroked-button 
            color="primary"
            (click)="addContributorControl()"
            class="border-violet-600 text-violet-400 hover:bg-violet-950/30 hover:border-violet-500 transition-all">
            <mat-icon class="mr-2">person_add</mat-icon>
            Ajouter un outil
          </button>
        </div>
      }
    </div>
    
          </div>

          <!-- Titre professionnel -->
          <mat-form-field appearance="outline" class="w-full" floatLabel="always">
            <input 
            [ngModel]="DataService.Donneetitre()"
              (ngModelChange)="DataService.Donneetitre.set($event)"
              matInput 
              formControlName="titre"
              placeholder=" Titre professionnel   Ex: Développeur Full-Stack | Designer UI/UX"
              required
              class="text-white text-lg py-3"
            />
            <mat-icon matPrefix class="text-cyan-400 mr-3">work</mat-icon>
            <mat-hint class="text-slate-500">Ce qui apparaît sur votre profil public</mat-hint>
            @if (titre?.hasError('required') && titre?.touched) {
              <mat-error class="text-red-400">Le titre est obligatoire</mat-error>
            }
          </mat-form-field>

          <!-- Bio -->
          <mat-form-field appearance="outline" class="w-full" floatLabel="always">
            <textarea 
            [ngModel]="DataService.Donneebio()"
              (ngModelChange)="DataService.Donneebio.set($event)"
              matInput 
              formControlName="bio"
              rows="6"
              placeholder="Parlez de vous, vos passions, vos compétences, votre parcours..."
              class="text-white text-lg py-3 resize-y min-h-[140px]"
            ></textarea>
            <mat-icon matPrefix class="text-violet-400 mr-3">info</mat-icon>
            <!-- <mat-hint align="end" class="text-slate-500">
              {{ bio?.value?.length || 0 }}/500 caractères
            </mat-hint> -->
          </mat-form-field>

          <!-- Boutons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-slate-800/50">
            <button 
              type="button"
              mat-stroked-button
              class="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 transition-all px-8 py-3"
              (click)="onCancel()"
            >
              Annuler
            </button>

            <button
            type="button"
              routerLink="/visual"
              mat-flat-button
              [disabled]="profileForm.invalid || profileForm.pristine"
              class="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium px-10 py-3 rounded-xl shadow-lg hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
            >
              <span class="material-icons text-xl group-hover:scale-110 transition-transform">visibility</span>
              Previsualiser
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class InfosComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  DataService = inject(DataService)
  infos = input<Infos | null>(null);
  save = output<Infos>();

  profileForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    skills: this.fb.array([this.contributorFormControl()]),

    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    github:[''],
    titre: ['', [Validators.required, Validators.maxLength(100)]],
    bio: [''],
  });

  get nom() { return this.profileForm.get('nom'); }
  get prenom() { return this.profileForm.get('prenom'); }
  get github() { return this.profileForm.get('github'); }
  get skills() { return this.profileForm.get('skills'); }
  get titre() { return this.profileForm.get('titre'); }
  get bio() { return this.profileForm.get('bio'); }

  ngOnChanges() {
    if (this.infos()) {
      this.profileForm.patchValue({
        nom: this.infos()!.nom,
        prenom: this.infos()!.prenom,
        github: this.infos()!.github || '',
        // skills: this.infos()!.skills || '',
        titre: this.infos()!.titre,
        bio: this.infos()!.bio || '',
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'OK', { duration: 4000 });
      return;
    }

    const formValue = this.profileForm.getRawValue();
    const updatedInfos: Infos = {
      ...this.infos()!, // conserve id, uid, etc.
      nom: formValue.nom.trim(),
      prenom: formValue.prenom.trim(),
      titre: formValue.titre.trim(),
      bio: formValue.bio.trim() || undefined,
    };

    this.save.emit(updatedInfos);
    this.snackBar.open('Informations enregistrées avec succès', 'OK', { duration: 5000 });
  }

  onCancel() {
    // Reset ou ferme le composant/dialogue
    this.profileForm.reset();
  }

  contributorFormControl(name: string = '') {
  return this.fb.nonNullable.control(name.trim(), [
    Validators.required,
    Validators.minLength(2),          // optionnel : au moins 2 caractères pour un nom
    Validators.maxLength(100)         // optionnel : limite raisonnable
  ]);
}

  addContributorControl(name: string = '') {
  const control = this.contributorFormControl(name);
  this.profileForm.controls.skills.push(control);
}

   removeContributorControl(index: number) {
    this.profileForm.controls.skills.removeAt(index);
  }
}