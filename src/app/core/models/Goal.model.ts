
export interface Goal {
  id: string;
  uid: string; // ID de l'utilisateur propriétaire
  projectId: string; // ID du projet associé
  title: string;
  description?: string;
  type: 'OKR' | 'KPI'; // Type d'objectif
  status: 'active' | 'paused' | 'completed' | 'archived'; // Statut de l'objectif
  progress: number; // Pourcentage de progression (0-100)
  linkedTasks: string[]; // IDs des tâches liées
  dueDate: any; // Date d'échéance (Firestore Timestamp ou Date)
  createdAt: any; // Date de création (Firestore Timestamp ou Date)
  updatedAt: any; // Date de dernière modification (Firestore Timestamp ou Date)
  priority?: 'low' | 'medium' | 'high';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}