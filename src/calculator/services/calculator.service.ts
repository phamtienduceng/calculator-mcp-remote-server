import { Injectable, BadRequestException } from '@nestjs/common';
import { SessionService } from './session.service';
import {
  CalculationRequest,
  CalculationResult,
  CalculationResponse,
} from '../interfaces/calculator.interfaces';

@Injectable()
export class CalculatorService {
  constructor(private readonly sessionService: SessionService) {}

  calculate(
    sessionId: string,
    request: CalculationRequest,
  ): CalculationResponse {
    const session = this.sessionService.getSession(sessionId);
    const sessionEvents = this.sessionService.getSessionEvents(sessionId);

    let result: number;
    let operationDescription: string;

    switch (request.operation) {
      case 'add':
        if (request.a === undefined || request.b === undefined) {
          throw new BadRequestException(
            'Addition requires both a and b parameters',
          );
        }
        result = request.a + request.b;
        operationDescription = `${request.a} + ${request.b}`;
        break;

      case 'subtract':
        if (request.a === undefined || request.b === undefined) {
          throw new BadRequestException(
            'Subtraction requires both a and b parameters',
          );
        }
        result = request.a - request.b;
        operationDescription = `${request.a} - ${request.b}`;
        break;

      case 'multiply':
        if (request.a === undefined || request.b === undefined) {
          throw new BadRequestException(
            'Multiplication requires both a and b parameters',
          );
        }
        result = request.a * request.b;
        operationDescription = `${request.a} × ${request.b}`;
        break;

      case 'divide':
        if (request.a === undefined || request.b === undefined) {
          throw new BadRequestException(
            'Division requires both a and b parameters',
          );
        }
        if (request.b === 0) {
          throw new BadRequestException('Cannot divide by zero');
        }
        result = request.a / request.b;
        operationDescription = `${request.a} ÷ ${request.b}`;
        break;

      case 'clear':
        result = 0;
        operationDescription = 'clear';
        break;

      default:
        throw new BadRequestException(
          `Unsupported operation: ${request.operation}`,
        );
    }

    const timestamp = new Date().toISOString();

    // Create calculation result
    const calculationResult: CalculationResult = {
      result,
      operation: operationDescription,
      timestamp,
    };

    // Update session
    this.sessionService.updateSession(sessionId, {
      currentValue: result,
      history: [...session.history, calculationResult],
    });

    // Emit calculation event
    sessionEvents.next({
      type: 'calculation',
      data: calculationResult,
    });

    return {
      result,
      sessionId,
      operation: operationDescription,
      timestamp,
    };
  }

  getHistory(sessionId: string): CalculationResult[] {
    const session = this.sessionService.getSession(sessionId);
    const sessionEvents = this.sessionService.getSessionEvents(sessionId);

    // Emit history event
    sessionEvents.next({
      type: 'history',
      data: session.history,
    });

    return session.history;
  }
}
