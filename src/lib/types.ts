export type Entity = {
  name: string;
  type: 'Party' | 'Date' | 'Amount' | 'Obligation' | string;
};

export type Clause = {
  id: string;
  title: string;
  text: string;
  entities: Entity[];
};

export type Contract = {
  title: string;
  clauses: Clause[];
};

export type RiskAnalysis = {
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  colorCode: 'red' | 'amber' | 'green';
};

export type Summary = {
  summary: string;
  bulletPoints: string[];
};

export type Explanation = {
  explanation: string;
};
