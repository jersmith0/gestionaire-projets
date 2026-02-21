import { Component, inject } from '@angular/core';
import { ProjectListComponent } from "./project-list/project-list.component";
import { MatButtonModule } from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import { SetProjectComponent } from './set-project/set-project.component';

@Component({
  selector: 'app-projects',
  imports: [ProjectListComponent,MatButtonModule],
  template: `
      <!-- <button mat-flat-button (click)="onNewProject()">Nouveau projet</button> -->
    <app-project-list />
  `,
  styles: ``
})
export default class ProjectsComponent {
  // dialog =inject(MatDialog);
  // onNewProject(){
  //    this.dialog.open(SetProjectComponent, { 
  //    width: "35rem",
  //    disableClose: true,
  // });
  // }
}
