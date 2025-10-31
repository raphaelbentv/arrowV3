export type EvaluationType = 'controle_continu' | 'examen_final' | 'projet' | 'participation';

export interface ModuleCours {
  _id?: string;
  nom: string;
  code: string;
  descriptionCourte?: string;
  nombreHeuresTotal?: number;
  coefficient?: number;
  intervenantPrincipalId?: string;
  semestre?: string;
  typeEvaluationPrincipal?: EvaluationType;
  poidsEvaluation?: number; // 0..1
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

