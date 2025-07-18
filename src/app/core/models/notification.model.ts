export interface Notification {
  id: string;
  to: string; // email du destinataire
  message: string;
  projectId: string;
  createdAt: any;
  read: boolean;
}
