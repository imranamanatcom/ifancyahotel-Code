import { Controller, Get } from '@nestjs/common';
import { mainService } from './app.service';

@Controller('/root')
export class mainController {

  constructor(private readonly mainService: mainService) {}

  @Get('/')
  getHello(): string {
    return this.mainService.getHello();
  }
}
