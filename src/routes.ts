import * as express from 'express';
import PaymentController from './components/payment/payment.controller';
import SystemStatusController from './components/system-status/system-status.controller';

export default function registerRoutes(app: express.Application): void {
    new SystemStatusController(app);
    new PaymentController(app);
}
