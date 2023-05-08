import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo'
import { ResponseBuilder } from "../../utils/ResponseBuilder";

@Injectable()
export class UsersService {

  constructor(private readonly UsersRepo: UsersRepo) {}

  public SignUp(data): any{

    return new Promise(async (resolve)=> {


      if (data.AthuBy === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
      }
      else if(data.AthuBy == "email"){

        if (data.Email === undefined) {
          resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
        }
        else if (data.Passwd === undefined) {
          resolve(ResponseBuilder.errorResponse('message', 'Passwd is required.'));
        }
        else if (data.AthuBy === undefined) {
          resolve(ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
        } else {

          let data_r = await this.UsersRepo.SignUp(data);
          resolve(data_r)

        }

      }
      else if(data.AthuBy == "facebook"){

        if (data.hash === undefined) {
          resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
        } else {
          let data_r = await this.UsersRepo.SignUp(data);
          resolve(data_r)
        }

      }
      else if(data.AthuBy == "google"){

        if (data.hash === undefined) {
          resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
        } else {
          let data_r = await this.UsersRepo.SignUp(data);
          resolve(data_r)
        }

      }
      else{
        resolve(ResponseBuilder.errorResponse('message', 'Something is Wrong.'));
      }


    });

  }

  public SignIn(data): any{

    return new Promise(async (resolve)=> {

    if (data.AthuBy === undefined) {
      resolve(ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
    }
    else if(data.AthuBy == "email"){

      if (data.Email === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
      }
      else if (data.Passwd === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Passwd is required.'));
      } else {
        let data_r = await this.UsersRepo.SignIn(data);
        resolve(data_r)
      }

    }
    else if(data.AthuBy == "facebook"){

      if (data.hash === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
      } else {
        let data_r = await this.UsersRepo.SignIn(data);
        resolve(data_r)
      }

    }
    else if(data.AthuBy == "google"){

      if (data.hash === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
      } else {
        let data_r = await this.UsersRepo.SignIn(data);
        resolve(data_r)
      }

    }
    else{
      resolve(ResponseBuilder.errorResponse('message', 'Something is Wrong.'));
    }


    });

  }


  public  MyTrips(data) {
          return new Promise(async (resolve) => {
              if (data.UserID === undefined) {
                  resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
              }
              else if (data.ActiveSession === undefined) {
                  resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
              }
              else {
                  let data_r = await this.UsersRepo.MyTrips(data);
                  resolve(data_r);
              }
          });
      }


    public  MyTripsMobile(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.MyTripsMobile(data);
                resolve(data_r);
            }
        });
    }

    public mytripscancellation(data) {
          return new Promise(async (resolve) => {
              if (data.UserID === undefined) {
                  resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
              }
              else if (data.ActiveSession === undefined) {
                  resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
              }
              else {
                  let data_r = await this.UsersRepo.mytripscancellation(data);
                  resolve(data_r);
              }
          });
      }

  public Preferences(body: any) {
    return new Promise(async (resolve)=> {

      if (body.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (body.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      }
      else if (body.Preferences === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Preferences is required.'));
      } else {
        let data_r = await this.UsersRepo.Preferences(body);
        resolve(data_r)
      }

    })
  }

  public PersonalDetails(body: any) {
    return new Promise(async (resolve)=> {

      if (body.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (body.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      }
      else if (body.PersonalDetails === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'PersonalDetails is required.'));
      } else {
        let data_r = await this.UsersRepo.PersonalDetails(body);
        resolve(data_r)
      }


    })

  }

  public PaymentDetails(body: any) {
    return new Promise(async (resolve)=> {

      if (body.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (body.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      }
      else if (body.PaymentDetails === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'PaymentDetails is required.'));
      } else {
        let data_r = await this.UsersRepo.PaymentDetails(body);
        resolve(data_r)
      }

    })

  }

  public paperboard(file: any) {
    return new Promise(async (resolve)=> {

      file['pathURL'] = 'http://54.152.204.39:3000/assets/uploads/'+file['filename'];
      resolve(file);
    })
  }


  public EmailSend(body: any) {
    return new Promise(async (resolve)=> {

      resolve(true);

    })
  }

  public UserReadyOnly(data: any) {
    return new Promise(async (resolve)=> {

      if (data.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (data.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      } else {

        let data_r = await this.UsersRepo.UserReadyOnly(data);
        resolve(data_r)

      }

    })
  }


  public UpdatePassword(data: any) {
    return new Promise(async (resolve)=> {

      if (data.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (data.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      } else {

        let data_r = await this.UsersRepo.UpdatePassword(data);
        resolve(data_r)

      }

    })
  }

  public ForgotPassword(body: any) {
    return new Promise(async (resolve)=> {

      if (body.Email === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
      }
      else
      {

      let data_r = await this.UsersRepo.forgotPassword(body);
      resolve(data_r)

      }

    })
  }

  public ForgotUpdatePassword(body: any) {
    return new Promise(async (resolve)=> {

      if (body.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (body.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      } else {

        let data_r = await this.UsersRepo.ForgotUpdatePassword(body);
        resolve(data_r)

      }

    })
  }

  public verifyEmail(body: any) {
    return new Promise(async (resolve)=> {

      if (body.UserID === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'UserID is required.'));
      }
      else if (body.ActiveSession === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
      } else {

        let data_r = await this.UsersRepo.verifyEmail(body);
        resolve(data_r)

      }

    })
  }

  public Resetemailverify(body: any) {
    return new Promise(async (resolve)=> {

      if (body.Email === undefined) {
        resolve(ResponseBuilder.errorResponse('message', 'Email is required.'));
      }
      else
      {

        let data_r = await this.UsersRepo.Resetemailverify(body);
        resolve(data_r)

      }

    })
  }
}
