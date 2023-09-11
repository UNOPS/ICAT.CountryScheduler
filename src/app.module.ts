import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Applicability } from './entity/applicability.entity';
import { Country } from './entity/country.entity';
import { CountrySector } from './entity/country-sector.entity';
import { DefaultValue } from './entity/defaultValue.entity';
import { InstitutionCategory } from './entity/institition.catagory.entity';
import { Institution } from './entity/institution.entity';
import { InstitutionType } from './entity/institution.typr.entity';
import { LearningMaterialSector } from './entity/learning-material-sector.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
import { MethodologyData } from './entity/methodology-data.entity';
import { Methodology } from './entity/methodology.entity';
import { MitigationAction } from './entity/mitigation-action.entity';
import { Sector } from './entity/sector.entity';
import { UnitConversion } from './entity/unit-conversion.entity';
import { User } from './entity/user.entity';
import { UserType } from './entity/user.type.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      socketPath: process.env.SOCKET_PATH,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Applicability,
        Country,
        Methodology,
        MitigationAction,
        Sector,
        LearningMaterialSector,
        LearningMaterialUserType,
        LearningMaterial,
        UserType,
        DefaultValue,
        UnitConversion,
        User,
        Institution,
        InstitutionCategory,
        InstitutionType,
        MethodologyData,
        CountrySector
      ],

      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      Applicability,
      Country,
      Methodology,
      MitigationAction,
      Sector,
      LearningMaterialSector,
      LearningMaterialUserType,
      LearningMaterial,
      UserType,
      DefaultValue,
      UnitConversion,
      User,
      Institution,
      InstitutionCategory,
      InstitutionType,
      MethodologyData,
      CountrySector]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
