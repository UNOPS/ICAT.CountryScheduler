import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable, timeout } from 'rxjs';
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
import { MethodologyData } from './entity/methodology-data.entity';
import { CountrySector } from './entity/country-sector.entity';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  // private readonly pmuBaseURl = 'http://localhost:7081/';
  // private readonly calEngineBaseURl = 'http://localhost:3600/';
  private readonly pmuBaseURl = 'http://13.233.122.62:7090/';
  private readonly calEngineBaseURl = 'http://13.233.122.62:3600/';

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
    @InjectRepository(MethodologyData)
    private readonly methodologyDataRepository: Repository<CountrySector>,
    @InjectRepository(CountrySector)
    private readonly countrySectorRepository: Repository<CountrySector>,

    private httpService: HttpService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('* * 23 * * *')
  async handleCron() {
    this.logger.debug('Called when the current second is 50');
    await this.syncCountry();
    await this.syncMethodologyData();
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
    setTimeout(async () => {
      await this.synclearningMeterialSector();
      await this.synclearningMeterialUserType();
    }, 1000)

  }

  async manualSynCountry() {
    await this.syncCountry();
    setTimeout(async () =>{
      await this.syncSectorCountry();
    },1000)
    
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

  async syncSectorCountry() {
    let localMCountrySector = await this.countrySectorRepository.find();
    let Pmu :any;
    let sec:any;

      await this.getMetodlogyFromPMU('country/country-sector').subscribe(async (m) => {
        Pmu =m.data;
  
        sec =await localMCountrySector.filter((a) => !Pmu.some((b) => a.uniqueIdentification == b.uniqueIdentification));
      
        if(sec.length>0){
          console.log(sec)
          sec.forEach((a) => this.countrySectorRepository.delete(a.id));
         }
      });

      
   
    setTimeout(async () =>{
      console.log("mmmm",sec)
      

       await this.getMetodlogyFromPMU('country/country-sector').subscribe(async (m) => {
        m.data.map(async (me) => {
  
          if (me.uniqueIdentification !=null && me.uniqueIdentification.length>5)  {
            let exsistingItem = localMCountrySector.find(
              (a) => a.uniqueIdentification === me.uniqueIdentification,
            );
  
            if (!exsistingItem) {
              console.log('Insert country sector',me.id);
  
              await this.countrySectorRepository.save(me);
            } else {;
              console.log('Update country sector',me.id);
              await this.countrySectorRepository.save(me);
            }
          }
        });
      });
    },5000)
   

   

  }

  async syncMethodologyData() {
    let localMCountry = await this.methodologyDataRepository.find();
    await this.getMetodlogyFromPMU('methodology-data').subscribe(async (m) => {
      m.data.map((me) => {

        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            //item not found Insert
            console.log('Insert country');

            this.methodologyDataRepository.save(me);
          } else {
            //item found Update;
            console.log('Update country');
            // console.log(me);
            this.methodologyDataRepository.save(me);
          }
        }
      });
    });
  }

  async syncUser() {
    let localMCountry = await this.userRepository.find();
    this.getMetodlogyFromPMU('users/findUserBy').subscribe(async (m) => {
      m.data.map(async (me) => {

        //console.log("ME+++", me)
        if (me.uniqueIdentification) {

          let exsistingItem = await localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification
          );



          if (!exsistingItem) {
            let ins = new Institution();
            ins.name = me.mrvInstitution;
            ins.description = me.mrvInstitution;

            ins.country = me.countryId;
            // ins.
            let n = await this.insRepository.insert(ins);

            //item not found Insert

            if (me.userTypeId == 2) {
              me.id = null;
              me.userTypeId = "1";
              me.institutionId = n.identifiers[0].id;
              await this.userRepository.insert(me);
            }



          }
          else {
            //item found Update;
            let id;


            if (me.userTypeId == 2) {
              await localMCountry.find((a) => { if (a.uniqueIdentification === me.uniqueIdentification) { id = a.id; } });
              // console.log("ME+++", me)
              let co= await this.countryRepository.findOne({where:{id:me.countryId}})
              let ins1 = await this.insRepository.findOne({ where: { country: co, type: null } })
              me.id = id;
              me.userTypeId = "1";
               me.institution=ins1;
              console.log("ME+++", me)
             
              //console.log('update user======', me.userTypeId);
              await this.userRepository.save(me);
            }
            console.log('Update user');

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
    // console.log("me===========", localMCountry)
    await this.getMetodlogyFromPMU('learning-material').subscribe(async (m) => {
      m.data.map((me) => {
        // console.log("me===========", me)
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );
          // console.log("me===========",me)
          if (!exsistingItem) {
            //item not found Insert
            // console.log('Insert learning Meterial');

            this.learningMeterialRepository.save(me);
          } else {
            //item found Update;
            // console.log('Update learning Meterial');
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
            // console.log('Insert learning Meterial Sector');

            this.learningMeterialSectorRepository.save(me);
          } else {
            //item found Update;
            // console.log('Update learning Meterial Sector');
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
        // console.log("me++++++++++,",me)
        if (me.uniqueIdentification) {
          let exsistingItem = localMCountry.find(
            (a) => a.uniqueIdentification === me.uniqueIdentification,
          );

          if (!exsistingItem) {
            if (me.userid == 2) {
              me.userType = 1;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 6) {
              me.userType = 2;
              console.log("me++++++++++,", me)
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 7) {
              me.userType = 3;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 8) {
              me.userType = 4;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 9) {
              me.userType = 5;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 10) {
              me.userType = 6;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 11) {
              me.userType = 7;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 12) {
              me.userType = 8;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 13) {
              me.userType = 9;
              this.learningMeterialUserTypeRepository.save(me);
            }
            //item not found Insert
            console.log('Insert learning Meterial Type');


          } else {
            if (me.userid == 2) {
              me.userType = 1;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 6) {
              me.userType = 2;
              console.log("me++++++++++,", me)
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 7) {
              me.userType = 3;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 8) {
              me.userType = 4;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 9) {
              me.userType = 5;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 10) {
              me.userType = 6;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 11) {
              me.userType = 7;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 12) {
              me.userType = 8;
              this.learningMeterialUserTypeRepository.save(me);
            }
            if (me.userid == 13) {
              me.userType = 9;
              this.learningMeterialUserTypeRepository.save(me);
            }
            // this.learningMeterialUserTypeRepository.save(me);
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

            me.baselineImage = me.method.baselineImage;
            me.projectImage = me.method.projectImage;
            me.projectionImage = me.method.projectionImage;
            me.leakageImage = me.method.leakageImage;
            me.resultImage = me.method.resultImage;
            await this.methodologyRepository.insert(me);
          } else {
            me.baselineImage = me.method.baselineImage;
            me.projectImage = me.method.projectImage;
            me.projectionImage = me.method.projectionImage;
            me.leakageImage = me.method.leakageImage;
            me.resultImage = me.method.resultImage;
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
