import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class mainService {

  
  public config: { get: (arg0: string) => any; }
  
  getHello(): string {

    

    const databaseName: string = this.config.get('DATABASE_NAME');
    console.log({ databaseName });

    return databaseName;
  }
}
