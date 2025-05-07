export interface CalculationResult {
  result: number;
  operation: string;
  timestamp: string;
}

export interface CalculationSession {
  id: string;
  history: CalculationResult[];
  currentValue: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface CalculationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'clear';
  a?: number;
  b?: number;
}

export interface CalculationResponse {
  result: number;
  sessionId: string;
  operation: string;
  timestamp: string;
}

export interface SessionEvent {
  type: 'calculation' | 'error' | 'connected' | 'history';
  data: any;
}
