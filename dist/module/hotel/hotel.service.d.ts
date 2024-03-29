import { HotelRepo } from "./hotel.repo";
export declare class HotelService {
    private readonly hotelRepo;
    constructor(hotelRepo: HotelRepo);
    emailBookingSend(template: any, to: any, subject: any, BookingConfirmation: any, CreateDate: any, HotelPropertyName: any, CheckInDate: any, CheckOutDate: any, Bookinglink: any, BookingDetailsURL: any, CancelBookingURL: any): Promise<unknown>;
    emailBookingCancelSend(template: any, to: any, subject: any, BookingCancelation: any): Promise<unknown>;
    minRequestforHotelDetails(json_data: any): Promise<unknown>;
    getHotelMoreAvailability(data: any): any;
    getMultiHotelMoreAvailability(data: any): Promise<unknown>;
    getMultiHotelServiceAvailability(data: any): Promise<unknown>;
    getMultiHotelMoreAvailabilityMobile(data: any): Promise<unknown>;
    getHotelServiceAvailabilityMobile(data: any): Promise<unknown>;
    getHotelServiceAvailability(data: any): any;
    getHotelDetailsAvailability(data: any): any;
    getHotelDetailsAvailabilityMobile(data: any): any;
    deepCompare: (arg1: any, arg2: any) => boolean;
    keepBiggest(arr: any): any[];
    removeDuplicates(obj: any): void;
    isEven(number: any): boolean;
    isOdd(number: any): boolean;
    RequestExtarFlow(PlusRequest: any): any;
    consoles(json_data: any, ParticipationLevel: any): Promise<unknown>;
    getHotelMediaLinks(data: any): Promise<unknown>;
    getTermsAndCondition(data: any): Promise<any>;
    getMultiTermsAndCondition(body: any): Promise<any>;
    getCityAutoComplete(body: any): Promise<any>;
    getHotelFilters(body: any): Promise<any>;
    popularDestinations(body: any, ip: any): Promise<any>;
    destinationsDeals(body: any, ip: any): Promise<any>;
    blogs(body: any): Promise<any>;
    hotelMultiMediaLinks(body: any): Promise<any>;
    userCurrentlocation(body: any, ip: any): Promise<any>;
    multiHotelbooking(body: any): Promise<any>;
    userBooking(body: any): Promise<any>;
    userReviews(body: any): Promise<any>;
    SearchByIataCode(body: any): Promise<unknown>;
    multibookingcancel(body: any): Promise<unknown>;
    bookingCancel(body: any): Promise<unknown>;
    userBookingDetails(body: any): Promise<unknown>;
    SearchByfilters(body: any): Promise<unknown>;
    Syncfilterdata(body: any): Promise<unknown>;
}
