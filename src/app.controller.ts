import { Controller, Get, Post } from '@nestjs/common';
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

  @Get('lerninigMeterial')
  manualSynclerninigMeterial(){
    this.appService.manualSynLerningMeterial();
  }

  @Get('country')
  manualSynclerninigCountry(){
    this.appService.manualSynCountry();
  }

  @Get('country1')
  syncSectorCountry(){
    this.appService.syncSectorCountry();
  }

  @Get('user')
  manualSyncUser(){
    this.appService.manualSynUser();
  }
}
