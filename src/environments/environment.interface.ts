

interface IBraintreeEnvironment {
    environment: braintree.Environment,
    merchantId: string,
    publicKey: string,
    privateKey: string
}

interface IEnvironment {
    port: number;
    secretKey: string;
    applyEncryption: boolean;
    braintree: IBraintreeEnvironment;
    getCurrentEnvironment(): string;
    setEnvironment(env: string): void;
    isProductionEnvironment(): boolean;
    isDevEnvironment(): boolean;
    isTestEnvironment(): boolean;
    isStagingEnvironment(): boolean;
}



export { IEnvironment, IBraintreeEnvironment } ;
