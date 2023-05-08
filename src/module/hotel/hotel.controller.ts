import { Body, Controller, Get , Post , HttpCode , HttpStatus, Query, ValidationPipe , Ip} from "@nestjs/common";
import { HotelService } from "./hotel.service";
require('dotenv').config();

@Controller('/hotel')
export class HotelController {
  constructor(private readonly appService: HotelService) {}

  @Post('/console')
  @HttpCode(HttpStatus.OK)
  public soapHome(@Body() body: any ): Promise<any> {
        return this.appService.consoles(body, 3);
  }

  @Post('/hotelSearchAvailability')
  @HttpCode(HttpStatus.OK)
  async getHotelServiceAvailability(@Body() body: any ): Promise<any>{
    return this.appService.getMultiHotelServiceAvailability(body);
    //return this.appService.getHotelServiceAvailability(body);
  }

  @Post('/hotelSearchAvailabilityMobile')
  @HttpCode(HttpStatus.OK)
  async getHotelServiceAvailabilityMobile(@Body() body: any ): Promise<any>{
    return this.appService.getHotelServiceAvailabilityMobile(body);
    //return this.appService.getHotelServiceAvailability(body);
  }

  @Post('/hotelMoreAvailabilityMobile')
  @HttpCode(HttpStatus.OK)
  async getMoreHotelServiceAvailabilityMobile(@Body() body: any ): Promise<any>{
    return this.appService.getMultiHotelMoreAvailabilityMobile(body);
    //return this.appService.getHotelMoreAvailability(body);
  }

  @Post('/hotelMoreAvailability')
  @HttpCode(HttpStatus.OK)
  async getMoreHotelServiceAvailability(@Body() body: any ): Promise<any>{
    return this.appService.getMultiHotelMoreAvailability(body);
    //return this.appService.getHotelMoreAvailability(body);
  }

  @Post('/hotelDetailsAvailability')
  @HttpCode(HttpStatus.OK)
  async getHotelDetailsAvailability(@Body() body: any): Promise<any>{
     return this.appService.getHotelDetailsAvailability(body);
  }

  @Post('/hotelDetailsAvailabilityMobile')
  @HttpCode(HttpStatus.OK)
  async getHotelDetailsAvailabilityMobile(@Body() body: any): Promise<any>{
     return this.appService.getHotelDetailsAvailabilityMobile(body);
  }

  @Post('/hotelMediaLinks')
  @HttpCode(HttpStatus.OK)
  async getHotelMediaLinks(@Body() body: any ): Promise<any>{
    return this.appService.getHotelMediaLinks(body);
  }

  @Post('/hotelTermsAndCondition')
  @HttpCode(HttpStatus.OK)
  async getTermsAndCondition(@Body() body: any ): Promise<any>{
    return this.appService.getTermsAndCondition(body);
  }

  @Post('/hotelMultiTermsAndCondition')
  @HttpCode(HttpStatus.OK)
  async getMultiTermsAndCondition(@Body() body: any ): Promise<any>{
    return this.appService.getMultiTermsAndCondition(body);
  }

  @Post('/hotelCityAutoComplete')
  @HttpCode(HttpStatus.OK)
  async getCityAutoComplete(@Body() body: any ): Promise<any>{
    return this.appService.getCityAutoComplete(body);
  }

  @Post('/hotelFilters')
  @HttpCode(HttpStatus.OK)
  async getHotelFilters(@Body() body: any ): Promise<any>{
    return this.appService.getHotelFilters(body);
  }

  @Post('/popularDestinations')
  @HttpCode(HttpStatus.OK)
  async popularDestinations(@Body() body: any, @Ip() ip ): Promise<any>{
    return this.appService.popularDestinations(body, ip);
  }

  @Post('/destinationsDeals')
  @HttpCode(HttpStatus.OK)
  async destinationsDeals(@Body() body: any, @Ip() ip ): Promise<any>{
    return this.appService.destinationsDeals(body, ip);
  }

  @Post('/blogList')
  @HttpCode(HttpStatus.OK)
  async blogList(@Body() body: any ): Promise<any>{
    return this.appService.blogs(body);
  }

  @Post('/reviews')
  @HttpCode(HttpStatus.OK)
  async userReviews(@Body() body: any): Promise<any>{
    return this.appService.userReviews(body);
  }

  @Post('/hotelMultiMediaLinks')
  @HttpCode(HttpStatus.OK)
  async hotelMultiMediaLinks(@Body() body: any ): Promise<any>{
    return this.appService.hotelMultiMediaLinks(body);
  }

  @Post('/userCurrentlocation')
  @HttpCode(HttpStatus.OK)
  async userCurrentlocation(@Body() body: any, @Ip() ip ): Promise<any>{
    return this.appService.userCurrentlocation(body, ip);
  }

  @Post('/booking')
  @HttpCode(HttpStatus.OK)
  async userBooking(@Body() body: any): Promise<any>{
    return this.appService.userBooking(body);
  }

  @Post('/bookingdetails')
  @HttpCode(HttpStatus.OK)
  async userBookingDetails(@Body() body: any): Promise<any>{
    return this.appService.userBookingDetails(body);
  }

  @Post('/multiHotelbooking')
  @HttpCode(HttpStatus.OK)
  async multiHotelbooking(@Body() body: any): Promise<any>{
    return this.appService.multiHotelbooking(body);
  }
  
  @Post('/multibookingcancel')
  @HttpCode(HttpStatus.OK)
  async multibookingcancel(@Body() body: any): Promise<any>{
    return this.appService.multibookingcancel(body);
  }

  @Post('/bookingcancel')
  @HttpCode(HttpStatus.OK)
  async bookingCancel(@Body() body: any): Promise<any>{
    return this.appService.bookingCancel(body);
  }

  @Post('/searchbyiatacode')
  public SearchByIataCode(@Body() body: any): Promise<unknown> {
    return this.appService.SearchByIataCode(body);
  }

  @Post('/filters')
  public SearchByfilters(@Body() body: any): Promise<unknown> {
    return this.appService.SearchByfilters(body);
  }

  @Post('/syncfilterdata')
  public Syncfilterdata(@Body() body: any): Promise<unknown> {
    return this.appService.Syncfilterdata(body);
  }

}
