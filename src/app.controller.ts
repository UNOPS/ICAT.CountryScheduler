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
    console.log("jjjj")
    this.appService.manualSynMethod();
  }

  @Get('lerninigMeterial')
  manualSynclerninigMeterial(){
    console.log("jjjj")
    this.appService.manualSynLerningMeterial();
  }

  @Get('country')
  manualSynclerninigCountry(){
    console.log("Country")
    this.appService.manualSynCountry();
  }

  @Get('country1')
  syncSectorCountry(){
    console.log("Country")
    this.appService.syncSectorCountry();
  }

  @Get('user')
  manualSyncUser(){
    console.log("User")
    this.appService.manualSynUser();
  }
}
