import * as fs from 'fs';
import * as path from 'path';
import { config as configDotenv } from 'dotenv';

import { EnvironmentFile, Environments } from './environment.constant';
import { IBraintreeEnvironment, IEnvironment } from './environment.interface';
import braintree from 'braintree';

class Environment implements IEnvironment {

    public port: number;

    public secretKey: string;

    public applyEncryption: boolean;

    public braintree: IBraintreeEnvironment;

    constructor(NODE_ENV?: string) {
      const env: string= NODE_ENV || process.env.NODE_ENV || Environments.DEV;
      const port: string | undefined | number = process.env.PORT || 3146;
      this.setEnvironment(env);
      this.port = Number(port);
      this.applyEncryption = JSON.parse(process.env.APPLY_ENCRYPTION);
      this.secretKey =  process.env.SECRET_KEY;
      this.braintree = this.setBraintreeEnvironment();
    }

    public getCurrentEnvironment(): string {
      let environment: string = process.env.NODE_ENV || Environments.DEV;

      if (!environment) {
        environment = Environments.LOCAL;
      }
      switch (environment) {
        case Environments.PRODUCTION:
          return Environments.PRODUCTION;
        case Environments.DEV:
        case Environments.TEST:
        case Environments.QA:
          return Environments.TEST;
        case Environments.STAGING:
          return Environments.STAGING;
        case Environments.LOCAL:
        default:
          return Environments.LOCAL;
      }
    }

    public setEnvironment(env: string): void {
      let envPath: string;
      const rootdir : string = path.resolve(__dirname, '../../');
      switch (env) {
        case Environments.PRODUCTION:
          envPath = path.resolve(rootdir, EnvironmentFile.PRODUCTION);
          break;
        case Environments.TEST:
          envPath = path.resolve(rootdir, EnvironmentFile.TEST);
          break;
        case Environments.STAGING:
          envPath = path.resolve(rootdir, EnvironmentFile.STAGING);
          break;
        case Environments.LOCAL:
          envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
          break;
        default:
          envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
      }
      if (!fs.existsSync(envPath)) {
        throw new Error('.env file is missing in root directory');
      }
      configDotenv({ path: envPath });
    }

    public isProductionEnvironment(): boolean {
      return this.getCurrentEnvironment() === Environments.PRODUCTION;
    }

    public isDevEnvironment(): boolean {
      return this.getCurrentEnvironment() === Environments.DEV || this.getCurrentEnvironment() === Environments.LOCAL;
    }

    public isTestEnvironment(): boolean {
      return this.getCurrentEnvironment() === Environments.TEST;
    }

    public isStagingEnvironment(): boolean {
      return this.getCurrentEnvironment() === Environments.STAGING;
    }

    /**
     * This sets the braintree environment values
     * environment
     * merchantId
     * privateKey
     * publicKey
     * @returns braintreeEnv
     */
    private setBraintreeEnvironment(): IBraintreeEnvironment {
      let braintreeEnv: IBraintreeEnvironment = {
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.BRAINTREE_MERCHANT_ID,
        privateKey: process.env.BRAINTREE_PRIVATE_KEY,
        publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      };
      braintreeEnv.environment = this.isProductionEnvironment() ?  
        braintree.Environment.Production : 
          this.isStagingEnvironment() ? braintree.Environment.Qa : braintree.Environment.Sandbox;
    
      return braintreeEnv;
    }

}

export default Environment;
