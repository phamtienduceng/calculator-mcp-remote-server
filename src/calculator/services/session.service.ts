import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import {
  CalculationSession,
  SessionEvent,
} from '../interfaces/calculator.interfaces';

@Injectable()
export class SessionService {
  private sessions: Map<string, CalculationSession> = new Map();
  private sessionEvents: Map<string, Subject<SessionEvent>> = new Map();

  createSession(): { sessionId: string; events: Subject<SessionEvent> } {
    const sessionId = uuidv4();
    const session: CalculationSession = {
      id: sessionId,
      history: [],
      currentValue: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    const eventSubject = new Subject<SessionEvent>();

    this.sessions.set(sessionId, session);
    this.sessionEvents.set(sessionId, eventSubject);

    // Send connected event
    eventSubject.next({
      type: 'connected',
      data: { sessionId, timestamp: new Date().toISOString() },
    });

    return { sessionId, events: eventSubject };
  }

  getSession(sessionId: string): CalculationSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }
    return session;
  }

  getSessionEvents(sessionId: string): Subject<SessionEvent> {
    const events = this.sessionEvents.get(sessionId);
    if (!events) {
      throw new NotFoundException(
        `Session events for ID ${sessionId} not found`,
      );
    }
    return events;
  }

  updateSession(
    sessionId: string,
    updates: Partial<CalculationSession>,
  ): CalculationSession {
    const session = this.getSession(sessionId);
    const updatedSession = {
      ...session,
      ...updates,
      lastUpdated: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  closeSession(sessionId: string): void {
    const events = this.sessionEvents.get(sessionId);
    if (events) {
      events.complete();
      this.sessionEvents.delete(sessionId);
    }
    this.sessions.delete(sessionId);
  }

  getAllSessions(): CalculationSession[] {
    return Array.from(this.sessions.values());
  }
}
