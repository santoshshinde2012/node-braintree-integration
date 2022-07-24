import { Application, NextFunction, Request, Response } from 'express';
import * as os from 'os';
import * as process from 'process';
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import * as responsehandler from '../../lib/response-handler';
import BaseApi from '../BaseApi';
import BraintreeWrapper from '../../lib/braintree';
import { IClientToken, ITransactionRequest, ITransactionResponse } from './payment.types';

/**
 * Payment controller
 */
export default class PaymentController extends BaseApi {

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {

        // base route path {host}:/api/payment
        express.use('/api/payment', this.router);

        // generate-token {host}:/api/payment/generate-token
        this.router.get('/generate-token', this.generateToken);

        // checkout  {host}:/api/payment/checkout
        this.router.post('/checkout', this.checkout);
    }


    /**
     * to generate the token for client
     * @param req 
     * @param res 
     * @param next 
     */
    public async generateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const braintreeWrapper = new BraintreeWrapper()
            const clientToken = await braintreeWrapper.generateToken();
            const response: IClientToken = {
                clientToken
            };
            res.locals.data = response;
            responsehandler.send(res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * To checkout the transaction
     * @param req 
     * req.body.amount
     * req.body.nonceFromTheClient
     * req.body.deviceDataFromTheClient
     * @param res 
     * @param next 
     */
    public async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { amount, paymentMethodNonce, deviceDataFromTheClient } = req.body
            const transactionRequest: ITransactionRequest = {
                amount,
                paymentMethodNonce,
                deviceData: deviceDataFromTheClient,
                options: {
                  submitForSettlement: true,
                  storeInVault: true
                }
            };
            const braintreeWrapper = new BraintreeWrapper()
            const result: ITransactionResponse = await braintreeWrapper.transaction(transactionRequest);
            res.locals.data = result;
            responsehandler.send(res);
        } catch (err) {
            next(err);
        }
    }
}
