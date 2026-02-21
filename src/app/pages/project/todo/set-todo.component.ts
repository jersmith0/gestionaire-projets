// src/app/dialogs/set-todo/set-todo.component.ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { Task } from '../../../core/models/Task.model';
import { Goal } from '../../../core/models/Goal.model';
import { Observable, take } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-set-todo',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './set-todo.component.html',
  styles: [`
    .full-width { width: 100%; }
  `]
})
export class SetTodoComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);

  readonly user$ = this.auth.user;
  readonly todo = inject<Task<FieldValue> | undefined>(MAT_DIALOG_DATA);

  // Liste des goals du projet courant
  goals$!: Observable<Goal[]>;

  // Stocker l'ancien goalId pour gérer les changements
  private previousGoalId: string | null = null;

  todoForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    priority: ['medium' as 'low' | 'medium' | 'high', [Validators.required]],
    goalId: [null as string | null] // Champ pour lier au goal
  });

  ngOnInit(): void {
    const projectId = this.todo?.projectId;
    if (!projectId) {
      console.error('❌ Aucun projectId disponible');
      return;
    }

    // Charge les goals du projet
    this.goals$ = this.fs.getGoals(projectId);

    if (this.todo?.id) {
      // Stocker l'ancien goalId pour détecter les changements
      this.previousGoalId = this.todo.goalId || null;

      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description,
        priority: this.todo.priority,
        goalId: this.todo.goalId || null
      });
    }
  }

  ngOnDestroy(): void {}

  // Dans SetTodoComponent - CORRECTION
async onSubmit() {
  if (this.todoForm.invalid) {
    this.todoForm.markAllAsTouched();
    return;
  }

  const user = await this.auth.user.pipe(take(1)).toPromise();
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  const projectId = this.todo?.projectId!;
  const todoId = this.todo?.id || this.fs.createDocId(this.fs.todoCol(projectId));

  const formValue = this.todoForm.getRawValue();
  const newGoalId = formValue.goalId;

  const todoData: Task<FieldValue> = {
    id: todoId,
    uid: user.uid,
    projectId,
    status: this.todo?.id ? (this.todo.status as 'backlog' | 'in-progress' | 'done') : 'backlog',
    createdAt: this.todo?.id ? this.todo.createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
    title: formValue.title,
    description: formValue.description,
    priority: formValue.priority,
    goalId: newGoalId || undefined
  };

  try {
    // 1. IMPORTANT : D'abord sauvegarder la tâche et ATTENDRE
    console.log('💾 Sauvegarde de la tâche:', todoId);
    await this.fs.setTask(projectId, todoData);
    console.log('✅ Tâche sauvegardée dans Firestore');

    // 2. PUIS lier au goal (maintenant la tâche existe)
    if (this.todo?.id) {
      // Modification d'une tâche existante
      if (this.previousGoalId !== newGoalId) {
        if (this.previousGoalId) {
          try {
            await this.fs.unlinkTaskFromGoal(todoId, this.previousGoalId);
            console.log(`✅ Tâche déliée de l'ancien goal`);
          } catch (error) {
            console.warn(`⚠️ Impossible de délier l'ancien goal:`, error);
          }
        }

        if (newGoalId) {
          console.log(`🔗 Liaison de la tâche ${todoId} au goal ${newGoalId}`);
          await this.fs.linkTaskToGoal(todoId, newGoalId);
          console.log(`✅ Tâche liée au nouveau goal`);
        }
      }
    } else {
      // Création d'une nouvelle tâche
      if (newGoalId) {
        console.log(`🔗 Liaison de la nouvelle tâche ${todoId} au goal ${newGoalId}`);
        
        // Attendre un petit délai pour être sûr que Firestore a bien enregistré
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.fs.linkTaskToGoal(todoId, newGoalId);
        console.log(`✅ Nouvelle tâche liée au goal`);
      }
    }

    const message = this.todo?.id ? 'Tâche modifiée' : 'Tâche créée';
    this.snackBar.open(message + ' avec succès', '', { duration: 5000 });
    this.dialog.closeAll();
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    this.snackBar.open('Erreur: ' + (error as any).message, '', { duration: 5000 });
  }
}
}