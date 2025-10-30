import api from './api';

export interface UploadResponse {
  count: number;
  documents: Array<{
    _id: string;
    nomFichier: string;
    cheminStockage: string;
    typeDocument: string;
    mimeType: string;
    taille: number;
  }>;
}

export const uploadsService = {
  async uploadEmargements(sessionId: string, files: File[], uploadedBy?: string): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (uploadedBy) formData.append('uploadedBy', uploadedBy);

    const response = await api.post(`/uploads/sessions/${sessionId}/emargements`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadJustificatifs(sessionId: string, files: File[], etudiantId?: string, uploadedBy?: string): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (etudiantId) formData.append('etudiantId', etudiantId);
    if (uploadedBy) formData.append('uploadedBy', uploadedBy);

    const response = await api.post(`/uploads/sessions/${sessionId}/justificatifs`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getDownloadUrl(documentId: string): string {
    const baseURL = api.defaults.baseURL || 'http://localhost:4000/api/v1';
    return `${baseURL}/documents/${documentId}/download`;
  },
};

