import {
  Body, Controller, Get , Post , HttpCode , HttpStatus, Query, ValidationPipe ,  UploadedFile, UseInterceptors, Req} from "@nestjs/common";
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/users')
export class usersController {
  constructor(private readonly appService: UsersService) {}

  @Post('/SignUp')
  public SignUp(@Body() body: any): string {
    return this.appService.SignUp(body);
  }

  @Post('/SignIn')
  public SignIn(@Body() body: any): string {
    return this.appService.SignIn(body);
  }

  @Post('/MyTrips')
  public MyTrips(@Body() body: any): Promise<unknown> {
    return this.appService.MyTrips(body);
  }

  @Post('/MyTripsMobile')
  public MyTripsMobile(@Body() body: any): Promise<unknown> {
    return this.appService.MyTripsMobile(body);
  }

  @Post('/verifyemail')
  public mytripscancellation(body) {
    return this.appService.mytripscancellation(body);
  }

  @Post('/mytripscancellation')
  public VerifyEmail(@Body() body: any): Promise<unknown> {
    return this.appService.verifyEmail(body);
  }

  @Post('/preferences')
  public preferences(@Body() body: any): Promise<unknown> {
    return this.appService.Preferences(body);
  }

  @Post('/personaldetails')
  public PersonalDetails(@Body() body: any): Promise<unknown> {
    return this.appService.PersonalDetails(body);
  }

  @Post('/emailsend')
  public EmailSend(@Body() body: any): Promise<unknown> {
    return this.appService.EmailSend(body);
  }


  @Post('/userreadyonly')
  public UserReadyOnly(@Body() body: any): Promise<unknown> {
    return this.appService.UserReadyOnly(body);
  }

  @Post('/updatepassword')
  public UpdatePassword(@Body() body: any): Promise<unknown> {
    return this.appService.UpdatePassword(body);
  }


  @Post('/forgotpassword')
  public ForgotPassword(@Body() body: any): Promise<unknown> {
    return this.appService.ForgotPassword(body);
  }

  @Post('/forgotupdatepassword')
  public ForgotUpdatePassword(@Body() body: any): Promise<unknown> {
    return this.appService.ForgotUpdatePassword(body);
  }

  @Post('/sendemailverify')
  public Resetemailverify(@Body() body: any): Promise<unknown> {
    return this.appService.Resetemailverify(body);
  }


  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './views/assets/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  public Upload(@UploadedFile() file): Promise<unknown> {
    return this.appService.paperboard(file);
  }


}
