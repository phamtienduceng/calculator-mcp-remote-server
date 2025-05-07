import { Module } from '@nestjs/common';
import { CalculatorController } from './controllers/calculator.controller';
import { CalculatorService } from './services/calculator.service';
import { SessionService } from './services/session.service';

@Module({
  controllers: [CalculatorController],
  providers: [CalculatorService, SessionService],
  exports: [CalculatorService, SessionService],
})
export class CalculatorModule {}
