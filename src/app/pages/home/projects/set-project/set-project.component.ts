import { Component, inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatCardContent } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/service/firebase/auth.service';
import { AsyncPipe } from '@angular/common';
import { user, User } from '@angular/fire/auth';
import { FieldValue, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../../../core/service/firebase/firestore.service';
import { Project } from '../../../../core/models/project.model';


@Component({
  selector: 'app-set-project',
  imports: [ReactiveFormsModule,
     MatDialogModule,
      MatDivider, 
      MatCardContent,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      AsyncPipe
    ],
  templateUrl: './set-project.component.html',
  styles: `
  .contributor-form {
      display: flex;
      gap: 1rem;

      & > mat-form-field {
        flex: 2;
      }
    }
  `
})
export class SetProjectComponent implements OnInit{
    ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue(this.project);
      this.removeContributorControl(0);
      this.project.contributors?.forEach((c) => this.addContributorControl(c));
    }
  }
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snakBar = inject(MatSnackBar)
  private fs = inject(FirestoreService);
  readonly project = inject<Project<FieldValue> | undefined>(MAT_DIALOG_DATA);
  USER$ = this.auth.user;


 projectForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    contributors: this.fb.array([this.contributorFormControl()]),
  });

  contributorFormControl(email?: string) {
    return this.fb.nonNullable.control(email ?? '', [Validators.email]);
  }

  addContributorControl(email?: string) {
    this.projectForm.controls.contributors.push(
      this.contributorFormControl(email)
    );
  }
  removeContributorControl(index: number) {
    this.projectForm.controls.contributors.removeAt(index);
  }

  onSubmit(user:User | null){
     if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const projectCollection = this.fs.projectCol;
    const projectId = this.project
      ? this.project.id
      : this.fs.createDocId(projectCollection);
    const project:Project<FieldValue> = {
      id: projectId,
      uid: user?.uid!,
       createdAt: this.project ? this.project.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.projectForm.getRawValue()
    }

    this.fs.setProject(project);

     const message = this.project
      ? 'projet modifié avec succès'
      : 'projet crée avec succès';
    this.snakBar.open(message,'',{duration:5000});
    this.dialog.closeAll();
  }
}
