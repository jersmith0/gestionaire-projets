export interface Project<T> {
  id: string;
  title: string;
  description?: string;
  uid: string;
  contributors?: string[];
  archieved?: boolean;
  createdAt: T;
  updatedAt: T;
}
export interface Notification {
  id: string;
  to: string; 
  message: string;
  projectId: string;
  createdAt: any;
  read: boolean;
}

export interface Task<T> {
  id: any;
  uid: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in-progress' | 'done' ;
  moved?: boolean;
  priority: 'low' | 'medium' | 'high';
  goalId?: string;
  createdAt: T;
  updatedAt: T;
}
