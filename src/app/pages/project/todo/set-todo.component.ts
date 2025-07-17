import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/service/firebase/auth.service';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { Task } from '../../../core/models/Task.model';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-set-todo',
  imports: [MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,],
  templateUrl: './set-todo.component.html',
  styles: ``
})
export class SetTodoComponent implements OnInit, OnDestroy{

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  readonly user$ = this.auth.user;
  readonly todo = inject<Task<FieldValue> | undefined>(MAT_DIALOG_DATA);

   ngOnInit(): void {
    if (this.todo?.id) {
      this.todoForm.patchValue(this.todo);
    }
  }
  ngOnDestroy(): void {}
  
  todoForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    priority: ['medium' as 'medium' | 'low' | 'high', [Validators.required]],
  });

  onSubmit(user: User | null) {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const todoCollection = this.fs.todoCol(this.todo?.projectId!);
    const todoId = this.todo?.id
      ? this.todo.id
      : this.fs.createDocId(todoCollection);

    const todoData: Task<FieldValue> = {
      id: todoId,
      uid: user?.uid!,
      projectId: this.todo?.projectId!,
      status: this.todo?.id ? this.todo?.status : 'backlog',
      createdAt: this.todo?.id ? this.todo.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.todoForm.getRawValue(),
    };

    this.fs.setTask(todoData.projectId, todoData);
    const message = this.todo?.id
      ? 'Tâche modifiée avec succès'
      : 'Tâche créée avec succès';
    this.snackBar.open(message, '', { duration: 5000 });
    this.dialog.closeAll();
  }

}
