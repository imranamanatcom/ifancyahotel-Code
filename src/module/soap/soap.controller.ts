import { 
  Body, Controller, Get , Post , HttpCode , HttpStatus, Query, ValidationPipe ,Render } from "@nestjs/common";
import { SoapService } from './soap.service';
const passport = require('passport');

@Controller('/soap')
export class soapController {
  constructor(private readonly appService: SoapService) {}

  @Get('/')
  @Render('index')
  public soapHome(@Body() body: any): string {
    return this.appService.getHello(body);
  }


  @Get('/google')
  @Render('google')
  public soapGoogle(@Body() body: any, ): string {

    return passport.authenticate('google', { scope:
        [ 'email', 'profile' ]
    })

  }

}
