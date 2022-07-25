import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Applicability } from './entity/applicability.entity';
import { Country } from './entity/contry.entity';
import { DefaultValue } from './entity/defaultValue.entity';
import { InstitutionCategory } from './entity/institition.catagory.entity';
import { Institution } from './entity/institution.entity';
import { InstitutionType } from './entity/institution.typr.entity';
import { LearningMaterialSector } from './entity/learning-material-sector.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
import { Methodology } from './entity/methodology.entity';
import { MitigationAction } from './entity/mitigation-action.entity';
import { Sector } from './entity/sector.entity';
import { UnitConversion } from './entity/unit-conversion.entity';
import { User } from './entity/user.entity';
import { UserType } from './entity/user.type.entity';

// https://docs.nestjs.com/techniques/task-scheduling

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      // username: 'root',
      // password: 'password',
      //database: 'nccdsndb',
      username: 'root',
      password: '',
      database: 'portelservice',
      entities: [Applicability,Country,Methodology,MitigationAction,Sector,LearningMaterialSector,LearningMaterialUserType,LearningMaterial,UserType,DefaultValue,UnitConversion,User,Institution,InstitutionCategory,InstitutionType],

      synchronize: false,
    }),
    TypeOrmModule.forFeature([Applicability,Country,Methodology,MitigationAction,Sector,LearningMaterialSector,LearningMaterialUserType,LearningMaterial,UserType,DefaultValue,UnitConversion,User,Institution,InstitutionCategory,InstitutionType]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
