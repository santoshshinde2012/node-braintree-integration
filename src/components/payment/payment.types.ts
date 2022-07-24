
export interface IClientToken {
    clientToken: string;
}

export interface ITransactionRequest {
    amount: string;
    paymentMethodNonce?: string | undefined;
    deviceData?: string | undefined;
    options?:
    | {
        submitForSettlement?: boolean | undefined;
        storeInVault?: boolean | undefined;
    } | undefined;
}

export interface ITransactionResponse {
    id: string;
    status : string;
    type: string;
    currencyIsoCode: string;
    amount: string;
    merchantAccountId: string;
    orderId: string;
    createdAt: string;
    updatedAt: string;
}