import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Applicability } from './entity/applicability.entity';
import { Country } from './entity/contry.entity';
import { DefaultValue } from './entity/defaultValue.entity';
import { LearningMaterialSector } from './entity/learning-material-sector.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
import { Methodology } from './entity/methodology.entity';
import { MitigationAction } from './entity/mitigation-action.entity';
import { Sector } from './entity/sector.entity';
import { UnitConversion } from './entity/unit-conversion.entity';
import { User } from './entity/user.entity';
import { Institution } from './entity/institution.entity';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly pmuBaseURl = 'http://localhost:7081/';
  private readonly calEngineBaseURl = 'http://localhost:3600/';
  // private readonly pmuBaseURl = 'http://65.2.75.253:7090/';
  // private readonly calEngineBaseURl = 'http://65.2.75.253:3600/';

  /**
   *
   */
  constructor(
    @InjectRepository(Methodology)
    private readonly methodologyRepository: Repository<Methodology>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,

    @InjectRepository(MitigationAction)
    private readonly mitidationActionRepository: Repository<MitigationAction>,

    @InjectRepository(Applicability)
    private readonly applicabilityRepository: Repository<Applicability>,

    @InjectRepository(LearningMaterialSector)
    private readonly learningMeterialSectorRepository: Repository<LearningMaterialSector>,

    @InjectRepository(LearningMaterial)
    private readonly learningMeterialRepository: Repository<LearningMaterial>,

    @InjectRepository(LearningMaterialUserType)
    private readonly learningMeterialUserTypeRepository: Repository<LearningMaterialUserType>,

    @InjectRepository(DefaultValue)
    private readonly defaultValueRepository: Repository<DefaultValue>,

    @InjectRepository(UnitConversion)
    private readonly unitConversionRepository: Repository<UnitConversion>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Institution)
    private readonly insRepository: Repository<Institution>,

    private httpService: HttpService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('* * 23 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 50');
    await this.syncCountry();
    await this.syncSector();
    await this.syncApplicability();
    await this.syncMAction();

    await this.syncDefaultValue();
    await this.syncUnitConversion();
  }

  async manualSynMethod() {
    await this.syncMethodology();
  }

  async manualSynLerningMeterial() {

    await this.synclearningMeterial();
    await this.synclearningMeterialSector();
    await this.synclearningMeterialUserType();
  }

  async manualSynCountry() {
    await this.syncCountry();
  }

  async manualSynUser() {
    await this.syncUser();
  }


  async syncCountry() {
    let localMCountry = await this.countryRepository.find();
    await this.getMetodlogyFromPMU('country').subscribe(async (m) => {
      m.data.map((me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert country');

            this.countryRepository.save(me);
          } else {
            //item found Update;
            console.log('Update country');
            // console.log(me);
            this.countryRepository.save(me);
          }
        }
      });
    });
  }

  async syncUser() {
    let localMCountry = await this.userRepository.find();
    this.getMetodlogyFromPMU('users/findUserBy').subscribe(async (m) => {
      m.data.map(async (me) => {

        // console.log("ME+++",me)
        if (me.uniqueIdentification) {

          let exsistingItem = await localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification
          );



          if (!exsistingItem) {
            let ins = new Institution();
            ins.name = me.mrvInstitution;
            ins.description=me.mrvInstitution;
            
            ins.country = me.countryId;
            // ins.
            let n=await this.insRepository.insert(ins);

            //item not found Insert
            me.id = null;
            me.userTypeId = "1";
            me.institutionId=n.identifiers[0].id;

            await this.userRepository.insert(me);
          }
          else {
            //item found Update;
            let id;
            await localMCountry.find((a) => { if (a.uniqueIdentification === me.uniqueIdentification) { id = a.id; } });
            me.id = id;
            console.log('Update user');
            me.userTypeId = "1";
            console.log('update user======', me.userTypeId);
            await this.userRepository.save(me);
          }
        }
      });
    });
  }

  async syncSector() {
    let localMCountry = await this.sectorRepository.find();
    await this.getMetodlogyFromPMU('sector').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert sector');

            this.sectorRepository.save(me);
          } else {
            //item found Update;
            console.log('Update sector');
            this.sectorRepository.save(me);
          }
        }
      });
    });
  }

  async syncApplicability() {
    let localMCountry = await this.applicabilityRepository.find();
    await this.getMetodlogyFromPMU('applicability').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert applicability');

            this.applicabilityRepository.save(me);
          } else {
            //item found Update;
            console.log('Update applicability');
            this.applicabilityRepository.save(me);
          }
        }
      });
    });
  }

  async syncMAction() {
    let localMCountry = await this.mitidationActionRepository.find();
    await this.getMetodlogyFromPMU('mitigation-action').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.unitIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert mitigation-action');

            this.mitidationActionRepository.save(me);
          } else {
            //item found Update;
            console.log('Update mitigation-action');
            this.mitidationActionRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterial() {
    let localMCountry = await this.learningMeterialRepository.find();
    console.log("me===========", localMCountry)
    await this.getMetodlogyFromPMU('learning-material').subscribe(async (m) => {
      m.data.map((me) => {
        console.log("me===========", me)
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          // console.log("me===========",me)
          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert learning Meterial');

            this.learningMeterialRepository.save(me);
          } else {
            //item found Update;
            console.log('Update learning Meterial');
            // console.log(me);
            this.learningMeterialRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterialSector() {
    let localMCountry = await this.learningMeterialSectorRepository.find();
    await this.getMetodlogyFromPMU('learning-material/sector').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert learning Meterial Sector');

            this.learningMeterialSectorRepository.save(me);
          } else {
            //item found Update;
            console.log('Update learning Meterial Sector');
            // console.log(me);
            this.learningMeterialSectorRepository.save(me);
          }
        }
      });
    });
  }

  async synclearningMeterialUserType() {
    let localMCountry = await this.learningMeterialUserTypeRepository.find();
    await this.getMetodlogyFromPMU('learning-material/user-type').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert learning Meterial Type');

            this.learningMeterialUserTypeRepository.save(me);
          } else {
            //item found Update;
            console.log('Update learning Meterial type');
            // console.log(me);
            this.learningMeterialUserTypeRepository.save(me);
          }
        }
      });
    });
  }

  async syncMethodology() {
    let localMethodology = await this.methodologyRepository.find();
    console.log('Insert--------');
    await this.getMetodlogyFromPMU('methodology').subscribe(async (m) => {
      m.data.map(async (me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = await localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert');

            await this.methodologyRepository.insert(me);
          } else {
            //item found Update;
            // console.log('Update');
            console.log('Update', me.isActive);
            await this.methodologyRepository.save(me);
          }
        }
      });
    });
  }

  async syncDefaultValue() {
    let localMethodology = await this.defaultValueRepository.find();
    await this.getMetodlogyFromCalEngine('default-value').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert default-value');

            this.defaultValueRepository.insert(me);
          } else {
            //item found Update;
            console.log('Update default-value');
            this.defaultValueRepository.save(me);
          }
        }
      });
    });
  }

  async syncUnitConversion() {
    let localMethodology = await this.unitConversionRepository.find();
    await this.getMetodlogyFromCalEngine('unit-conversion').subscribe(async (m) => {
      m.data.map((me) => {
        if (me.uniqueIdentification) {
          let exsistingItem = localMethodology.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert unit-conversion');

            this.unitConversionRepository.insert(me);
          } else {
            //item found Update;
            console.log('Update unit-conversion');
            this.unitConversionRepository.save(me);
          }
        }
      });
    });
  }

  getMetodlogyFromPMU(name: string): Observable<AxiosResponse<any>> {
    try {
      let methodologuURL = this.pmuBaseURl + name;
      console.log("==========", (methodologuURL))
      return this.httpService.get(methodologuURL);
    } catch (e) {
      console.log('calculation Engine error', e);
    }
  }

  getMetodlogyFromCalEngine(name: string): Observable<AxiosResponse<any>> {
    try {
      let methodologuURL = this.calEngineBaseURl + name;
      console.log("==========", (methodologuURL))
      return this.httpService.get(methodologuURL);
    } catch (e) {
      console.log('calculation Engine error', e);
    }
  }
}
