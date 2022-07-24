import braintree, {
    BraintreeGateway,
    KeyGatewayConfig,
    ValidatedResponse,
    Transaction,
    ClientToken,
    TransactionRequest
} from 'braintree';
import { ITransactionResponse } from '../components/payment/payment.types';

export default class BraintreeWrapper {

    private gateway: BraintreeGateway;

    constructor() {
        // get the braintree key gateway config from environment, which we set in global environment objecr
        const env: KeyGatewayConfig = environment.braintree;

        // creates a gateway instance using 
        this.gateway = new braintree.BraintreeGateway(env);
    }

    // generate the client token
    public async generateToken(): Promise < string > {
        const result : ValidatedResponse < ClientToken > = await this.gateway.clientToken.generate({});
        const { clientToken } = result;
        return clientToken;
    }

    // make transaction
    public async transaction(request: TransactionRequest): Promise < ITransactionResponse > {
            const result: ValidatedResponse < Transaction > = await this.gateway.transaction.sale(request);

            // extract transaction response keys from result
            const { 
                transaction: {
                    id,
                    status,
                    type,
                    currencyIsoCode,
                    amount,
                    merchantAccountId,
                    orderId,
                    createdAt,
                    updatedAt,
                } 
            } = result;

            // map transaction response keys
            const response: ITransactionResponse = {
                id,
                status,
                type,
                currencyIsoCode,
                amount,
                merchantAccountId,
                orderId,
                createdAt,
                updatedAt,
            };

            return response;
    }


}