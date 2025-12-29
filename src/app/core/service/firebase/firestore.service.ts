import { Notification } from '../../models/notification.model';
import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/project.model';
import { FieldValue, collection ,doc, Firestore, addDoc, updateDoc, setDoc, query, collectionData, or, orderBy, where, Timestamp, docData, deleteDoc, arrayUnion, getDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { Task } from '../../models/Task.model';
import { Observable } from 'rxjs';
import { Goal } from '../../models/Goal.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  // ...existing code...
  getNotificationsForUser(email: string) {
    const notifColRef = collection(this.fs, this.notificationCol);
    const notifQuery = query(
      notifColRef,
      where('to', '==', email),
      orderBy('createdAt', 'desc')
    );
    return collectionData(notifQuery);
  }
  private fs = inject(Firestore);
  public notificationCol = "notifications";

  public setNotification(notification: Notification) {
    const notifColRef = collection(this.fs, this.notificationCol);
    const notifDocRef = doc(notifColRef, notification.id);
    return setDoc(notifDocRef, notification, { merge: true });
  }
  createDocId = (colName: string) => doc(collection(this.fs, colName)).id;
  projectCol = "projects";

  todoCol = (projectId: string) =>`${this.projectCol}/${projectId}/todos`

  setProject(projet: Project<FieldValue>){
    const projectColRef = collection(this.fs, this.projectCol);
    const projectDocRef = doc(projectColRef, projet.id);
    return setDoc(projectDocRef, projet,{merge:true})
  }

   setTask(projectId: string, t: Task<FieldValue>) {
    const todoColRef = collection(this.fs, this.todoCol(projectId));
    const todoDocRef = doc(todoColRef, t.id);
    return setDoc(todoDocRef, t, { merge: true });
  }

   getProjects(user: User) {
    const projectColRef = collection(this.fs, this.projectCol);
    const queryProjects = query(
      projectColRef,
      or(
        where('uid', '==', user.uid),
        where('contributors', 'array-contains', user.email)
      ),
      orderBy('createdAt', 'desc')
    );
    return collectionData(queryProjects);
  }

   getTodos(projectId: string, todoStatus: string) {
    const todoColRef = collection(this.fs, this.todoCol(projectId));
    const queryTodos = query(
      todoColRef,
      where('status', '==', todoStatus),
      orderBy('createdAt', 'asc')
    );
    return collectionData(queryTodos) as Observable<Task<Timestamp>[]>;
  }

   getDocData(colName: string, id: string) {
    return docData(doc(this.fs, colName, id));
  }

   deleteData(colName: string, id: string) {
    return deleteDoc(doc(this.fs, colName, id));
  }

  getGoals(projectId: string): Observable<Goal[]> {
    const goalsCol = collection(this.fs, `projects/${projectId}/goals`);
    return collectionData(goalsCol, { idField: 'id' }) as Observable<Goal[]>;
  }

  addGoal(projectId: string, goal: Omit<Goal, 'id' | 'progress' | 'createdAt' | 'updatedAt'>) {
    const goalsCol = collection(this.fs, `projects/${projectId}/goals`);
    return addDoc(goalsCol, {
      ...goal,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  linkTaskToGoal(projectId: string, goalId: string, taskId: string) {
    const goalDoc = doc(this.fs, `projects/${projectId}/goals/${goalId}`);
    return updateDoc(goalDoc, {
      linkedTasks: arrayUnion(taskId),
      updatedAt: new Date()
    });
  }

  // Calcul automatique de la progression (appelable périodiquement ou sur update task)
  async updateGoalProgress(projectId: string, goalId: string, tasks: Task<Date>[]) {
    const goalDoc = doc(this.fs, `projects/${projectId}/goals/${goalId}`);
    const goal = await getDoc(goalDoc).then(snap => snap.data() as Goal);

    const linkedTasks = tasks.filter(t => goal.linkedTasks.includes(t.id));
    const completed = linkedTasks.filter(t => t.status === 'done').length;
    const progress = linkedTasks.length > 0 ? Math.round((completed / linkedTasks.length) * 100) : 0;

    return updateDoc(goalDoc, { progress, updatedAt: new Date() });
  }

    formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
  
}
