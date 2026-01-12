// src/app/core/service/current-project.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentProjectService {
  private projectIdSubject = new BehaviorSubject<string | null>(null);
  projectId$ = this.projectIdSubject.asObservable();

  setProjectId(projectId: string | null) {
    this.projectIdSubject.next(projectId);
  }

  clearProjectId() {
    this.projectIdSubject.next(null);
  }
}