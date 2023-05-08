import { Module } from '@nestjs/common';
import { soapController } from "./soap.controller";
import { SoapService } from "./soap.service";
import { SoapRepo} from "./soap.repo";

@Module({
  imports: [],
  controllers: [soapController],
  providers: [SoapService, SoapRepo],
})
export class SoapModule {}
