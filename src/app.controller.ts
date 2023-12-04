import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('methodology')
  manualSyncMethodology(){
    this.appService.manualSynMethod();
  }

  @Post('methodologyone')
  async manualSyncMethodologyOne(@Body() dto: any): Promise<any>{    
    this.appService.manualSynMethodOne(dto);
  }
  @Post('methodologies')
  async manualSyncMethodologies(@Body() dto: any): Promise<any>{
    this.appService.manualSynMethodoloies(dto);
  }

  @Get('lerninigMeterial')
  manualSynclerninigMeterial(){
    this.appService.manualSynLerningMeterial();
  }
  @Post('lerninigMeterialOne')
  manualSynclerninigMeterialOne(@Body() dto: any){
    this.appService.synclearningMeterialOne(dto);
  }

  @Get('country')
  manualSyncCountry(){
    this.appService.manualSynCountry();
  }

  @Post('countryone')
  async manualSyncCountryOne(@Body() dto: any,): Promise<any>{
    this.appService.manualSynCountryOne(dto);
  }

  @Get('country1')
  syncSectorCountry(){
    this.appService.syncSectorCountry();
  }

  @Get('user')
  manualSyncUser(){
    this.appService.manualSynUser();
  }

  @Post('userone')
  async manualSyncUserOne(@Body() dto: any,): Promise<any>{
   
    this.appService.manualSynUserOne(dto);
  }
}
