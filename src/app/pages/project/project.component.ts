import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import { Project } from '../../core/models/project.model';
import { FieldValue, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/service/firebase/auth.service';
import { FirestoreService } from '../../core/service/firebase/firestore.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { SetProjectComponent } from '../home/projects/set-project/set-project.component';
import { MatCardModule } from '@angular/material/card';
import { SetTodoComponent } from './todo/set-todo.component';
import { Task } from '../../core/models/Task.model';
import { TodoComponent } from "./todo/todo.component";
import {
  // CdkDragDrop,
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  // moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatTooltipModule,
    RouterLink,
    MatDivider,
    DatePipe,
    MatCardModule,
    TodoComponent,
    CdkDropList,
    CdkDrag
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export default class ProjectComponent implements OnInit, OnDestroy{

  id = input('id');
  projectSub?: Subscription;
  project?: Project<Timestamp>;
   readonly title = inject(Title);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  readonly user$ = this.auth.user;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  todos$?: Observable<Task<Timestamp>[]>;
  inProgresses$?: Observable<Task<Timestamp>[]>;
  dones$?: Observable<Task<Timestamp>[]>;

  ngOnInit(): void {
    this.todos$ = this.fs.getTodos(this.id(), 'backlog');
    this.inProgresses$ = this.fs.getTodos(this.id(), 'in-progress');
    this.dones$ = this.fs.getTodos(this.id(), 'done');

    this.projectSub = this.fs
      .getDocData(this.fs.projectCol, this.id())
      .subscribe((project) => {
        this.project = project as Project<Timestamp>;
        this.title.setTitle(`${this.project.title} - ngProject`);
      });
  }

  ngOnDestroy(): void {
    this.projectSub?.unsubscribe();
  }

  formateDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);

  onSetTodo(projectId: string) {
    this.dialog.open(SetTodoComponent, {
      width: '35rem',
      disableClose: true,
      data: { projectId },
    });
  }

  onEditProject(project: Project<Timestamp>) {
   this.dialog.open(SetProjectComponent, { 
     width: "35rem",
     disableClose: true,
     data: project
  });
}

drop(event: CdkDragDrop<Task<Timestamp>[]|null>,status: 'backlog' | 'in-progress' | 'done') {
  if(event.previousContainer !== event.container){
    const task = event.previousContainer.data![
        event.previousIndex
      ] as Task<FieldValue>;

      task.moved = true;
      task.status = status;
      this.fs.setTask(this.id(), task);
  }
}
 onDeleteProject(projectId: string) {
    this.fs.deleteData(this.fs.projectCol, projectId);
    const message = 'Projet suprimé avec succès';
    this.snackBar.open(message, '', { duration: 5000 });
  }

}
