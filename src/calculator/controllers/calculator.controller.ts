import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CalculatorService } from '../services/calculator.service';
import { SessionService } from '../services/session.service';
import {
  CalculationRequest,
  CalculationResponse,
  SessionEvent,
} from '../interfaces/calculator.interfaces';

@Controller('calculator')
export class CalculatorController {
  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('stream')
  async streamCalculations(@Res() response: Response): Promise<void> {
    // Set headers for SSE
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no'); // For NGINX proxy buffering

    // Create a new session
    const { sessionId, events } = this.sessionService.createSession();

    // Send session ID as first event
    response.write(
      `data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`,
    );

    // Subscribe to session events
    const subscription = events.subscribe(
      (event: SessionEvent) => {
        response.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      (error) => {
        console.error('SSE error:', error);
        response.end();
      },
      () => {
        response.end();
      },
    );

    // Handle client disconnect
    response.on('close', () => {
      subscription.unsubscribe();
      this.sessionService.closeSession(sessionId);
      console.log(`Client disconnected, session ${sessionId} closed`);
    });
  }

  @Post('calculate/:sessionId')
  calculate(
    @Param('sessionId') sessionId: string,
    @Body() request: CalculationRequest,
  ): CalculationResponse {
    try {
      return this.calculatorService.calculate(sessionId, request);
    } catch (error) {
      // Emit error event to the client
      try {
        const events = this.sessionService.getSessionEvents(sessionId);
        events.next({
          type: 'error',
          data: {
            message: error.message,
            status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          },
        });
      } catch {
        // Session might not exist
      }

      // Re-throw the error for HTTP response
      throw error;
    }
  }

  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    return this.calculatorService.getHistory(sessionId);
  }

  @Get('sessions')
  getAllSessions() {
    return this.sessionService.getAllSessions();
  }
}
