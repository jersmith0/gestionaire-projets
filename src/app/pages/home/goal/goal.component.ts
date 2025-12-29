import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goal } from '../../../core/models/Goal.model';
import { FirestoreService } from '../../../core/service/firebase/firestore.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [CommonModule, ProgressBarModule, ButtonModule],
  template: `
    <h2>Goals / OKRs</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (goal of goals; track goal.id) {
        <div class="p-card p-4">
          <h3>{{ goal.title }}</h3>
          <p class="text-sm text-surface-500">{{ goal.type }} – Due: {{ goal.dueDate | date }}</p>
          <p-progressbar [value]="goal.progress" [showValue]="true"></p-progressbar>
          <p class="text-sm mt-2">Tâches liées : {{ goal.linkedTasks.length }}</p>
        </div>
      }
    </div>
    <button pButton label="Ajouter un Goal" icon="pi pi-plus" class="mt-4" (click)="addGoal()"></button>
  `
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  private service = inject(FirestoreService);

  ngOnInit() {
    // Exemple : charger pour le projet courant
    const projectId = 'current-project-id'; // Remplace par ton logic
    this.service.getGoals(projectId).subscribe(goals => {
      this.goals = goals;
    });
  }

  addGoal() {
    const projectId = 'current-project-id';
    const newGoal = {
      title: 'Nouveau OKR',
      type: 'OKR',
      linkedTasks: [],
      dueDate: new Date()
    };
    this.service.addGoal(projectId, newGoal);
  }
}