import { Notification } from '../../models/notification.model';
import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/project.model';
import { FieldValue, collection, doc, Firestore, addDoc, updateDoc, setDoc, query, collectionData, or, orderBy, where, Timestamp, docData, deleteDoc, arrayUnion, getDoc, collectionGroup, getDocs, arrayRemove, serverTimestamp, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { Task } from '../../models/Task.model';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Goal } from '../../models/Goal.model';
import { Infos } from '../../models/infos.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  async updateGoalStatus(id: string, newStatus: string): Promise<void> {
  try {
    const goalRef = doc(this.fs, 'goals', id);
    await updateDoc(goalRef, { 
      status: newStatus,
      updatedAt: new Date()
    });
    console.log(`✅ Statut du goal ${id} mis à jour: ${newStatus}`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
}
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
  projectCol = "projects";
infoCol = collection(this.fs, 'infos'); // ou le nom de ta collection

createDocId(path: string): string {
  const colRef = collection(this.fs, path);
  return doc(colRef).id;
}

  todoCol = (projectId: string) =>`${this.projectCol}/${projectId}/todos`


  setProject(projet: Project<FieldValue>){
    const projectColRef = collection(this.fs, this.projectCol);
    const projectDocRef = doc(projectColRef, projet.id);
    return setDoc(projectDocRef, projet,{merge:true})
  }

  setInfo(info: Infos) {
  const infoColRef = collection(this.fs, 'infos');
  const infoDocRef = doc(infoColRef, info.id);
  return setDoc(infoDocRef, info, { merge: true });
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

  

  getAllGoals(): Observable<Goal[]> {
    const goalsQuery = query(collectionGroup(this.fs, 'goals'));
    return collectionData(goalsQuery, { idField: 'id' }) as Observable<Goal[]>;
  }
async updateGoalProgressFromTask(projectId: string, task: Task<any>) {
  if (!task.goalId) return;

  const goalDoc = doc(this.fs, `projects/${projectId}/goals/${task.goalId}`);
  const goalSnap = await getDoc(goalDoc);
  if (!goalSnap.exists()) return;

  const goal = goalSnap.data() as Goal;
  const tasksSnap = await getDocs(query(
    collection(this.fs, `projects/${projectId}/tasks`),
    where('goalId', '==', task.goalId)
  ));

  const linkedTasks = tasksSnap.docs.map(d => d.data() as Task<any>);
  const completed = linkedTasks.filter(t => t.status === 'done').length;
  const progress = linkedTasks.length > 0 ? Math.round((completed / linkedTasks.length) * 100) : 0;

  await updateDoc(goalDoc, { progress });
}


  // linkTaskToGoal(projectId: string, goalId: string, taskId: string) {
  //   const goalDoc = doc(this.fs, `projects/${projectId}/goals/${goalId}`);
  //   return updateDoc(goalDoc, {
  //     linkedTasks: arrayUnion(taskId),
  //     updatedAt: new Date()
  //   });
  // }
  // Dans votre FirestoreService
getAllProjects(): Observable<Project<any>[]> {
  const projectsRef = collection(this.fs, 'projects');
  return collectionData(projectsRef, { idField: 'id' }).pipe(
    map(data => data as Project<any>[])
  );
}

getAllTasks(): Observable<Task<any>[]> {
  const tasksRef = collection(this.fs, 'tasks');
  return collectionData(tasksRef, { idField: 'id' }).pipe(
    map(data => data as Task<any>[])
  );
}

    formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
  

    ////////////////////////////////
    // src/app/core/service/firebase/firestore.service.ts

// ============================================
// MÉTHODES POUR LIER/DÉLIER TÂCHES ET GOALS
// ============================================

/**
 * Lie une tâche à un goal
 * @param taskId - ID de la tâche
 * @param goalId - ID du goal
 */
// Dans FirestoreService
async linkTaskToGoal(taskId: string, goalId: string): Promise<void> {
  try {
    console.log(`🔗 Tentative de liaison: tâche ${taskId} → goal ${goalId}`);
    
    // 1. Vérifier que le goal existe
    const goalRef = doc(this.fs, 'goals', goalId);
    const goalSnap = await getDoc(goalRef);
    
    if (!goalSnap.exists()) {
      throw new Error(`Le goal ${goalId} n'existe pas`);
    }
    console.log(`✅ Goal ${goalId} trouvé`);

    // 2. Vérifier que la tâche existe (NOUVEAU)
    const taskRef = doc(this.fs, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (!taskSnap.exists()) {
      throw new Error(`La tâche ${taskId} n'existe pas encore dans Firestore`);
    }
    console.log(`✅ Tâche ${taskId} trouvée`);

    // 3. Mettre à jour le goal avec arrayUnion
    await updateDoc(goalRef, {
      linkedTasks: arrayUnion(taskId),
      updatedAt: new Date()
    });
    console.log(`✅ LinkedTasks mis à jour dans le goal`);

    // 4. Mettre à jour la tâche avec le goalId
    await updateDoc(taskRef, {
      goalId: goalId,
      updatedAt: new Date()
    });
    console.log(`✅ GoalId mis à jour dans la tâche`);
    
    console.log(`✅ Liaison complète: tâche ${taskId} ↔ goal ${goalId}`);
  } catch (error) {
    console.error('❌ Erreur lors de la liaison tâche-goal:', error);
    throw error;
  }
}

/**
 * Délie une tâche d'un goal
 * @param taskId - ID de la tâche
 * @param goalId - ID du goal
 */
async unlinkTaskFromGoal(taskId: string, goalId: string): Promise<void> {
  try {
    const goalRef = doc(this.fs, 'goals', goalId);
    
    // Utiliser arrayRemove pour retirer l'ID
    await updateDoc(goalRef, {
      linkedTasks: arrayRemove(taskId),
      updatedAt: new Date()
    });

    // Retirer le goalId de la tâche
    const taskRef = doc(this.fs, 'tasks', taskId);
    await updateDoc(taskRef, {
      goalId: null,
      updatedAt: new Date()
    });
    
    console.log(`✅ Tâche ${taskId} détachée du goal ${goalId}`);
  } catch (error) {
    console.error('❌ Erreur lors du détachement tâche-goal:', error);
    throw error;
  }
}

/**
 * Lie plusieurs tâches à un goal en une seule opération
 * @param taskIds - Array d'IDs de tâches
 * @param goalId - ID du goal
 */
async linkMultipleTasksToGoal(taskIds: string[], goalId: string): Promise<void> {
  try {
    const goalRef = doc(this.fs, 'goals', goalId);
    
    // Ajouter tous les IDs en une seule opération
    await updateDoc(goalRef, {
      linkedTasks: arrayUnion(...taskIds),
      updatedAt: new Date()
    });

    // Mettre à jour toutes les tâches
    const updatePromises = taskIds.map(taskId => {
      const taskRef = doc(this.fs, 'tasks', taskId);
      return updateDoc(taskRef, {
        goalId: goalId,
        updatedAt: new Date()
      });
    });

    await Promise.all(updatePromises);
    
    console.log(`✅ ${taskIds.length} tâches liées au goal ${goalId}`);
  } catch (error) {
    console.error('❌ Erreur lors de la liaison multiple:', error);
    throw error;
  }
}

/**
 * Récupère toutes les tâches liées à un goal
 * @param goalId - ID du goal
 * @returns Observable des tâches
 */
getTasksByGoalId(goalId: string): Observable<Task<any>[]> {
  const tasksRef = collection(this.fs, 'tasks');
  const q = query(tasksRef, where('goalId', '==', goalId));
  
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => data as Task<any>[])
  );
}


async addGoal(projectId: string, goalData: Partial<Goal>): Promise<string> {
  try {
    console.log('🎯 Création du goal pour le projet:', projectId);
    console.log('📝 Données du goal:', goalData);
    
    const goalsRef = collection(this.fs, 'goals');
    
    const newGoal = {
      ...goalData,
      projectId,
      linkedTasks: goalData.linkedTasks || [],
      progress: goalData.progress || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // 1. Créer le document
    const docRef = await addDoc(goalsRef, newGoal);
    console.log('✅ Document créé avec l\'ID:', docRef.id);
    
    // 2. IMPORTANT : Ajouter l'ID dans le document lui-même
    await updateDoc(docRef, { 
      id: docRef.id 
    });
    
    console.log('✅ Goal créé et sauvegardé avec succès:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création du goal:', error);
    throw error;
  }
}

// Dans FirestoreService
getGoals(projectId: string): Observable<Goal[]> {
  const goalsRef = collection(this.fs, 'goals');
  const q = query(goalsRef, where('projectId', '==', projectId));
  
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => {
      const goals = data as Goal[];
      console.log('🎯 Goals récupérés:', goals);
      
      // Vérifier que chaque goal a bien un ID
      goals.forEach(goal => {
        if (!goal.id) {
          console.error('⚠️ Goal sans ID détecté:', goal);
        }
      });
      
      return goals;
    })
  );
}


// Dans FirestoreService - Assurez-vous que setTask ressemble à ça
async setTaskaa(projectId: string, task: Task<any>): Promise<void> {
  try {
    const taskRef = doc(this.fs, 'tasks', task.id);
    
    console.log('💾 Enregistrement de la tâche:', task.id);
    
    // Utiliser setDoc avec merge pour créer ou mettre à jour
    await setDoc(taskRef, task, { merge: true });
    
    console.log('✅ Tâche enregistrée dans Firestore:', task.id);
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la tâche:', error);
    throw error;
  }
}

async setTask(projectId: string, task: Task<FieldValue>) {
  try {
    const todoColRef = collection(this.fs, this.todoCol(projectId));
    const todoDocRef = doc(todoColRef, task.id);
    await setDoc(todoDocRef, task, { merge: true });
    console.log('✅ Tâche enregistrée dans Firestore:', task.id);

    return setDoc(todoDocRef, task, { merge: true })
  }catch(error){
    console.error('❌ Erreur lors de l\'enregistrement de la tâche:', error);

  };
  }

  async setTaskw(projectId: string, task: Task<any>): Promise<void> {
  try {
    if (!projectId) {
      throw new Error('projectId est requis');
    }

    // Chemin : projects/{projectId}/tasks/{taskId}
    const tasksColRef = collection(this.fs, `projects/${projectId}/todos`);
    const taskRef = doc(tasksColRef, task.id);
    console.log('💾 Enregistrement tâche dans projet:', projectId, 'tâche:', task.id);
    // { merge: true } pour mise à jour partielle si la tâche existe déjà
    await setDoc(taskRef, task, { merge: true });

    console.log('✅ Tâche enregistrée avec succès');
  } catch (error) {
    console.error('❌ Erreur enregistrement tâche:', error);
    throw error;
  }
}

// Dans FirestoreService - VERSION UNIFIÉE
async setTasko(projectId: string, task: Task<any>): Promise<void> {
  try {
    // Utiliser la collection globale 'tasks'
    const taskRef = doc(this.fs, 'tasks', task.id);
    
    console.log('💾 Enregistrement de la tâche:', task.id);
    
    // Préparer les données avec timestamp
    const taskData = {
      ...task,
      projectId, // S'assurer que le projectId est bien là
      updatedAt: serverTimestamp()
    };
    
    // Si c'est une nouvelle tâche, ajouter createdAt
    if (!task.createdAt) {
      taskData.createdAt = serverTimestamp();
    }
    
    // Utiliser setDoc avec merge
    await setDoc(taskRef, taskData, { merge: true });
    
    console.log('✅ Tâche enregistrée dans Firestore:', task.id);
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la tâche:', error);
    throw error;
  }
}


// Dans FirestoreService
getTasks(projectId: string): Observable<Task<any>[]> {
  // Utiliser la collection globale avec un filtre sur projectId
  const tasksRef = collection(this.fs, 'tasks');
  const q = query(tasksRef, where('projectId', '==', projectId));
  
  return collectionData(q, { idField: 'id' }).pipe(
    map(data => {
      console.log('📋 Tâches chargées pour le projet', projectId, ':', data.length);
      return data as Task<any>[];
    })
  );
}


// Dans FirestoreService.ts



// Converter Infos
infosConverter: FirestoreDataConverter<Infos> = {
  toFirestore: (data: Infos) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): Infos => ({
    id: snap.id,
    ...snap.data() as Omit<Infos, 'id'>,
  }),
};

// Converter Project (avec Timestamp comme type générique)
 projectConverter: FirestoreDataConverter<Project<Timestamp>> = {
  toFirestore: (data: Project<Timestamp>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): Project<Timestamp> => ({
    id: snap.id,
    ...snap.data() as Omit<Project<Timestamp>, 'id'>,
  }),
};

// Méthode getUserProfile
getUserProfile(uid: string): Observable<Infos | null> {
  if (!uid) {
    return of(null);
  }

  const profileRef = doc(this.fs, 'infos', uid).withConverter(this.infosConverter);

  return docData<Infos>(profileRef).pipe(
    map(data => data ?? null)  // ← transforme undefined → null
  );
}

// Méthode getUserProjects
getUserProjects(uid: string): Observable<Project<Timestamp>[]> {
  if (!uid) {
    return of([] as Project<Timestamp>[]); // Typage explicite pour éviter l'erreur never[]
  }

  const projectsQuery = query(
    collection(this.fs, 'projects').withConverter(this.projectConverter),
    where('uid', '==', uid)
  );

  return collectionData<Project<Timestamp>>(projectsQuery, { idField: 'id' });
}
}
